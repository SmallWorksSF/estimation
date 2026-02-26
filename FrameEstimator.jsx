import { useState, useMemo, useEffect, useCallback, useRef } from "react";

// ── DEFAULT DATA ──────────────────────────────────────────────────────────────
const DEFAULT_DB = {
  mouldings: [
    { id: "m1", name: "401 Maple", price: 37 }, { id: "m2", name: "401 Oak", price: 38 }, { id: "m3", name: "401 Walnut", price: 40 },
    { id: "m4", name: "500 Maple", price: 40 }, { id: "m5", name: "500 Oak", price: 42 }, { id: "m6", name: "500 Walnut", price: 47 },
    { id: "m7", name: "501 Maple", price: 50 }, { id: "m8", name: "501 Walnut", price: 55 },
    { id: "m9", name: "600 Maple", price: 49.5 }, { id: "m10", name: "600 Oak", price: 53 }, { id: "m11", name: "600 Walnut", price: 53 },
    { id: "m12", name: "601 Maple", price: 52.5 }, { id: "m13", name: "601 Oak", price: 55 }, { id: "m14", name: "601 Walnut", price: 57.75 },
    { id: "m15", name: "801 Maple", price: 56.7 }, { id: "m16", name: "803 Maple", price: 59.43 }, { id: "m17", name: "803 Oak", price: 78 },
    { id: "m18", name: "901 Maple", price: 66.15 }, { id: "m19", name: "901 Oak", price: 70.5 }, { id: "m20", name: "901 Walnut", price: 80.85 },
    { id: "m21", name: "903 Maple", price: 66.15 }, { id: "m22", name: "903 Oak", price: 73.5 }, { id: "m23", name: "903 Walnut", price: 80.85 },
    { id: "m24", name: "904 Maple", price: 78 },
    { id: "m25", name: "SW1 Maple", price: 42 }, { id: "m26", name: "SW1 Oak", price: 50.7 }, { id: "m27", name: "SW1 Walnut", price: 48.5 },
    { id: "m28", name: "SW2 Maple", price: 52.5 }, { id: "m29", name: "SW2 Oak", price: 57.35 }, { id: "m30", name: "SW2 Walnut", price: 57.75 },
    { id: "m31", name: "SW3 Maple", price: 61 }, { id: "m32", name: "SW3 Walnut", price: 66.15 },
    { id: "m33", name: 'Float Frame <1.5"', price: 52.5 }, { id: "m34", name: 'Float Frame >2" >3"', price: 57.75 },
    { id: "m35", name: 'Float Frame >3" >4"', price: 73.5 }, { id: "m36", name: "Walnut Float Frame", price: 55.1 },
    { id: "m37", name: "Walnut Float >2>3", price: 64 },
    { id: "m38", name: "Kori Moulding", price: 48 }, { id: "m39", name: "Coulter Moulding", price: 55 },
    { id: "m40", name: "Custom Made Min. Charge", price: 44 }, { id: "m41", name: "Custom 600/601", price: 57 },
    { id: "m42", name: "Custom Larger Profile", price: 80 },
    { id: "m43", name: "501 Maple Oakland Museum", price: 33.37 }, { id: "m44", name: "501 Walnut Oakland Museum", price: 38.45 },
  ],
  finishes: [
    { id: "f0", name: "None", price: 0 },
    { id: "f1", name: "Bleach and Clear", price: 6.3 }, { id: "f2", name: "Bleach and Lite Graphite", price: 7.35 },
    { id: "f3", name: "Bleach and Oil", price: 6.56 }, { id: "f4", name: "Bleach/White Wash", price: 6.3 },
    { id: "f5", name: "Clear Coat", price: 5 }, { id: "f6", name: "Graphite", price: 7.15 },
    { id: "f7", name: "Light Graphite", price: 7.56 }, { id: "f8", name: "Oil/Wax", price: 6.05 },
    { id: "f9", name: "Painted", price: 6.55 }, { id: "f10", name: "Painted Face Clear Sides (Maple)", price: 8.925 },
    { id: "f11", name: "Painted Face Clear Sides (Walnut)", price: 12 },
    { id: "f12", name: "Stain and Clear", price: 5.7 }, { id: "f13", name: "Stain/Oil/Wax", price: 6.35 },
    { id: "f14", name: "Two Color Paint", price: 11.8 }, { id: "f15", name: "White Wax", price: 3.25 },
  ],
  spacers: [
    { id: "sp0", name: "None", price: 0 },
    { id: "sp1", name: '1/4" Matching Wood', price: 3.85 }, { id: "sp2", name: '1/2" Matching Wood', price: 5.51 },
    { id: "sp3", name: '3/4" Matching Wood', price: 6 }, { id: "sp4", name: '1" Matching Wood', price: 7.71 },
    { id: "sp5", name: '>1" Matching Wood', price: 11 }, { id: "sp6", name: "Linen Spacer (wrapped)", price: 10 },
    { id: "sp7", name: "Raglined", price: 3.25 },
  ],
  strainers: [
    { id: "st0", name: "None", price: 0 },
    { id: "st1", name: '3/8" Strainer', price: 3.9 }, { id: "st2", name: '1/2" Strainer', price: 4.41 },
    { id: "st3", name: '5/8" Strainer', price: 5 }, { id: "st4", name: '3/4" Strainer', price: 5.4 },
  ],
  glazings: [
    { id: "g0", name: "None", price: 0 },
    { id: "g1", name: "FF (Float Glass)", price: 0.04 }, { id: "g2", name: "Conservation Glass", price: 0.11 },
    { id: "g3", name: "Museum Glass", price: 0.45 }, { id: "g4", name: '1/8" OP3 UV Plex', price: 0.145 },
    { id: "g5", name: '1/8" OP3 (over 48" short)', price: 0.16 }, { id: "g6", name: '1/8" Optium', price: 0.4865 },
    { id: "g7", name: 'Optium 48-52" Short', price: 0.52 }, { id: "g8", name: "Optium 93% SBFA", price: 0.45 },
  ],
  matboards: [
    { id: "mb0", name: "None", price: 0 },
    { id: "mb1", name: "4 Ply Mat", price: 0.04725 },
    { id: "mb2", name: "4 Ply Mat (super oversize)", price: 0.05775 },
  ],
  backings: [
    { id: "bk0", name: "None", price: 0 },
    { id: "bk1", name: "Foamcore", price: 0.03 }, { id: "bk2", name: "Coroplast", price: 0.0615 },
    { id: "bk3", name: "Gator", price: 0.0525 }, { id: "bk4", name: "Linen Backing", price: 0.08 },
  ],
  fitting: [
    { id: "ft0", name: "None", price: 0 },
    { id: "ft1", name: "Fitting (standard)", price: 75 },
    { id: "ft2", name: "Fitting (small)", price: 50 },
    { id: "ft3", name: "Fitting (float small)", price: 50 },
    { id: "ft4", name: "Fitting Oversize 1", price: 120 },
    { id: "ft5", name: "Fitting Oversize 2", price: 155 },
  ],
  mounting: [
    { id: "mo0", name: "None", price: 0 },
    { id: "mo1", name: "Hinging", price: 65 },
    { id: "mo2", name: "Hinging 30x40", price: 100 },
    { id: "mo3", name: 'Hinging Over 48" Short', price: 165 },
    { id: "mo4", name: "Linen Backing Mount", price: 0.08, unit: "sqin", desc: "per sq in, $10 min" },
    { id: "mo5", name: "Aluminum Mount", price: 0, desc: "quote required" },
    { id: "mo6", name: "Dibond Mount", price: 0, desc: "quote required" },
    { id: "mo7", name: "Sintra Mount", price: 0, desc: "quote required" },
    { id: "mo8", name: "Gator Mount", price: 0, desc: "quote required" },
  ],
  modifiers: [
    { id: "md1", name: "Bevel", price: 2.2, unit: "lf", desc: "per LF" },
    { id: "md2", name: "Pan Faced", price: 3.5, unit: "sqft", desc: "per sq ft face area" },
    { id: "md3", name: "Custom Rip", price: 3, unit: "lf", desc: "per LF (mill charge)" },
    { id: "md4", name: "Face Spline", price: 27.5, unit: "flat", desc: "flat rate" },
    { id: "md5", name: "Face Spline (Large)", price: 55, unit: "flat", desc: "flat rate" },
    { id: "md6", name: "Decorative Face Spline", price: 45, unit: "flat", desc: "flat rate" },
  ],
  addons: [
    { id: "ad1", name: "Lap Join (small)", price: 70, unit: "flat" },
    { id: "ad2", name: "Lap Join (medium)", price: 90, unit: "flat" },
    { id: "ad3", name: "Lap Join (large)", price: 165, unit: "flat" },
    { id: "ad4", name: "Rounded Corners", price: 65, unit: "flat" },
    { id: "ad5", name: "Rounded Corners (large frame)", price: 110, unit: "flat" },
    { id: "ad6", name: "Geometric Corners (up to 18x24)", price: 75, unit: "flat" },
    { id: "ad7", name: "Geometric Corners (up to 30x40)", price: 165, unit: "flat" },
    { id: "ad8", name: "Geometric Corners (large)", price: 250, unit: "flat" },
    { id: "ad9", name: "Corner Block", price: 60, unit: "flat" },
    { id: "ad10", name: "Inside/Outside Rounded Corners", price: 100, unit: "flat" },
    { id: "ad11", name: "Color Match", price: 60, unit: "flat", desc: "per color, custom mixing fee" },
    { id: "ad12", name: "Color Match (gradient)", price: 120, unit: "flat" },
    { id: "ad13", name: "Brass Dowel", price: 50, unit: "flat" },
    { id: "ad14", name: "Dowel", price: 20, unit: "flat" },
    { id: "ad15", name: "Rush Order (+10%)", price: null, unit: "pct", pct: 0.1 },
  ],
};

