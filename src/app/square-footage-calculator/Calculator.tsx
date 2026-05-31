"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Square footage: sq ft = length_ft * width_ft.
// Unit conversions:
//   inches -> feet:   value / 12
//   meters -> feet:   value * 3.28084   (NIST SP 811 SI conversion factor)
//   sq ft -> sq m:    value * 0.092903  (NIST SP 811)
// TODO_VERIFY: NIST SP 811 SI conversion factors —
//   https://www.nist.gov/pml/special-publication-811

type Unit = "ft" | "in" | "m";

type Room = {
  id: number;
  name: string;
  length: number;
  width: number;
  unit: Unit;
};

function toFeet(value: number, unit: Unit): number {
  if (!Number.isFinite(value)) return NaN;
  if (unit === "ft") return value;
  if (unit === "in") return value / 12;
  return value * 3.28084;
}

function roomSqFt(r: Room): number {
  const l = toFeet(r.length, r.unit);
  const w = toFeet(r.width, r.unit);
  if (!Number.isFinite(l) || !Number.isFinite(w)) return NaN;
  return l * w;
}

function sqFtToSqM(sqft: number): number {
  return sqft * 0.092903;
}

export function Calculator() {
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, name: "Room 1", length: 12, width: 10, unit: "ft" },
  ]);
  const [nextId, setNextId] = useState(2);

  const { perRoom, totalSqFt, totalSqM } = useMemo(() => {
    const per = rooms.map((r) => ({
      id: r.id,
      name: r.name,
      sqft: roomSqFt(r),
    }));
    const total = per.reduce(
      (sum, r) => (Number.isFinite(r.sqft) ? sum + r.sqft : sum),
      0,
    );
    return { perRoom: per, totalSqFt: total, totalSqM: sqFtToSqM(total) };
  }, [rooms]);

  function updateRoom(id: number, patch: Partial<Room>) {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
  }

  function addRoom() {
    setRooms((prev) => [
      ...prev,
      { id: nextId, name: `Room ${prev.length + 1}`, length: 10, width: 10, unit: "ft" },
    ]);
    setNextId((n) => n + 1);
  }

  function removeRoom(id: number) {
    setRooms((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  }

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <form
        className="grid gap-6"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        {rooms.map((room, idx) => (
          <div
            key={room.id}
            className="grid gap-3 rounded-[var(--md-sys-shape-corner-medium)] border border-[var(--md-sys-color-outline-variant)] p-3 sm:p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="md-title-medium">{room.name}</p>
              {rooms.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRoom(room.id)}
                  className="md-label-large min-h-10 px-3 rounded-[var(--md-sys-shape-corner-full)] text-[var(--md-sys-color-on-surface-variant)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-[-2px]"
                  aria-label={`Remove ${room.name}`}
                >
                  Remove
                </button>
              )}
            </div>

            <Segment
              label="Unit"
              value={room.unit}
              onChange={(v) => updateRoom(room.id, { unit: v as Unit })}
              options={[
                { value: "ft", label: "ft" },
                { value: "in", label: "in" },
                { value: "m", label: "m" },
              ]}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <TextField
                label="Length"
                type="number"
                inputMode="decimal"
                value={room.length}
                onChange={(e) =>
                  updateRoom(room.id, { length: Number(e.target.value) })
                }
                min={0}
                step={0.1}
                trailing={room.unit}
              />
              <TextField
                label="Width"
                type="number"
                inputMode="decimal"
                value={room.width}
                onChange={(e) =>
                  updateRoom(room.id, { width: Number(e.target.value) })
                }
                min={0}
                step={0.1}
                trailing={room.unit}
              />
            </div>

            <p className="md-body-small text-[var(--md-sys-color-on-surface-variant)]">
              {room.name}:{" "}
              <span className="font-[var(--md-sys-typescale-mono-font)] tabular-nums">
                {Number.isFinite(perRoom[idx]?.sqft)
                  ? `${perRoom[idx].sqft.toFixed(2)} sq ft`
                  : "—"}
              </span>
            </p>
          </div>
        ))}

        <button
          type="button"
          onClick={addRoom}
          className="md-label-large min-h-12 px-4 rounded-[var(--md-sys-shape-corner-full)] border border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-primary)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-primary)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-[-2px]"
        >
          + Add room
        </button>
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div
          role="status"
          aria-live="polite"
          className="grid gap-x-6 gap-y-4 sm:grid-cols-2"
        >
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Total area
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(totalSqFt) ? `${totalSqFt.toFixed(2)} sq ft` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              In square meters
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(totalSqM) ? `${totalSqM.toFixed(2)} m²` : "—"}
            </p>
          </div>
          <div className="sm:col-span-2 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
            Rooms counted: {rooms.length}
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Length × width assumes a rectangular footprint. For L-shaped or irregular
        spaces, split into rectangles and add them as separate rooms.
      </p>
    </Card>
  );
}

function Segment({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <p className="md-label-medium mb-1 text-[var(--md-sys-color-on-surface-variant)]">{label}</p>
      <div role="radiogroup" aria-label={label} className="inline-flex rounded-[var(--md-sys-shape-corner-full)] border border-[var(--md-sys-color-outline)] overflow-hidden">
        {options.map((opt, i) => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
            onClick={() => onChange(opt.value)}
            className={[
              "min-h-12 px-4 md-label-large",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-[-2px]",
              value === opt.value
                ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
                : "text-[var(--md-sys-color-on-surface)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)]",
              i > 0 ? "border-l border-[var(--md-sys-color-outline)]" : "",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
