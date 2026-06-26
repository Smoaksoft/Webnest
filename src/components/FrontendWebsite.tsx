import React, { useState, useEffect } from "react";
import WebNestLogo from "./WebNestLogo";
import { 
  Globe, Laptop, Code, Smartphone, RefreshCw, Search, ShieldCheck, 
  ArrowRight, FileText, HelpCircle, Check, MapPin, Phone, Mail, 
  Send, AlertCircle, BarChart3, Star, Download, RotateCcw,
  BookOpen, Calendar, UserCheck, TrendingUp, X
} from "lucide-react";
import { PortfolioProject, Testimonial, AuditReport, Quotation, AgencySettings } from "../types";

interface FrontendProps {
  settings: AgencySettings;
  portfolio: PortfolioProject[];
  testimonials: Testimonial[];
  onSubmitInquiry: (name: string, email: string, phone: string, biz: string, msg: string) => Promise<boolean>;
  onTriggerAudit: (url: string, name: string, email: string, phone: string) => Promise<AuditReport | null>;
  onTriggerQuote: (name: string, email: string, phone: string, type: string, pages: number, ecommerce: boolean, features: string[]) => Promise<Quotation | null>;
  initialTab?: string;
}

export default function FrontendWebsite({ 
  settings, 
  portfolio, 
  testimonials, 
  onSubmitInquiry,
  onTriggerAudit,
  onTriggerQuote,
  initialTab = "home"
}: FrontendProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>(initialTab);
  const [selectedBlogPost, setSelectedBlogPost] = useState<any | null>(null);
  const [blogSearchQuery, setBlogSearchQuery] = useState<string>("");
  const [blogCategoryFilter, setBlogCategoryFilter] = useState<string>("All");

  // Keep activeSubTab synced with prop initialTab
  useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);

  // Synchronize browser URL, dynamic metadata titles, and descriptions for SEO
  useEffect(() => {
    let title = "WebNest | Website Development Company in India | SEO & App Development";
    let desc = "WebNest provides professional website development, mobile app development, SEO services, UI/UX design, eCommerce solutions, and digital marketing services for businesses across India.";
    
    // Update browser URL path using pushState
    if (activeSubTab === "home") {
      window.history.pushState(null, "", "/");
    } else if (activeSubTab === "services") {
      // Keep service-specific path if already loaded, otherwise use default
      const path = window.location.pathname;
      if (
        path !== "/website-development-company" &&
        path !== "/web-development-services" &&
        path !== "/seo-services" &&
        path !== "/mobile-app-development" &&
        path !== "/ecommerce-solutions" &&
        path !== "/ui-ux-design" &&
        path !== "/digital-marketing-agency" &&
        path !== "/digital-marketing"
      ) {
        window.history.pushState(null, "", "/web-development-services");
      }
    } else {
      window.history.pushState(null, "", "/" + activeSubTab);
    }

    if (activeSubTab === "services") {
      const path = window.location.pathname;
      if (path === "/website-development-company") {
        title = "Website Development Company | Professional Web Development Services - WebNest";
        desc = "WebNest is a premium website development company offering custom website development and professional web design services tailored for corporate growth.";
      } else if (path === "/seo-services") {
        title = "Best SEO Services | Rank #1 on Google with SEO Services by WebNest";
        desc = "Optimize your search visibility with expert SEO services by WebNest. We build high-converting SEO strategies, structured schemas, and speed boosts.";
      } else if (path === "/mobile-app-development") {
        title = "Mobile App Development Services | Custom iOS & Android Apps - WebNest";
        desc = "WebNest is a leading mobile app development team. We engineer secure, responsive, and performance-optimized iOS and Android apps.";
      } else if (path === "/ecommerce-solutions" || path === "/ecommerce-website-development") {
        title = "E-commerce Website Development | Responsive E-commerce Solutions - WebNest";
        desc = "Build secure, scalable digital storefronts with our custom E-commerce Website Development. Seamless payment gateways, checkouts, and custom products.";
      } else {
        title = "Professional Web Development Services & Digital Marketing - WebNest";
        desc = "WebNest provides web development, SEO, and digital marketing services across India to scale business visibility and conversions.";
      }
    } else if (activeSubTab === "portfolio") {
      title = "Our Creative Web Design & App Portfolio - WebNest";
      desc = "Explore our premium web design, SEO, custom eCommerce solutions, and web development project portfolio to see our visual craftsmanship.";
    } else if (activeSubTab === "pricing") {
      title = "Transparent Web Design & Development Pricing & Packages - WebNest";
      desc = "Affordable and transparent web development services, SEO pricing plans, and app development package costs.";
    } else if (activeSubTab === "blogs") {
      title = "WebNest Insights Blog | Web Development & SEO Marketing Articles";
      desc = "Read our latest developer journals about website development cost in India, small business web design templates, and actionable SEO tips.";
    } else if (activeSubTab === "about") {
      title = "About WebNest | Leading Website Designer & Developer";
      desc = "WebNest is an award-winning website designer and developer. Learn about our mission to build digital experiences that drive exponential business growth.";
    } else if (activeSubTab === "contact") {
      title = "Contact WebNest | Website Development Company in India";
      desc = "Get in touch with WebNest today. Let's discuss your custom web development, mobile app, SEO optimization, or digital marketing agency requirements.";
    }
    
    document.title = title;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', desc);
  }, [activeSubTab]);
  
  // Website Audit State
  const [auditUrl, setAuditUrl] = useState("");
  const [auditName, setAuditName] = useState("");
  const [auditEmail, setAuditEmail] = useState("");
  const [auditPhone, setAuditPhone] = useState("");
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditMessageIdx, setAuditMessageIdx] = useState(0);
  const [auditReport, setAuditReport] = useState<AuditReport | null>(null);

  // Instant Quote State
  const [quoteName, setQuoteName] = useState("");
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quoteType, setQuoteType] = useState("Business Website");
  const [quotePages, setQuotePages] = useState(8);
  const [quoteEcommerce, setQuoteEcommerce] = useState(false);
  const [quoteFeatures, setQuoteFeatures] = useState<string[]>([]);
  const [quoteReport, setQuoteReport] = useState<Quotation | null>(null);

  // Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactBiz, setContactBiz] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  // Portfolio Filters
  const [portfolioFilter, setPortfolioFilter] = useState<string>("All");

  const auditMessages = [
    "Establishing diagnostics link with DNS servers...",
    "Crawling site DOM semantic landmarks...",
    "Querying HTTP header configurations & security certificates...",
    "Evaluating mobile image optimization indicators...",
    "Gemini AI synthesizing customized performance suggestions..."
  ];

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditUrl || !auditName || !auditEmail) return;

    setAuditLoading(true);
    setAuditReport(null);
    setAuditMessageIdx(0);

    const interval = setInterval(() => {
      setAuditMessageIdx((prev) => (prev < auditMessages.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const report = await onTriggerAudit(auditUrl, auditName, auditEmail, auditPhone);
      if (report) {
        setAuditReport(report);
      }
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(interval);
      setAuditLoading(false);
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteName || !quoteEmail) return;
    try {
      const q = await onTriggerQuote(
        quoteName, quoteEmail, quotePhone, 
        quoteType, quotePages, quoteEcommerce, quoteFeatures
      );
      if (q) {
        setQuoteReport(q);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onSubmitInquiry(contactName, contactEmail, contactPhone, contactBiz, contactMsg);
    if (ok) {
      setContactSuccess(true);
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setContactBiz("");
      setContactMsg("");
      setTimeout(() => setContactSuccess(false), 5000);
    }
  };

  const toggleFeature = (feat: string) => {
    setQuoteFeatures(prev => 
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    );
  };

  const filteredPortfolio = portfolioFilter === "All" 
    ? portfolio 
    : portfolio.filter(p => p.category === portfolioFilter);

  const servicesList = [
    { 
      icon: <Globe className="w-8 h-8 text-[#0A66FF]" />, 
      title: "Website Designer", 
      desc: "Stunning aesthetic graphics paired with visual layout grids crafted in custom Figma boards by our expert website designer team to reinforce your corporate identity.",
      benefits: ["Distinctive UI layout aesthetics", "Premium design iterations", "Eye-friendly viewport compliance"]
    },
    { 
      icon: <Code className="w-8 h-8 text-[#03b879]" />, 
      title: "Website Development Services", 
      desc: "Fast, standards-compliant backend and frontend engineering. As a top website development company, we code templates with lightning speeds and clean system controllers.",
      benefits: ["Highly indexed web layouts", "Robust secure database integrations", "Clean object-oriented templates"]
    },
    { 
      icon: <Smartphone className="w-8 h-8 text-indigo-500" />, 
      title: "Mobile App Development", 
      desc: "Engineered secure, high-performance, and responsive mobile application architectures for iOS and Android platforms.",
      benefits: ["Cross-platform Flutter / React Native", "Offline-first capability integration", "Smooth App Store & Google Play launch"]
    },
    { 
      icon: <Laptop className="w-8 h-8 text-[#0a66ff]" />, 
      title: "E-commerce Website Development", 
      desc: "Scale your commerce revenue with custom e-commerce web development. Fully responsive shopping carts, secure checkout flows, and payment gateway capture.",
      benefits: ["Secure automated credit capture", "Interactive product search index", "Bulk order fulfillment tables"]
    },
    { 
      icon: <Search className="w-8 h-8 text-[#4DA3FF]" />, 
      title: "SEO Services", 
      desc: "Get discovered first on Google. Semantic JSON-LD schema layouts, rich XML sitemaps, meta descriptions, and rapid keyword indexings.",
      benefits: ["Higher organic lead inquiries", "Accelerated site crawlings", "Micro-structured Local Schema logs"]
    },
    { 
      icon: <BarChart3 className="w-8 h-8 text-amber-500" />, 
      title: "Digital Marketing Agency", 
      desc: "Our full-service digital marketing agency solutions will boost your corporate presence through paid campaigns, brand strategies, and growth tracking.",
      benefits: ["High return on ad spend (ROAS)", "Comprehensive brand tracking reports", "Lead-generating search engine funnels"]
    }
  ];

  return (
    <div className="bg-white min-h-screen text-slate-800">
      {/* Sub navigation for website pages inside the app */}
      <div className="bg-slate-50 border-y border-slate-100 py-2 sticky top-16 z-30 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 sm:space-x-2 text-sm font-medium">
          {["home", "services", "portfolio", "pricing", "blogs", "contact"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveSubTab(tab);
                setAuditReport(null);
                setQuoteReport(null);
              }}
              className={`px-3 py-1.5 rounded-full capitalize whitespace-nowrap transition-colors duration-200 ${
                (activeSubTab === tab || (tab === "pricing" && activeSubTab === "quote") || (tab === "contact" && activeSubTab === "about"))
                  ? "bg-[#0A66FF] text-white" 
                  : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {tab === "pricing" ? "💳 Plans & Quote" : tab === "blogs" ? "📰 Blogs" : tab === "contact" ? "✉️ About & Contact" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* 1. HOME VIEW */}
      {activeSubTab === "home" && (
        <div>
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#001B5E] to-slate-900 text-white py-20 lg:py-32">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(77,163,255,0.15),transparent_40%)]"></div>
            <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-400/20">
                  <Star className="w-3.5 h-3.5 fill-blue-400" /> Leading Digital Transformation Agency
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white">
                  Professional <span className="text-[#4DA3FF]">Website Development Company</span> in India
                </h1>
                <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  WebNest is a premier website development company in India, offering custom web development services, professional website designer assets, mobile app development, E-commerce website development, and digital marketing agency solutions to scale businesses organic traffic.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <button 
                    onClick={() => setActiveSubTab("quote")}
                    className="px-6 py-3.5 bg-[#0A66FF] hover:bg-opacity-90 font-medium rounded-lg shadow-lg flex items-center justify-center gap-2 transition"
                  >
                    Get Started / Request Quote <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setActiveSubTab("audit")}
                    className="px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 font-medium rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    Free AI Website Audit <Search className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                  <div>
                    <h3 className="text-2xl font-bold text-white">100%</h3>
                    <p className="text-xs text-slate-400">Custom Code / SEO Ready</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">50+</h3>
                    <p className="text-xs text-slate-400">Projects Delivered</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#4DA3FF]">98%</h3>
                    <p className="text-xs text-slate-400">Success Rating</p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 relative mt-6 lg:mt-0">
                <div className="absolute inset-0 bg-blue-500 rounded-2xl filter blur-2xl opacity-10"></div>
                <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="font-mono text-xs text-blue-400"># DIAGNOSTIC ENGINE v3.5</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Is your current website losing clients?</h3>
                    <p className="text-xs text-slate-400">
                      Enter your address below. Our AI-driven diagnostic engine will inspect performance configurations and outline instant fixes.
                    </p>
                    <div className="space-y-2">
                      <input 
                        type="url" 
                        placeholder="https://yourwebsite.com" 
                        value={auditUrl}
                        onChange={(e) => setAuditUrl(e.target.value)}
                        className="w-full bg-slate-950 border border-white/15 focus:border-[#0A66FF] text-white text-sm rounded-lg px-4 py-3 placeholder:text-slate-500 outline-none"
                      />
                      <button 
                        onClick={() => setActiveSubTab("audit")}
                        className="w-full px-4 py-3 bg-[#0A66FF] hover:bg-[#0A66FF]/95 transition active:scale-95 text-xs font-semibold text-white rounded-lg uppercase tracking-wider"
                      >
                        Analyze Site Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Core Corporate Process */}
          <section className="py-16 max-w-7xl mx-auto px-4">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
              <span className="text-[#0A66FF] uppercase tracking-widest text-xs font-bold">Proven Architecture</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">How We Ensure Your Growth</h2>
              <p className="text-slate-600">Our seamless project lifecycle takes your corporate idea from early Figma designs to standard tested production code.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Intake & Cost Estimate", desc: "Use our instant invoice and quote estimator to transparently draft exact scope sheets matching parameters." },
                { step: "02", title: "Aesthetic Wireframing", desc: "We map modern graphics in customizable layout files, styling specific components to represent your brand." },
                { step: "03", title: "Relational Coding", desc: "Construct codebases adhering to standard security practices - prepared SQL interfaces and XSS sanitizations." },
                { step: "04", title: "Deployment Control", desc: "Boot site instances to Hostinger, local XAMPP, or dedicated virtual private servers with clean guides." }
              ].map((proc, idx) => (
                <div key={idx} className="relative bg-slate-50 border border-slate-100 rounded-xl p-6 hover:shadow-lg transition group">
                  <div className="absolute top-4 right-4 text-4xl font-extrabold font-mono text-slate-200 group-hover:text-blue-100 transition-colors">
                    {proc.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-4 mb-2">{proc.title}</h3>
                  <p className="text-sm text-slate-600">{proc.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Services Preview */}
          <section className="bg-slate-50 py-16">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                <div>
                  <span className="text-[#0A66FF] uppercase tracking-widest text-xs font-bold text-left">Our Capabilities</span>
                  <h2 className="text-3xl font-bold text-slate-900 mt-2">Services Built For Conversions</h2>
                </div>
                <button 
                  onClick={() => setActiveSubTab("services")}
                  className="text-sm font-semibold text-[#0A66FF] hover:underline flex items-center gap-1.5"
                >
                  View All Detailed Services <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {servicesList.slice(0, 3).map((srv, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                    <div className="p-3 bg-blue-50 w-fit rounded-lg mb-4">{srv.icon}</div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{srv.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">{srv.desc}</p>
                    <ul className="space-y-2">
                      {srv.benefits.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-center gap-2 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Elegant Statistics Banner */}
          <section className="bg-white py-12 max-w-7xl mx-auto px-4 border-y border-slate-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <h4 className="text-4xl font-extrabold text-[#0D215E]">50+</h4>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Active Websites Managed</p>
              </div>
              <div>
                <h4 className="text-4xl font-extrabold text-[#0A66FF]">$140K+</h4>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Revenue Generated for Clients</p>
              </div>
              <div>
                <h4 className="text-4xl font-extrabold text-blue-400">12ms</h4>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Average API Response time</p>
              </div>
              <div>
                <h4 className="text-4xl font-extrabold text-emerald-500">22%</h4>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Average Lead Increase</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 2. SERVICES VIEW */}
      {activeSubTab === "services" && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <span className="text-[#0A66FF] uppercase tracking-widest text-xs font-bold">Solutions Catalog</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">What We Build For Growth</h2>
            <p className="text-slate-600">
              WebNest develops high-performance websites engineered strictly using optimization protocols to increase customer retention and capture sales leads daily.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicesList.map((srv, idx) => (
              <div key={idx} className="bg-white border border-slate-100 shadow-sm rounded-xl p-8 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-slate-50 w-fit rounded-lg mb-6">{srv.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{srv.title}</h3>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">{srv.desc}</p>
                  <div className="space-y-2 border-t border-slate-100 pt-4 mb-6">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Benefits</span>
                    {srv.benefits.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" /> {b}
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setQuoteType(srv.title.includes("E-Commerce") ? "E-Commerce Website" : srv.title.includes("Design") ? "Starter Website" : "Business Website");
                    setActiveSubTab("quote");
                  }}
                  className="w-full text-center py-2.5 rounded bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-[#0A66FF] text-xs font-semibold transition"
                >
                  Estimate Service Price →
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. PORTFOLIO VIEW */}
      {activeSubTab === "portfolio" && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
            <span className="text-[#0A66FF] uppercase tracking-widest text-xs font-bold font-mono">Our Achievements</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Digital Works That Drive Impact</h2>
            <p className="text-slate-600">Discover sample live frameworks we developed for commerce and security businesses.</p>
          </div>

          {/* Filtering Buttons */}
          <div className="flex justify-center space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
            {["All", "Web Design", "Web Development", "E-Commerce", "WordPress"].map((cat) => (
              <button
                key={cat}
                onClick={() => setPortfolioFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                  portfolioFilter === cat 
                    ? "bg-[#0A66FF] text-white" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredPortfolio.map((p) => (
              <div key={p.id} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition group">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={p.image_url} 
                    alt={p.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                  />
                  <span className="absolute top-3 left-3 bg-[#001B5E] text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">
                    {p.category}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <span className="text-[11px] text-slate-400 font-mono">CLIENT: {p.client_name}</span>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{p.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {p.tech_stack.map((stk, sidx) => (
                      <span key={sidx} className="bg-slate-50 border border-slate-100 text-slate-500 font-mono text-[9px] px-2 py-0.5 rounded">
                        {stk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. PRICING VIEW */}
      {(activeSubTab === "pricing" || activeSubTab === "quote") && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
              <span className="text-[#0A66FF] uppercase tracking-widest text-xs font-bold text-center">Transparent Pricing</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Preoccupied Package Deals</h2>
              <p className="text-slate-600">Select standard packages with clear outcomes, or generate a specific customized quotation using our dynamic wizard below.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { 
                  name: "Starter Website", 
                  price: "$499", 
                  desc: "Ideal for basic portfolio listings, startups, and simple local business landings.",
                  features: ["Up to 5 custom styled pages", "100% Mobile responsive layout", "Secure secure custom contact form", "Basic meta-data title tags set", "1 Month standard repair warranty"]
                },
                { 
                  name: "Business Website", 
                  price: "$1,200", 
                  popular: true,
                  desc: "Perfect for growing teams, marketing companies, and complete corporate solutions.",
                  features: ["Up to 15 optimized pages", "Dynamic slide banners & animations", "Dynamic customer acquisition forms", "Complete JSON-LD SEO schema integration", "Speed compressed static assets", "3 Months expert maintenance help"]
                },
                { 
                  name: "Premium Website", 
                  price: "$2,500", 
                  desc: "High-level agency layout designed to highlight elite corporate portfolios.",
                  features: ["Unlimited bespoke Figma designs", "Custom API system integrations", "Advanced admin settings controls", "Dynamic database filters", "Interactive Google/Leaflet Maps integration", "Complete source-code delivery files", "6 Months fully covered code updates"]
                },
                { 
                  name: "E-Commerce Website", 
                  price: "$3,500", 
                  desc: "Full functional retail store built to capture payments and manage stock logs seamlessly.",
                  features: ["Unlimited digital and physical products", "Complete Stripe / Razorpay capture", "Dynamic client login lockboxes", "Automated customer email invoices", "Stock parameters alert settings", "Complete admin order fulfillment boards"]
                }
              ].map((pkg, idx) => (
                <div 
                  key={idx} 
                  className={`bg-white border rounded-2xl p-6 relative flex flex-col justify-between ${
                    pkg.popular 
                      ? "border-[#0A66FF] shadow-lg xl:-translate-y-4" 
                      : "border-slate-100 shadow-sm"
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0A66FF] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                      Most Selected
                    </span>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{pkg.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{pkg.desc}</p>
                    <div className="my-6">
                      <span className="text-3xl font-extrabold text-slate-900">{pkg.price}</span>
                      <span className="text-xs text-slate-400 font-medium"> / one-time</span>
                    </div>
                    <ul className="space-y-3 border-t border-slate-100 pt-4 mb-6 text-xs text-slate-600">
                      {pkg.features.map((f, fidx) => (
                        <li key={fidx} className="flex gap-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button 
                    onClick={() => {
                      setQuoteType(pkg.name);
                      setActiveSubTab("pricing");
                      setTimeout(() => {
                        const el = document.getElementById("estimator-section");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                    className={`w-full py-2.5 rounded font-semibold text-xs text-center transition ${
                      pkg.popular 
                        ? "bg-[#0A66FF] text-white hover:bg-opacity-95" 
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    Select Plan & View Quote
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-lg font-bold text-slate-900">Need specific custom software integrations?</h3>
                <p className="text-sm text-slate-600">Answer 4 quick questions about your project scope to calculate an estimate and download a complete quotation.</p>
              </div>
              <button 
                onClick={() => {
                  setActiveSubTab("pricing");
                  setTimeout(() => {
                    const el = document.getElementById("estimator-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="px-5 py-3 bg-[#0A66FF] text-white hover:bg-opacity-90 font-semibold text-xs rounded uppercase tracking-wider whitespace-nowrap grow-0 shrink-0"
              >
                Launch Price Estimator →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 5. WEBSITE AUDIT VIEW */}
      {activeSubTab === "audit" && (
        <section className="py-12 max-w-4xl mx-auto px-4">
          <div className="text-center space-y-3 mb-8">
            <span className="text-[#0A66FF] uppercase tracking-widest text-xs font-bold">Diagnostics Hub</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">AI-Powered Website Audit Tool</h2>
            <p className="text-sm text-slate-600">
              Provide your website's URL. Our server conducts live diagnostic evaluations of security standards, semantic tags, and performance variables.
            </p>
          </div>

          {!auditReport && !auditLoading && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-xl max-w-xl mx-auto">
              <form onSubmit={handleAuditSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Website URL</label>
                  <input 
                    type="url" 
                    required 
                    placeholder="https://mybusinesswebsite.com" 
                    value={auditUrl}
                    onChange={(e) => setAuditUrl(e.target.value)}
                    className="w-full border border-slate-200 focus:border-[#0A66FF] rounded px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Anand" 
                      value={auditName}
                      onChange={(e) => setAuditName(e.target.value)}
                      className="w-full border border-slate-200 focus:border-[#0A66FF] rounded px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="anand@example.com" 
                      value={auditEmail}
                      onChange={(e) => setAuditEmail(e.target.value)}
                      className="w-full border border-slate-200 focus:border-[#0A66FF] rounded px-3 py-2 text-sm outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone (Optional)</label>
                  <input 
                    type="tel" 
                    placeholder="+91 XXXXX XXXXX" 
                    value={auditPhone}
                    onChange={(e) => setAuditPhone(e.target.value)}
                    className="w-full border border-slate-200 focus:border-[#0A66FF] rounded px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div className="bg-slate-50 rounded border border-slate-100 p-4 text-xs text-slate-500 flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p>Our server will logs this request in the custom leads database, allowing administrators to follow up with a deeper manual diagnostics call.</p>
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#001B5E] text-white hover:bg-[#0A66FF] font-semibold text-xs tracking-wider uppercase rounded transition"
                >
                  Generate Free AI Report
                </button>
              </form>
            </div>
          )}

          {auditLoading && (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-12 text-center space-y-6 max-w-xl mx-auto shadow-sm">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#0A66FF] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">Analysing site parameters...</h3>
                <p className="text-xs text-slate-500 min-h-[1.5rem] font-mono select-none">
                  {auditMessages[auditMessageIdx]}
                </p>
              </div>
            </div>
          )}

          {auditReport && !auditLoading && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-mono bg-blue-50 text-[#0A66FF] border border-blue-100 px-2 py-0.5 rounded-full font-bold">
                    Diagnostic Sheet
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">{auditReport.url}</h3>
                  <p className="text-xs text-slate-400">Audited on {auditReport.date} | Lead ID: {auditReport.id}</p>
                </div>
                <button 
                  onClick={() => { setAuditReport(null), setAuditUrl(""); }}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Start New Audit
                </button>
              </div>

              {/* Guages & Scores */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 items-center">
                <div className="sm:col-span-2 text-center p-6 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Average Grade</span>
                  <div className="text-5xl font-extrabold text-[#0A66FF]">{auditReport.score}%</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                    auditReport.score >= 85 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                    auditReport.score >= 70 ? "bg-amber-50 text-amber-600 border border-amber-100" :
                    "bg-rose-50 text-rose-600 border border-rose-100"
                  }`}>
                    {auditReport.score >= 85 ? "Lighthouse Optimised" : auditReport.score >= 70 ? "Needs Improvements" : "Critical Parameters Risk"}
                  </span>
                </div>
                <div className="sm:col-span-3 grid grid-cols-2 gap-4">
                  {[
                    { label: "Performance", val: auditReport.categories.performance },
                    { label: "SEO Index", val: auditReport.categories.seo },
                    { label: "Mobile Compliant", val: auditReport.categories.mobile },
                    { label: "Security Headers", val: auditReport.categories.security }
                  ].map((cat, idx) => (
                    <div key={idx} className="p-4 bg-white border border-slate-100 shadow-sm rounded-lg space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{cat.label}</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-bold text-slate-800">{cat.val}%</span>
                        <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#0A66FF] h-full" style={{ width: `${cat.val}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 border-l-4 border-amber-500 pl-2">Critical Actionable Fixes</h4>
                <div className="space-y-4">
                  {auditReport.recommendations.map((rec, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            rec.severity === "High" ? "bg-rose-100 text-rose-700" :
                            rec.severity === "Medium" ? "bg-amber-100 text-amber-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                            {rec.severity} Risk
                          </span>
                          <span className="text-xs font-bold text-slate-400 font-mono">[{rec.category}]</span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-900">{rec.issue}</h5>
                        <p className="text-xs text-slate-600 font-mono bg-white p-2 border border-slate-100 rounded leading-relaxed">
                          <span className="font-bold text-blue-600 block mb-1">🔧 Suggested Fix:</span> {rec.fix}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-lg p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h5 className="text-sm font-bold text-blue-300">Want our team to apply these technical fixes?</h5>
                  <p className="text-xs text-slate-400">Our engineers can configure the settings to boost your performance score up to 90%+.</p>
                </div>
                <button 
                  onClick={() => setActiveSubTab("contact")}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 transition text-xs font-bold rounded"
                >
                  Contact Support Engineers
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 6. INSTANT QUOTE GENERATOR VIEW */}
      {(activeSubTab === "pricing" || activeSubTab === "quote") && (
        <section id="estimator-section" className="py-12 max-w-4xl mx-auto px-4 border-t border-slate-100 mt-12 scroll-mt-24">
          <div className="text-center space-y-3 mb-8">
            <span className="text-[#0A66FF] uppercase tracking-widest text-xs font-bold font-mono">Rate Estimations</span>
            <h2 className="text-3xl font-bold text-slate-900">Instant Estimate Builder</h2>
            <p className="text-sm text-slate-600">Select parameters to calculate estimated development costs and view your invoice breakdown.</p>
          </div>

          {!quoteReport && (
            <div className="bg-white border border-slate-100 shadow-xl rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
              <form onSubmit={handleQuoteSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Anand Verma" 
                      value={quoteName}
                      onChange={(e) => setQuoteName(e.target.value)}
                      className="w-full border border-slate-200 focus:border-[#0A66FF] rounded px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="anand@example.com" 
                      value={quoteEmail}
                      onChange={(e) => setQuoteEmail(e.target.value)}
                      className="w-full border border-slate-200 focus:border-[#0A66FF] rounded px-3 py-2 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Number (Optional)</label>
                  <input 
                    type="tel" 
                    placeholder="+91 XXXXX XXXXX" 
                    value={quotePhone}
                    onChange={(e) => setQuotePhone(e.target.value)}
                    className="w-full border border-slate-200 focus:border-[#0A66FF] rounded px-3 py-2 text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Website Template Blueprint</label>
                    <select 
                      value={quoteType}
                      onChange={(e) => setQuoteType(e.target.value)}
                      className="w-full border border-slate-200 bg-white focus:border-[#0A66FF] rounded px-3 py-2 text-sm outline-none h-[40px]"
                    >
                      <option>Starter Website</option>
                      <option>Business Website</option>
                      <option>Premium Website</option>
                      <option>E-Commerce Website</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Number of target pages: {quotePages}</label>
                    <input 
                      type="range" 
                      min={1} 
                      max={40} 
                      value={quotePages}
                      onChange={(e) => setQuotePages(Number(e.target.value))}
                      className="w-full accent-[#0A66FF] h-6 cursor-pointer mt-2"
                    />
                  </div>
                </div>

                {/* Ecommerce checkbox toggler */}
                <div className="flex items-center space-x-3 bg-slate-50 p-4 border border-slate-100 rounded">
                  <input 
                    type="checkbox" 
                    id="quoteEcom" 
                    checked={quoteEcommerce || quoteType === "E-Commerce Website"}
                    disabled={quoteType === "E-Commerce Website"}
                    onChange={(e) => setQuoteEcommerce(e.target.checked)}
                    className="w-4.5 h-4.5 accent-[#0A66FF]"
                  />
                  <label htmlFor="quoteEcom" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                    Requires functional E-Commerce integration? <span className="text-blue-500 font-mono">(+$800 flat rate)</span>
                  </label>
                </div>

                {/* Additional Features List */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Optional Features Add-ons</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      "Complete SEO Optimization (+$250)",
                      "Interactive Contact & Intake Forms (+$150)",
                      "Premium Maintenance coverage (+$300)",
                      "Custom Graphics styling Figma (+$400)",
                      "Google Maps platform API setup (+$150)"
                    ].map((feat, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => toggleFeature(feat)}
                        className={`text-left p-3 rounded border text-xs font-medium flex items-center justify-between transition ${
                          quoteFeatures.includes(feat) 
                            ? "border-blue-500 bg-blue-50 text-blue-900" 
                            : "border-slate-100 hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        <span>{feat.split(" (+")[0]}</span>
                        {quoteFeatures.includes(feat) && <Check className="w-3.5 h-3.5 text-blue-500" />}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#0A66FF] hover:bg-opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded transition"
                >
                  Generate PDF Quote / Estimate
                </button>
              </form>
            </div>
          )}

          {quoteReport && (
            <div className="bg-white border border-slate-100 shadow-xl rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-100 pb-5 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[#001B5E]">WebNest Agency Estimate</h3>
                  <p className="text-xs text-slate-400 font-mono">QUOTE ID: {quoteReport.id} | Date: {quoteReport.date}</p>
                </div>
                <div className="text-right sm:text-right">
                  <span className="text-xs text-slate-400 block font-semibold uppercase">TOTAL ESTIMATED BUDGET</span>
                  <span className="text-3xl font-extrabold text-[#0a66ff]">${quoteReport.estimated_cost}</span>
                </div>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded text-xs">
                <div>
                  <span className="text-[#0A66FF] font-bold block mb-1 uppercase tracking-wider font-mono text-[10px]">PREPARED FOR:</span>
                  <p className="font-bold text-slate-800">{quoteReport.client_name}</p>
                  <p className="text-slate-600">{quoteReport.email}</p>
                  {quoteReport.phone && <p className="text-slate-600">{quoteReport.phone}</p>}
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-1 uppercase tracking-wider font-mono text-[10px]">PREPARED BY:</span>
                  <p className="font-bold text-slate-800">{settings.company_name}</p>
                  <p className="text-slate-600">{settings.email}</p>
                  <p className="text-slate-600">{settings.phone}</p>
                </div>
              </div>

              {/* Table breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Cost Breakdown Spreadsheet</span>
                <div className="border border-slate-100 rounded overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-400 font-bold font-mono">
                      <tr>
                        <th className="p-3">LINE ITEM DESCRIPTION</th>
                        <th className="p-3 text-right">COST (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {quoteReport.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3 text-slate-700">{item.description}</td>
                          <td className="p-3 text-right font-mono font-bold">${item.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 font-bold text-slate-900 border-t border-slate-100">
                      <tr>
                        <td className="p-3 text-right uppercase tracking-wider">AGGREGATE EXPENDITURE:</td>
                        <td className="p-3 text-right text-base text-[#0A66FF] font-mono">${quoteReport.estimated_cost}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-xs text-slate-600 space-y-1">
                <p className="font-bold">📄 Legal Disclosures:</p>
                <p>This document constitutes a non-binding cost diagnostic sheet based on user inputs. Complete contract parameters will be signed upon deeper intake review with WebNest account executives.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100 justify-between items-center">
                <button 
                  onClick={() => { setQuoteReport(null); }}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Recalculate Quote
                </button>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 transition text-xs font-bold rounded flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Print / Export PDF
                  </button>
                  <button 
                    onClick={() => { setActiveSubTab("contact"); }}
                    className="px-4 py-2 bg-[#0A66FF] text-white hover:bg-opacity-95 transition text-xs font-bold rounded"
                  >
                    Confirm Scope / Schedule Demo
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 7. ABOUT VIEW */}
      {(activeSubTab === "contact" || activeSubTab === "about") && (
        <section className="py-16 max-w-5xl mx-auto px-4 space-y-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto py-4 flex flex-col items-center">
            <span className="text-[#0A66FF] uppercase tracking-widest text-xs font-bold">Who We Are</span>
            <WebNestLogo size="lg" showText={true} showTagline={true} direction="col" />
            <p className="text-slate-600 font-medium">Established to bridge advanced coding frameworks with high converting marketing layouts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Mission Statement</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To build lightning-fast web assets for small-to-medium enterprise partners, incorporating advanced search indexing, prepared database connectors, and seamless UI grids to boost commercial traffic.
              </p>
              <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To stand out as the leading technical development and SEO platform agency internationally, delivering outstanding craft inside modular full stack components.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Why Choose WebNest?</h3>
              {[
                { title: "No Templated Lag", desc: "Every portfolio page is optimized carefully to render faster, preventing layout shifts or blank screens." },
                { title: "Rigorous CRM Connectivity", desc: "Client invoices, milestones tracking, proposals generation directly synced to your client dashboard." },
                { title: "AI Diagnostic Groundings", desc: "Analyze and repair slow web frameworks in real-time." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="bg-[#0A66FF] text-white w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7.5 BLOGS VIEW */}
      {activeSubTab === "blogs" && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
            <span className="text-[#0A66FF] uppercase tracking-widest text-xs font-bold font-mono">Expert Insights</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Articles & Digital Strategies</h2>
            <p className="text-slate-600 leading-relaxed">
              Explore the latest insights on website development cost in India, small business web designer strategies, search engine optimizations, and digital marketing trends.
            </p>
          </div>

          {/* Search and Category Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-10 pb-6 border-b border-slate-100">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search articles..."
                value={blogSearchQuery}
                onChange={(e) => setBlogSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#0A66FF] rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none transition animate-none"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1">
              {["All", "Website Design", "Website Development Services", "SEO Services", "Digital Marketing"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setBlogCategoryFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                    blogCategoryFilter === cat 
                      ? "bg-[#0A66FF] text-white" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts
              .filter(post => {
                const matchesSearch = post.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) || 
                                     post.excerpt.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                                     post.keyword.toLowerCase().includes(blogSearchQuery.toLowerCase());
                const matchesCat = blogCategoryFilter === "All" || post.category === blogCategoryFilter;
                return matchesSearch && matchesCat;
              })
              .map((post) => (
                <div 
                  key={post.id} 
                  onClick={() => setSelectedBlogPost(post)}
                  className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    {/* Visual icon container representing article */}
                    <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6 border-b border-slate-50 group-hover:from-blue-100/60 group-hover:to-indigo-100/60 transition">
                      <BookOpen className="w-12 h-12 text-[#0A66FF]/60 group-hover:scale-110 transition" />
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                        <span className="bg-blue-50 text-[#0A66FF] px-2 py-0.5 rounded-full font-bold">{post.category}</span>
                        <span>{post.date}</span>
                        <span>&bull; {post.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0A66FF] transition leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-3 border-t border-slate-50 flex justify-between items-center text-xs font-semibold text-[#0A66FF]">
                    <span>Read Full Article &rarr;</span>
                    <span className="text-[10px] text-slate-400 font-normal font-mono">By {post.author.split(",")[0]}</span>
                  </div>
                </div>
              ))}
          </div>

          {/* Empty state */}
          {blogPosts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) || 
                                 post.excerpt.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                                 post.keyword.toLowerCase().includes(blogSearchQuery.toLowerCase());
            const matchesCat = blogCategoryFilter === "All" || post.category === blogCategoryFilter;
            return matchesSearch && matchesCat;
          }).length === 0 && (
            <div className="text-center py-16 space-y-2 border border-dashed border-slate-200 rounded-xl">
              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-600">No articles match your search criteria.</p>
              <button 
                onClick={() => { setBlogSearchQuery(""); setBlogCategoryFilter("All"); }}
                className="text-xs text-[#0A66FF] font-bold hover:underline"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </section>
      )}

      {/* Blog Article Detail Dialog Modal */}
      {selectedBlogPost && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedBlogPost(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span className="bg-blue-50 text-[#0A66FF] px-2 py-0.5 rounded-full font-bold">{selectedBlogPost.category}</span>
                <span>{selectedBlogPost.date}</span>
                <span>&bull; {selectedBlogPost.readTime}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {selectedBlogPost.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 border-b border-slate-100 pb-4">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span>Written by <strong className="font-semibold text-slate-800">{selectedBlogPost.author}</strong></span>
              </div>
            </div>

            {/* Rendered Body Content */}
            <div className="prose prose-slate max-w-none">
              {(() => {
                return selectedBlogPost.content.split("\n").map((line: string, idx: number) => {
                  const trimmed = line.trim();
                  if (!trimmed) return <div key={idx} className="h-4" />;
                  if (trimmed.startsWith("### ")) {
                    return <h3 key={idx} className="text-xl font-bold text-slate-900 mt-6 mb-3 border-b border-slate-100 pb-2">{trimmed.slice(4)}</h3>;
                  }
                  if (trimmed.startsWith("#### ")) {
                    return <h4 key={idx} className="text-base font-bold text-slate-800 mt-4 mb-2">{trimmed.slice(5)}</h4>;
                  }
                  if (trimmed.startsWith("* ")) {
                    const parts = trimmed.slice(2).split("**");
                    return (
                      <li key={idx} className="list-disc list-inside ml-4 text-sm text-slate-600 leading-relaxed py-0.5">
                        {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-slate-900">{p}</strong> : p)}
                      </li>
                    );
                  }
                  const parts = trimmed.split("**");
                  return (
                    <p key={idx} className="text-sm text-slate-600 leading-relaxed mb-3">
                      {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-slate-900">{p}</strong> : p)}
                    </p>
                  );
                });
              })()}
            </div>

            {/* Footer buttons */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-slate-400">
                Targeting search query: <code className="bg-slate-50 px-2 py-1 rounded border border-slate-100 text-slate-600">{selectedBlogPost.keyword}</code>
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedBlogPost(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded transition"
                >
                  Close Article
                </button>
                <button 
                  onClick={() => { setSelectedBlogPost(null); setActiveSubTab("contact"); }}
                  className="px-4 py-2 bg-[#0A66FF] hover:bg-[#001B5E] text-white text-xs font-bold rounded transition shadow-sm"
                >
                  Discuss Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. CONTACT VIEW */}
      {(activeSubTab === "contact" || activeSubTab === "about") && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
              <span className="text-[#0A66FF] uppercase tracking-widest text-xs font-bold">Get In Touch</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Contact WebNest CRM Platform</h2>
              <p className="text-slate-600 font-medium">Have a project proposal? Log an inquiry below to start mapping details inside the admin dashboard.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-5 bg-[#001B5E] text-white p-8 rounded-2xl shadow-xl space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Corporate Office</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">Let's discuss. Connect directly via physical mail routing or phone lines.</p>
                </div>
                <div className="space-y-4 text-xs font-medium text-slate-200">
                  <div className="flex gap-3">
                    <MapPin className="w-4.5 h-4.5 text-[#4DA3FF] shrink-0" />
                    <span>Durgapur, West Bengal 713205</span>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="w-4.5 h-4.5 text-[#4DA3FF] shrink-0" />
                    <span>+91 7908774055</span>
                  </div>
                  <div className="flex gap-3">
                    <Mail className="w-4.5 h-4.5 text-[#4DA3FF] shrink-0" />
                    <span>webnestsupport@gmail.com</span>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-6 space-y-2">
                  <span className="text-[10px] uppercase font-mono text-blue-300">Live app support</span>
                  <p className="text-xs text-slate-400">Our customer portal allows viewing quotation logs, downloading invoices, and tracking milestones directly from other viewtabs.</p>
                </div>
              </div>

              <div className="md:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm">
                {contactSuccess ? (
                  <div className="p-8 text-center bg-emerald-50 border border-emerald-100 rounded-lg space-y-4">
                    <Check className="w-12 h-12 text-emerald-500 mx-auto" />
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-emerald-800">Inquiry Logged Successfully!</h4>
                      <p className="text-xs text-emerald-600">Your details are logged inside CRM database. Lead administrators have been notified.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Name *</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Anand" 
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full border border-slate-200 focus:border-[#0A66FF] rounded px-3 py-2 text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
                        <input 
                          type="email" 
                          required 
                          placeholder="anand@example.com" 
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full border border-slate-200 focus:border-[#0A66FF] rounded px-3 py-2 text-sm outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Phone</label>
                        <input 
                          type="tel" 
                          placeholder="+91 82404 XXXX" 
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full border border-slate-200 focus:border-[#0A66FF] rounded px-3 py-2 text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business Name</label>
                        <input 
                          type="text" 
                          placeholder="Apex Tech" 
                          value={contactBiz}
                          onChange={(e) => setContactBiz(e.target.value)}
                          className="w-full border border-slate-200 focus:border-[#0A66FF] rounded px-3 py-2 text-sm outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Detailed Scope Message *</label>
                      <textarea 
                        required 
                        rows={5} 
                        placeholder="Detail your company development requirements..." 
                        value={contactMsg}
                        onChange={(e) => setContactMsg(e.target.value)}
                        className="w-full border border-slate-200 focus:border-[#0A66FF] rounded px-3 py-2 text-sm outline-none leading-relaxed"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full py-3 bg-[#0A66FF] hover:bg-[#001B5E] text-white font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" /> Log CRM Inquiry
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Corporate footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-4 gap-8">
          <div className="space-y-3">
            <WebNestLogo size="sm" showText={true} theme="dark" />
            <p className="text-xs leading-relaxed">
              Modern WordPress, E-Commerce, Custom SaaS web architectures tailored meticulously for small business partnerships.
            </p>
          </div>
          <div className="space-y-2 text-xs">
            <span className="text-white font-bold block mb-1">Company Views</span>
            {["home", "services", "portfolio", "pricing", "about"].map(v => (
              <button key={v} onClick={() => { setActiveSubTab(v); }} className="block hover:text-white capitalize transition">
                {v}
              </button>
            ))}
          </div>
          <div className="space-y-2 text-xs">
            <span className="text-white font-bold block mb-1">Interactive Tools</span>
            <button onClick={() => { setActiveSubTab("audit"); }} className="block hover:text-white transition">🔍 Instant AI Audit Report</button>
            <button onClick={() => { setActiveSubTab("quote"); }} className="block hover:text-white transition">📊 Calculate Price Estimates</button>
            <button onClick={() => { setActiveSubTab("contact"); }} className="block hover:text-white transition">📧 Submit RFQ Inquiries</button>
          </div>
          <div className="space-y-3 text-xs">
            <span className="text-white font-bold block">Physical Headquarters</span>
            <p>Durgapur, West Bengal 713205</p>
            <p className="text-[#4DA3FF] font-semibold font-mono">{settings.phone}</p>
            <p className="font-mono">{settings.email}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 border-t border-slate-900 mt-8 pt-6 text-center text-[10px] text-slate-600 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>&copy; {new Date().getFullYear()} WebNest Digital Group. Code protected by MVC architectural guidelines.</span>
          <div className="flex space-x-4">
            <a href="https://webnest-two.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">Official WebNest Page</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const blogPosts = [
  {
    id: "b1",
    title: "Website Development Cost in India: A Complete 2026 Guide",
    keyword: "Website Development Cost in India",
    excerpt: "How much does it cost to build a business website, e-commerce storefront, or custom SaaS web portal in India? We break down prices, hidden fees, and developer rates.",
    category: "Website Development Services",
    date: "June 25, 2026",
    readTime: "6 min read",
    author: "Siddharth Roy, Chief Tech Officer",
    content: `
### Understanding Website Development Cost in India

Are you planning to build a web presence and wondering about the **Website Development Cost in India**? You are not alone. As businesses migrate to digital-first models, understanding the financial parameters of establishing a website is crucial. In 2026, the cost of custom web design and development services varies significantly based on complexity, technology stacks, and functional integrations.

Here is a comprehensive breakdown of typical development budgets across India:

#### 1. Starter & Business Websites (₹15,000 - ₹50,000)
Ideal for small businesses, startups, and service providers who need a clean, responsive web presentation to showcase their credibility.
* **Tech Stack**: HTML5, Tailwind CSS, WordPress, or lightweight React.
* **Pages**: 5 to 10 standard pages (Home, About, Services, Contact, Blog).
* **Features**: Contact forms, Google Maps, social links, and basic SEO meta tags.

#### 2. E-commerce Website Development (₹45,000 - ₹1,50,000+)
Tailored for retail and grocery businesses seeking online sales portals.
* **Tech Stack**: WooCommerce, Shopify, or custom React + Node.js.
* **Features**: Dynamic cart systems, secure payment gateway integrations (Razorpay, Stripe), order tracking dashboards, and tax billing calculators.

#### 3. Custom Enterprise Portals & SaaS Systems (₹1,50,000 - ₹5,00,000+)
Built for companies with heavy database requirements, customer portals, or interactive tools (e.g., Wealth Platforms, CRM dashboards, or AI Diagnostic utilities).
* **Tech Stack**: React, Node.js, Express, PostgreSQL, D3.js.

#### What Factors Influence the Price?
* **Design Customization**: Off-the-shelf templates are cheaper, but custom designs crafted in Figma by a professional **Website Designer** are essential for brand differentiation.
* **Mobile Responsiveness**: Ensuring flawless viewing across mobile, tablet, and ultra-wide desktop monitors.
* **Advanced Integrations**: Live chat support systems, secure client document portals, or real-time progress trackers.

#### Why Choose WebNest for Your Development Needs?
WebNest, a leading **Website Development Company in India**, offers transparent pricing and milestone-based invoicing. We ensure your web asset is highly optimized, fast (achieving PageSpeed scores above 90), and fully configured for search rankings with expert **SEO Services**.
    `
  },
  {
    id: "b2",
    title: "Best Website Design for Small Businesses: Designing for Conversions",
    keyword: "Best Website Design for Small Businesses",
    excerpt: "Discover the key design elements that convert visitors into paying clients. High-contrast layouts, spacing, typography pairing, and visual hierarchies.",
    category: "Website Design",
    date: "June 24, 2026",
    readTime: "5 min read",
    author: "Aditi Sen, Senior UX Designer",
    content: `
### Crucial Factors in Best Website Design for Small Businesses

A website should be more than a passive digital brochure. The **Best Website Design for Small Businesses** acts as a 24/7 sales representative, actively capturing leads, establishing brand trust, and converting traffic into customers. If your website has high traffic but low conversions, it's time to re-evaluate your design aesthetics.

#### 1. First Impressions & Desktop-First Precision
Studies show that users form an opinion about your brand within **0.05 seconds** of loading your page.
* **The Hero Section**: The upper fold of your page must clearly communicate what you do, who you serve, and what immediate action the user should take.
* **White Space**: Generous margins and negative space create clean visual hierarchies, preventing cognitive overload and highlighting key CTA (Call-to-Action) buttons.

#### 2. Mobile-First Optimization
Over **60% of global web traffic** comes from mobile screens. A responsive grid layout that adapts seamlessly to varying viewports is non-negotiable. Buttons must have a minimum touch target size of 44px to accommodate touch navigation.

#### 3. Visual Credibility and Font Pairings
Using clean display fonts (like Inter or Space Grotesk) paired with structured, high-contrast text establishes high readability. Combining actual testimonials with professional logos instead of stock graphics builds trust immediately.

#### The Golden Rules of High-Converting Web Design:
* **One Clear Goal Per Page**: Whether requesting a price estimate or filling out a contact form, keep your CTAs prominent and unified.
* **Fast Page Loading**: If your page takes longer than 3 seconds to load, over 40% of visitors will bounce.
* **SEO-Friendly Landings**: Ensure your design contains semantic HTML landmarks (Header, Nav, Main, Footer) to make it easy for Google crawler bots to parse your content.

Partner with an experienced **Website Designer** at WebNest to elevate your small business into an industry leader. We build modern, conversion-focused websites that look stunning and perform flawlessly.
    `
  },
  {
    id: "b3",
    title: "10 Actionable SEO Tips for Business Websites to Boost Search Rankings",
    keyword: "SEO Tips for Business Websites",
    excerpt: "Uncover technical SEO strategies, semantic structures, JSON-LD schema markups, and PageSpeed optimizations to boost your organic traffic.",
    category: "SEO Services",
    date: "June 20, 2026",
    readTime: "7 min read",
    author: "Aman Gupta, SEO Strategist",
    content: `
### Essential SEO Tips for Business Websites

To succeed in the highly competitive digital landscape, having a stunning website is only half the battle. Your audience must be able to find you on search engines. These technical **SEO Tips for Business Websites** will help you optimize your web presence to rank higher on Google and drive valuable organic search traffic.

#### 1. Place Primary Keywords Strategically
Do not engage in keyword stuffing, which Google's algorithms penalize. Instead, weave search terms naturally inside:
* **The H1 Main Heading**: Make sure your primary page title clearly highlights your focus (e.g., "Professional Website Development Company").
* **The URL Path**: Use clean, SEO-friendly paths like \`/seo-services\` or \`/mobile-app-development\`.
* **Meta Title & Description**: Keep titles under 60 characters and descriptions under 160 characters.

#### 2. Integrate Rich Schema Markup (JSON-LD)
Schema markup helps Google search bots understand the context of your page. Adding \`LocalBusiness\` or \`ProfessionalService\` schema tags displays valuable metadata, such as your location, phone number, and reviews, directly on search results.

#### 3. Prioritize Site Loading Speed
Page speed is a major Google ranking factor. Aim for a **PageSpeed Insights score above 90** by:
* Compressing all images and utilizing responsive web formats (like WebP or SVG).
* Minifying HTML, CSS, and JS bundle packages.
* Eliminating render-blocking scripts.

#### 4. Configure Sitemap.xml and Robots.txt
* **Sitemap.xml**: Serves as a clear directory for Google bots, ensuring all your key pages are discovered and indexed.
* **Robots.txt**: Tells crawlers which sections of your site to scan and which private areas (like administrative client dashboards) to avoid.

Need help implementing advanced search engine optimization? Our expert **SEO Services** and **Digital Marketing Agency** packages at WebNest are customized to elevate your brand's authority, drive leads, and maximize your digital footprint.
    `
  },
  {
    id: "b4",
    title: "Why Every Business Needs a Website in the Digital Era",
    keyword: "Why Every Business Needs a Website",
    excerpt: "Building credibility, capturing 24/7 client leads, and expanding your reach. Why relying solely on social media is a risk for your brand.",
    category: "Digital Marketing",
    date: "June 18, 2026",
    readTime: "5 min read",
    author: "Vikram Sen, Marketing Director",
    content: `
### The Definitive Answer to: Why Every Business Needs a Website

In today's digital-first economy, the question is no longer "should we have a web presence?" but rather "how fast can we build an optimized website?" Here is the definitive answer to **Why Every Business Needs a Website** to survive, thrive, and scale in 2026.

#### 1. Establishes Instant Credibility
Over **84% of consumers** believe having a website makes your business more professional and credible than simply having a social media profile. Your website acts as the physical storefront of your digital brand, showcasing your achievements, case studies, and corporate settings.

#### 2. Capture Lead Inquiries 24/7
A physical office has opening hours, but a website is always online. With interactive inquiry forms, instant pricing estimate tools, and AI diagnostics assistants, you can capture qualified consumer leads while you sleep.

#### 3. Complete Ownership of Your Audience
Relying solely on social media platforms (like Facebook or Instagram) places your business at risk of sudden algorithm shifts, policy updates, or account suspensions. Your website is a digital asset that you completely own and control.

#### 4. Expand Beyond Local Boundaries
Whether your office is based in Durgapur, Kolkata, or Bangalore, an optimized website allows you to attract corporate partners internationally, scaling your small business into an enterprise agency.

At WebNest, we help brands build secure, scalable, and highly optimized platforms. As an established **Website Development Company**, we combine striking aesthetics with modern database structures to ensure your brand stands out.
    `
  },
  {
    id: "b5",
    title: "How to Rank a Website on Google: The Ultimate SEO Roadmap",
    keyword: "How to Rank a Website on Google",
    excerpt: "A comprehensive checklist from keyword mapping and sitemap submission, to rapid mobile loading speed and local citation building.",
    category: "SEO Services",
    date: "June 12, 2026",
    readTime: "8 min read",
    author: "Sanjay Dutta, Head of Content",
    content: `
### A Step-by-Step Guide on How to Rank a Website on Google

Ranking on the first page of Google is the ultimate goal of any modern digital marketing strategy. To achieve this, your website must meet both user standards and search engine crawlers' strict criteria. This blueprint outlines the exact steps for **How to Rank a Website on Google**.

#### Step 1: Conduct Thorough Keyword Mapping
Identify what your target audience is actively searching for. Map high-intent keywords like "Web Development Services", "E-commerce Website Development", and "Mobile App Development" directly into your landing pages and services catalogs.

#### Step 2: Craft Compelling Meta Titles & Descriptions
Your meta title is the first thing a user sees in search results. Ensure it is click-worthy, includes your primary search query, and accurately represents your brand.

#### Step 3: Implement Seamless Schema Markups
Add structured JSON-LD data to tell Google search bots exactly what your business is. This increases the chances of appearing in rich search snippets, FAQ accordions, and local map packs.

#### Step 4: Maximize Speed & Performance
Google favors websites that load within milliseconds. Implement lazy-loading, use vector SVG files for logos (like our WebNest 3D folded mark), and minimize main thread execution.

#### Step 5: Secure the Site with SSL (HTTPS)
Google explicitly flags non-secure websites, which instantly hurts user trust and organic search rankings. Make sure your SSL certificate is correctly configured.

#### Step 6: Build High-Quality Backlinks
Earn links from trusted publications, directories, and industry portals to establish your domain authority.

By following this strategic roadmap, you will significantly improve your domain authority and organic leads. Let WebNest assist you—our professional **SEO Services** and full-service **Digital Marketing Agency** solutions will help you conquer search results!
    `
  }
];
