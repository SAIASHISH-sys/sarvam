/**
 * Design engine: derives a preliminary structural design summary from the
 * project parameters. Pure — mirrors what the backend will run.
 *
 * Output is a starting point for study and planning, never a construction
 * document. Everything here must be verified and signed off by a licensed
 * structural engineer.
 */

const FOUNDATION_BY_SOIL = {
  hard: 'Isolated footings',
  medium: 'Isolated footings (enlarged) — confirm bearing capacity',
  soft: 'Raft foundation — geotechnical investigation required',
}

const DUCTILE_ZONES = ['III', 'IV', 'V']

/**
 * @param {object} params project design parameters
 * @returns {{ system: string, foundation: string, rationale: string[], members: Array<object>, disclaimer: string }}
 */
export function generateDesign(params) {
  const ductile = DUCTILE_ZONES.includes(params.seismicZone)
  const system = ductile
    ? 'RCC special moment-resisting frame (SMRF)'
    : 'RCC moment-resisting frame'

  const members = [
    {
      element: 'Footing (typical interior)',
      size: '1.8 × 1.8 × 0.45 m',
      concrete: params.concreteGrade,
      steel: 'Fe 415 TMT, #10 @ 150 c/c both ways',
      remarks: 'Size to be confirmed against safe bearing capacity.',
    },
    {
      element: 'Plinth beam',
      size: '230 × 300 mm',
      concrete: params.concreteGrade,
      steel: '4 × #12 top and bottom, #8 stirrups',
      remarks: 'Ties all footings; check plinth height for flood level.',
    },
    {
      element: 'Column (typical)',
      size: '300 × 450 mm',
      concrete: params.concreteGrade,
      steel: '8 × #16 longitudinal, #8 ties',
      remarks: ductile ? 'Ductile detailing per IS 13920 mandatory.' : 'Standard detailing.',
    },
    {
      element: 'Beam (typical)',
      size: '230 × 450 mm',
      concrete: params.concreteGrade,
      steel: '4 × #16 bottom, 2 × #12 top, #8 stirrups',
      remarks: ductile ? 'Confinement at plastic hinge zones per IS 13920.' : 'Standard detailing.',
    },
    {
      element: 'Slab (typical)',
      size: `${params.slabThickness} mm thick`,
      concrete: params.concreteGrade,
      steel: '#8 @ 150 c/c main, #8 @ 180 c/c distribution (typical)',
      remarks: 'Preliminary sizing — check deflection and vibration.',
    },
  ]

  return {
    system,
    foundation: FOUNDATION_BY_SOIL[params.soilType] ?? FOUNDATION_BY_SOIL.medium,
    rationale: [
      `Seismic Zone ${params.seismicZone} → ${ductile ? 'SMRF with ductile detailing (IS 13920)' : 'moment-resisting frame'}.`,
      `Basic wind speed ${params.basicWindSpeed} m/s governs cladding and roof bracing checks.`,
      `${params.floors} low-rise configuration → shallow foundation system from soil type.`,
    ],
    members,
    disclaimer:
      'Preliminary sizing for study and planning only. Every member and detail must be designed and signed by a licensed structural engineer before construction.',
  }
}
