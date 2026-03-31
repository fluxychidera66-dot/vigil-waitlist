'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [position, setPosition] = useState(42);
  const [referralCode, setReferralCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });

      if (response.ok) {
        const data = await response.json();
        setPosition(data.position || 42);
        setReferralCode(data.referral_code || 'VIGIL' + Math.random().toString(36).substring(7).toUpperCase());
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const shareUrl = `https://vigil-waitlist.vercel.app?ref=${referralCode}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-md z-50 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <span className="text-white font-bold text-xl">Vigil</span>
          </div>
          <div className="text-sm text-blue-300">Early Access Available</div>
        </div>
      </nav>

      {/* Live Status Banner */}
      <div className="mt-16 bg-blue-500/10 border-b border-blue-500/20 py-3 text-center">
        <p className="text-blue-200 text-sm">
          🔧 Development progress: <span className="font-semibold">92% complete</span>. Targeting launch in <span className="font-semibold">April 2026</span>
        </p>
      </div>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Stop losing money to <span className="text-blue-400">silent website failures.</span>
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Vigil watches your entire website 24/7, catches failures in seconds, and alerts you before your customers notice.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="px-4 py-3 rounded-lg bg-slate-800/50 border border-blue-500/30 text-white placeholder-slate-400 flex-1 focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-3 rounded-lg bg-slate-800/50 border border-blue-500/30 text-white placeholder-slate-400 flex-1 focus:outline-none focus:border-blue-500"
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="px-4 py-3 rounded-lg bg-slate-800/50 border border-blue-500/30 text-white placeholder-slate-400 flex-1 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition whitespace-nowrap"
            >
              Join Waitlist
            </button>
          </form>
        ) : (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-8 max-w-md mx-auto mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">🎉 You're In!</h2>
            <p className="text-3xl font-bold text-blue-400 mb-2">#{position}</p>
            <p className="text-slate-300 mb-6">You're on the waitlist!</p>
            <div className="mb-4">
              <p className="text-slate-400 text-sm mb-2">Your referral code:</p>
              <code className="block bg-slate-800 text-blue-300 px-3 py-2 rounded text-sm font-mono mb-2">
                {referralCode}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(shareUrl)}
                className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded text-sm transition"
              >
                Copy Referral Link
              </button>
            </div>
            <div className="flex gap-2 justify-center">
              <a href={`https://twitter.com/intent/tweet?text=I'm%20joining%20Vigil's%20waitlist!%20${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded text-sm transition">
                Share on Twitter
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded text-sm transition">
                Share on LinkedIn
              </a>
            </div>
          </div>
        )}
      </section>

      {/* Value Props */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Why Vigil?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '⚡', title: 'Instant Visual Alerts', desc: 'Get notified within seconds when something breaks' },
            { icon: '🕷️', title: 'Whole-Site Crawling', desc: 'Automatically crawl every page to catch silent failures' },
            { icon: '🎬', title: 'Transaction Replay', desc: 'Replay user flows to detect checkout & signup failures' },
          ].map((item, i) => (
            <div key={i} className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cost Calculator */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Cost of Downtime Calculator</h2>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="text-slate-300 text-sm font-semibold">Avg Order Value</label>
              <input type="number" placeholder="$100" defaultValue="100" className="w-full mt-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-blue-500/30 text-white" />
            </div>
            <div>
              <label className="text-slate-300 text-sm font-semibold">Orders per Hour</label>
              <input type="number" placeholder="50" defaultValue="50" className="w-full mt-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-blue-500/30 text-white" />
            </div>
          </div>
          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-blue-500/30">
            <p className="text-slate-400 text-sm">Cost of 1 hour downtime:</p>
            <p className="text-4xl font-bold text-blue-400">$5,000</p>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Early Access Pricing (50% Off)</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Growth', regular: '$50', discounted: '$25', features: ['5 Sites', 'Basic Alerts', 'Email Support'] },
            { name: 'Business', regular: '$150', discounted: '$75', features: ['20 Sites', 'Advanced Alerts', 'Slack Integration', 'Phone Support'], highlight: true },
            { name: 'Pro', regular: '$300', discounted: '$150', features: ['Unlimited Sites', 'AI Alerts', 'Webhook Support', 'Priority Support'] },
          ].map((plan, i) => (
            <div
              key={i}
              className={`rounded-xl p-8 border ${
                plan.highlight ? 'border-blue-500 bg-blue-500/20' : 'border-blue-500/20 bg-blue-500/10'
              }`}
            >
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-sm text-slate-400 line-through">{plan.regular}/mo</span>
                <span className="text-3xl font-bold text-blue-400 ml-2">{plan.discounted}/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="text-slate-300 flex items-center gap-2">
                    <span className="text-blue-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition">
                Join Waitlist
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">FAQ</h2>
        <div className="space-y-4">
          {[
            { q: 'How is Vigil different from Pingdom?', a: 'Vigil provides visual alerts, entire site crawling, and transaction replay - giving you the full picture of failures, not just uptime status.' },
            { q: 'How do I install Vigil?', a: 'Simply add a single script tag to your website. No complex setup required - Vigil works out of the box.' },
            { q: 'Can I self-host Vigil?', a: 'Yes! Vigil is built on OpenReplay and can be self-hosted on your own infrastructure.' },
            { q: 'When is the full launch?', a: 'We\'re targeting April 2026. Waitlist members get 50% off forever.' },
          ].map((item, i) => (
            <details key={i} className="group bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 cursor-pointer">
              <summary className="font-semibold text-white flex items-center justify-between">
                {item.q}
                <span className="text-blue-400 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-slate-300 mt-3">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-blue-500/20 mt-24 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="text-white font-bold mb-4">Vigil</p>
              <p className="text-slate-400 text-sm">Made with ❤️ on OpenReplay</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Community</p>
              <a href="#" className="text-blue-400 text-sm hover:text-blue-300">GitHub</a>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Legal</p>
              <a href="#" className="text-blue-400 text-sm hover:text-blue-300">Privacy Policy</a>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Social</p>
              <a href="#" className="text-blue-400 text-sm hover:text-blue-300">Twitter</a>
            </div>
          </div>
          <div className="border-t border-blue-500/20 pt-8 text-center text-slate-500 text-sm">
            © 2026 Vigil. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
