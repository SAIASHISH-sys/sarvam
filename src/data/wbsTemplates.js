/**
 * Work-breakdown-structure template for a low-rise RCC building.
 *
 * Durations are indicative working days for the seed/study scale; a real
 * deployment derives them from CPWD or organisation-specific norms. Items
 * marked `perFloor` are repeated once per floor above ground.
 */

export const WBS_TEMPLATE = [
  { key: 'mobilise', phase: 'Pre-construction', task: 'Mobilisation & site clearance', duration: 5 },
  { key: 'layout', phase: 'Pre-construction', task: 'Survey, layout & approvals', duration: 10 },
  { key: 'excavation', phase: 'Substructure', task: 'Excavation & PCC blinding', duration: 12 },
  { key: 'footings', phase: 'Substructure', task: 'Footings & plinth beams', duration: 10 },
  { key: 'floor-cycle', phase: 'Superstructure', task: 'Floor cycle (columns, slab, curing)', duration: 12, perFloor: true },
  { key: 'masonry', phase: 'Superstructure', task: 'Brickwork & partitions', duration: 8 },
  { key: 'roof', phase: 'Envelope', task: 'Roof slab & waterproofing', duration: 7 },
  { key: 'mep', phase: 'Services', task: 'MEP rough-in', duration: 15 },
  { key: 'finishes', phase: 'Finishes', task: 'Plaster, flooring & painting', duration: 22 },
  { key: 'handover', phase: 'Handover', task: 'Fittings, snag list & handover', duration: 6 },
]
