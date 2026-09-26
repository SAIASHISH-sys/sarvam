"""WBS template and schedule math (port of the frontend's utils/schedule.js
and the factory's expansion logic)."""

from datetime import date, timedelta

from app.schemas import WbsTask

WBS_TEMPLATE = [
    {"key": "mobilise", "phase": "Pre-construction", "task": "Mobilisation & site clearance", "duration": 5},
    {"key": "layout", "phase": "Pre-construction", "task": "Survey, layout & approvals", "duration": 10},
    {"key": "excavation", "phase": "Substructure", "task": "Excavation & PCC blinding", "duration": 12},
    {"key": "footings", "phase": "Substructure", "task": "Footings & plinth beams", "duration": 10},
    {"key": "floor-cycle", "phase": "Superstructure", "task": "Floor cycle (columns, slab, curing)", "duration": 12, "perFloor": True},
    {"key": "masonry", "phase": "Superstructure", "task": "Brickwork & partitions", "duration": 8},
    {"key": "roof", "phase": "Envelope", "task": "Roof slab & waterproofing", "duration": 7},
    {"key": "mep", "phase": "Services", "task": "MEP rough-in", "duration": 15},
    {"key": "finishes", "phase": "Finishes", "task": "Plaster, flooring & painting", "duration": 22},
    {"key": "handover", "phase": "Handover", "task": "Fittings, snag list & handover", "duration": 6},
]

_SUFFIXES = {1: "st", 2: "nd", 3: "rd"}


def _ordinal(n: int) -> str:
    if 11 <= n % 100 <= 13:
        return f"{n}th"
    return f"{n}{_SUFFIXES.get(n % 10, 'th')}"


def expand_template(floors_count: int) -> list[dict]:
    specs: list[dict] = []
    for item in WBS_TEMPLATE:
        if not item.get("perFloor"):
            specs.append({k: v for k, v in item.items() if k != "perFloor"})
            continue
        for floor in range(1, floors_count + 1):
            specs.append(
                {
                    "key": f"{item['key']}-{floor}",
                    "phase": item["phase"],
                    "task": f"Floor cycle — {_ordinal(floor)} floor",
                    "duration": item["duration"],
                }
            )
    return specs


def build_wbs(start_date: date, floors_count: int) -> list[WbsTask]:
    """Sequential single-path schedule: each task starts when the previous ends."""
    tasks: list[WbsTask] = []
    cursor = start_date
    for spec in expand_template(floors_count):
        end = cursor + timedelta(days=spec["duration"] - 1)
        tasks.append(
            WbsTask(
                key=spec["key"], phase=spec["phase"], task=spec["task"],
                duration=spec["duration"], start=cursor, end=end,
            )
        )
        cursor = end + timedelta(days=1)
    return tasks


def overall_progress(tasks: list[WbsTask]) -> float:
    total = sum(t.duration for t in tasks)
    done = sum(t.duration * t.progress for t in tasks)
    return done / total if total else 0.0


def schedule_duration_days(tasks: list[WbsTask]) -> int:
    if not tasks:
        return 0
    return (max(t.end for t in tasks) - min(t.start for t in tasks)).days + 1
