"""Compliance and design engines — faithful ports of the frontend's pure
functions so backend and UI agree on every computed value.

The catalogue remains an illustrative sample set (IS 456, IS 875, IS 1893,
IS 13920, IS 1904, NBC 2016). Production use requires a licensed, verified
catalogue and a licensed structural engineer's sign-off.
"""

from app.schemas import ProjectParams

CONCRETE_GRADES = {"M20": 20, "M25": 25, "M30": 30, "M35": 35}
ZONE_FACTORS = {"II": 0.10, "III": 0.16, "IV": 0.24, "V": 0.36}
LIVE_LOADS = {"Residential": "2.0 kN/m²", "Commercial": "3.0 kN/m²", "Institutional": "3.0 kN/m²"}
SOIL_LABELS = {
    "hard": "Type I — hard soil",
    "medium": "Type II — medium soil",
    "soft": "Type III — soft soil",
}
FOUNDATION_BY_SOIL = {
    "hard": "Isolated footings",
    "medium": "Isolated footings (enlarged) — confirm bearing capacity",
    "soft": "Raft foundation — geotechnical investigation required",
}
DUCTILE_ZONES = ("III", "IV", "V")


def _check(rule_id, code, clause, category, parameter, requirement, value, status, note):
    return {
        "id": rule_id,
        "code": code,
        "clause": clause,
        "category": category,
        "parameter": parameter,
        "requirement": requirement,
        "projectValue": value,
        "status": status,
        "note": note,
    }


def evaluate_compliance(p: ProjectParams) -> list[dict]:
    """One check per catalogue rule against the project parameters."""
    checks: list[dict] = []

    grade = CONCRETE_GRADES.get(p.concrete_grade, 0)
    checks.append(
        _check(
            "IS456-GRADE", "IS 456:2000", "6.1.2, Table 5", "Materials",
            "Minimum concrete grade for RCC", "≥ M20", p.concrete_grade,
            "compliant" if grade >= 20 else "noncompliant",
            "Selected grade meets the minimum for structural RCC."
            if grade >= 20
            else "Upgrade to M20 or better for all structural RCC members.",
        )
    )

    cover_ok = p.nominal_cover >= 20
    checks.append(
        _check(
            "IS456-COVER", "IS 456:2000", "26.4.2.1", "Durability",
            "Nominal cover — mild exposure", "≥ 20 mm", f"{p.nominal_cover} mm",
            "compliant" if cover_ok else "noncompliant",
            "Cover satisfies the minimum for mild exposure."
            if cover_ok
            else "Increase nominal cover to at least 20 mm.",
        )
    )

    effective_depth = p.slab_thickness - p.nominal_cover - 8
    ratio = p.slab_span * 1000 / max(1, effective_depth)
    ratio_text = f"{ratio:.1f}"
    if ratio <= 26:
        slab_status, slab_note = "compliant", "Within the basic span-to-depth limit."
    elif ratio <= 34:
        slab_status = "attention"
        slab_note = ("Above the basic limit — justify with the Fig. 4 modification "
                     "factor or thicken the slab.")
    else:
        slab_status = "noncompliant"
        slab_note = ("Exceeds even the modified limit — increase slab thickness or "
                     "re-frame the span.")
    checks.append(
        _check(
            "IS456-SPAN-DEPTH", "IS 456:2000", "23.2.1", "Serviceability",
            "Slab span-to-depth ratio (continuous, one-way)",
            "L/d ≤ 26 (up to ~34 with Fig. 4 modification factor)",
            f"L/d = {ratio_text}", slab_status, slab_note,
        )
    )

    checks.append(
        _check(
            "IS456-WCR", "IS 456:2000", "Table 5", "Durability",
            "Maximum water-cement ratio / minimum cement content (mild)",
            "w/c ≤ 0.55 · cement ≥ 300 kg/m³", "per mix design", "info",
            "Locked during the concrete mix design, not at concept stage.",
        )
    )

    z = ZONE_FACTORS[p.seismic_zone]
    checks.append(
        _check(
            "IS1893-ZONE", "IS 1893 (Part 1):2016", "Table 2", "Seismic",
            "Seismic zone factor", "Z per zone", f"Zone {p.seismic_zone} → Z = {z:.2f}",
            "info",
            "Zone factor feeds the design horizontal seismic coefficient "
            "(Ah = Z/2 · I/R · Sa/g).",
        )
    )

    ductile = p.seismic_zone in DUCTILE_ZONES
    checks.append(
        _check(
            "IS13920-APPLICABILITY", "IS 13920:2016", "1.1.1", "Seismic",
            "Ductile detailing of RC members", "Mandatory in Zones III–V",
            "Applicable" if ductile else "Not triggered",
            "attention" if ductile else "info",
            "Special confinement, lap and joint detailing is mandatory for this zone."
            if ductile
            else "Zone II still recommends ductile detailing as good practice.",
        )
    )

    checks.append(
        _check(
            "IS875-WIND", "IS 875 (Part 3):2015", "Annex A", "Wind",
            "Basic wind speed", "Vb per site", f"Vb = {p.basic_wind_speed} m/s", "info",
            "Design wind pressure computed from Vb, terrain and risk coefficient.",
        )
    )

    checks.append(
        _check(
            "IS875-LIVE", "IS 875 (Part 2):1987", "Table 1", "Loads",
            "Imposed (live) load — typical floor", "Per occupancy",
            LIVE_LOADS.get(p.building_type, "Per schedule"), "info",
            "Floor live load for the selected occupancy; roof load to be added separately.",
        )
    )

    checks.append(
        _check(
            "IS1904-DEPTH", "IS 1904:1986", "15.4", "Foundations",
            "Minimum foundation depth", "≥ 500 mm below natural ground",
            "per footing design", "info",
            "Shallow footings placed below topsoil at a depth fixed by the "
            "geotechnical report.",
        )
    )

    checks.append(
        _check(
            "NBC-STAIRS", "NBC 2016 (Vol 1, Part 3)", "Staircase geometry", "Egress",
            "Residential stair risers & treads", "Riser ≤ 190 mm · tread ≥ 250 mm",
            "per stair layout", "info",
            "Verify in the architectural drawings before sanction submission.",
        )
    )

    return checks


