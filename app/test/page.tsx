'use client';
import { useState } from 'react';

export default function Test() {
    const [authed, setAuthed] = useState(false);
    const [pass, setPass] = useState('');
    const [autoResult, setAutoResult] = useState('');
    const [autoLoading, setAutoLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [published, setPublished] = useState('');

    // Password check via API — not hardcoded!
    const login = async () => {
        const res = await fetch('/api/admin/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: pass })
        });
        const data = await res.json();
        if (data.success) {
            setAuthed(true);
        } else {
            alert('Wrong password!');
        }
    };

    if (!authed) {
        return (
            <div className="min-h-screen bg-gray-950 flex
        items-center justify-center">
                <div className="bg-gray-900 p-8 rounded-2xl
          border border-gray-800 w-80">
                    <h1 className="text-white font-bold text-xl mb-4">
                        🔐 Admin Access
                    </h1>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={pass}
                        onChange={e => setPass(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && login()}
                        className="w-full bg-gray-800 text-white
              px-4 py-3 rounded-xl mb-4 outline-none"
                    />
                    <button
                        onClick={login}
                        className="w-full bg-blue-600 text-white
              py-3 rounded-xl font-bold"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    const testAuto = async () => {
        setAutoLoading(true);
        const res = await fetch('/api/agent/auto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secret: process.env.NEXT_PUBLIC_AGENT_SECRET
            })
        });
        const data = await res.json();
        setAutoResult(JSON.stringify(data, null, 2));
        setAutoLoading(false);
    };

    const test = async () => {
        setLoading(true);
        const res = await fetch('/api/agent/seo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                keyword: 'temp mail for phonepe india',
                secret: process.env.NEXT_PUBLIC_AGENT_SECRET
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
            body: JSON.stringify({
                ...result,
                secret: process.env.NEXT_PUBLIC_AGENT_SECRET
            })
        });
        const data = await res.json();
        if (data.success) setPublished(data.slug);
        setPublishing(false);
    };

    return (
        <div className="p-8 bg-gray-950 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-6">
                🤖 SEO Agent Control Panel
            </h1>

            <div className="bg-gray-900 rounded-xl p-6 mb-6
        border border-gray-800">
                <h2 className="font-bold text-lg mb-3">
                    🔄 Auto Agent
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

            <div className="bg-gray-900 rounded-xl p-6
        border border-gray-800">
                <h2 className="font-bold text-lg mb-3">
                    ✍️ Manual Generate
                </h2>
                <div className="flex gap-3 mb-4">
                    <button
                        onClick={test}
                        className="bg-blue-600 px-6 py-3 rounded-xl"
                    >
                        {loading ? 'Generating...' : 'Generate'}
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
                        <p className="text-green-400 font-bold">✅ Published!</p>
                        <a href={`/${published}`}
                            className="text-blue-400 underline"
                            target="_blank">
                            View page →
                        </a>
                    </div>
                )}
                {result && (
                    <div className="bg-gray-800 p-4 rounded-xl">
                        <p className="text-white">Title: {result.title}</p>
                        <p className="text-gray-400">Slug: {result.slug}</p>
                    </div>
                )}
            </div>
        </div>
    );
}