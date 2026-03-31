'use client';
import { useState } from 'react';

export default function Test() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

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
    setResult(JSON.stringify(data, null, 2));
    setLoading(false);
  };

  return (
    <div className="p-8 bg-gray-950 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">
        🤖 SEO Agent Test
      </h1>
      <button
        onClick={test}
        className="bg-blue-600 px-6 py-3 rounded-xl mb-4"
      >
        {loading ? 'Generating...' : 'Test Agent'}
      </button>
      <pre className="text-green-400 text-xs whitespace-pre-wrap">
        {result}
      </pre>
    </div>
  );
}