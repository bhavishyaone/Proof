import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

const FEATURES = [
  {
    icon: "✉️",
    title: "Effortless Collection",
    desc: "Share a single link and receive both text and video testimonials in minutes. Your customers need zero accounts, zero downloads — just their words and their story.",
  },
  {
    icon: "🖼️",
    title: "Wall of Love",
    desc: "Transform your testimonials into a stunning wall you can embed on any website. Choose from animated masonry, fixed grid, or carousel layouts — one line of code does it all.",
  },
  {
    icon: "📥",
    title: "Powerful Inbox",
    desc: "Every submission lands in a structured inbox. Approve, reject, like, archive, or mark spam with one click. Stay in full control of what your audience sees.",
  },
  {
    icon: "🎬",
    title: "Video Testimonials",
    desc: "Record directly in the browser — no app installs, no uploads needed. High-quality video testimonials that your customers can record in seconds from any device.",
  },
  {
    icon: "⚡",
    title: "Instant Embed",
    desc: "Copy the generated code and paste it anywhere. The Wall of Love renders inside a responsive iframe that fits your site's design, dark or light.",
  },
  {
    icon: "🎨",
    title: "Full Customisation",
    desc: "Set your branding, choose card sizes, toggle dark mode, hide dates, minimize images, and pick arrow colors. Your wall, your style.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Create your space",
    body: "Set up your testimonial collection page in under a minute. Add your brand name, header title, a custom welcome message, and choose whether to collect text, video, or both.",
  },
  {
    num: "02",
    title: "Share the link",
    body: "Every space gets a unique public URL like proof.app/your-brand. Send it via email, paste it in a Slack message, or add it to your website — customers fill it out in seconds.",
  },
  {
    num: "03",
    title: "Approve & embed",
    body: "Review incoming testimonials in your inbox. Approve the ones you love, then head to Wall of Love, pick a layout, and copy the embed code. Done.",
  },
];

const QUOTES = [
  {
    text: "Proof has completely changed how we collect social proof. Setting up the collection page took two minutes and my first testimonial came in the same day.",
    name: "Suraj Kulakrni",
    role: "Founder of Kayaka",
    initial: "S",
    stars: 3,
  },
  {
    text: "The video testimonial recording is incredibly smooth. My customers actually enjoy leaving reviews — that's something I never experienced with other tools.",
    name: "Shubh Arya",
    role: "Founder",
    initial: "S",
    stars: 5,
  },
  {
    text: "I pasted the embed code on my landing page in literally thirty seconds. The animated wall looks premium and I didn't write a single line of custom CSS.",
    name: "Daksh Saini",
    role: "Probe Founder",
    initial: "D",
    stars: 4,
  },
];