const CATEGORY_META = {
  mouldings:  { label: "Mouldings",          unit: "lf",   unitLabel: "$/LF",     hasUnit: false, hasDesc: false },
  finishes:   { label: "Finishes",            unit: "lf",   unitLabel: "$/LF",     hasUnit: false, hasDesc: false },
  spacers:    { label: "Spacers",             unit: "lf",   unitLabel: "$/LF",     hasUnit: false, hasDesc: false },
  strainers:  { label: "Strainers",           unit: "lf",   unitLabel: "$/LF",     hasUnit: false, hasDesc: false },
  glazings:   { label: "Glazings",            unit: "sqin", unitLabel: "$/sq in",  hasUnit: false, hasDesc: false },
  matboards:  { label: "Matboards",           unit: "sqin", unitLabel: "$/sq in",  hasUnit: false, hasDesc: false },
  backings:   { label: "Backings",            unit: "sqin", unitLabel: "$/sq in",  hasUnit: false, hasDesc: false },
  fitting:    { label: "Fitting",             unit: "flat", unitLabel: "flat rate", hasUnit: false, hasDesc: false },
  mounting:   { label: "Mounting",            unit: "flat", unitLabel: "flat/$sqin",hasUnit: true,  hasDesc: true  },
  modifiers:  { label: "Moulding Modifiers",  unit: "flat", unitLabel: "varies",   hasUnit: true,  hasDesc: true  },
  addons:     { label: "Add-ons",             unit: "flat", unitLabel: "flat/%",   hasUnit: true,  hasDesc: true  },
};

const UNIT_OPTIONS = ["flat", "lf", "sqin", "sqft", "pct"];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmt = (n) => (n == null ? "—" : n.toLocaleString("en-US", { style: "currency", currency: "USD" }));
const fmtPrice = (item) => {
  if (item.unit === "pct") return item.pct ? `+${(item.pct * 100).toFixed(0)}%` : "—";
  if (!item.price && item.price !== 0) return "—";
  return fmt(item.price);
};
const uid = () => Math.random().toString(36).slice(2, 9);
const round2 = (n) => Math.round(n * 100) / 100;

// ── STYLES ────────────────────────────────────────────────────────────────────
const T = {
  mono: "'Courier Prime', monospace",
  sans: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};
const C = {
  bg: "#ffffff", card: "#ffffff", border: "#e0e0e0",
  accent: "#999999", accentDark: "#1a1a1a",
  text: "#1a1a1a", textMid: "#555555", textLight: "#888888", textFaint: "#bbbbbb",
  divider: "#f0f0f0", highlight: "#f7f7f7",
  green: "#2d8a4e", blue: "#4a6fa5", orange: "#c47d2c",
  danger: "#d44", dangerBg: "#fef0f0",
  scanBg: "#fafafa", scanBorder: "#ddd",
  warm: "#f5f0eb",
};

const baseInput = {
  background: "#fff", border: `1px solid ${C.border}`, borderRadius: 2,
  padding: "8px 10px", fontFamily: T.mono, fontSize: 13, color: C.text,
};
const selectStyle = {
  ...baseInput, appearance: "none", flex: 1,
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
};
const labelStyle = {
  display: "block", fontSize: 10, letterSpacing: "0.15em",
  textTransform: "uppercase", color: C.textLight, marginBottom: 5, fontFamily: T.sans,
};
const btnBase = {
  fontFamily: T.sans, fontSize: 12, borderRadius: 2, border: "none",
  padding: "7px 14px", cursor: "pointer", letterSpacing: "0.08em", fontWeight: 500,
};
const btn = (variant = "primary") => ({
  ...btnBase,
  background: variant === "primary" ? C.accentDark : variant === "danger" ? C.danger : variant === "ghost" ? "transparent" : C.divider,
  color: variant === "primary" ? "#fff" : variant === "danger" ? "#fff" : variant === "ghost" ? C.textMid : C.text,
  border: variant === "ghost" ? `1px solid ${C.border}` : "none",
});

// ── REUSABLE COMPONENTS ───────────────────────────────────────────────────────
function FieldSelect({ label, options, value, onChange, unit }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={labelStyle}>{label}</label>}
      <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
        {options.map((o) => (
          <option key={o.id ?? o.name} value={o.name}>
            {o.name}{o.price > 0 && unit ? ` — ${unit === "sqin" ? `${fmt(o.price)}/sq in` : unit === "lf" ? `${fmt(o.price)}/LF` : fmt(o.price)}` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}

function NumInput({ label, value, onChange, unit }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type="number" min="0" step="0.25" value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          style={{ ...baseInput, width: 90 }} />
        {unit && <span style={{ fontSize: 12, color: C.textLight, fontFamily: T.mono }}>{unit}</span>}
      </div>
    </div>
  );
}

function CheckItem({ item, checked, onToggle }) {
  return (
    <label style={{
      display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 10px",
      borderRadius: 4, cursor: "pointer", marginBottom: 4,
      background: checked ? C.highlight : "transparent",
      border: `1px solid ${checked ? C.accent : C.divider}`,
      transition: "all 0.12s",
    }}>
      <input type="checkbox" checked={checked} onChange={onToggle}
        style={{ marginTop: 2, accentColor: C.accentDark, cursor: "pointer" }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: C.text, fontFamily: T.mono }}>{item.name}</div>
        {item.desc && <div style={{ fontSize: 10, color: C.textLight, marginTop: 2 }}>{item.desc}</div>}
      </div>
      <div style={{ fontSize: 12, color: C.accentDark, fontFamily: T.mono, fontWeight: "bold", whiteSpace: "nowrap" }}>
        {fmtPrice(item)}
      </div>
    </label>
  );
}

function LineItem({ label, value, sub }) {
  if (!value && value !== 0) return null;
  if (value === 0) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "5px 0", borderBottom: `1px dashed ${C.divider}` }}>
      <span style={{ fontSize: 12, color: C.textMid, fontFamily: T.mono }}>
        {label}{sub && <span style={{ color: C.textLight, fontSize: 11 }}> {sub}</span>}
      </span>
      <span style={{ fontFamily: T.mono, fontSize: 13, color: C.text, fontWeight: "bold" }}>{fmt(value)}</span>
    </div>
  );
}

function SectionHead({ title }) {
  return (
    <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent, fontFamily: T.mono, marginBottom: 12, paddingBottom: 4, borderBottom: `2px solid ${C.divider}` }}>
      {title}
    </div>
  );
}

// ── CALCULATE FRAME COST ─────────────────────────────────────────────────────
function calculateFrame(db, frameData) {
  const { width, height, moulding, finish, spacer, strainer, glazing, matboard, backing, fitting, mounting, selectedModifiers, selectedAddons, dropCleat } = frameData;

  const frameW = width;
  const frameH = height;
  const shortSide = Math.min(frameW, frameH);
  const longSide = Math.max(frameW, frameH);
  const perimeterIn = 2 * (frameW + frameH);
  const perimeterLF = (perimeterIn / 12) * 1.1;
  const areaSqIn = frameW * frameH;
  const areaSqFt = areaSqIn / 144;

  const byName = (list, name) => list.find((x) => x.name === name);

  // ── Size-based auto-selection rules ──
  const warnings = [];

  // Glazing rules based on short side
  let effectiveGlazing = glazing;
  let glazingNote = null;
  if (glazing !== "None") {
    if (shortSide > 52 && shortSide <= 72) {
      // Short side 52-72": glazing needs custom quote
      glazingNote = "QUOTE REQUIRED";
      warnings.push(`Glazing: short side is ${shortSide}" (over 52") — requires manual quote`);
    } else if (shortSide > 72) {
      glazingNote = "QUOTE REQUIRED";
      warnings.push(`Glazing: short side is ${shortSide}" (over 72") — requires manual quote`);
    } else if (shortSide > 48 && shortSide <= 52 && (glazing === '1/8" Optium' || glazing === 'Optium 93% SBFA')) {
      // Optium over 48" but ≤52": use the over-48 variant
      effectiveGlazing = 'Optium 48-52" Short';
      glazingNote = "Auto-upgraded to Optium 48-52\" Short";
    }
  }

  // Matboard rules based on size
  let effectiveMatboard = matboard;
  let matboardNote = null;
  if (matboard !== "None" && matboard !== "4 Ply Mat (super oversize)") {
    if (shortSide >= 48 && shortSide <= 60 && longSide < 107) {
      effectiveMatboard = "4 Ply Mat (super oversize)";
      matboardNote = "Auto-upgraded to super oversize mat";
    }
  }

  const mouldingCost = (byName(db.mouldings, moulding)?.price || 0) * perimeterLF;
  const finishCost   = (byName(db.finishes, finish)?.price || 0) * perimeterLF;
  const spacerCost   = (byName(db.spacers, spacer)?.price || 0) * perimeterLF;
  const strainerBase = (byName(db.strainers, strainer)?.price || 0) * perimeterLF;
  const strainerCost = dropCleat ? strainerBase * 1.1 : strainerBase;
  const glazingCost  = glazingNote === "QUOTE REQUIRED" ? 0 : (byName(db.glazings, effectiveGlazing)?.price || 0) * areaSqIn;
  const matCost      = (byName(db.matboards, effectiveMatboard)?.price || 0) * areaSqIn;
  const backingCost  = (byName(db.backings, backing)?.price || 0) * areaSqIn;
  const fittingCost  = byName(db.fitting, fitting)?.price || 0;

  const mountingItem = byName(db.mounting, mounting);
  const mountingCost = mountingItem
    ? mountingItem.unit === "sqin" ? (mountingItem.price || 0) * areaSqIn : (mountingItem.price || 0)
    : 0;
  const laborCost = fittingCost + mountingCost;

  const modifierLines = [];
  for (const id of selectedModifiers) {
    const mod = db.modifiers.find((m) => m.id === id);
    if (!mod) continue;
    const cost = mod.unit === "lf" ? (mod.price || 0) * perimeterLF
               : mod.unit === "sqft" ? (mod.price || 0) * areaSqFt
               : (mod.price || 0);
    const sub  = mod.unit === "lf" ? `${perimeterLF.toFixed(2)} LF`
               : mod.unit === "sqft" ? `${areaSqFt.toFixed(2)} sq ft` : "flat";
    modifierLines.push({ name: mod.name, cost, sub });
  }
  const modifierTotal = modifierLines.reduce((s, l) => s + l.cost, 0);

  const addonLines = [];
  let rushPct = 0;
  for (const id of selectedAddons) {
    const addon = db.addons.find((a) => a.id === id);
    if (!addon) continue;
    if (addon.unit === "pct") { rushPct += (addon.pct || 0.1); continue; }
    addonLines.push({ name: addon.name, cost: addon.price || 0 });
  }
  const addonTotal = addonLines.reduce((s, l) => s + l.cost, 0);
  const baseSubtotal = mouldingCost + finishCost + spacerCost + strainerCost +
    glazingCost + matCost + backingCost + laborCost + modifierTotal + addonTotal;
  const rushCost = baseSubtotal * rushPct;
  const subtotal = baseSubtotal + rushCost;

  return {
    frameW, frameH, shortSide, longSide, perimeterLF, areaSqIn,
    mouldingCost, finishCost, spacerCost, strainerCost,
    glazingCost, matCost, backingCost, fittingCost, mountingCost, laborCost,
    modifierLines, modifierTotal,
    addonLines, addonTotal,
    rushCost, rushPct, subtotal, dropCleat: !!dropCleat,
    effectiveGlazing, effectiveMatboard, glazingNote, matboardNote, warnings,
  };
}

