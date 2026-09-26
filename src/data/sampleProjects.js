/**
 * Seed data for the demo store. Projects are built through the real factory
 * so the sample stays honest — nothing here bypasses the engines.
 */

import { buildProject, applyProgress, overallProgress } from '../services/projectFactory.js'

export function seedProjects() {
  const ashray = buildProject({
    id: 'prj_001',
    name: 'Ashray Residences',
    client: 'Mishra Family Trust',
    city: 'Bhubaneswar',
    state: 'Odisha',
    buildingType: 'Residential',
    plotArea: 2400,
    floors: 'G+4',
    floorHeight: 3.0,
    seismicZone: 'III',
    basicWindSpeed: 50,
    soilType: 'medium',
    concreteGrade: 'M25',
    slabSpan: 3.9,
    slabThickness: 150,
    nominalCover: 25,
    startDate: '2026-06-01',
    createdAt: new Date('2026-05-20T10:00:00'),
  })
  ashray.wbs = applyProgress(ashray.wbs, {
    mobilise: 1,
    layout: 1,
    excavation: 1,
    footings: 1,
    'floor-cycle-1': 1,
    'floor-cycle-2': 1,
    'floor-cycle-3': 0.75,
  })
  ashray.progress = overallProgress(ashray.wbs)
  ashray.agentPublishedAt = new Date('2026-07-14T18:30:00')

  const vidya = buildProject({
    id: 'prj_002',
    name: 'Vidya School Block',
    client: 'Vidya Charitable Society',
    city: 'Nagpur',
    state: 'Maharashtra',
    buildingType: 'Institutional',
    plotArea: 5000,
    floors: 'G+2',
    floorHeight: 3.6,
    seismicZone: 'II',
    basicWindSpeed: 44,
    soilType: 'hard',
    concreteGrade: 'M20',
    slabSpan: 4.5,
    slabThickness: 150,
    nominalCover: 30,
    startDate: '2026-11-02',
    createdAt: new Date('2026-09-18T09:15:00'),
  })
  vidya.status = 'draft'

  return [ashray, vidya]
}