const FAQS = [
  {
    q: "Do my customers need to create an account to leave a testimonial?",
    a: "No. Your customers just open the unique link you share with them. They fill in their name, email (optional), and their testimonial text or record a video — no sign-up, no password.",
  },
  {
    q: "How do I embed the Wall of Love on my website?",
    a: "Once you've approved testimonials, go to Wall of Love, pick a layout (Animated, Fixed, or Carousel), configure the settings, and click Save & Continue. You'll get a ready-to-paste HTML snippet that works inside any website or web app.",
  },
  {
    q: "Can I collect both text and video testimonials?",
    a: "Yes. Each space can be configured to accept text only, video only, or both. Your public testimonial page will show the corresponding options to submitters.",
  },
  {
    q: "What happens to testimonials I don't want to show?",
    a: "Every submission goes into your inbox with 'pending' status. You decide what to approve. You can also archive, mark as spam, or permanently delete any submission.",
  },
  {
    q: "Can I manage multiple products or brands?",
    a: "Yes. You can create as many spaces as you need, each with its own custom branding, collection page, inbox, and Wall of Love embed.",
  },
  {
    q: "Does the embed work on any website?",
    a: "Yes. The embed code is a standard HTML iframe snippet. It works on any website — plain HTML, React, Next.js, Webflow, WordPress, or any other platform that allows custom HTML.",
  },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .card-hover {
          transition: transform 0.25s ease, border-color 0.25s ease;
        }
        .card-hover:hover {
          transform: translateY(-3px);
          border-color: rgba(255,255,255,0.15) !important;
        }
        .btn-white {
          background: #ffffff;
          color: #000000;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-white:hover {
          background: #e5e5e5;
          transform: translateY(-1px);
        }
        .btn-ghost {
          transition: background 0.2s, color 0.2s;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.06); color: #ffffff; }
        .faq-item { transition: border-color 0.2s; }
        .faq-item:hover { border-color: rgba(255,255,255,0.15) !important; }
        .floating { animation: float 6s ease-in-out infinite; }
        .floating-d1 { animation-delay: 0s; }
        .floating-d2 { animation-delay: 1s; }
        .floating-d3 { animation-delay: 2s; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>


      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1A1A1A]" : ""}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
              <span className="text-black font-black text-sm">P</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Proof</span>
          </div>


          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <button key={l.label} onClick={() => scrollTo(l.href)} className="text-[#6B6B6B] hover:text-white text-sm font-medium transition-colors">
                {l.label}
              </button>
            ))}
          </nav>


          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-[#6B6B6B] text-sm font-medium px-4 py-2 rounded-lg">
              Sign in
            </Link>
            <Link to="/register" className="btn-white text-sm font-semibold px-5 py-2 rounded-xl">
              Get started 
            </Link>
          </div>


          <button className="md:hidden text-[#6B6B6B] hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {mobileMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>


        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0A0A0A] border-t border-[#1A1A1A] px-6 py-4 space-y-3">
            {NAV_LINKS.map((l) => (
              <button key={l.label} onClick={() => scrollTo(l.href)} className="block w-full text-left text-[#6B6B6B] text-sm py-2">
                {l.label}
              </button>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" className="text-center text-[#6B6B6B] text-sm py-2 border border-[#2A2A2A] rounded-xl">Sign in</Link>
              <Link to="/register" className="text-center btn-white text-sm font-semibold py-2 rounded-xl">Get started free</Link>
            </div>
          </div>
        )}
      </header>


      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative">




          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6 text-white">
            Collect testimonials{" "}
            <span className="text-white">your customers</span>{" "}
            actually leave
          </h1>


          <p className="text-lg md:text-xl text-[#6B6B6B] max-w-xl mx-auto leading-relaxed mb-10">
            Share a link. Get video and text testimonials in minutes. Manage them in your inbox, then embed a stunning Wall of Love on any website — no code required.
          </p>


          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link to="/register" className="btn-white font-bold text-base px-8 py-3.5 rounded-2xl">
              Start collecting — it's free
            </Link>
            <button onClick={() => scrollTo("#how-it-works")} className="btn-ghost text-[#6B6B6B] text-base font-medium px-6 py-3.5 rounded-2xl border border-[#2A2A2A]">
              See how it works →
            </button>
          </div>


          <div className="flex items-center justify-center gap-6 text-sm text-[#6B6B6B]">
            <span className="flex items-center gap-1.5"><span className="text-white">✓</span> No Payment Required</span>
            <span className="hidden sm:block w-1 h-1 bg-[#2A2A2A] rounded-full" />
            <span className="flex items-center gap-1.5"><span className="text-white">✓</span> Free to start</span>
            <span className="hidden sm:block w-1 h-1 bg-[#2A2A2A] rounded-full" />
            <span className="flex items-center gap-1.5"><span className="text-white">✓</span> Instant embed</span>
          </div>
        </div>


        <div className="relative mt-20 max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0A] z-10 pointer-events-none" />
          <div className="grid grid-cols-3 gap-4 opacity-60">
            {[
              { name: "Tanubhav Katiyar", text: "Incredible tool. Got my first testimonial in under 5 minutes.", stars: 4, delay: "floating-d1" },
              { name: "Ganesh Wayal.", text: "The embed wall looks so professional on my site.", stars: 5, delay: "floating-d2" },
              { name: "Priya M.", text: "Video testimonials are a game changer for conversion.", stars: 3, delay: "floating-d3" },
            ].map((c, i) => (
              <div key={i} className={`floating ${c.delay} bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5`}>
                <div className="flex gap-0.5 mb-3">
                  {Array(c.stars).fill(0).map((_, si) => <span key={si} className="text-amber-400 text-sm">★</span>)}
                </div>
                <p className="text-[#A0A0A0] text-sm leading-relaxed mb-4">"{c.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center text-white font-bold text-xs">{c.name.charAt(0)}</div>
                  <span className="text-[#6B6B6B] text-xs font-medium">{c.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section id="features" className="py-24 px-6 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#6B6B6B] font-semibold text-xs tracking-widest uppercase mb-3">Features</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">Everything you need to<br />build social proof</h2>
            <p className="text-[#6B6B6B] text-lg max-w-xl mx-auto">From collection to display — every piece of the testimonial workflow, in one place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="card-hover bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-7">
                <div className="w-11 h-11 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-xl mb-5">{f.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section id="how-it-works" className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#6B6B6B] font-semibold text-xs tracking-widest uppercase mb-3">Process</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">Up and running<br />in three steps</h2>
            <p className="text-[#6B6B6B] text-lg max-w-lg mx-auto">No complex setup. No integrations to configure. Just a simple, repeatable workflow.</p>
          </div>

          <div className="space-y-5">
            {STEPS.map((s, i) => (
              <div key={i} className="card-hover bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <span className="text-white font-black text-4xl leading-none opacity-30">{s.num}</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">{s.title}</h3>
                  <p className="text-[#6B6B6B] leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-24 px-6 bg-[#111111]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-3xl p-10 md:p-14">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[#6B6B6B] font-semibold text-xs tracking-widest uppercase mb-3">Wall of Love</p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-5 text-white">
                  Embed a beautiful testimonial wall on any page
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed mb-6">
                  Once you've curated your best testimonials, generate an embed code with one click. The Wall of Love is an iframe that works on any website — paste it and ship it.
                </p>
                <ul className="space-y-3">
                  {["Animated masonry — cards that gently float", "Fixed masonry — clean static grid layout", "Carousel — one testimonial at a time, with arrows"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#A0A0A0]">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                        <svg width="8" height="8" fill="none" viewBox="0 0 8 8"><path d="M1 4l2 2 4-4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="inline-block mt-8 btn-white text-sm font-semibold px-6 py-3 rounded-xl">
                  Create your wall →
                </Link>
              </div>


              <div className="bg-[#111111] rounded-2xl p-5 space-y-3 border border-[#2A2A2A]">
                {[
                  { name: "Rishi Seth.", text: "Absolutely love this. Five stars, no question.", stars: 3, animate: true },
                  { name: "Kshitij Saxena.", text: "My conversion rate improved the week I added the wall.", stars: 5, animate: false },
                  { name: "Vinayak Singh", text: "Clean, fast, and my customers keep complimenting it.", stars: 4, animate: true },
                ].map((c, i) => (
                  <div key={i} className={`bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 ${c.animate ? "floating floating-d" + (i + 1) : ""}`}>
                    <div className="flex gap-0.5 mb-2">{Array(c.stars).fill(0).map((_, si) => <span key={si} className="text-amber-400 text-xs">★</span>)}</div>
                    <p className="text-[#A0A0A0] text-xs leading-relaxed mb-3">"{c.text}"</p>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#2A2A2A] flex items-center justify-center text-white font-bold text-[10px]">{c.name.charAt(0)}</div>
                      <span className="text-[#6B6B6B] text-xs">{c.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      <section id="testimonials" className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#6B6B6B] font-semibold text-xs tracking-widest uppercase mb-3">From our users</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">What people are saying</h2>
            <p className="text-[#6B6B6B] text-lg max-w-lg mx-auto">Founders, designers, and developers who use Proof every day.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {QUOTES.map((q, i) => (
              <div key={i} className="card-hover bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-7 flex flex-col">
                <div className="flex gap-0.5 mb-5">
                  {Array(q.stars).fill(0).map((_, si) => <span key={si} className="text-amber-400 text-base">★</span>)}
                </div>
                <p className="text-[#A0A0A0] leading-relaxed text-sm flex-1 mb-6">"{q.text}"</p>
                <div className="flex items-center gap-3 border-t border-[#2A2A2A] pt-5">
                  <div className="w-9 h-9 rounded-full bg-[#2A2A2A] flex items-center justify-center font-bold text-white text-sm">
                    {q.initial}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{q.name}</p>
                    <p className="text-[#6B6B6B] text-xs">{q.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section id="faq" className="py-24 px-6 bg-[#111111]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#6B6B6B] font-semibold text-xs tracking-widest uppercase mb-3">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">Common questions</h2>
            <p className="text-[#6B6B6B] text-lg">Everything you need to know before getting started.</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)} className="faq-item bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl cursor-pointer overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5">
                  <p className="text-white font-semibold text-sm pr-4">{f.q}</p>
                  <span className={`text-white text-lg font-light flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </div>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-[#6B6B6B] text-sm leading-relaxed">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-12 md:p-16 text-center">
            <p className="text-[#6B6B6B] font-semibold text-xs tracking-widest uppercase mb-4">Get started today</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5 text-white">
              Turn happy customers<br />into your best marketing
            </h2>
            <p className="text-[#6B6B6B] text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              Create your first space, collect your first testimonial, and have a Wall of Love live on your site — all within the same afternoon.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-white font-bold text-base px-10 py-4 rounded-2xl w-full sm:w-auto">
                Create your free account
              </Link>
              <Link to="/login" className="btn-ghost text-[#6B6B6B] text-base font-medium px-8 py-4 rounded-2xl border border-[#2A2A2A] w-full sm:w-auto">
                Sign in
              </Link>
            </div>

          </div>
        </div>
      </section>


      <footer className="border-t border-[#1A1A1A] py-12 px-6 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">

            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
                  <span className="text-black font-black text-sm">P</span>
                </div>
                <span className="text-white font-bold text-lg">Proof</span>
              </div>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">
                Collect video and text testimonials from your customers. Build trust. Grow faster.
              </p>
            </div>


            <div className="grid grid-cols-2 gap-10">
              <div>
                <p className="text-white font-semibold text-sm mb-4">Product</p>
                <ul className="space-y-3">
                  <li><button onClick={() => scrollTo("#features")} className="text-[#6B6B6B] hover:text-white text-sm transition-colors">Features</button></li>
                  <li><button onClick={() => scrollTo("#how-it-works")} className="text-[#6B6B6B] hover:text-white text-sm transition-colors">How it works</button></li>
                  <li><button onClick={() => scrollTo("#faq")} className="text-[#6B6B6B] hover:text-white text-sm transition-colors">FAQ</button></li>
                </ul>
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-4">Account</p>
                <ul className="space-y-3">
                  <li><Link to="/register" className="text-[#6B6B6B] hover:text-white text-sm transition-colors">Sign up</Link></li>
                  <li><Link to="/login" className="text-[#6B6B6B] hover:text-white text-sm transition-colors">Sign in</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1A1A1A] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[#6B6B6B] text-xs">© 2026 Proof. All rights reserved.</p>
            <div className="flex items-center gap-1.5 text-[#6B6B6B] text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white opacity-60" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