def summarize_compliance(checks: list[dict]) -> dict[str, int]:
    counts = {"compliant": 0, "attention": 0, "noncompliant": 0, "info": 0}
    for check in checks:
        counts[check["status"]] += 1
    return counts


def generate_design(p: ProjectParams) -> dict:
    """Preliminary structural design summary. Study output only — every member
    must be designed and signed by a licensed structural engineer."""
    ductile = p.seismic_zone in DUCTILE_ZONES
    system = (
        "RCC special moment-resisting frame (SMRF)" if ductile else "RCC moment-resisting frame"
    )
    members = [
        {
            "element": "Footing (typical interior)",
            "size": "1.8 × 1.8 × 0.45 m",
            "concrete": p.concrete_grade,
            "steel": "Fe 415 TMT, #10 @ 150 c/c both ways",
            "remarks": "Size to be confirmed against safe bearing capacity.",
        },
        {
            "element": "Plinth beam",
            "size": "230 × 300 mm",
            "concrete": p.concrete_grade,
            "steel": "4 × #12 top and bottom, #8 stirrups",
            "remarks": "Ties all footings; check plinth height for flood level.",
        },
        {
            "element": "Column (typical)",
            "size": "300 × 450 mm",
            "concrete": p.concrete_grade,
            "steel": "8 × #16 longitudinal, #8 ties",
            "remarks": "Ductile detailing per IS 13920 mandatory."
            if ductile
            else "Standard detailing.",
        },
        {
            "element": "Beam (typical)",
            "size": "230 × 450 mm",
            "concrete": p.concrete_grade,
            "steel": "4 × #16 bottom, 2 × #12 top, #8 stirrups",
            "remarks": "Confinement at plastic hinge zones per IS 13920."
            if ductile
            else "Standard detailing.",
        },
        {
            "element": "Slab (typical)",
            "size": f"{p.slab_thickness} mm thick",
            "concrete": p.concrete_grade,
            "steel": "#8 @ 150 c/c main, #8 @ 180 c/c distribution (typical)",
            "remarks": "Preliminary sizing — check deflection and vibration.",
        },
    ]
    return {
        "system": system,
        "foundation": FOUNDATION_BY_SOIL.get(p.soil_type, FOUNDATION_BY_SOIL["medium"]),
        "rationale": [
            f"Seismic Zone {p.seismic_zone} → "
            + ("SMRF with ductile detailing (IS 13920)." if ductile
               else "moment-resisting frame."),
            f"Basic wind speed {p.basic_wind_speed} m/s governs cladding and "
            "roof bracing checks.",
            f"{p.floors} low-rise configuration → shallow foundation system from soil type.",
        ],
        "members": members,
        "disclaimer": (
            "Preliminary sizing for study and planning only. Every member and "
            "detail must be designed and signed by a licensed structural "
            "engineer before construction."
        ),
    }
