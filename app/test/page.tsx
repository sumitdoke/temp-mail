'use client';
import { useState } from 'react';

export default function Test() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState('');
  const [autoResult, setAutoResult] = useState('');
  const [autoLoading, setAutoLoading] = useState(false);

  const test = async () => {
    setLoading(true);
    const res = await fetch('/api/agent/seo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        keyword: 'temp mail for phonepe india' 
      })
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const publish = async () => {
    if (!result) return;
    setPublishing(true);
    const res = await fetch('/api/agent/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    });
    const data = await res.json();
    if (data.success) setPublished(data.slug);
    setPublishing(false);
  };

  // ← NEW: Test auto agent directly
  const testAuto = async () => {
    setAutoLoading(true);
    const res = await fetch('/api/agent/auto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: 'tempmail2026' })
    });
    const data = await res.json();
    setAutoResult(JSON.stringify(data, null, 2));
    setAutoLoading(false);
  };

  return (
    <div className="p-8 bg-gray-950 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">
        🤖 SEO Agent Control Panel
      </h1>

      {/* Auto Agent Test */}
      <div className="bg-gray-900 rounded-xl p-6 mb-6
        border border-gray-800">
        <h2 className="font-bold text-lg mb-3">
          🔄 Auto Agent (Full Pipeline)
        </h2>
        <button
          onClick={testAuto}
          className="bg-purple-600 hover:bg-purple-700
            px-6 py-3 rounded-xl mb-4 w-full font-bold"
        >
          {autoLoading ? 
            '🤖 Agent working...' : 
            '🚀 Run Auto Agent Now'
          }
        </button>
        {autoResult && (
          <pre className="text-green-400 text-xs 
            whitespace-pre-wrap bg-black p-4 rounded-xl">
            {autoResult}
          </pre>
        )}
      </div>

      {/* Manual Test */}
      <div className="bg-gray-900 rounded-xl p-6
        border border-gray-800">
        <h2 className="font-bold text-lg mb-3">
          ✍️ Manual Generate + Publish
        </h2>
        <div className="flex gap-3 mb-4 flex-wrap">
          <button
            onClick={test}
            className="bg-blue-600 px-6 py-3 rounded-xl"
          >
            {loading ? 'Generating...' : 'Generate Article'}
          </button>
          {result && (
            <button
              onClick={publish}
              className="bg-green-600 px-6 py-3 rounded-xl"
            >
              {publishing ? 'Publishing...' : '🚀 Publish'}
            </button>
          )}
        </div>

        {published && (
          <div className="bg-green-900 p-4 rounded-xl mb-4">
            <p className="text-green-400 font-bold">
              ✅ Published!
            </p>
            <a
              href={`/${published}`}
              className="text-blue-400 underline"
              target="_blank"
            >
              View live page →
            </a>
          </div>
        )}

        {result && (
          <div className="bg-gray-800 p-4 rounded-xl">
            <p className="text-white">
              Title: {result.title}
            </p>
            <p className="text-gray-400">
              Slug: {result.slug}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}