// ── AI TICKET PARSER (uses Anthropic API) ────────────────────────────────────
async function parseTicketWithAI(text, db) {
  const mouldingNames = db.mouldings.map(m => m.name);
  const finishNames = db.finishes.map(f => f.name);
  const spacerNames = db.spacers.map(s => s.name);
  const strainerNames = db.strainers.map(s => s.name);
  const glazingNames = db.glazings.map(g => g.name);
  const matboardNames = db.matboards.map(m => m.name);
  const backingNames = db.backings.map(b => b.name);
  const fittingNames = db.fitting.map(f => f.name);
  const mountingNames = db.mounting.map(m => m.name);
  const modifierNames = db.modifiers.map(m => m.name);
  const addonNames = db.addons.map(a => a.name);

  const systemPrompt = `You are a shop ticket parser for a custom picture framing shop called Small Works Inc. You extract structured data from shop tickets / work orders. You must return ONLY valid JSON with no markdown or preamble.

Available options in the price database:
MOULDINGS: ${JSON.stringify(mouldingNames)}
FINISHES: ${JSON.stringify(finishNames)}
SPACERS: ${JSON.stringify(spacerNames)}
STRAINERS: ${JSON.stringify(strainerNames)}
GLAZINGS: ${JSON.stringify(glazingNames)}
MATBOARDS: ${JSON.stringify(matboardNames)}
BACKINGS: ${JSON.stringify(backingNames)}
FITTING: ${JSON.stringify(fittingNames)}
MOUNTING: ${JSON.stringify(mountingNames)}
MODIFIERS: ${JSON.stringify(modifierNames)}
ADDONS: ${JSON.stringify(addonNames)}

Rules:
- Match items to the closest available option in the database. Be flexible with abbreviations, shorthand, and informal descriptions.
- Common abbreviations: "CC" = "Clear Coat", "OW" or "O/W" = "Oil/Wax", "FC" = "Foamcore", "MG" = "Museum Glass", "CG" = "Conservation Glass", "OP3" = '1/8" OP3 UV Plex', "OPTIUM" = '1/8" Optium', "std" or "standard" fitting = "Fitting (standard)", "sm" = small, "lg" = large, "B&C" or "bleach & clear" = "Bleach and Clear", "B&O" = "Bleach and Oil", "S&C" = "Stain and Clear", "ltgraph" or "lt graphite" = "Light Graphite", "PF" = "Painted", "2clr" = "Two Color Paint", "COROPLAST" = "Coroplast", "GATOR" = "Gator"
- Pay special attention to finish information — it may be written casually or as a shorthand.
- If both frame size and art size are given, use the FRAME SIZE for width and height (this is the opening size we quote on).
- Dimensions with fractions: ¼=0.25, ½=0.5, ¾=0.75, ⅛=0.125, ⅜=0.375, ⅝=0.625, ⅞=0.875
- CRITICAL: Only return frames that have ACTUAL DATA — a frame MUST have real dimensions (width and height) to count. Ignore any blank or unfilled entries. Do NOT guess or invent frames.
- For FITTING TICKETS: include appropriate fitting type based on frame size. Frames over 40" on any side are oversize.
- For HINGING: map to appropriate size. Over 30x40 = "Hinging 30x40". Over 48" short side = 'Hinging Over 48" Short'.
- For items not mentioned on a valid frame, use "None". But be thorough — consider all text before deciding something is "None".
- If you can identify a client name or job name, include it.
- Width and height should be the FRAME size (opening size). This is what we quote on. If art size is also given, ignore it — use frame size.
- Return this exact JSON structure:
{
  "jobName": "string or empty",
  "clientName": "string or empty",
  "frames": [
    {
      "label": "short description of this frame",
      "width": number,
      "height": number,
      "moulding": "exact name from list",
      "finish": "exact name from list or None",
      "spacer": "exact name from list or None",
      "strainer": "exact name from list or None",
      "glazing": "exact name from list or None",
      "matboard": "exact name from list or None",
      "backing": "exact name from list or None",
      "fitting": "exact name from list or None",
      "mounting": "exact name from list or None",
      "modifiers": ["exact modifier names from list"],
      "addons": ["exact addon names from list"]
    }
  ]
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: `Parse this shop ticket and extract all frame information:\n\n${text}` }],
      }),
    });
    const data = await response.json();
    const raw = data.content?.map(c => c.text || "").join("") || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("AI parse error:", err);
    return null;
  }
}

async function parseTicketImagesWithAI(images, db) {
  // images is an array of {base64, mediaType} objects (1 or 2 images)
  const mouldingNames = db.mouldings.map(m => m.name);
  const finishNames = db.finishes.map(f => f.name);
  const spacerNames = db.spacers.map(s => s.name);
  const strainerNames = db.strainers.map(s => s.name);
  const glazingNames = db.glazings.map(g => g.name);
  const matboardNames = db.matboards.map(m => m.name);
  const backingNames = db.backings.map(b => b.name);
  const fittingNames = db.fitting.map(f => f.name);
  const mountingNames = db.mounting.map(m => m.name);
  const modifierNames = db.modifiers.map(m => m.name);
  const addonNames = db.addons.map(a => a.name);

  const systemPrompt = `You are a shop ticket parser for a custom picture framing shop called Small Works Inc. You read images of shop tickets / work orders and extract structured data. You must return ONLY valid JSON with no markdown or preamble.

UNDERSTANDING THE TICKET FORMAT:
The shop uses a standardized ticket system with TWO pages per job:

PAGE 1 — FITTING TICKET (for assembly):
Columns: QTY | FRAME SIZE/PROFILE | SPACERS | MATBOARD | HINGING | GLAZING | BACKING | ART SIZE/CONDITION/LOCATION
- FRAME SIZE: H (height) and W (width) in inches, may include fractions
- SPACERS on fitting ticket: RW = rabbet width, WW = spacer width, PW = panel width. These are all "Raglined" spacers. If ANY of RW, WW, or PW have values written in, the spacer type is "Raglined". "Wood" circled = a matching wood spacer instead.
- MATBOARD: RISING, WARM, POLAR, ANTIQUE, OTHER — circled = selected
- HINGING: "museum", "wrap", "straight", "other" — circled = selected. LIFT: FC = foamcore
- GLAZING: OP3, OPTIUM, museum — circled = selected
- BACKING: 1/4 COROPLAST, 1/8 COROPLAST, GATOR, O/S — circled = selected
- ART SIZE: Separate from frame size. Informational only — we quote on FRAME size, not art size.

PAGE 2 — WOODSHOP TICKET (for frame building):
Columns: QTY | FRAME SIZE | PROFILE | DIAGRAM | FINISH | STRAINER | SPACERS | SPECIAL/NOTES
- FRAME SIZE: H and W in inches
- PROFILE: The moulding profile number and wood type (e.g. "601 Walnut", "500 Maple")
- DIAGRAM: A cross-section sketch of the frame profile (informational)
- FINISH: The finish to apply. Written by hand. Look for: "oil wax", "oil/wax", "clear coat", "painted", "bleach", "graphite", "stain", etc.
- STRAINER: Pre-printed sizes 3/4, 1/2, 3/8, OTHER. Circled = selected.
- SPACERS on woodshop ticket: Pre-printed sizes 5/16, 3/8, 1/2 with "SKINNY" option. Circled or written values indicate spacer size. Also an "OTHER" field for custom sizes.
- SPECIAL/NOTES: Pre-printed options that may be circled: ROUNDED CORNERS, BEVEL, GEM FACED, LAP JOIN, PIN WHEELED. Plus a NOTES field for additional instructions.
- Also has: MITRE SPLINE and FACE SPLINE checkboxes — circled or checked = selected
- CUT TO: specific cut dimensions if different from frame size
- CLEAT / DROP CLEAT: hanging hardware options — circled = selected. IMPORTANT: If "DROP CLEAT" is circled/selected, add 10% extra to the strainer quantity (the strainer cost should be multiplied by 1.1 to account for extra strainer material needed for the cleat).

HOW TO COMBINE TWO PAGES:
If you see TWO images, combine the information from both into a single set of frames. Match frames across pages by their position (row 1 on page 1 = row 1 on page 2) and by matching dimensions. Each row across both pages represents ONE frame.

HOW TO READ CIRCLED vs WRITTEN vs CROSSED OUT items:
- CIRCLED or MARKED items on the pre-printed form = that option is selected
- HANDWRITTEN text = additional specifications
- If something is circled AND has handwriting, the handwriting may clarify or override
- CROSSED OUT / STRUCK THROUGH: If an entire section, row, or group of options has a line drawn through it, an X over it, or is otherwise crossed out or struck through, that means NONE of those items are selected. Ignore everything in that crossed-out area. A single diagonal line, X, or scribble over a section means "not applicable" or "skip this section".
- Be careful to distinguish between: a CIRCLE around one item (= selected) vs a line THROUGH multiple items or a whole section (= rejected/not applicable)

MAPPING TICKET FIELDS TO DATABASE:
- Profile (e.g. "601 Walnut") → match to MOULDINGS list
- Finish (handwritten, e.g. "oil wax") → match to FINISHES list. "oil wax" or "oil/wax" or "O/W" = "Oil/Wax". "clear coat" or "CC" = "Clear Coat". "painted" = "Painted".
- Strainer (circled size) → match to STRAINERS: "1/2" = '1/2" Strainer', "3/8" = '3/8" Strainer', "3/4" = '3/4" Strainer'
- Spacers → match to SPACERS by size. If "SKINNY" or a small fraction, use closest match.
- GLAZING: "OP3" = '1/8" OP3 UV Plex'. "OPTIUM" = '1/8" Optium' (or 48-52" variant if short side > 48"). "museum" = "Museum Glass".
- BACKING: "COROPLAST" = "Coroplast", "GATOR" = "Gator", "FC" = "Foamcore"
- HINGING → "Hinging" for normal, "Hinging 30x40" if over 30x40, 'Hinging Over 48" Short' if short side > 48"
- FITTING TICKET → include fitting: "Fitting (standard)" normally, "Fitting Oversize 1" if any dimension > 40", "Fitting Oversize 2" if very large
- SPECIAL NOTES / MODIFIERS: "BEVEL" circled = "Bevel" modifier. "FACE SPLINE" circled/checked = "Face Spline" modifier (or "Face Spline (Large)" for large frames). "LAP JOIN" circled = "Lap Join" addon (small/medium/large based on frame size). "ROUNDED CORNERS" circled = "Rounded Corners" addon. "DROP CLEAT" circled = include "dropCleat": true in the frame JSON (this triggers extra strainer material).
- IMPORTANT: Width and height = the FRAME SIZE (opening size). This is what we quote on. The ticket may also show an art size — ignore it for pricing. Always use the frame H and W dimensions.
- If only art size is available and no frame size, use the art size as a fallback.

Available options in the price database:
MOULDINGS: ${JSON.stringify(mouldingNames)}
FINISHES: ${JSON.stringify(finishNames)}
SPACERS: ${JSON.stringify(spacerNames)}
STRAINERS: ${JSON.stringify(strainerNames)}
GLAZINGS: ${JSON.stringify(glazingNames)}
MATBOARDS: ${JSON.stringify(matboardNames)}
BACKINGS: ${JSON.stringify(backingNames)}
FITTING: ${JSON.stringify(fittingNames)}
MOUNTING: ${JSON.stringify(mountingNames)}
MODIFIERS: ${JSON.stringify(modifierNames)}
ADDONS: ${JSON.stringify(addonNames)}

Additional rules:
- "WW" in the SPACERS column = spacer width measurement, NOT "White Wax" finish.
- Fractions: ¼=0.25, ½=0.5, ¾=0.75, ⅛=0.125, ⅜=0.375, ⅝=0.625, ⅞=0.875
- CRITICAL: Only return frames for rows with ACTUAL DATA (dimensions filled in). Ignore blank rows.
- For items not circled or mentioned, use "None". Be thorough — check ALL marks before using "None".
- Include client name and job name from the ticket header.
- Return this exact JSON structure:
{
  "jobName": "string or empty",
  "clientName": "string or empty",
  "frames": [
    {
      "label": "short description of this frame",
      "width": number,
      "height": number,
      "moulding": "exact name from list",
      "finish": "exact name from list or None",
      "spacer": "exact name from list or None",
      "strainer": "exact name from list or None",
      "glazing": "exact name from list or None",
      "matboard": "exact name from list or None",
      "backing": "exact name from list or None",
      "fitting": "exact name from list or None",
      "mounting": "exact name from list or None",
      "modifiers": ["exact modifier names from list"],
      "addons": ["exact addon names from list"],
      "dropCleat": false
    }
  ]
}`;

  // Build content array with all images
  const content = [];
  images.forEach((img, i) => {
    content.push({ type: "image", source: { type: "base64", media_type: img.mediaType, data: img.base64 } });
  });

  const imageCount = images.length;
  const instructionText = imageCount === 2
    ? "You are looking at TWO pages of the same shop ticket. Page 1 is typically the FITTING TICKET and Page 2 is the WOODSHOP TICKET. Combine information from BOTH pages to build complete frame specifications. Match rows by position (row 1 on both pages = same frame). Read ALL circled items, handwritten notes, finishes, and annotations from BOTH pages. Return ONLY JSON."
    : "Read this shop ticket image thoroughly. It may be either a FITTING TICKET or WOODSHOP TICKET. Look at ALL circled items, handwritten notes, written-out descriptions (especially finishes), and annotations. Extract every piece of frame information. Return ONLY JSON.";

  content.push({ type: "text", text: instructionText });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: "user", content }],
      }),
    });
    const data = await response.json();
    const raw = data.content?.map(c => c.text || "").join("") || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("AI image parse error:", err);
    return null;
  }
}


// ── DATABASE MODAL ────────────────────────────────────────────────────────────
function DatabaseModal({ db, onSave, onClose }) {
  const [localDb, setLocalDb] = useState(() => JSON.parse(JSON.stringify(db)));
  const [activeCategory, setActiveCategory] = useState("mouldings");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newForm, setNewForm] = useState({ name: "", price: "", unit: "flat", pct: "", desc: "" });
  const [globalPct, setGlobalPct] = useState("");
  const [globalTarget, setGlobalTarget] = useState("all");
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const meta = CATEGORY_META[activeCategory];
  const items = localDb[activeCategory] || [];

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ name: item.name, price: item.price ?? "", unit: item.unit ?? "flat", pct: item.pct ?? "", desc: item.desc ?? "" });
  };

  const saveEdit = (id) => {
    setLocalDb((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map((it) =>
        it.id === id ? {
          ...it, name: editForm.name,
          price: editForm.unit === "pct" ? null : parseFloat(editForm.price) || 0,
          unit: meta.hasUnit ? editForm.unit : it.unit,
          pct: editForm.unit === "pct" ? parseFloat(editForm.pct) || 0 : it.pct,
          desc: meta.hasDesc ? editForm.desc : it.desc,
        } : it
      ),
    }));
    setEditingId(null);
  };

  const deleteItem = (id) => {
    setLocalDb((prev) => ({ ...prev, [activeCategory]: prev[activeCategory].filter((it) => it.id !== id) }));
  };

  const addItem = () => {
    if (!newForm.name.trim()) return;
    const newItem = {
      id: uid(), name: newForm.name.trim(),
      price: newForm.unit === "pct" ? null : parseFloat(newForm.price) || 0,
      unit: meta.hasUnit ? newForm.unit : undefined,
      pct: newForm.unit === "pct" ? parseFloat(newForm.pct) || 0.1 : undefined,
      desc: meta.hasDesc && newForm.desc ? newForm.desc : undefined,
    };
    Object.keys(newItem).forEach((k) => newItem[k] === undefined && delete newItem[k]);
    setLocalDb((prev) => ({ ...prev, [activeCategory]: [...prev[activeCategory], newItem] }));
    setNewForm({ name: "", price: "", unit: "flat", pct: "", desc: "" });
  };

  const applyGlobalPct = () => {
    const pct = parseFloat(globalPct);
    if (!pct) return;
    const multiplier = 1 + pct / 100;
    const applyToCategory = (cat) => cat.map((item) => {
      if (item.price == null || item.price === 0 || item.name === "None") return item;
      return { ...item, price: round2(item.price * multiplier) };
    });
    if (globalTarget === "all") {
      const updated = {};
      Object.keys(localDb).forEach((cat) => { updated[cat] = applyToCategory(localDb[cat]); });
      setLocalDb(updated);
    } else {
      setLocalDb((prev) => ({ ...prev, [globalTarget]: applyToCategory(prev[globalTarget]) }));
    }
    setGlobalPct("");
  };

  const handleSave = () => { onSave(localDb); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handleReset = () => { setLocalDb(JSON.parse(JSON.stringify(DEFAULT_DB))); setConfirmReset(false); };
  const catKeys = Object.keys(CATEGORY_META);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(30,20,10,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, width: "100%", maxWidth: 860, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: `2px solid ${C.divider}` }}>
          <div>
            <div style={{ fontFamily: T.sans, fontSize: 20, color: C.text, fontWeight: 700 }}>Price Database</div>
            <div style={{ fontSize: 11, color: C.textLight, fontFamily: T.mono, marginTop: 2 }}>Edit items, prices, and categories</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {saved && <span style={{ fontSize: 11, color: C.green, fontFamily: T.mono }}>✓ Saved</span>}
            <button onClick={handleSave} style={btn("primary")}>Save Changes</button>
            <button onClick={onClose} style={btn("ghost")}>Close</button>
          </div>
        </div>
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div style={{ width: 180, borderRight: `1px solid ${C.divider}`, padding: "12px 0", overflowY: "auto", flexShrink: 0 }}>
            <div style={{ padding: "8px 14px 12px", borderBottom: `1px solid ${C.divider}`, marginBottom: 8 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, marginBottom: 8, fontFamily: T.mono }}>Global Price Adjust</div>
              <select value={globalTarget} onChange={(e) => setGlobalTarget(e.target.value)} style={{ ...selectStyle, fontSize: 11, padding: "5px 8px", marginBottom: 6, width: "100%" }}>
                <option value="all">All Categories</option>
                {catKeys.map((k) => <option key={k} value={k}>{CATEGORY_META[k].label}</option>)}
              </select>
              <div style={{ display: "flex", gap: 4 }}>
                <input type="number" placeholder="%" value={globalPct} onChange={(e) => setGlobalPct(e.target.value)} style={{ ...baseInput, fontSize: 12, padding: "5px 8px", width: 56 }} />
                <button onClick={applyGlobalPct} style={{ ...btn("primary"), fontSize: 11, padding: "5px 10px" }}>Apply</button>
              </div>
              <div style={{ fontSize: 9, color: C.textFaint, marginTop: 4, fontFamily: T.mono }}>e.g. 10 = +10%, -5 = -5%</div>
            </div>
            {catKeys.map((k) => (
              <button key={k} onClick={() => { setActiveCategory(k); setEditingId(null); }} style={{
                display: "block", width: "100%", textAlign: "left", background: activeCategory === k ? C.highlight : "transparent",
                border: "none", borderLeft: `3px solid ${activeCategory === k ? C.accentDark : "transparent"}`,
                padding: "8px 14px", fontFamily: T.mono, fontSize: 12, color: activeCategory === k ? C.accentDark : C.textMid,
                cursor: "pointer", fontWeight: activeCategory === k ? "bold" : "normal",
              }}>
                {CATEGORY_META[k].label}
                <span style={{ fontSize: 10, color: C.textLight, marginLeft: 4 }}>({localDb[k]?.length ?? 0})</span>
              </button>
            ))}
            <div style={{ padding: "12px 14px", borderTop: `1px solid ${C.divider}`, marginTop: 8 }}>
              {!confirmReset ? (
                <button onClick={() => setConfirmReset(true)} style={{ ...btn("ghost"), fontSize: 11, width: "100%" }}>Reset to Defaults</button>
              ) : (
                <div>
                  <div style={{ fontSize: 10, color: C.danger, marginBottom: 6, fontFamily: T.mono }}>Reset all prices?</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={handleReset} style={{ ...btn("danger"), fontSize: 11, flex: 1 }}>Yes</button>
                    <button onClick={() => setConfirmReset(false)} style={{ ...btn("ghost"), fontSize: 11, flex: 1 }}>No</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <div style={{ fontFamily: T.sans, fontSize: 16, color: C.text, fontWeight: 600 }}>{meta.label}</div>
              <div style={{ fontSize: 11, color: C.textLight, fontFamily: T.mono }}>Unit: {meta.unitLabel}</div>
            </div>
            <div style={{ border: `1px solid ${C.divider}`, borderRadius: 4, overflow: "hidden", marginBottom: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: meta.hasUnit ? "1fr 90px 70px 80px 28px" : "1fr 90px 28px", background: C.divider, padding: "6px 10px", gap: 8 }}>
                <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textLight, fontFamily: T.mono }}>Name</span>
                <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textLight, fontFamily: T.mono }}>Price</span>
                {meta.hasUnit && <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textLight, fontFamily: T.mono }}>Unit</span>}
                {meta.hasUnit && <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textLight, fontFamily: T.mono }}>Desc</span>}
                <span />
              </div>
              {items.map((item, idx) => (
                editingId === item.id ? (
                  <div key={item.id} style={{ background: "#fffbf5", borderTop: `1px solid ${C.divider}`, padding: "10px 10px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: meta.hasUnit ? "1fr 90px 80px 1fr auto" : "1fr 90px auto", gap: 8, alignItems: "start" }}>
                      <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} style={{ ...baseInput, fontSize: 12 }} placeholder="Name" />
                      <input type="number" value={editForm.unit === "pct" ? (editForm.pct ?? "") : (editForm.price ?? "")}
                        onChange={(e) => editForm.unit === "pct" ? setEditForm({ ...editForm, pct: e.target.value }) : setEditForm({ ...editForm, price: e.target.value })}
                        style={{ ...baseInput, fontSize: 12 }} placeholder={editForm.unit === "pct" ? "0.1" : "0.00"} />
                      {meta.hasUnit && (
                        <select value={editForm.unit} onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })} style={{ ...selectStyle, fontSize: 12 }}>
                          {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
                        </select>
                      )}
                      {meta.hasUnit && (
                        <input value={editForm.desc} onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })} style={{ ...baseInput, fontSize: 12 }} placeholder="Description (optional)" />
                      )}
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => saveEdit(item.id)} style={{ ...btn("primary"), fontSize: 11 }}>Save</button>
                        <button onClick={() => setEditingId(null)} style={{ ...btn("ghost"), fontSize: 11 }}>×</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={item.id} style={{
                    display: "grid", gridTemplateColumns: meta.hasUnit ? "1fr 90px 70px 80px 28px" : "1fr 90px 28px",
                    alignItems: "center", gap: 8, padding: "8px 10px",
                    borderTop: idx === 0 ? "none" : `1px solid ${C.divider}`,
                    background: item.name === "None" ? "#f5f0ea" : "transparent",
                  }}>
                    <span style={{ fontSize: 13, fontFamily: T.mono, color: item.name === "None" ? C.textLight : C.text }}>{item.name}</span>
                    <span style={{ fontSize: 13, fontFamily: T.mono, color: C.accentDark, fontWeight: "bold" }}>{fmtPrice(item)}</span>
                    {meta.hasUnit && <span style={{ fontSize: 11, fontFamily: T.mono, color: C.textLight }}>{item.unit ?? "flat"}</span>}
                    {meta.hasUnit && <span style={{ fontSize: 11, fontFamily: T.mono, color: C.textLight, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.desc ?? ""}</span>}
                    <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                      {item.name !== "None" && (
                        <>
                          <button onClick={() => startEdit(item)} title="Edit" style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 14, color: C.textLight, padding: "0 2px", lineHeight: 1 }}>✎</button>
                          <button onClick={() => deleteItem(item.id)} title="Delete" style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 14, color: "#d4b0aa", padding: "0 2px", lineHeight: 1 }}>✕</button>
                        </>
                      )}
                    </div>
                  </div>
                )
              ))}
            </div>
            <div style={{ background: C.highlight, border: `1px solid ${C.accent}`, borderRadius: 4, padding: 14 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.accent, fontFamily: T.mono, marginBottom: 10 }}>＋ Add New Item</div>
              <div style={{ display: "grid", gridTemplateColumns: meta.hasUnit ? "1fr 80px 70px 1fr auto" : "1fr 80px auto", gap: 8, alignItems: "end" }}>
                <div>
                  <label style={{ ...labelStyle, fontSize: 10 }}>Name</label>
                  <input value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} style={{ ...baseInput, fontSize: 12, width: "100%" }} placeholder="Item name" />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: 10 }}>{newForm.unit === "pct" ? "Pct (0.1=10%)" : "Price"}</label>
                  <input type="number" value={newForm.unit === "pct" ? newForm.pct : newForm.price}
                    onChange={(e) => newForm.unit === "pct" ? setNewForm({ ...newForm, pct: e.target.value }) : setNewForm({ ...newForm, price: e.target.value })}
                    style={{ ...baseInput, fontSize: 12, width: "100%" }} placeholder="0.00" />
                </div>
                {meta.hasUnit && (
                  <div>
                    <label style={{ ...labelStyle, fontSize: 10 }}>Unit</label>
                    <select value={newForm.unit} onChange={(e) => setNewForm({ ...newForm, unit: e.target.value })} style={{ ...selectStyle, fontSize: 12 }}>
                      {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                )}
                {meta.hasUnit && (
                  <div>
                    <label style={{ ...labelStyle, fontSize: 10 }}>Description (optional)</label>
                    <input value={newForm.desc} onChange={(e) => setNewForm({ ...newForm, desc: e.target.value })} style={{ ...baseInput, fontSize: 12, width: "100%" }} placeholder="e.g. per LF" />
                  </div>
                )}
                <button onClick={addItem} style={{ ...btn("primary"), whiteSpace: "nowrap" }}>Add Item</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ── TICKET SCANNER MODAL ─────────────────────────────────────────────────────
function TicketScannerModal({ db, onImportFrames, onClose }) {
  const [ticketText, setTicketText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(null); // "fitting" | "woodshop" | null
  const fittingInputRef = useRef(null);
  const woodshopInputRef = useRef(null);

  // Two-image state
  const [fittingImage, setFittingImage] = useState(null); // {preview, base64, mediaType}
  const [woodshopImage, setWoodshopImage] = useState(null);

  const handleParse = async () => {
    if (!ticketText.trim()) return;
    setParsing(true);
    setError(null);
    setParsedResult(null);
    const result = await parseTicketWithAI(ticketText, db);
    setParsing(false);
    if (result && result.frames && result.frames.length > 0) {
      setParsedResult(result);
    } else {
      setError("Could not parse the ticket. Please check the text and try again.");
    }
  };

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        reject("Please upload a JPG, PNG, GIF, or WebP image.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const base64 = dataUrl.split(",")[1];
        resolve({ preview: dataUrl, base64, mediaType: file.type });
      };
      reader.onerror = () => reject("Failed to read the image file.");
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (file, slot) => {
    if (!file) return;
    try {
      const imgData = await processFile(file);
      if (slot === "fitting") setFittingImage(imgData);
      else setWoodshopImage(imgData);
      setError(null);
    } catch (e) {
      setError(e);
    }
  };

  const handleScanImages = async () => {
    if (!fittingImage && !woodshopImage) return;
    setParsing(true);
    setError(null);
    setParsedResult(null);

    const images = [];
    if (fittingImage) images.push({ base64: fittingImage.base64, mediaType: fittingImage.mediaType });
    if (woodshopImage) images.push({ base64: woodshopImage.base64, mediaType: woodshopImage.mediaType });

    const result = await parseTicketImagesWithAI(images, db);
    setParsing(false);
    if (result && result.frames && result.frames.length > 0) {
      setParsedResult(result);
    } else {
      setError("Could not read the ticket image(s). Try uploading clearer photos or typing the ticket text instead.");
    }
  };

  const handleDrop = (e, slot) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileUpload(file, slot);
  };

  const handleImport = () => {
    if (parsedResult) {
      onImportFrames(parsedResult);
      onClose();
    }
  };

  const hasAnyImage = fittingImage || woodshopImage;

  const dropZone = (slot, label, sublabel, imgData, inputRef) => (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(slot); }}
      onDragLeave={() => setDragOver(null)}
      onDrop={(e) => handleDrop(e, slot)}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragOver === slot ? C.accentDark : imgData ? C.green : C.border}`,
        borderRadius: 8, padding: imgData ? 12 : 24, textAlign: "center", cursor: "pointer",
        background: dragOver === slot ? C.highlight : imgData ? "#f4f9f5" : C.scanBg,
        transition: "all 0.15s", flex: 1, minWidth: 200, position: "relative",
      }}
    >
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={(e) => handleFileUpload(e.target.files?.[0], slot)} />
      {imgData ? (
        <div>
          <img src={imgData.preview} alt={label} style={{ maxWidth: "100%", maxHeight: 160, borderRadius: 4 }} />
          <div style={{ fontFamily: T.mono, fontSize: 10, color: C.green, marginTop: 6, letterSpacing: "0.05em" }}>✓ {label}</div>
          <button onClick={(e) => {
            e.stopPropagation();
            if (slot === "fitting") setFittingImage(null); else setWoodshopImage(null);
          }} style={{
            position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.5)", color: "#fff",
            border: "none", borderRadius: 12, width: 22, height: 22, cursor: "pointer", fontSize: 12, lineHeight: "22px",
          }}>×</button>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 28, marginBottom: 6, opacity: 0.4 }}>{slot === "fitting" ? "📋" : "🪵"}</div>
          <div style={{ fontFamily: T.mono, fontSize: 12, color: C.textMid, fontWeight: "bold", marginBottom: 4 }}>{label}</div>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: C.textFaint }}>{sublabel}</div>
        </>
      )}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(30,20,10,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, width: "100%", maxWidth: 800, maxHeight: "92vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.25)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: `2px solid ${C.divider}`, flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: T.sans, fontSize: 20, color: C.text, fontWeight: 700 }}>⎘ Scan Shop Ticket</div>
            <div style={{ fontSize: 11, color: C.textLight, fontFamily: T.mono, marginTop: 2 }}>Upload both pages of a ticket, or paste text</div>
          </div>
          <button onClick={onClose} style={btn("ghost")}>Close</button>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          {/* Input area */}
          {!parsedResult && (
            <>
              {/* Two-image Upload Zones */}
              <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
                {dropZone("fitting", "Page 1 — Fitting Ticket", "Glazing, backing, hinging, matboard", fittingImage, fittingInputRef)}
                {dropZone("woodshop", "Page 2 — Woodshop Ticket", "Profile, finish, strainer, modifiers", woodshopImage, woodshopInputRef)}
              </div>

              <div style={{ fontSize: 10, color: C.textFaint, fontFamily: T.mono, textAlign: "center", marginBottom: 12 }}>
                Upload one or both pages — more pages = more complete quote
              </div>

              {hasAnyImage && (
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <button onClick={handleScanImages} disabled={parsing} style={{
                    ...btn("primary"), padding: "10px 28px", fontSize: 13,
                    opacity: parsing ? 0.5 : 1,
                  }}>
                    {parsing ? "⟳ Scanning…" : `Scan ${fittingImage && woodshopImage ? "Both Pages" : "Ticket"}`}
                  </button>
                  {parsing && (
                    <div style={{ fontFamily: T.mono, fontSize: 12, color: C.textLight, marginTop: 8, animation: "pulse 1.5s infinite" }}>
                      AI is reading {fittingImage && woodshopImage ? "both ticket pages" : "the ticket"}…
                    </div>
                  )}
                </div>
              )}

              <div style={{ textAlign: "center", fontFamily: T.mono, fontSize: 11, color: C.textFaint, marginBottom: 16, letterSpacing: "0.2em" }}>— OR TYPE / PASTE BELOW —</div>

              <textarea
                value={ticketText}
                onChange={(e) => setTicketText(e.target.value)}
                placeholder={`Paste or type your shop ticket here...\n\nExample:\nClient: Jane Smith\nJob: Gallery Show 2026\n\nFrame 1: 16x20, 601 Walnut, Clear Coat, Museum Glass,\n  Foamcore backing, Standard fitting, Hinging\n\nFrame 2: 24x36, 500 Maple, Painted, OP3 Plex,\n  4 Ply Mat 2.5" overhang, Foamcore,\n  Fitting oversize 1, Hinging 30x40`}
                style={{ ...baseInput, width: "100%", minHeight: 150, resize: "vertical", lineHeight: 1.6, fontSize: 13 }}
              />

              <div style={{ display: "flex", gap: 10, marginTop: 16, alignItems: "center" }}>
                <button onClick={handleParse} disabled={parsing || !ticketText.trim()} style={{
                  ...btn("primary"), padding: "10px 24px", fontSize: 13,
                  opacity: (parsing || !ticketText.trim()) ? 0.5 : 1,
                }}>
                  {parsing ? "⟳ Scanning…" : "Scan Ticket Text"}
                </button>
              </div>
            </>
          )}

          {error && (
            <div style={{ background: C.dangerBg, border: `1px solid ${C.danger}`, borderRadius: 4, padding: 14, marginTop: 16, fontFamily: T.mono, fontSize: 12, color: C.danger }}>
              {error}
            </div>
          )}

          {/* Parsed Results */}
          {parsedResult && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: T.sans, fontSize: 16, fontWeight: 600, color: C.text }}>
                    Ticket Scanned — {parsedResult.frames.length} frame{parsedResult.frames.length !== 1 ? "s" : ""} found
                  </div>
                  {(parsedResult.clientName || parsedResult.jobName) && (
                    <div style={{ fontFamily: T.mono, fontSize: 12, color: C.textLight, marginTop: 4 }}>
                      {parsedResult.clientName && <>Client: <strong style={{ color: C.text }}>{parsedResult.clientName}</strong></>}
                      {parsedResult.clientName && parsedResult.jobName && " · "}
                      {parsedResult.jobName && <>Job: <strong style={{ color: C.text }}>{parsedResult.jobName}</strong></>}
                    </div>
                  )}
                </div>
                <button onClick={() => { setParsedResult(null); setError(null); setFittingImage(null); setWoodshopImage(null); }} style={btn("ghost")}>← Re-scan</button>
              </div>

              {parsedResult.frames.map((frame, i) => {
                const calc = calculateFrame(db, {
                  width: frame.width || 16, height: frame.height || 20,
                  moulding: frame.moulding || db.mouldings[0]?.name,
                  finish: frame.finish || "None", spacer: frame.spacer || "None",
                  strainer: frame.strainer || "None", glazing: frame.glazing || "None",
                  matboard: frame.matboard || "None", backing: frame.backing || "None",
                  fitting: frame.fitting || "None", mounting: frame.mounting || "None",
                  selectedModifiers: new Set((frame.modifiers || []).map(n => db.modifiers.find(m => m.name === n)?.id).filter(Boolean)),
                  selectedAddons: new Set((frame.addons || []).map(n => db.addons.find(a => a.name === n)?.id).filter(Boolean)),
                  dropCleat: !!frame.dropCleat,
                });
                return (
                  <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                      <div style={{ fontFamily: T.mono, fontSize: 13, fontWeight: "bold", color: C.accentDark }}>
                        Frame {i + 1}: {frame.label || `${frame.width}×${frame.height}`}
                      </div>
                      <div style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 700, color: C.text }}>{fmt(calc.subtotal)}</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px", fontFamily: T.mono, fontSize: 11, color: C.textMid }}>
                      <div>Size: {frame.width}" × {frame.height}"</div>
                      <div>Moulding: {frame.moulding}</div>
                      {frame.finish !== "None" && <div>Finish: {frame.finish}</div>}
                      {frame.glazing !== "None" && <div>Glazing: {frame.glazing}</div>}
                      {frame.matboard !== "None" && <div>Matboard: {frame.matboard}</div>}
                      {frame.backing !== "None" && <div>Backing: {frame.backing}</div>}
                      {frame.spacer !== "None" && <div>Spacer: {frame.spacer}</div>}
                      {frame.strainer !== "None" && <div>Strainer: {frame.strainer}</div>}
                      {frame.fitting !== "None" && <div>Fitting: {frame.fitting}</div>}
                      {frame.mounting !== "None" && <div>Mounting: {frame.mounting}</div>}
                      {frame.modifiers?.length > 0 && <div>Modifiers: {frame.modifiers.join(", ")}</div>}
                      {frame.addons?.length > 0 && <div>Add-ons: {frame.addons.join(", ")}</div>}
                    </div>
                  </div>
                );
              })}

              {parsedResult.frames.length > 1 && (() => {
                const total = parsedResult.frames.reduce((sum, frame) => {
                  const c = calculateFrame(db, {
                    width: frame.width || 16, height: frame.height || 20,
                    moulding: frame.moulding || db.mouldings[0]?.name,
                    finish: frame.finish || "None", spacer: frame.spacer || "None",
                    strainer: frame.strainer || "None", glazing: frame.glazing || "None",
                    matboard: frame.matboard || "None", backing: frame.backing || "None",
                    fitting: frame.fitting || "None", mounting: frame.mounting || "None",
                    selectedModifiers: new Set((frame.modifiers || []).map(n => db.modifiers.find(m => m.name === n)?.id).filter(Boolean)),
                    selectedAddons: new Set((frame.addons || []).map(n => db.addons.find(a => a.name === n)?.id).filter(Boolean)),
                  dropCleat: !!frame.dropCleat,
                  });
                  return sum + c.subtotal;
                }, 0);
                return (
                  <div style={{ borderTop: `2px solid ${C.text}`, paddingTop: 14, marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontFamily: T.sans, fontSize: 14, color: C.text }}>JOB TOTAL</span>
                    <span style={{ fontFamily: T.sans, fontSize: 26, fontWeight: 700, color: C.text }}>{fmt(total)}</span>
                  </div>
                );
              })()}

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button onClick={handleImport} style={{ ...btn("primary"), padding: "10px 24px", fontSize: 13 }}>
                  Import {parsedResult.frames.length} Frame{parsedResult.frames.length !== 1 ? "s" : ""} into Quote
                </button>
                <button onClick={() => { setParsedResult(null); setError(null); setFittingImage(null); setWoodshopImage(null); }} style={{ ...btn("ghost"), padding: "10px 20px" }}>
                  Re-scan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ── SINGLE FRAME EDITOR ──────────────────────────────────────────────────────
