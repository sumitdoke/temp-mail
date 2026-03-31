'use client';
import { useState } from 'react';

export default function Test() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState('');

  const test = async () => {
    setLoading(true);
    const res = await fetch('/api/agent/seo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        keyword: 'temp mail for instagram india' 
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
    if (data.success) {
      setPublished(data.slug);
    }
    setPublishing(false);
  };

  return (
    <div className="p-8 bg-gray-950 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">
        🤖 SEO Agent Test
      </h1>
      
      <div className="flex gap-3 mb-4">
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
            {publishing ? 'Publishing...' : '🚀 Publish to Site'}
          </button>
        )}
      </div>

      {published && (
        <div className="bg-green-900 p-4 rounded-xl mb-4">
          <p className="text-green-400 font-bold">
            ✅ Published successfully!
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
        <div className="bg-gray-900 p-4 rounded-xl">
          <p className="text-yellow-400 font-bold mb-2">
            Generated Article:
          </p>
          <p className="text-white">Title: {result.title}</p>
          <p className="text-gray-400">Slug: {result.slug}</p>
          <p className="text-gray-400">Meta: {result.meta}</p>
        </div>
      )}
    </div>
  );
}