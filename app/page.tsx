const workflowSteps = [
  'User Upload',
  'File Validation',
  'Provider Detection',
  'Language Detection',
  'OCR',
  'Document Classification',
  'Provider-Specific Extraction',
  'Normalized Bill Schema',
  'Confidence Scoring',
  'User Verification',
  'Verified Bill',
  'Deterministic Analysis',
  'AI Explanation'
];

const providerDirectory = [
  { name: 'BSES Rajdhani', state: 'Delhi', status: '✓ Supported', lastTested: 'PDF / JPG / PNG', billTypes: 'Domestic & commercial bill layouts' },
  { name: 'Tata Power Mumbai', state: 'Maharashtra', status: '✓ Supported', lastTested: 'PDF / JPEG', billTypes: 'Consumer bill, meter summary' },
  { name: 'MSEB', state: 'Maharashtra', status: '◐ Partially Supported', lastTested: 'Upload & detect', billTypes: 'Regional language scans' },
  { name: 'TP Southern', state: 'Tamil Nadu', status: '🔍 Upload & Detect', lastTested: 'Awaiting test', billTypes: 'Provider-specific bill pages' },
  { name: 'JVVNL', state: 'Rajasthan', status: '⏳ Coming Soon', lastTested: 'Not yet tested', billTypes: 'Regional print layouts' }
];

const educationTopics = [
  'What is a meter?',
  'What is a unit of electricity?',
  'What is fixed charge?',
  'What is kWh?',
  'What is tariff slab?',
  'What is smart metering?',
  'What is net metering?',
  'What is estimated reading?'
];

export default function HomePage() {
  return (
    <main className="min-h-screen text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container-shell flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-black text-white">⚡</div>
            <div>
              <div className="text-xl font-black tracking-tight">RushXArena</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Electricity bill intelligence</div>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#workflow">Workflow</a>
            <a href="#coverage">Coverage</a>
            <a href="#education">Education</a>
            <a href="#trust">Trust</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="/signin" className="btn-secondary">Sign In</a>
            <a href="/signup" className="btn-primary">Upload Real Bill ⚡</a>
          </div>
        </div>
      </header>

      <section className="container-shell grid gap-10 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Real electricity bill analysis</div>
          <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            Your Electricity Bill. Your Data. Your Understanding.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600">
            RushXArena reads your real electricity bill, explains the charges, compares verified consumption and helps you understand what your electricity provider has actually billed you.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="/signup" className="btn-primary">Upload Real Bill ⚡</a>
            <a href="#education" className="btn-secondary">Learn Electricity</a>
          </div>
          <div className="mt-10 flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="info-chip">PDF</span>
            <span className="info-chip">JPG</span>
            <span className="info-chip">JPEG</span>
            <span className="info-chip">PNG</span>
            <span className="info-chip">WebP</span>
          </div>
        </div>

        <div className="card-surface overflow-hidden p-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white">
            <div className="mb-6 flex items-center justify-between text-sm text-slate-300">
              <span>Bill upload status</span>
              <span className="rounded-full bg-amber-400/15 px-2 py-1 text-xs font-semibold text-amber-300">No bill uploaded</span>
            </div>
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/15 text-2xl">📄</div>
              <h2 className="mt-4 text-xl font-black">Upload your real electricity bill to see your actual data.</h2>
              <p className="mt-3 text-sm text-slate-300">No fictional readings, no invented charges, no fake meter values.</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-200">
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Provider</div>
                <div className="mt-2 font-semibold">Not detected yet</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Reading status</div>
                <div className="mt-2 font-semibold">? Not available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white/60 py-20" id="workflow">
        <div className="container-shell">
          <div className="max-w-2xl">
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Real data pipeline</div>
            <h2 className="section-title mt-3">Evidence before explanation.</h2>
            <p className="section-copy">RushXArena never jumps from OCR to a confident conclusion. Every stage uses actual document evidence, confidence checks, and user verification before analysis.</p>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {workflowSteps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700">
                <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-brand-700">Step {index + 1}</div>
                <div>{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-20" id="coverage">
        <div className="max-w-2xl">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">PAN-India provider directory</div>
          <h2 className="section-title mt-3">Support is based on tested formats, not assumptions.</h2>
        </div>
        <div className="mt-10 space-y-4">
          {providerDirectory.map((provider) => (
            <div key={provider.name} className="card-surface grid gap-3 p-5 md:grid-cols-[1.3fr_0.7fr_0.9fr_1.1fr] md:items-center">
              <div>
                <div className="text-xl font-black text-slate-900">{provider.name}</div>
                <div className="mt-1 text-sm text-slate-500">{provider.state}</div>
              </div>
              <div className="text-sm font-semibold text-slate-700">{provider.status}</div>
              <div className="text-sm text-slate-600">Last tested: {provider.lastTested}</div>
              <div className="text-sm text-slate-600">{provider.billTypes}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white" id="trust">
        <div className="container-shell">
          <div className="max-w-2xl">
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-300">What RushXArena can prove</div>
            <h2 className="section-title mt-3 text-white">Transparent, evidence-based limits.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-white/5 p-6">
              <h3 className="text-xl font-black">RushXArena can determine</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                <li>✓ Information explicitly present on the bill</li>
                <li>✓ Arithmetic calculations based on bill data</li>
                <li>✓ Changes between verified bills</li>
                <li>✓ Reading differences</li>
                <li>✓ Missing information</li>
                <li>✓ OCR confidence</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-white/5 p-6">
              <h3 className="text-xl font-black">RushXArena cannot determine automatically</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                <li>✗ Information not present on the bill</li>
                <li>✗ Hidden meter problems</li>
                <li>✗ Unverified tariff rates</li>
                <li>✗ Intentional billing misconduct without evidence</li>
                <li>✗ Information from another consumer</li>
                <li>✗ Future electricity charges</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-20" id="education">
        <div className="max-w-2xl">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Consumer awareness</div>
          <h2 className="section-title mt-3">Bijli Bill Samajhna Har Consumer Ka Haq Hai.</h2>
          <p className="section-copy">Every electricity consumer should be able to understand their bill. RushXArena does not automatically accuse providers. It helps consumers understand the evidence in their own bills.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {educationTopics.map((topic) => (
            <div key={topic} className="card-surface p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-lg text-brand-700">⚡</div>
              <div className="text-lg font-bold text-slate-900">{topic}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell pb-20">
        <div className="card-surface bg-gradient-to-r from-brand-500 to-brand-700 p-8 text-white md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-100">Ready to understand your bill?</div>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">Upload your real electricity bill and start from evidence.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/signup" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700">Upload Real Bill ⚡</a>
              <a href="/signin" className="rounded-full border border-white/50 bg-transparent px-6 py-3 text-sm font-semibold text-white">Learn Electricity</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
