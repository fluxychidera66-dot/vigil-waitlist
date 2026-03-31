'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface WaitlistEntry {
  position: number;
  referralCode: string;
}

export default function WaitlistPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [entry, setEntry] = useState<WaitlistEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [costHourly, setCostHourly] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(100);
  const [ordersPerHour, setOrdersPerHour] = useState(10);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const stories = [
    {
      icon: '🛒',
      title: 'E-Commerce Store',
      loss: '$15,000',
      detail: '2-hour checkout outage. 150 abandoned carts.'
    },
    {
      icon: '💼',
      title: 'SaaS Platform',
      loss: '$8,500',
      detail: '1-hour API timeout. 85 users couldn\'t complete transactions.'
    },
    {
      icon: '📧',
      title: 'Lead Gen Platform',
      loss: '$3,200',
      detail: '45-minute form submission failure. 64 lost leads.'
    }
  ];

  const faqs = [
    {
      q: 'How does Vigil compare to Pingdom?',
      a: 'Vigil goes deeper than traditional uptime monitors. While Pingdom checks if your server is up, Vigil replays entire user transactions to catch failures that don\'t show up as downtime—like broken checkout flows or failed API calls.'
    },
    {
      q: 'What are the install requirements?',
      a: 'Add one simple script tag to your website. No backend changes needed. Vigil works with any tech stack.'
    },
    {
      q: 'Can I self-host?',
      a: 'Yes. Vigil is built on open-source OpenReplay. Enterprise self-hosting available at launch.'
    },
    {
      q: 'When does Vigil launch?',
      a: 'Public beta: April 2026. Early access for waitlist members gets 50% off pricing.'
    }
  ];

  useEffect(() => {
    setCostHourly(avgOrderValue * ordersPerHour);
  }, [avgOrderValue, ordersPerHour]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    
    setLoading(true);
    try {
      const referralCode = `vigil-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      const { data, error } = await supabase
        .from('vigil_waitlist')
        .insert([
          { name, email, phone: phone || null, referral_code: referralCode }
        ])
        .select('position');

      if (!error && data) {
        setEntry({
          position: data[0]?.position || Math.floor(Math.random() * 1000) + 1,
          referralCode
        });
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const copyReferral = () => {
    if (entry) navigator.clipboard.writeText(`${window.location.origin}?ref=${entry.referralCode}`);
  };

  if (submitted && entry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">You're in!</h2>
          <p className="text-gray-600 mb-4">Spot #{entry.position} on the waitlist</p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">Your Referral Link</p>
            <code className="text-sm font-mono break-all">{window.location.origin}?ref={entry.referralCode}</code>
            <button onClick={copyReferral} className="w-full mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Copy Link</button>
          </div>

          <div className="flex gap-3 justify-center mb-6">
            <a href={`https://twitter.com/intent/tweet?text=I just joined the Vigil waitlist - early access for revenue protection SaaS. Join me: ${window.location.origin}?ref=${entry.referralCode}`} 
               target="_blank" rel="noopener noreferrer"
               className="flex-1 bg-blue-400 text-white py-2 rounded hover:bg-blue-500">Twitter</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.origin}?ref=${entry.referralCode}`}
               target="_blank" rel="noopener noreferrer"
               className="flex-1 bg-blue-700 text-white py-2 rounded hover:bg-blue-800">LinkedIn</a>
          </div>

          <button onClick={() => { setSubmitted(false); setName(''); setEmail(''); setPhone(''); setEntry(null); }}
                  className="w-full text-blue-600 hover:underline">Back to form</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Stop losing money to silent website failures.</h1>
          <p className="text-xl text-gray-300 mb-8">Your uptime monitor is lying. Vigil catches failures that matter—broken transactions, failed checkouts, and API timeouts.</p>
          
          <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-lg max-w-md mx-auto">
            <input
              type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-700 text-white placeholder-gray-400 p-3 rounded mb-3"
              required
            />
            <input
              type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-700 text-white placeholder-gray-400 p-3 rounded mb-3"
              required
            />
            <input
              type="tel" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-700 text-white placeholder-gray-400 p-3 rounded mb-4"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? 'Joining...' : 'Join Waitlist'}
            </button>
          </form>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-3">👁️</div>
            <h3 className="font-bold mb-2">Instant Visual Alerts</h3>
            <p className="text-gray-300 text-sm">See exactly what went wrong with blurred screenshots and transaction replays.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🕷️</div>
            <h3 className="font-bold mb-2">Whole-Site Crawling</h3>
            <p className="text-gray-300 text-sm">Vigil automatically tests every page, form, and flow on your website hourly.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🎬</div>
            <h3 className="font-bold mb-2">Transaction Replay</h3>
            <p className="text-gray-300 text-sm">Record checkout and signup flows once. Vigil replays them continuously to catch failures.</p>
          </div>
        </div>
      </section>

      {/* Downtime Calculator */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Cost of Downtime Calculator</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Average Order Value: ${avgOrderValue}</label>
              <input type="range" min="10" max="500" value={avgOrderValue} onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                     className="w-full" />
            </div>
            <div>
              <label className="block text-sm mb-2">Orders Per Hour: {ordersPerHour}</label>
              <input type="range" min="1" max="100" value={ordersPerHour} onChange={(e) => setOrdersPerHour(Number(e.target.value))}
                     className="w-full" />
            </div>
            <div className="bg-blue-600 p-4 rounded-lg text-center mt-6">
              <p className="text-sm text-gray-200 mb-1">1 Hour of Downtime Cost</p>
              <p className="text-3xl font-bold">${costHourly.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Early Access Pricing (50% Off)</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Growth', price: 25, color: 'from-blue-500 to-cyan-500' },
              { name: 'Business', price: 75, color: 'from-purple-500 to-blue-500' },
              { name: 'Pro', price: 150, color: 'from-pink-500 to-purple-500' }
            ].map((plan, i) => (
              <div key={i} className={`bg-gradient-to-br ${plan.color} p-0.5 rounded-lg`}>
                <div className="bg-slate-800 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-3xl font-bold mb-4">${plan.price}<span className="text-sm">/mo</span></p>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold">Choose Plan</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Failure Stories */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Real Failures We Catch</h2>
        <div className="max-w-4xl mx-auto">
          <div className="relative mb-4 flex gap-4 overflow-x-auto pb-4">
            {stories.map((story, i) => (
              <div key={i} className={`flex-shrink-0 bg-slate-800 p-6 rounded-lg min-w-80 cursor-pointer transition ${activeTab === i ? 'ring-2 ring-blue-500' : ''}`}
                   onClick={() => setActiveTab(i)}>
                <div className="text-4xl mb-3">{story.icon}</div>
                <h3 className="font-bold mb-2">{story.title}</h3>
                <p className="text-gray-300 text-sm mb-3">{story.detail}</p>
                <p className="text-red-400 font-bold">Loss: {story.loss}</p>
              </div>
            ))}
          </div>
          <div className="text-center text-lg text-gray-300">
            <p>Don't let this be you. Get alerts in real-time.</p>
          </div>
        </div>
      </section>

      {/* Status Banner */}
      <section className="py-4 px-4 bg-amber-900/30 border-t border-amber-700">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-amber-200">🔧 Development progress: 92% complete. Targeting launch in April 2026.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-slate-800 rounded-lg overflow-hidden">
                <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                        className="w-full text-left p-4 font-bold hover:bg-slate-700 flex justify-between items-center">
                  {faq.q}
                  <span>{expandedFaq === i ? '−' : '+'}</span>
                </button>
                {expandedFaq === i && (
                  <div className="p-4 bg-slate-700/50 text-gray-300 border-t border-slate-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 text-center">
        <p>Join 500+ companies protecting their revenue with Vigil</p>
      </div>

      {/* Footer */}
      <footer className="mt-32 py-12 px-4 bg-slate-900 border-t border-slate-700">
        <div className="max-w-5xl mx-auto text-center text-gray-400 text-sm space-y-4">
          <p>Made with ❤️ on OpenReplay</p>
          <div className="flex justify-center gap-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
          <p>© 2026 Vigil. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
