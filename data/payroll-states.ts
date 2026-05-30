// Per-state payroll metadata for the paycheck-calculator/[state] programmatic route.
//
// Rates are 2025 top-marginal income-tax rates from each state's Department of
// Revenue. Used as the calculator's default state rate; users can override the
// flat-rate field. Per-state bracket math is planned for v1.
//
// TODO_VERIFY: refresh each rate against the state's 2026 DOR publication when
// available. Sources are linked per state in `sourceUrl`.

export type StateMeta = {
  /** Two-letter postal code, lowercase (matches /data/calculators.json programmatic.states). */
  slug: string;
  /** Display name. */
  name: string;
  /** Top marginal personal income-tax rate, as a percent (e.g. 5.0). 0 if the state has no wage income tax. */
  topRatePct: number;
  /** Short note shown in the state-page hero. */
  note: string;
  /** Authoritative source for the rate. */
  sourceUrl: string;
  /** True if the state has no wage income tax. */
  noIncomeTax: boolean;
};

// Last verified against state DOR / tax-foundation summaries on 2026-05-31.
// TODO_VERIFY: re-pull each from the linked source before public launch.
export const PAYROLL_STATES: Record<string, StateMeta> = {
  al: { slug: "al", name: "Alabama", topRatePct: 5.0, note: "Brackets: 2% / 4% / 5%. Federal income tax is deductible on AL.", sourceUrl: "https://www.revenue.alabama.gov/individual-corporate/", noIncomeTax: false },
  ak: { slug: "ak", name: "Alaska", topRatePct: 0, note: "No state income tax on wages.", sourceUrl: "https://tax.alaska.gov/", noIncomeTax: true },
  az: { slug: "az", name: "Arizona", topRatePct: 2.5, note: "Flat 2.5% on taxable income.", sourceUrl: "https://azdor.gov/individual-income-tax-information", noIncomeTax: false },
  ar: { slug: "ar", name: "Arkansas", topRatePct: 4.4, note: "Top marginal 4.4%; lower brackets apply below $25,000.", sourceUrl: "https://www.dfa.arkansas.gov/income-tax/", noIncomeTax: false },
  ca: { slug: "ca", name: "California", topRatePct: 13.3, note: "Top marginal 13.3% above $1M. State Disability Insurance (SDI) extra.", sourceUrl: "https://www.ftb.ca.gov/file/personal/tax-calculator-tables-rates.asp", noIncomeTax: false },
  co: { slug: "co", name: "Colorado", topRatePct: 4.4, note: "Flat 4.4% on Colorado taxable income.", sourceUrl: "https://tax.colorado.gov/individual-income-tax", noIncomeTax: false },
  ct: { slug: "ct", name: "Connecticut", topRatePct: 6.99, note: "Top marginal 6.99% above $500k single.", sourceUrl: "https://portal.ct.gov/DRS/Individuals", noIncomeTax: false },
  de: { slug: "de", name: "Delaware", topRatePct: 6.6, note: "Top marginal 6.6% above $60k.", sourceUrl: "https://revenue.delaware.gov/", noIncomeTax: false },
  fl: { slug: "fl", name: "Florida", topRatePct: 0, note: "No state income tax on wages.", sourceUrl: "https://floridarevenue.com/taxes/Pages/individuals.aspx", noIncomeTax: true },
  ga: { slug: "ga", name: "Georgia", topRatePct: 5.39, note: "Flat 5.39% (2024 reform; on track to 4.99%).", sourceUrl: "https://dor.georgia.gov/individual-taxes", noIncomeTax: false },
  hi: { slug: "hi", name: "Hawaii", topRatePct: 11.0, note: "Top marginal 11% above $200k single.", sourceUrl: "https://tax.hawaii.gov/", noIncomeTax: false },
  id: { slug: "id", name: "Idaho", topRatePct: 5.8, note: "Flat 5.8% on Idaho taxable income.", sourceUrl: "https://tax.idaho.gov/", noIncomeTax: false },
  il: { slug: "il", name: "Illinois", topRatePct: 4.95, note: "Flat 4.95% on Illinois income.", sourceUrl: "https://tax.illinois.gov/individuals/incometax.html", noIncomeTax: false },
  in: { slug: "in", name: "Indiana", topRatePct: 3.05, note: "Flat 3.05% state; counties also levy a local tax.", sourceUrl: "https://www.in.gov/dor/individual-income-taxes/", noIncomeTax: false },
  ia: { slug: "ia", name: "Iowa", topRatePct: 3.8, note: "Iowa moved to a flat 3.8% in 2025.", sourceUrl: "https://tax.iowa.gov/individual-income-tax", noIncomeTax: false },
  ks: { slug: "ks", name: "Kansas", topRatePct: 5.7, note: "Top marginal 5.7% above $30k single.", sourceUrl: "https://www.ksrevenue.gov/perstaxtypesii.html", noIncomeTax: false },
  ky: { slug: "ky", name: "Kentucky", topRatePct: 4.0, note: "Flat 4.0%; on a glide path toward elimination.", sourceUrl: "https://revenue.ky.gov/Individual/", noIncomeTax: false },
  la: { slug: "la", name: "Louisiana", topRatePct: 3.0, note: "Flat 3.0% (2024 reform).", sourceUrl: "https://revenue.louisiana.gov/IndividualIncomeTax", noIncomeTax: false },
  me: { slug: "me", name: "Maine", topRatePct: 7.15, note: "Top marginal 7.15% above $61,600 single.", sourceUrl: "https://www.maine.gov/revenue/taxes/income-estate-tax", noIncomeTax: false },
  md: { slug: "md", name: "Maryland", topRatePct: 5.75, note: "Top marginal 5.75% above $250k single. County taxes are additional.", sourceUrl: "https://www.marylandtaxes.gov/individual/", noIncomeTax: false },
  ma: { slug: "ma", name: "Massachusetts", topRatePct: 9.0, note: "5% on most wages; +4% surtax above $1M (Fair Share Amendment).", sourceUrl: "https://www.mass.gov/topics/personal-income-tax", noIncomeTax: false },
  mi: { slug: "mi", name: "Michigan", topRatePct: 4.25, note: "Flat 4.25% (rate may shift annually under MI's revenue trigger).", sourceUrl: "https://www.michigan.gov/taxes/iit", noIncomeTax: false },
  mn: { slug: "mn", name: "Minnesota", topRatePct: 9.85, note: "Top marginal 9.85% above ~$200k single.", sourceUrl: "https://www.revenue.state.mn.us/individuals", noIncomeTax: false },
  ms: { slug: "ms", name: "Mississippi", topRatePct: 4.0, note: "Flat 4.0% above $10k taxable.", sourceUrl: "https://www.dor.ms.gov/individual", noIncomeTax: false },
  mo: { slug: "mo", name: "Missouri", topRatePct: 4.7, note: "Top marginal 4.7% above ~$9k.", sourceUrl: "https://dor.mo.gov/personal/individual/", noIncomeTax: false },
  mt: { slug: "mt", name: "Montana", topRatePct: 5.9, note: "Two-bracket 4.7% / 5.9%.", sourceUrl: "https://mtrevenue.gov/individuals/", noIncomeTax: false },
  ne: { slug: "ne", name: "Nebraska", topRatePct: 5.84, note: "Top marginal 5.84% (phasing down to 3.99% by 2027).", sourceUrl: "https://revenue.nebraska.gov/individuals", noIncomeTax: false },
  nv: { slug: "nv", name: "Nevada", topRatePct: 0, note: "No state income tax on wages.", sourceUrl: "https://tax.nv.gov/", noIncomeTax: true },
  nh: { slug: "nh", name: "New Hampshire", topRatePct: 0, note: "No tax on wages. Interest and dividend tax was repealed for 2025+.", sourceUrl: "https://www.revenue.nh.gov/individuals/", noIncomeTax: true },
  nj: { slug: "nj", name: "New Jersey", topRatePct: 10.75, note: "Top marginal 10.75% above $1M. Family Leave + UI extras.", sourceUrl: "https://www.nj.gov/treasury/taxation/individuals.shtml", noIncomeTax: false },
  nm: { slug: "nm", name: "New Mexico", topRatePct: 5.9, note: "Top marginal 5.9% above $315k.", sourceUrl: "https://www.tax.newmexico.gov/individuals/", noIncomeTax: false },
  ny: { slug: "ny", name: "New York", topRatePct: 10.9, note: "Top marginal 10.9% above $25M. NYC adds local tax up to ~3.876%.", sourceUrl: "https://www.tax.ny.gov/pit/", noIncomeTax: false },
  nc: { slug: "nc", name: "North Carolina", topRatePct: 4.5, note: "Flat 4.5% (phasing to 3.99% by 2027).", sourceUrl: "https://www.ncdor.gov/taxes-forms/individual-income-tax", noIncomeTax: false },
  nd: { slug: "nd", name: "North Dakota", topRatePct: 2.5, note: "Top marginal 2.5% above $250k single.", sourceUrl: "https://www.tax.nd.gov/individual", noIncomeTax: false },
  oh: { slug: "oh", name: "Ohio", topRatePct: 3.5, note: "Top marginal 3.5% above $100k. Municipal taxes extra.", sourceUrl: "https://tax.ohio.gov/individual", noIncomeTax: false },
  ok: { slug: "ok", name: "Oklahoma", topRatePct: 4.75, note: "Top marginal 4.75% above ~$7,200 single.", sourceUrl: "https://oklahoma.gov/tax/individuals.html", noIncomeTax: false },
  or: { slug: "or", name: "Oregon", topRatePct: 9.9, note: "Top marginal 9.9% above $125k. No sales tax.", sourceUrl: "https://www.oregon.gov/dor/programs/individuals/Pages/default.aspx", noIncomeTax: false },
  pa: { slug: "pa", name: "Pennsylvania", topRatePct: 3.07, note: "Flat 3.07% state. Local Earned Income Tax (EIT) typically 1–2%.", sourceUrl: "https://www.pa.gov/agencies/revenue.html", noIncomeTax: false },
  ri: { slug: "ri", name: "Rhode Island", topRatePct: 5.99, note: "Top marginal 5.99% above ~$176k.", sourceUrl: "https://tax.ri.gov/individuals", noIncomeTax: false },
  sc: { slug: "sc", name: "South Carolina", topRatePct: 6.2, note: "Top marginal 6.2% above ~$17k single.", sourceUrl: "https://dor.sc.gov/tax/individual-income", noIncomeTax: false },
  sd: { slug: "sd", name: "South Dakota", topRatePct: 0, note: "No state income tax on wages.", sourceUrl: "https://dor.sd.gov/", noIncomeTax: true },
  tn: { slug: "tn", name: "Tennessee", topRatePct: 0, note: "No tax on wages. Hall tax on interest/dividends was repealed.", sourceUrl: "https://www.tn.gov/revenue/taxes.html", noIncomeTax: true },
  tx: { slug: "tx", name: "Texas", topRatePct: 0, note: "No state income tax on wages.", sourceUrl: "https://comptroller.texas.gov/taxes/", noIncomeTax: true },
  ut: { slug: "ut", name: "Utah", topRatePct: 4.55, note: "Flat 4.55% on Utah taxable income.", sourceUrl: "https://incometax.utah.gov/", noIncomeTax: false },
  vt: { slug: "vt", name: "Vermont", topRatePct: 8.75, note: "Top marginal 8.75% above $213k single.", sourceUrl: "https://tax.vermont.gov/individuals", noIncomeTax: false },
  va: { slug: "va", name: "Virginia", topRatePct: 5.75, note: "Top marginal 5.75% above $17k.", sourceUrl: "https://www.tax.virginia.gov/individual-income-tax-filing", noIncomeTax: false },
  wa: { slug: "wa", name: "Washington", topRatePct: 0, note: "No state income tax on wages. Long-term cap-gains tax above $250k is separate.", sourceUrl: "https://dor.wa.gov/", noIncomeTax: true },
  wv: { slug: "wv", name: "West Virginia", topRatePct: 5.12, note: "Top marginal 5.12% (rate trending lower under revenue triggers).", sourceUrl: "https://tax.wv.gov/Individuals/", noIncomeTax: false },
  wi: { slug: "wi", name: "Wisconsin", topRatePct: 7.65, note: "Top marginal 7.65% above ~$315k single.", sourceUrl: "https://www.revenue.wi.gov/Pages/Individuals/home.aspx", noIncomeTax: false },
  wy: { slug: "wy", name: "Wyoming", topRatePct: 0, note: "No state income tax on wages.", sourceUrl: "https://revenue.wyo.gov/", noIncomeTax: true },
};

export const PAYROLL_STATE_SLUGS = Object.keys(PAYROLL_STATES);
