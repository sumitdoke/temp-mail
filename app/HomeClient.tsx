'use client';
import { useState, useEffect, useCallback } from 'react';
import AdBanner from './components/AdBanner';

export default function HomeClient() {
  const [email, setEmail] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const generateEmail = useCallback(async () => {
    setLoading(true);
    setMessages([]);

    try {
      const res = await fetch('/api/generate', {
        cache: 'no-store' // Force fresh request!
      });
      const data = await res.json();
      console.log('Generated email:', data); // Debug log
      setEmail(data.email);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInbox = useCallback(async (currentEmail: string) => {
    if (!currentEmail) return;
    try {
      const id = currentEmail.split('@')[0];
      const res = await fetch(`/api/inbox/${id}`, {
        cache: 'no-store'
      });
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (err) {
      console.error('Inbox error:', err);
    }
  }, []);

  // Generate on load
  useEffect(() => {
    generateEmail();
  }, [generateEmail]);

  // Poll inbox when email changes
  useEffect(() => {
    if (!email) return;
    fetchInbox(email);
    const interval = setInterval(
      () => fetchInbox(email), 5000
    );
    return () => clearInterval(interval);
  }, [email, fetchInbox]);

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-blue-400">
              ⚡ TempMailin.in
            </h1>
            <p className="text-gray-400 text-xs">
              Free disposable email — India
            </p>
          </div>
          <span className="text-xs bg-green-900 text-green-400
            px-2 py-1 rounded-full">
            ● Live
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Email Box */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6
          border border-gray-800">
          <p className="text-gray-400 text-sm mb-2">
            Your temporary email address:
          </p>

          {loading ? (
            <div className="text-gray-500 animate-pulse text-lg">
              Generating email...
            </div>
          ) : (
            <span className="text-lg font-mono font-bold
              text-white break-all">
              {email}
            </span>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={copyEmail}
              disabled={!email || loading}
              className="bg-blue-600 hover:bg-blue-700
                disabled:opacity-50 text-white px-4 py-2
                rounded-lg text-sm font-medium transition-all"
            >
              {copied ? '✅ Copied!' : '📋 Copy Email'}
            </button>
            <button
              onClick={generateEmail}
              disabled={loading}
              className="bg-gray-700 hover:bg-gray-600
                disabled:opacity-50 text-white px-4 py-2
                rounded-lg text-sm font-medium transition-all"
            >
              {loading ? '⏳ Generating...' : '🔄 New Email'}
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            ⏱ Valid for
            <span className="text-yellow-400 ml-1">
              24 hours
            </span>
          </div>
        </div>

        {/* Ad  */}
        <div
          id="container-363db0065e45178cfa21464d3889b752"></div>
        <script
          async data-cfasync="false"
          src="https://pl29096623.profitablecpmratenetwork.com/363db0065e45178cfa21464d3889b752/invoke.js" />



        {/* <AdBanner
          adKey="363db0065e45178cfa21464d3889b752"
          height={250}
          width={300}
        /> */}

        {/* Inbox */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800
            flex items-center justify-between">
            <h2 className="font-semibold text-gray-200">
              📬 Inbox
            </h2>
            <span className="text-xs text-gray-500">
              Auto-refreshes every 5s
            </span>
          </div>

          {messages.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-600">
              <div className="text-4xl mb-3">📭</div>
              <p>No emails yet</p>
              <p className="text-xs mt-1">
                Use the email above to sign up anywhere
              </p>
            </div>
          ) : (
            <div>
              {messages.map((msg: any) => (
                <div key={msg.id}
                  className="px-6 py-4 border-b border-gray-800
                    hover:bg-gray-800 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-white text-sm">
                        {msg.subject || 'No Subject'}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        From: {msg.sender}
                      </p>
                    </div>
                    <span className="text-gray-600 text-xs">
                      {new Date(msg.created_at)
                        .toLocaleTimeString('en-IN')}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-2
                    line-clamp-2">
                    {msg.body_plain}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 320*50 */}
        <AdBanner
          adKey="8417fd24a6f755b707c66c5e90f75362"
          height={50}
          width={320}
        />

        {/* Footer */}
        <p className="text-center text-gray-700 text-xs mt-8">
          Emails auto-delete after 24 hours • No signup required
          <br />
          Made for India 🇮🇳
          <br />
          <span className="mt-2 flex justify-center gap-4">
            <a href="/privacy"
              className="text-gray-600 hover:text-gray-400">
              Privacy Policy
            </a>
            <a href="/terms"
              className="text-gray-600 hover:text-gray-400">
              Terms of Service
            </a>
          </span>
        </p>

      </div>
    </main>
  );
}