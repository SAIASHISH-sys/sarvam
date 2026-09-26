/**
 * Illustrative norms catalogue.
 *
 * Each entry models one clause from an Indian building code as a pure
 * predicate: `evaluate(params)` receives the project's design parameters and
 * returns a compliance check. This sample set exists to prove the
 * architecture — a production deployment needs a licensed, verified
 * catalogue with clause-level provenance, and every design still requires a
 * licensed structural engineer's sign-off.
 */

/**
 * @param {object} rule    catalogue entry (this binding)
 * @param {string} value    the project's value for display
 * @param {string} status   'compliant' | 'attention' | 'noncompliant' | 'info'
 * @param {string} note    one-line explanation
 */
function check(rule, value, status, note) {
  return {
    id: rule.id,
    code: rule.code,
    clause: rule.clause,
    category: rule.category,
    parameter: rule.parameter,
    requirement: rule.requirement,
    projectValue: value,
    status,
    note,
  }
}

const CONCRETE_GRADES = { M20: 20, M25: 25, M30: 30, M35: 35 }

const ZONE_FACTORS = { II: 0.10, III: 0.16, IV: 0.24, V: 0.36 }

const LIVE_LOADS = { Residential: '2.0 kN/m²', Commercial: '3.0 kN/m²', Institutional: '3.0 kN/m²' }

const SOIL_LABELS = { hard: 'Type I — hard soil', medium: 'Type II — medium soil', soft: 'Type III — soft soil' }

export const NORMS_CATALOG = [
  {
    id: 'IS456-GRADE',
    code: 'IS 456:2000',
    clause: '6.1.2, Table 5',
    category: 'Materials',
    parameter: 'Minimum concrete grade for RCC',
    requirement: '≥ M20',
    evaluate(p) {
      const grade = CONCRETE_GRADES[p.concreteGrade] ?? 0
      return check(
        this,
        p.concreteGrade,
        grade >= 20 ? 'compliant' : 'noncompliant',
        grade >= 20
          ? 'Selected grade meets the minimum for structural RCC.'
          : 'Upgrade to M20 or better for all structural RCC members.',
      )
    },
  },
  {
    id: 'IS456-COVER',
    code: 'IS 456:2000',
    clause: '26.4.2.1',
    category: 'Durability',
    parameter: 'Nominal cover — mild exposure',
    requirement: '≥ 20 mm',
    evaluate(p) {
      const ok = p.nominalCover >= 20
      return check(
        this,
        `${p.nominalCover} mm`,
        ok ? 'compliant' : 'noncompliant',
        ok
          ? 'Cover satisfies the minimum for mild exposure.'
          : 'Increase nominal cover to at least 20 mm.',
      )
    },
  },
  {
    id: 'IS456-SPAN-DEPTH',
    code: 'IS 456:2000',
    clause: '23.2.1',
    category: 'Serviceability',
    parameter: 'Slab span-to-depth ratio (continuous, one-way)',
    requirement: 'L/d ≤ 26 (up to ~34 with Fig. 4 modification factor)',
    evaluate(p) {
      // Effective depth ≈ overall thickness minus cover minus half bar diameter.
      const effectiveDepth = p.slabThickness - p.nominalCover - 8
      const ratio = p.slabSpan * 1000 / Math.max(1, effectiveDepth)
      const ratioText = ratio.toFixed(1)
      if (ratio <= 26) {
        return check(this, `L/d = ${ratioText}`, 'compliant', 'Within the basic span-to-depth limit.')
      }
      if (ratio <= 34) {
        return check(
          this,
          `L/d = ${ratioText}`,
          'attention',
          'Above the basic limit — justify with the Fig. 4 modification factor or thicken the slab.',
        )
      }
      return check(
        this,
        `L/d = ${ratioText}`,
        'noncompliant',
        'Exceeds even the modified limit — increase slab thickness or re-frame the span.',
      )
    },
  },
  {
    id: 'IS456-WCR',
    code: 'IS 456:2000',
    clause: 'Table 5',
    category: 'Durability',
    parameter: 'Maximum water-cement ratio / minimum cement content (mild)',
    requirement: 'w/c ≤ 0.55 · cement ≥ 300 kg/m³',
    evaluate(p) {
      return check(this, 'per mix design', 'info', 'Locked during the concrete mix design, not at concept stage.')
    },
  },
  {
    id: 'IS1893-ZONE',
    code: 'IS 1893 (Part 1):2016',
    clause: 'Table 2',
    category: 'Seismic',
    parameter: 'Seismic zone factor',
    requirement: 'Z per zone',
    evaluate(p) {
      const z = ZONE_FACTORS[p.seismicZone]
      return check(this, `Zone ${p.seismicZone} → Z = ${z.toFixed(2)}`, 'info', 'Zone factor feeds the design horizontal seismic coefficient (Ah = Z/2 · I/R · Sa/g).')
    },
  },
  {
    id: 'IS13920-APPLICABILITY',
    code: 'IS 13920:2016',
    clause: '1.1.1',
    category: 'Seismic',
    parameter: 'Ductile detailing of RC members',
    requirement: 'Mandatory in Zones III–V',
    evaluate(p) {
      const required = ['III', 'IV', 'V'].includes(p.seismicZone)
      return required
        ? check(this, 'Applicable', 'attention', 'Special confinement, lap and joint detailing is mandatory for this zone.')
        : check(this, 'Not triggered', 'info', 'Zone II still recommends ductile detailing as good practice.')
    },
  },
  {
    id: 'IS875-WIND',
    code: 'IS 875 (Part 3):2015',
    clause: 'Annex A',
    category: 'Wind',
    parameter: 'Basic wind speed',
    requirement: 'Vb per site',
    evaluate(p) {
      return check(this, `Vb = ${p.basicWindSpeed} m/s`, 'info', 'Design wind pressure computed from Vb, terrain and risk coefficient.')
    },
  },
  {
    id: 'IS875-LIVE',
    code: 'IS 875 (Part 2):1987',
    clause: 'Table 1',
    category: 'Loads',
    parameter: 'Imposed (live) load — typical floor',
    requirement: 'Per occupancy',
    evaluate(p) {
      return check(this, LIVE_LOADS[p.buildingType] ?? 'Per schedule', 'info', 'Floor live load for the selected occupancy; roof load to be added separately.')
    },
  },
  {
    id: 'IS1904-DEPTH',
    code: 'IS 1904:1986',
    clause: '15.4',
    category: 'Foundations',
    parameter: 'Minimum foundation depth',
    requirement: '≥ 500 mm below natural ground',
    evaluate(p) {
      return check(this, 'per footing design', 'info', 'Shallow footings placed below topsoil at a depth fixed by the geotechnical report.')
    },
  },
  {
    id: 'NBC-STAIRS',
    code: 'NBC 2016 (Vol 1, Part 3)',
    clause: 'Staircase geometry',
    category: 'Egress',
    parameter: 'Residential stair risers & treads',
    requirement: 'Riser ≤ 190 mm · tread ≥ 250 mm',
    evaluate(p) {
      return check(this, 'per stair layout', 'info', 'Verify in the architectural drawings before sanction submission.')
    },
  },
]

export const SOIL_TYPE_LABELS = SOIL_LABELS
