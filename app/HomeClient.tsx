'use client';
import { useState, useEffect, useCallback } from 'react';

export default function HomeClient() {
  const [email, setEmail] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dark, setDark] = useState<boolean>(true);
  const [selectedMsg, setSelectedMsg] = useState<any>(null);

  const t = {
    bg: dark ? '#0a0a0f' : '#f5f5f0',
    card: dark ? '#13131a' : '#ffffff',
    border: dark ? '#1e1e2e' : '#e5e5e5',
    text: dark ? '#e8e8f0' : '#1a1a2e',
    muted: dark ? '#555570' : '#888899',
    accent: '#6366f1',
    accentLight: dark ? '#818cf8' : '#4f46e5',
    success: '#10b981',
    inbox: dark ? '#0f0f1a' : '#f9f9fc',
  };

  const generateEmail = useCallback(async () => {
    setLoading(true);
    setMessages([]);
    setSelectedMsg(null);
    try {
      const res = await fetch('/api/generate', { cache: 'no-store' });
      const data = await res.json();
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
      const res = await fetch(`/api/inbox/${id}`, { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (err) {
      console.error('Inbox error:', err);
    }
  }, []);

  useEffect(() => { generateEmail(); }, [generateEmail]);

  useEffect(() => {
    if (!email) return;
    fetchInbox(email);
    const interval = setInterval(() => fetchInbox(email), 5000);
    return () => clearInterval(interval);
  }, [email, fetchInbox]);

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const features = [
    { icon: '⚡', title: 'Instant', desc: 'Ready in 1 click' },
    { icon: '🔒', title: 'Private', desc: 'Zero data stored' },
    { icon: '🇮🇳', title: 'India First', desc: 'Built for Indians' },
    { icon: '🗑️', title: 'Auto-Delete', desc: 'Clears in 24hrs' },
  ];

  const useCases = [
    'Swiggy', 'Zomato', 'Instagram', 'Netflix',
    'Amazon', 'Flipkart', 'Hotstar', 'PayTM',
    'GPay', 'Discord', 'ChatGPT', 'Spotify',
  ];

  const faqs = [
    { q: 'What is temp mail?', a: 'A free disposable email address that protects your real inbox from spam. Use it for OTP verification and signups.' },
    { q: 'Is TempMailin.in free?', a: 'Yes! 100% free forever. No signup, no credit card, no hidden charges.' },
    { q: 'How long does temp mail last?', a: 'All emails auto-delete after 24 hours. Your privacy is always protected.' },
    { q: 'Does it work for Indian apps?', a: 'Yes! Works perfectly for Swiggy, Zomato, Instagram, Netflix, Amazon, Flipkart and all Indian apps.' },
    { q: 'Is temp mail safe to use?', a: 'Yes, for non-sensitive signups. Never use it for banking or important accounts.' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: t.bg,
      color: t.text,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      transition: 'all 0.3s ease',
    }}>

      {/* ── TOP NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: dark ? 'rgba(10,10,15,0.92)' : 'rgba(245,245,240,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${t.border}`,
        padding: '0 24px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>⚡</span>
          <span style={{
            fontWeight: 800, fontSize: 16,
            color: t.accentLight,
            // background: `linear-gradient(135deg, ${t.accentLight}, #a78bfa)`,
            // WebkitBackgroundClip: 'text',
            // WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.3px',
          }}>
            TempMailin
          </span>
          <span style={{
            background: t.success + '22',
            color: t.success,
            fontSize: 10, fontWeight: 700,
            padding: '2px 7px', borderRadius: 20,
            letterSpacing: '0.05em',
          }}>LIVE</span>
        </div>

        <button
          onClick={() => setDark(!dark)}
          style={{
            background: t.border,
            border: 'none', cursor: 'pointer',
            padding: '6px 14px', borderRadius: 20,
            color: t.muted, fontSize: 13,
            fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
        >
          {dark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </nav>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 20px 60px' }}>

        {/* ── HERO ── */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{
            fontSize: 'clamp(26px, 6vw, 38px)',
            fontWeight: 900,
            margin: '0 0 10px',
            letterSpacing: '-0.8px',
            lineHeight: 1.15,
            color: t.text,
          }}>
            Free Temporary Email
            <br />
            <span style={{
              color: t.accentLight,
              // background: `linear-gradient(135deg, ${t.accentLight}, #a78bfa)`,
              // WebkitBackgroundClip: 'text',
              // WebkitTextFillColor: 'transparent',
            }}>
              India 🇮🇳
            </span>
          </h1>
          <p style={{
            color: t.muted, fontSize: 14,
            margin: 0, lineHeight: 1.6,
          }}>
            Disposable email address — no signup, no spam, auto-deletes in 24hrs
          </p>
        </div>

        {/* ── MAIN TOOL CARD ── */}
        <div style={{
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: 20,
          padding: 24,
          marginBottom: 16,
          boxShadow: dark
            ? '0 0 40px rgba(99,102,241,0.08)'
            : '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          <p style={{
            color: t.muted, fontSize: 11,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            margin: '0 0 10px', fontWeight: 600,
          }}>
            Your disposable email address
          </p>

          {loading ? (
            <div style={{
              height: 44, background: t.border,
              borderRadius: 10, animation: 'pulse 1.5s infinite',
            }} />
          ) : (
            <div style={{
              background: t.inbox,
              border: `1px solid ${t.border}`,
              borderRadius: 12,
              padding: '12px 16px',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              flexWrap: 'wrap',
            }}>
              <span style={{
                fontFamily: "'DM Mono', 'Courier New', monospace",
                fontSize: 'clamp(13px, 3.5vw, 15px)',
                fontWeight: 600,
                color: t.text,
                wordBreak: 'break-all',
                flex: 1,
              }}>
                {email}
              </span>
              <span style={{
                fontSize: 11, color: t.muted,
                flexShrink: 0,
              }}>
                ⏱ 24h
              </span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={copyEmail}
              disabled={!email || loading}
              style={{
                flex: 1,
                background: copied
                  ? t.success
                  : `linear-gradient(135deg, ${t.accent}, #8b5cf6)`,
                border: 'none',
                color: '#fff',
                padding: '12px 0',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                opacity: (!email || loading) ? 0.5 : 1,
              }}
            >
              {copied ? '✅ Copied!' : '📋 Copy Email'}
            </button>
            <button
              onClick={generateEmail}
              disabled={loading}
              style={{
                background: t.border,
                border: `1px solid ${dark ? '#2a2a3e' : '#d0d0d0'}`,
                color: t.muted,
                padding: '12px 16px',
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                opacity: loading ? 0.5 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              {loading ? '⏳' : '🔄 New'}
            </button>
          </div>
        </div>

        {/* ── INBOX ── */}
        <div style={{
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: 20,
          overflow: 'hidden',
          marginBottom: 32,
        }}>
          <div style={{
            padding: '14px 20px',
            borderBottom: `1px solid ${t.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>
              📬 Inbox
              {messages.length > 0 && (
                <span style={{
                  background: t.accent,
                  color: '#fff',
                  fontSize: 11, fontWeight: 700,
                  padding: '1px 7px',
                  borderRadius: 20,
                  marginLeft: 8,
                }}>
                  {messages.length}
                </span>
              )}
            </span>
            <span style={{ fontSize: 11, color: t.muted }}>
              Refreshes every 5s
            </span>
          </div>

          {selectedMsg ? (
            <div style={{ padding: 20 }}>
              <button
                onClick={() => setSelectedMsg(null)}
                style={{
                  background: 'none', border: 'none',
                  color: t.accentLight, cursor: 'pointer',
                  fontSize: 13, fontFamily: 'inherit',
                  marginBottom: 12, padding: 0,
                }}
              >
                ← Back to inbox
              </button>
              <h3 style={{
                fontWeight: 700, fontSize: 15,
                margin: '0 0 6px', color: t.text,
              }}>
                {selectedMsg.subject || 'No Subject'}
              </h3>
              <p style={{
                fontSize: 12, color: t.muted, margin: '0 0 12px',
              }}>
                From: {selectedMsg.sender}
              </p>
              <div style={{
                background: t.inbox,
                border: `1px solid ${t.border}`,
                borderRadius: 12, padding: 16,
                fontSize: 13, color: t.text,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {selectedMsg.body_plain || 'No content'}
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: t.muted,
            }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
              <p style={{ fontSize: 14, margin: '0 0 4px', fontWeight: 500 }}>
                No emails yet
              </p>
              <p style={{ fontSize: 12, margin: 0 }}>
                Use the email above to sign up anywhere
              </p>
            </div>
          ) : (
            <div>
              {messages.map((msg: any, i: number) => (
                <div
                  key={msg.id || i}
                  onClick={() => setSelectedMsg(msg)}
                  style={{
                    padding: '14px 20px',
                    borderBottom: i < messages.length - 1
                      ? `1px solid ${t.border}` : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    background: 'transparent',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = t.border;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 8,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontWeight: 600, fontSize: 13,
                        margin: '0 0 3px', color: t.text,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {msg.subject || 'No Subject'}
                      </p>
                      <p style={{
                        fontSize: 11, color: t.muted, margin: '0 0 4px',
                      }}>
                        {msg.sender}
                      </p>
                      <p style={{
                        fontSize: 12, color: t.muted, margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {msg.body_plain?.substring(0, 80)}
                      </p>
                    </div>
                    <span style={{
                      fontSize: 10, color: t.muted,
                      flexShrink: 0, marginTop: 2,
                    }}>
                      {new Date(msg.created_at).toLocaleTimeString('en-IN', {
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── FEATURES ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 10,
          marginBottom: 32,
        }}>
          {features.map(f => (
            <div key={f.title} style={{
              background: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: 14,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <span style={{ fontSize: 22 }}>{f.icon}</span>
              <div>
                <p style={{
                  fontWeight: 700, fontSize: 13,
                  margin: '0 0 2px', color: t.text,
                }}>
                  {f.title}
                </p>
                <p style={{
                  fontSize: 11, color: t.muted, margin: 0,
                }}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── HOW IT WORKS ── */}
        <div style={{
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
        }}>
          <h2 style={{
            fontSize: 16, fontWeight: 800,
            margin: '0 0 16px', color: t.text,
            letterSpacing: '-0.3px',
          }}>
            How to Use Temp Mail
          </h2>
          {[
            ['1', 'Copy Email', 'Click the copy button above'],
            ['2', 'Sign Up Anywhere', 'Paste in any website form'],
            ['3', 'Get OTP', 'Receive it in inbox above'],
            ['4', 'Done!', 'Email auto-deletes in 24hrs'],
          ].map(([num, title, desc]) => (
            <div key={num} style={{
              display: 'flex', alignItems: 'center',
              gap: 14, marginBottom: 12,
            }}>
              <div style={{
                width: 28, height: 28,
                background: `linear-gradient(135deg, ${t.accent}, #8b5cf6)`,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12, fontWeight: 800,
                color: '#fff', flexShrink: 0,
              }}>
                {num}
              </div>
              <div>
                <p style={{
                  fontWeight: 700, fontSize: 13,
                  margin: '0 0 1px', color: t.text,
                }}>
                  {title}
                </p>
                <p style={{
                  fontSize: 11, color: t.muted, margin: 0,
                }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── WORKS FOR ── */}
        <div style={{
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
        }}>
          <h2 style={{
            fontSize: 16, fontWeight: 800,
            margin: '0 0 14px', color: t.text,
            letterSpacing: '-0.3px',
          }}>
            Works For All Indian Apps
          </h2>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 8,
          }}>
            {useCases.map(app => (
              <span key={app} style={{
                background: dark
                  ? 'rgba(99,102,241,0.1)'
                  : 'rgba(99,102,241,0.08)',
                border: `1px solid rgba(99,102,241,0.2)`,
                color: t.accentLight,
                fontSize: 12, fontWeight: 600,
                padding: '5px 12px',
                borderRadius: 20,
              }}>
                {app}
              </span>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
        }}>
          <h2 style={{
            fontSize: 16, fontWeight: 800,
            margin: '0 0 16px', color: t.text,
            letterSpacing: '-0.3px',
          }}>
            Frequently Asked Questions
          </h2>
          {faqs.map((faq, i) => (
            <div key={i} style={{
              marginBottom: i < faqs.length - 1 ? 14 : 0,
              paddingBottom: i < faqs.length - 1 ? 14 : 0,
              borderBottom: i < faqs.length - 1
                ? `1px solid ${t.border}` : 'none',
            }}>
              <p style={{
                fontWeight: 700, fontSize: 13,
                margin: '0 0 4px', color: t.text,
              }}>
                {faq.q}
              </p>
              <p style={{
                fontSize: 12, color: t.muted,
                margin: 0, lineHeight: 1.5,
              }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* ── WHAT IS TEMP MAIL ── */}
        <div style={{
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
        }}>
          <h2 style={{
            fontSize: 16, fontWeight: 800,
            margin: '0 0 10px', color: t.text,
          }}>
            What is Temp Mail?
          </h2>
          <p style={{
            fontSize: 13, color: t.muted,
            margin: '0 0 12px', lineHeight: 1.6,
          }}>
            Temp mail (temporary email or disposable email) is a free
            service that gives you a throwaway email address instantly.
            Use it to sign up on websites without giving your real email.
            Perfect for avoiding spam, protecting privacy, and receiving
            OTPs on Indian apps like Swiggy, Zomato, and more.
          </p>
          <p style={{
            fontSize: 13, color: t.muted,
            margin: 0, lineHeight: 1.6,
          }}>
            TempMailin.in is India's fastest free temp mail service.
            No signup required. No personal data collected.
            All emails auto-delete after 24 hours. 100% free forever.
          </p>
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          textAlign: 'center',
          paddingTop: 8,
        }}>
          <p style={{
            fontSize: 12, color: t.muted,
            margin: '0 0 8px',
          }}>
            Emails auto-delete after 24 hours • No signup required
          </p>
          <p style={{
            fontSize: 12, color: t.muted,
            margin: '0 0 12px',
          }}>
            Made with ❤️ for India 🇮🇳
          </p>
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 20,
          }}>
            {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms']].map(([label, href]) => (
              <a key={label} href={href} style={{
                fontSize: 12, color: t.muted,
                textDecoration: 'none',
              }}>
                {label}
              </a>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>
    </div>
  );
}