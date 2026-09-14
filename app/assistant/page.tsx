 'use client';

import { useState } from 'react';

const sampleQuestions = [
  'Why did my bill increase?',
  'What is my meter reading?',
  'How much did I consume?',
  'What does FPPPA mean?',
  'How much extra does my EV cost?'
];

export default function AssistantPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  async function ask() {
    if (!question.trim()) return;
    setIsAsking(true);
    setAnswer('');
    const response = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }) });
    const result = await response.json() as { answer?: string; error?: string };
    setAnswer(result.answer || result.error || 'No answer available.');
    setIsAsking(false);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="container-shell max-w-5xl">
        <div className="card-surface p-8">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Ask RushXArena ⚡</div>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Evidence-based electricity help</h1>
          <p className="mt-3 text-slate-600">The assistant uses verified bill data, deterministic calculations, and only responds with information available to the authenticated user.</p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <textarea value={question} onChange={(event) => setQuestion(event.target.value)} className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 outline-none focus:border-brand-500" rows={5} placeholder="Ask about your electricity bill, meter reading, EV, solar, or tariff details..." />
            <div className="mt-4 flex justify-end">
              <button className="btn-primary" onClick={ask} disabled={isAsking}>{isAsking ? 'Checking evidence...' : 'Ask RushXArena'}</button>
            </div>
            {answer ? <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">{answer}</div> : null}
          </div>

          <div className="mt-8">
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Popular questions</div>
            <div className="mt-4 flex flex-wrap gap-3">
              {sampleQuestions.map((question) => (
                <button key={question} onClick={() => setQuestion(question)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">{question}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
