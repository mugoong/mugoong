'use client';

interface TipPoint { title: string; content: string; }

interface Props {
  extra: Record<string, any>;
  setExtra: (key: string, value: any) => void;
}

const cls = 'w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100';

export default function TipsFormFields({ extra, setExtra }: Props) {
  const tips: TipPoint[] = extra.tips ?? [];

  const updTip = (i: number, f: keyof TipPoint, v: string) => {
    const u = [...tips]; u[i] = { ...u[i], [f]: v }; setExtra('tips', u);
  };

  return (
    <>
      {/* ── Tip Points ── */}
      <section className="rounded-xl border border-purple-100 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-purple-700">💡 Tip Points</h2>
          <button type="button" onClick={() => setExtra('tips', [...tips, { title: '', content: '' }])} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">+ Add Tip</button>
        </div>
        {tips.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 py-4 text-center text-sm text-gray-400">No tip points yet. Add structured tips for readers.</p>
        ) : (
          <div className="space-y-4">
            {tips.map((tip, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">Tip #{i + 1}</span>
                  <button type="button" onClick={() => setExtra('tips', tips.filter((_, idx) => idx !== i))} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Tip Title</label>
                    <input type="text" value={tip.title} onChange={(e) => updTip(i, 'title', e.target.value)} className={cls} placeholder="e.g. Best time to visit" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Tip Content</label>
                    <textarea value={tip.content} onChange={(e) => updTip(i, 'content', e.target.value)} rows={3} className={cls} placeholder="Detailed tip content…" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Map Info ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">🗺️ Map Info</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Map Description</label>
            <textarea value={extra.map_description ?? ''} onChange={(e) => setExtra('map_description', e.target.value)} rows={2} className={cls} placeholder="e.g. Located in Hongdae — 5 min walk from Exit 9" />
          </div>
          {[
            { key: 'naver_map_url', label: 'Naver Map URL', ph: 'https://naver.me/...' },
            { key: 'kakao_map_url', label: 'Kakao Map URL', ph: 'https://kko.to/...' },
            { key: 'google_map_url', label: 'Google Map URL', ph: 'https://maps.app.goo.gl/...' },
          ].map(({ key, label, ph }) => (
            <div key={key}>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
              <input type="url" value={extra[key] ?? ''} onChange={(e) => setExtra(key, e.target.value)} className={cls} placeholder={ph} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Social & Media Links ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">🔗 Social & Media Links</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">YouTube Link</label>
            <input type="url" value={extra.youtube_url ?? ''} onChange={(e) => setExtra('youtube_url', e.target.value)} className={cls} placeholder="https://youtube.com/watch?v=... or https://youtu.be/..." />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Instagram Link</label>
            <input type="url" value={extra.instagram_url ?? ''} onChange={(e) => setExtra('instagram_url', e.target.value)} className={cls} placeholder="https://instagram.com/p/..." />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Source / Reference URL</label>
            <input type="url" value={extra.source_url ?? ''} onChange={(e) => setExtra('source_url', e.target.value)} className={cls} placeholder="https://..." />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Last Verified Date</label>
            <input type="text" value={extra.last_verified ?? ''} onChange={(e) => setExtra('last_verified', e.target.value)} className={cls} placeholder="e.g. 2026-05-01" />
          </div>
        </div>
      </section>
    </>
  );
}
