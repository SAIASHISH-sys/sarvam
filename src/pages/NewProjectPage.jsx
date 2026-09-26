import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Rocket } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader.jsx'
import Card from '../components/ui/Card.jsx'
import FormField from '../components/ui/FormField.jsx'
import TextInput from '../components/ui/TextInput.jsx'
import Select from '../components/ui/Select.jsx'
import Stepper from '../components/ui/Stepper.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import { createProject } from '../services/projectService.js'
import { evaluateCompliance, summarizeCompliance } from '../services/complianceEngine.js'
import { generateDesign } from '../services/designEngine.js'

const STEPS = ['Basics', 'Site & environment', 'Structure', 'Review']

const BUILDING_TYPES = [
  { value: 'Residential', label: 'Residential' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Institutional', label: 'Institutional' },
]

const FLOORS = ['G+1', 'G+2', 'G+3', 'G+4', 'G+5'].map((value) => ({ value, label: value }))

const SEISMIC_ZONES = ['II', 'III', 'IV', 'V'].map((value) => ({ value, label: `Zone ${value}` }))

const WIND_SPEEDS = [39, 44, 47, 50].map((value) => ({ value, label: `${value} m/s` }))

const SOIL_TYPES = [
  { value: 'hard', label: 'Type I — hard soil' },
  { value: 'medium', label: 'Type II — medium soil' },
  { value: 'soft', label: 'Type III — soft soil' },
]

const CONCRETE_GRADES = ['M20', 'M25', 'M30', 'M35'].map((value) => ({ value, label: value }))

const INITIAL_FORM = {
  name: '',
  client: '',
  city: '',
  state: '',
  buildingType: 'Residential',
  plotArea: '',
  floors: 'G+4',
  floorHeight: 3.0,
  seismicZone: 'III',
  basicWindSpeed: 44,
  soilType: 'medium',
  concreteGrade: 'M25',
  slabSpan: '',
  slabThickness: 150,
  nominalCover: 25,
}

function validateStep(step, form) {
  const errors = {}
  if (step === 0) {
    if (!form.name.trim()) errors.name = 'Project name is required.'
    if (!form.city.trim()) errors.city = 'City is required.'
  }
  if (step === 1 && (!form.plotArea || Number(form.plotArea) <= 0)) {
    errors.plotArea = 'Enter a positive plot area.'
  }
  if (step === 2 && (!form.slabSpan || Number(form.slabSpan) <= 0)) {
    errors.slabSpan = 'Enter a positive span.'
  }
  return errors
}

export default function NewProjectPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const setField = (field) => (event) => {
    const { value } = event.target
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const setNumberField = (field) => (event) => {
    const value = event.target.value
    setForm((prev) => ({ ...prev, [field]: value === '' ? '' : Number(value) }))
  }

  function handleNext() {
    const stepErrors = validateStep(step, form)
    setErrors(stepErrors)
    if (Object.keys(stepErrors).length === 0) setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  async function handleCreate() {
    setSubmitting(true)
    try {
      const project = await createProject(form)
      navigate(`/projects/${project.id}`)
    } finally {
      setSubmitting(false)
    }
  }

  const preview = step === 3 ? evaluateCompliance(form) : []
  const previewSummary = step === 3 ? summarizeCompliance(preview) : null
  const previewDesign = step === 3 ? generateDesign(form) : null

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="New project" description="Four steps from brief to a compliance-checked schedule." />

      <Card>
        <div className="mb-6 overflow-x-auto pb-1">
          <Stepper steps={STEPS} current={step} />
        </div>

        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FormField label="Project name" required hint="Shown to your team and on the site agent.">
                <TextInput value={form.name} onChange={setField('name')} placeholder="e.g. Ashray Residences Phase 2" />
              </FormField>
              {errors.name && <FieldError message={errors.name} />}
            </div>
            <FormField label="Client / owner">
              <TextInput value={form.client} onChange={setField('client')} placeholder="Owner or trust name" />
            </FormField>
            <FormField label="Building type">
              <Select options={BUILDING_TYPES} value={form.buildingType} onChange={setField('buildingType')} />
            </FormField>
            <div>
              <FormField label="City" required>
                <TextInput value={form.city} onChange={setField('city')} placeholder="e.g. Bhubaneswar" />
              </FormField>
              {errors.city && <FieldError message={errors.city} />}
            </div>
            <FormField label="State">
              <TextInput value={form.state} onChange={setField('state')} placeholder="e.g. Odisha" />
            </FormField>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FormField label="Plot area (m²)" required>
                <TextInput type="number" min="1" value={form.plotArea} onChange={setNumberField('plotArea')} placeholder="e.g. 2400" />
              </FormField>
              {errors.plotArea && <FieldError message={errors.plotArea} />}
            </div>
            <FormField label="Floors">
              <Select options={FLOORS} value={form.floors} onChange={setField('floors')} />
            </FormField>
            <FormField label="Floor height (m)">
              <TextInput type="number" step="0.1" min="2.4" value={form.floorHeight} onChange={setNumberField('floorHeight')} />
            </FormField>
            <FormField label="Seismic zone" hint="Per IS 1893 (Part 1) zone map.">
              <Select options={SEISMIC_ZONES} value={form.seismicZone} onChange={setField('seismicZone')} />
            </FormField>
            <FormField label="Basic wind speed" hint="Per IS 875 (Part 3) Annex A.">
              <Select options={WIND_SPEEDS} value={form.basicWindSpeed} onChange={setNumberField('basicWindSpeed')} />
            </FormField>
            <FormField label="Soil type" hint="Drives the foundation recommendation.">
              <Select options={SOIL_TYPES} value={form.soilType} onChange={setField('soilType')} />
            </FormField>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Concrete grade">
              <Select options={CONCRETE_GRADES} value={form.concreteGrade} onChange={setField('concreteGrade')} />
            </FormField>
            <div>
              <FormField label="Typical slab span (m)" required hint="Longest one-way continuous span.">
                <TextInput type="number" step="0.1" min="1" value={form.slabSpan} onChange={setNumberField('slabSpan')} placeholder="e.g. 3.6" />
              </FormField>
              {errors.slabSpan && <FieldError message={errors.slabSpan} />}
            </div>
            <FormField label="Slab thickness (mm)">
              <TextInput type="number" step="5" min="75" value={form.slabThickness} onChange={setNumberField('slabThickness')} />
            </FormField>
            <FormField label="Nominal cover (mm)" hint="Cover to reinforcement, mild exposure.">
              <TextInput type="number" step="5" min="20" value={form.nominalCover} onChange={setNumberField('nominalCover')} />
            </FormField>
          </div>
        )}

        {step === 3 && previewSummary && previewDesign && (
          <div className="space-y-5">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              <SummaryRow label="Project" value={`${form.name} · ${form.city}${form.state ? `, ${form.state}` : ''}`} />
              <SummaryRow label="Building" value={`${form.buildingType} · ${form.floors} · ${form.floorHeight} m floors`} />
              <SummaryRow label="Site" value={`Zone ${form.seismicZone} · Vb ${form.basicWindSpeed} m/s · ${SOIL_TYPES.find((s) => s.value === form.soilType)?.label}`} />
              <SummaryRow label="Structure" value={`${form.concreteGrade} · ${form.slabThickness} mm slab · ${form.nominalCover} mm cover`} />
            </dl>

            <div className="rounded-md border border-slate-200 bg-slate-50/60 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Compliance preview
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge tone="success">{previewSummary.compliant} compliant</Badge>
                <Badge tone="warning">{previewSummary.attention} attention</Badge>
                <Badge tone="danger">{previewSummary.noncompliant} not compliant</Badge>
                <Badge tone="neutral">{previewSummary.info} info</Badge>
              </div>
              <p className="mt-2.5 text-xs text-slate-500">
                System: {previewDesign.system}. {previewDesign.foundation}.
              </p>
            </div>

            <p className="text-xs leading-5 text-slate-500">
              Creating the project generates the full compliance ledger, preliminary member schedule and
              a dated WBS. Everything remains editable as the design develops.
            </p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-4">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ArrowLeft size={14} strokeWidth={2} /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button variant="primary" onClick={handleNext}>
              Continue <ArrowRight size={14} strokeWidth={2} />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleCreate} disabled={submitting}>
              <Rocket size={14} strokeWidth={2} /> {submitting ? 'Creating…' : 'Create project'}
            </Button>
          )}
        </div>
      </Card>

      <p className="mt-4 text-center text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-700">Cancel and return to dashboard</Link>
      </p>
    </div>
  )
}

function FieldError({ message }) {
  return <p className="mt-1 text-xs text-red-600">{message}</p>
}

function SummaryRow({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-slate-800">{value}</dd>
    </div>
  )
}