function FrameEditor({ db, frame, onChange, onRemove, index, isOnly }) {
  const { width, height, moulding, finish, spacer, strainer, glazing, matboard, backing, fitting, mounting, selectedModifiers, selectedAddons, label, dropCleat } = frame;

  const update = (key, val) => onChange({ ...frame, [key]: val });

  const toggleSet = (key, id) => {
    const next = new Set(frame[key]);
    next.has(id) ? next.delete(id) : next.add(id);
    onChange({ ...frame, [key]: next });
  };

  const calc = useMemo(() => calculateFrame(db, frame), [db, frame]);

  const card = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 20, marginBottom: 20 };

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 2, marginBottom: 28, background: "#fff", overflow: "hidden" }}>
      {/* Frame header bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 20px", background: C.accentDark, color: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{
            background: "none", border: "none", color: "#fff", cursor: "pointer",
            fontFamily: T.mono, fontSize: 16, padding: 0, lineHeight: 1,
          }}>
            {collapsed ? "▸" : "▾"}
          </button>
          <div>
            <span style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 600 }}>
              Frame {index + 1}
            </span>
            {label && <span style={{ fontFamily: T.mono, fontSize: 11, marginLeft: 10, opacity: 0.8 }}>— {label}</span>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 700 }}>{fmt(calc.subtotal)}</span>
          {!isOnly && (
            <button onClick={onRemove} style={{
              background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
              cursor: "pointer", fontFamily: T.mono, fontSize: 11, padding: "4px 10px",
              borderRadius: 3,
            }}>Remove</button>
          )}
        </div>
      </div>

      {!collapsed && (
        <div style={{ padding: 20 }}>
          {/* Frame Label */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Frame Label / Description</label>
            <input value={label || ""} onChange={(e) => update("label", e.target.value)}
              style={{ ...baseInput, width: "100%" }} placeholder="e.g. Living room landscape, Gallery piece #3" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* LEFT: Inputs */}
            <div>
              <div style={card}>
                <SectionHead title="▸ Frame / Opening Size" />
                <div style={{ display: "flex", gap: 16 }}>
                  <NumInput label="Width (in)" value={width} onChange={(v) => update("width", v)} unit="inches" />
                  <NumInput label="Height (in)" value={height} onChange={(v) => update("height", v)} unit="inches" />
                </div>
                <div style={{ fontSize: 11, color: C.textLight, marginTop: -6, paddingBottom: 4 }}>
                  Frame size: {calc.frameW}" × {calc.frameH}" · Perimeter: {calc.perimeterLF.toFixed(2)} LF · Area: {calc.areaSqIn.toFixed(0)} sq in
                </div>
              </div>

              <div style={card}>
                <SectionHead title="▸ Linear Components  ($/LF × perimeter)" />
                <FieldSelect label="Moulding" options={db.mouldings} value={moulding} onChange={(v) => update("moulding", v)} unit="lf" />
                <FieldSelect label="Finish" options={db.finishes} value={finish} onChange={(v) => update("finish", v)} unit="lf" />
                <FieldSelect label="Spacer" options={db.spacers} value={spacer} onChange={(v) => update("spacer", v)} unit="lf" />
                <FieldSelect label="Strainer" options={db.strainers} value={strainer} onChange={(v) => update("strainer", v)} unit="lf" />
              </div>

              <div style={card}>
                <SectionHead title="▸ Moulding Modifiers" />
                {db.modifiers.map((mod) => (
                  <CheckItem key={mod.id} item={mod} checked={selectedModifiers.has(mod.id)} onToggle={() => toggleSet("selectedModifiers", mod.id)} />
                ))}
              </div>

              <div style={card}>
                <SectionHead title="▸ Planar Components  ($/sq in × area)" />
                <FieldSelect label="Glazing" options={db.glazings} value={glazing} onChange={(v) => update("glazing", v)} unit="sqin" />
                <FieldSelect label="Matboard" options={db.matboards} value={matboard} onChange={(v) => update("matboard", v)} unit="sqin" />
                <FieldSelect label="Backing" options={db.backings} value={backing} onChange={(v) => update("backing", v)} unit="sqin" />
              </div>

              <div style={card}>
                <SectionHead title="▸ Fitting & Mounting" />
                <FieldSelect label="Fitting" options={db.fitting} value={fitting} onChange={(v) => update("fitting", v)} unit="flat" />
                <FieldSelect label="Mounting Method" options={db.mounting} value={mounting} onChange={(v) => update("mounting", v)} unit="flat" />
                {mounting !== "None" && db.mounting.find((m) => m.name === mounting)?.desc && (
                  <div style={{ fontSize: 11, color: C.textLight, marginTop: -8, marginBottom: 6 }}>
                    {db.mounting.find((m) => m.name === mounting).desc}
                  </div>
                )}
                <label style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "7px 10px",
                  borderRadius: 4, cursor: "pointer", marginTop: 8,
                  background: dropCleat ? C.highlight : "transparent",
                  border: `1px solid ${dropCleat ? C.accent : C.divider}`,
                  transition: "all 0.12s",
                }}>
                  <input type="checkbox" checked={!!dropCleat} onChange={() => update("dropCleat", !dropCleat)}
                    style={{ accentColor: C.accentDark, cursor: "pointer" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: C.text, fontFamily: T.mono }}>Drop Cleat</div>
                    <div style={{ fontSize: 10, color: C.textLight, marginTop: 2 }}>Adds 10% extra strainer material</div>
                  </div>
                </label>
              </div>

              <div style={card}>
                <SectionHead title="▸ Add-ons" />
                {db.addons.map((addon) => (
                  <CheckItem key={addon.id} item={addon} checked={selectedAddons.has(addon.id)} onToggle={() => toggleSet("selectedAddons", addon.id)} />
                ))}
              </div>
            </div>

            {/* RIGHT: Receipt */}
            <div style={{ position: "sticky", top: 20, alignSelf: "start" }}>
              <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 2, padding: 24 }}>
                <div style={{ textAlign: "center", marginBottom: 20, paddingBottom: 16, borderBottom: `2px solid ${C.divider}` }}>
                  <div style={{ fontFamily: T.sans, fontSize: 18, color: C.text, fontWeight: 600 }}>
                    {label ? label : `Frame ${index + 1}`}
                  </div>
                  <div style={{ fontSize: 10, color: C.textLight, letterSpacing: "0.15em", marginTop: 4 }}>
                    {calc.frameW}" × {calc.frameH}" FRAME
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.2em", color: C.accent, textTransform: "uppercase", marginBottom: 6 }}>Linear</div>
                  <LineItem label={`Moulding — ${moulding}`} value={calc.mouldingCost} sub={`${calc.perimeterLF.toFixed(2)} LF`} />
                  <LineItem label={`Finish — ${finish}`} value={calc.finishCost} sub={`${calc.perimeterLF.toFixed(2)} LF`} />
                  <LineItem label={`Spacer — ${spacer}`} value={calc.spacerCost} sub={`${calc.perimeterLF.toFixed(2)} LF`} />
                  <LineItem label={`Strainer — ${strainer}${calc.dropCleat ? " +DC" : ""}`} value={calc.strainerCost} sub={`${calc.perimeterLF.toFixed(2)} LF${calc.dropCleat ? " +10%" : ""}`} />
                </div>

                {calc.modifierLines.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 9, letterSpacing: "0.2em", color: C.accent, textTransform: "uppercase", marginBottom: 6 }}>Modifiers</div>
                    {calc.modifierLines.map((l) => <LineItem key={l.name} label={l.name} value={l.cost} sub={l.sub} />)}
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.2em", color: C.accent, textTransform: "uppercase", marginBottom: 6 }}>Planar</div>
                  {calc.glazingNote === "QUOTE REQUIRED" ? (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "5px 0", borderBottom: `1px dashed ${C.divider}` }}>
                      <span style={{ fontSize: 12, color: C.danger, fontFamily: T.mono }}>Glazing — {glazing}</span>
                      <span style={{ fontFamily: T.mono, fontSize: 11, color: C.danger, fontWeight: "bold" }}>QUOTE REQ'D</span>
                    </div>
                  ) : (
                    <LineItem label={`Glazing — ${calc.effectiveGlazing}`} value={calc.glazingCost} sub={`${calc.areaSqIn.toFixed(0)} sq in`} />
                  )}
                  {calc.glazingNote && calc.glazingNote !== "QUOTE REQUIRED" && (
                    <div style={{ fontSize: 10, color: C.orange, fontFamily: T.mono, marginTop: -2, marginBottom: 4 }}>{calc.glazingNote}</div>
                  )}
                  <LineItem label={`Matboard — ${calc.effectiveMatboard}`} value={calc.matCost} sub={`${calc.areaSqIn.toFixed(0)} sq in`} />
                  {calc.matboardNote && (
                    <div style={{ fontSize: 10, color: C.orange, fontFamily: T.mono, marginTop: -2, marginBottom: 4 }}>{calc.matboardNote}</div>
                  )}
                  <LineItem label={`Backing — ${backing}`} value={calc.backingCost} sub={`${calc.areaSqIn.toFixed(0)} sq in`} />
                </div>

                {calc.laborCost > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 9, letterSpacing: "0.2em", color: C.accent, textTransform: "uppercase", marginBottom: 6 }}>Labor</div>
                    <LineItem label={`Fitting — ${fitting}`} value={calc.fittingCost} />
                    <LineItem label={`Mounting — ${mounting}`} value={calc.mountingCost}
                      sub={db.mounting.find((m) => m.name === mounting)?.unit === "sqin" ? `${calc.areaSqIn.toFixed(0)} sq in` : undefined} />
                  </div>
                )}

                {calc.addonLines.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 9, letterSpacing: "0.2em", color: C.accent, textTransform: "uppercase", marginBottom: 6 }}>Add-ons</div>
                    {calc.addonLines.map((l) => <LineItem key={l.name} label={l.name} value={l.cost} />)}
                  </div>
                )}

                {calc.rushCost > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 9, letterSpacing: "0.2em", color: C.accent, textTransform: "uppercase", marginBottom: 6 }}>Rush</div>
                    <LineItem label={`Rush Order (+${(calc.rushPct * 100).toFixed(0)}%)`} value={calc.rushCost} />
                  </div>
                )}

                {calc.warnings && calc.warnings.length > 0 && (
                  <div style={{ marginTop: 12, marginBottom: 8 }}>
                    {calc.warnings.map((w, i) => (
                      <div key={i} style={{ fontSize: 11, color: C.danger, fontFamily: T.mono, padding: "4px 8px", background: C.dangerBg, borderRadius: 2, marginBottom: 4 }}>
                        ⚠ {w}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ borderTop: `1px solid ${C.text}`, paddingTop: 14, marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: T.sans, fontSize: 11, color: C.text, letterSpacing: "0.15em", textTransform: "uppercase" }}>Frame Total</span>
                  <span style={{ fontFamily: T.sans, fontSize: 26, fontWeight: 300, color: C.text }}>{fmt(calc.subtotal)}</span>
                </div>

                <div style={{ marginTop: 16, fontSize: 10, color: C.textFaint, textAlign: "center", lineHeight: 1.5, fontFamily: T.sans }}>
                  Perimeter includes 10% waste for corner joins.<br />
                  Prices subject to change.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function FrameEstimator() {
  const [db, setDb] = useState(() => JSON.parse(JSON.stringify(DEFAULT_DB)));
  const [dbLoaded, setDbLoaded] = useState(false);
  const [showDb, setShowDb] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // Job-level info
  const [jobName, setJobName] = useState("");
  const [clientName, setClientName] = useState("");

  // Multi-frame state
  const makeDefaultFrame = useCallback(() => ({
    id: uid(),
    label: "",
    width: 16, height: 20,
    moulding: db.mouldings?.[0]?.name || "401 Maple",
    finish: "None", spacer: "None", strainer: "None",
    glazing: "None", matboard: "None", backing: "None",
    fitting: "None", mounting: "None",
    selectedModifiers: new Set(), selectedAddons: new Set(), dropCleat: false,
  }), [db.mouldings]);

  const [frames, setFrames] = useState([]);

  // Load DB from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("frame-estimator-db");
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged = { ...JSON.parse(JSON.stringify(DEFAULT_DB)) };
        Object.keys(parsed).forEach((k) => { if (merged[k]) merged[k] = parsed[k]; });
        setDb(merged);
      }
    } catch (e) {}
    setDbLoaded(true);
  }, []);

  // Initialize first frame after DB loads
  useEffect(() => {
    if (dbLoaded && frames.length === 0) {
      setFrames([{
        id: uid(), label: "", width: 16, height: 20,
        moulding: db.mouldings[0]?.name || "401 Maple",
        finish: "None", spacer: "None", strainer: "None",
        glazing: "None", matboard: "None", backing: "None",
        fitting: "None", mounting: "None",
        selectedModifiers: new Set(), selectedAddons: new Set(), dropCleat: false,
      }]);
    }
  }, [dbLoaded]);

  const saveDb = useCallback((newDb) => {
    setDb(newDb);
    try { localStorage.setItem("frame-estimator-db", JSON.stringify(newDb)); } catch (e) {}
  }, []);

  const addFrame = () => {
    setFrames(prev => [...prev, {
      id: uid(), label: "", width: 16, height: 20,
      moulding: db.mouldings[0]?.name || "401 Maple",
      finish: "None", spacer: "None", strainer: "None",
      glazing: "None", matboard: "None", backing: "None",
      fitting: "None", mounting: "None",
      selectedModifiers: new Set(), selectedAddons: new Set(), dropCleat: false,
    }]);
  };

  const updateFrame = (index, newFrame) => {
    setFrames(prev => prev.map((f, i) => i === index ? newFrame : f));
  };

  const removeFrame = (index) => {
    setFrames(prev => prev.filter((_, i) => i !== index));
  };

  const handleImportFrames = (parsedResult) => {
    if (parsedResult.clientName) setClientName(parsedResult.clientName);
    if (parsedResult.jobName) setJobName(parsedResult.jobName);

    const newFrames = parsedResult.frames.map(pf => ({
      id: uid(),
      label: pf.label || "",
      width: pf.width || 16,
      height: pf.height || 20,
      moulding: pf.moulding || db.mouldings[0]?.name,
      finish: pf.finish || "None",
      spacer: pf.spacer || "None",
      strainer: pf.strainer || "None",
      glazing: pf.glazing || "None",
      matboard: pf.matboard || "None",
      backing: pf.backing || "None",
      fitting: pf.fitting || "None",
      mounting: pf.mounting || "None",
      selectedModifiers: new Set((pf.modifiers || []).map(n => db.modifiers.find(m => m.name === n)?.id).filter(Boolean)),
      selectedAddons: new Set((pf.addons || []).map(n => db.addons.find(a => a.name === n)?.id).filter(Boolean)),
      dropCleat: !!pf.dropCleat,
    }));

    // Replace the default empty frame, or append
    setFrames(prev => {
      const hasOnlyDefault = prev.length === 1 && prev[0].width === 16 && prev[0].height === 20 && prev[0].finish === "None" && prev[0].glazing === "None";
      return hasOnlyDefault ? newFrames : [...prev, ...newFrames];
    });
  };

  // Job totals
  const jobCalcs = useMemo(() => {
    return frames.map(f => calculateFrame(db, f));
  }, [db, frames]);

  const jobTotal = useMemo(() => jobCalcs.reduce((sum, c) => sum + c.subtotal, 0), [jobCalcs]);

  if (!dbLoaded) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.mono, color: C.textLight }}>
      Loading…
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fff; }
        input:focus, select:focus { outline: 2px solid #1a1a1a; outline-offset: 1px; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #f5f5f5; } ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {showDb && <DatabaseModal db={db} onSave={saveDb} onClose={() => setShowDb(false)} />}
      {showScanner && <TicketScannerModal db={db} onImportFrames={handleImportFrames} onClose={() => setShowScanner(false)} />}

      <div style={{ minHeight: "100vh", background: C.bg, padding: "32px 16px", fontFamily: T.mono }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48, paddingTop: 8 }}>
          <h1 style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 400, color: C.text, letterSpacing: "0.35em", textTransform: "uppercase" }}>Small Works</h1>
          <div style={{ width: 40, height: 1, background: C.text, margin: "14px auto" }} />
          <div style={{ fontFamily: T.sans, fontSize: 28, fontWeight: 300, color: C.text, letterSpacing: "0.02em", lineHeight: 1.2 }}>Frame Estimator</div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
            <button onClick={() => setShowScanner(true)} style={{ ...btn("primary"), fontSize: 12, padding: "9px 20px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Scan Shop Ticket
            </button>
            <button onClick={() => setShowDb(true)} style={{ ...btn("ghost"), fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Price Database
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 1020, margin: "0 auto" }}>
          {/* Job Info Bar */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: "16px 20px",
            marginBottom: 24, display: "flex", gap: 20, alignItems: "end", flexWrap: "wrap",
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={labelStyle}>Client Name</label>
              <input value={clientName} onChange={(e) => setClientName(e.target.value)}
                style={{ ...baseInput, width: "100%" }} placeholder="e.g. Jane Smith" />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={labelStyle}>Job / Project Name</label>
              <input value={jobName} onChange={(e) => setJobName(e.target.value)}
                style={{ ...baseInput, width: "100%" }} placeholder="e.g. Gallery Show 2026" />
            </div>
            <div style={{ fontFamily: T.mono, fontSize: 11, color: C.textLight, paddingBottom: 4 }}>
              {frames.length} frame{frames.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Frames */}
          {frames.map((frame, i) => (
            <FrameEditor
              key={frame.id}
              db={db}
              frame={frame}
              index={i}
              isOnly={frames.length === 1}
              onChange={(newFrame) => updateFrame(i, newFrame)}
              onRemove={() => removeFrame(i)}
            />
          ))}

          {/* Add Frame Button */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <button onClick={addFrame} style={{
              ...btn("ghost"), fontSize: 13, padding: "12px 32px",
              border: `2px dashed ${C.accent}`, borderRadius: 6,
            }}>
              ＋ Add Another Frame
            </button>
          </div>

          {/* Job Quote Summary */}
          {frames.length > 0 && (
            <div style={{
              background: "#fff", border: `1px solid ${C.accentDark}`, borderRadius: 2,
              padding: 32, marginBottom: 40,
            }}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: C.textLight, marginBottom: 8, fontFamily: T.sans }}>
                  Quote Summary
                </div>
                <div style={{ fontFamily: T.sans, fontSize: 24, fontWeight: 300, color: C.text, letterSpacing: "0.02em" }}>
                  {clientName || jobName || "Untitled Job"}
                </div>
                {clientName && jobName && (
                  <div style={{ fontFamily: T.mono, fontSize: 12, color: C.textLight, marginTop: 4 }}>{jobName}</div>
                )}
                <div style={{ fontFamily: T.mono, fontSize: 10, color: C.textFaint, marginTop: 4 }}>
                  {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>

              {/* Individual frame totals */}
              <div style={{ marginBottom: 20 }}>
                {frames.map((frame, i) => {
                  const c = jobCalcs[i];
                  return (
                    <div key={frame.id} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "baseline",
                      padding: "10px 0", borderBottom: `1px solid ${C.divider}`,
                    }}>
                      <div>
                        <span style={{ fontFamily: T.mono, fontSize: 13, color: C.text, fontWeight: "bold" }}>
                          Frame {i + 1}
                        </span>
                        {frame.label && (
                          <span style={{ fontFamily: T.mono, fontSize: 12, color: C.textLight, marginLeft: 8 }}>
                            {frame.label}
                          </span>
                        )}
                        <div style={{ fontFamily: T.mono, fontSize: 11, color: C.textFaint, marginTop: 2 }}>
                          {c.frameW}" × {c.frameH}" · {frame.moulding}
                          {frame.finish !== "None" ? ` · ${frame.finish}` : ""}
                          {frame.glazing !== "None" ? ` · ${frame.glazing}` : ""}
                        </div>
                      </div>
                      <span style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 700, color: C.text }}>{fmt(c.subtotal)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Grand total */}
              <div style={{
                borderTop: `3px solid ${C.text}`, paddingTop: 16,
                display: "flex", justifyContent: "space-between", alignItems: "baseline",
              }}>
                <span style={{ fontFamily: T.sans, fontSize: 16, color: C.text, fontWeight: 600 }}>
                  JOB TOTAL ({frames.length} frame{frames.length !== 1 ? "s" : ""})
                </span>
                <span style={{ fontFamily: T.sans, fontSize: 32, fontWeight: 700, color: C.text }}>{fmt(jobTotal)}</span>
              </div>

              <div style={{ marginTop: 24, fontSize: 10, color: C.textFaint, textAlign: "center", lineHeight: 1.6, fontFamily: T.sans }}>
                Small Works · San Francisco<br />
                Perimeter includes 10% waste for corner joins. Prices subject to change.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
