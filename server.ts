import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

// Middleware
app.use(express.json());

// Helper to access Gemini safely
let ai: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY || "";
    if (key && key !== "MY_GEMINI_API_KEY") {
      ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return ai;
}

// Initial/Mock database structured records
const INITIAL_DATABASE = {
  settings: {
    company_name: "WebNest",
    tagline: "Building Digital Experiences That Drive Growth",
    website: "https://webnest-two.vercel.app",
    phone: "+91 7908774055",
    email: "webnestsupport@gmail.com",
    brand_primary: "#0A66FF",
    brand_secondary: "#001B5E",
    brand_accent: "#4DA3FF",
    smtp_host: "smtp.gmail.com",
    smtp_port: 587,
    smtp_user: "webnestsupport@gmail.com",
    smtp_pass: "********",
    social_facebook: "https://facebook.com/webnest",
    social_twitter: "https://twitter.com/webnest",
    social_linkedin: "https://linkedin.com/company/webnest",
    social_instagram: "https://instagram.com/webnest",
  },
  portfolio_projects: [
    {
      id: "p1",
      title: "Truinvest - Premium Wealth Platform",
      category: "Web Development",
      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      description: "A high-performance interactive investment portal featuring beautiful charts, modern CRM dashboard connectivity, and secure client reporting tools.",
      client_name: "Truinvest LLC",
      tech_stack: ["React", "Express", "D3.js", "TailwindCSS"],
      completion_date: "2026-03-12",
      seo_title: "Truinvest Financial Wealth Portal Web Design",
      seo_description: "Professional wealth portal development for Truinvest by WebNest - high-security fintech website redesign."
    },
    {
      id: "p2",
      title: "Atrangi Achar - E-Commerce Grocery Store",
      category: "E-Commerce",
      image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
      description: "Custom e-commerce pickle and kitchen condiments store with product management system, secure payments integration, and optimized order fulfillment pipeline.",
      client_name: "Atrangi Gourmet",
      tech_stack: ["WooCommerce", "WordPress", "TailwindCSS", "Razorpay"],
      completion_date: "2026-05-20",
      seo_title: "Atrangi Achar Online Food Store Design",
      seo_description: "Custom culinary pickle store development for Atrangi Achar. Order management & SEO optimizations."
    },
    {
      id: "p3",
      title: "Elevate Real Estate Showcase",
      category: "Web Design",
      image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
      description: "A minimalist property catalog featuring dynamic grid layout, interactive client tour calendars, and lead generation funnels.",
      client_name: "Elevate Properties",
      tech_stack: ["Figma", "React", "Motion", "TailwindCSS"],
      completion_date: "2026-01-15",
      seo_title: "Premium Real Estate Web Design",
      seo_description: "Award-winning commercial and residential web template styling for Elevate Properties."
    }
  ],
  testimonials: [
    {
      id: "t1",
      name: "Rohit Sharma",
      company: "Truinvest",
      role: "Managing Director",
      rating: 5,
      feedback: "WebNest completely transformed our wealth portal. The responsive frontend, modern aesthetic, and prompt support exceeded our corporate standards.",
      approved: true
    },
    {
      id: "t2",
      name: "Priyanjana Roy",
      company: "Atrangi Gourmet",
      role: "Co-Founder",
      rating: 5,
      feedback: "Our online orders spiked by 40% immediately after standard launch. Our custom pickle store is lightning fast and easy to navigate.",
      approved: true
    },
    {
      id: "t3",
      name: "Siddharth Sen",
      company: "Apex Legal Services",
      role: "Founder",
      rating: 4,
      feedback: "Highly dedicated engineering group. They styled our custom dashboard and CRM. Very professional workflow. Highly recommended!",
      approved: true
    }
  ],
  leads: [
    {
      id: "lead_1",
      name: "Anand Verma",
      email: "anand.verma@apextech.in",
      phone: "+91 9830022114",
      website: "https://apextech.in",
      business_name: "Apex Tech Labs",
      status: "In Negotiation",
      source: "Website Form",
      notes: ["Highly interested in E-Commerce Website.", "Slightly tight budget but premium quality expected."],
      date: "2026-06-18"
    },
    {
      id: "lead_2",
      name: "Shreya Ghoshal",
      email: "shreya@melodyacademy.org",
      phone: "+91 8240455987",
      website: "https://melodyacademy.org",
      business_name: "Melody Music Academy",
      status: "New",
      source: "Audit Tool",
      notes: ["Website speed is extremely slow.", "Needs mobile responsive optimizations and landing page refresh."],
      date: "2026-06-19"
    }
  ],
  clients: [
    {
      id: "client_truinvest",
      name: "Rohit Sharma",
      email: "rohit@truinvest.com",
      phone: "+91 9051213456",
      business_name: "Truinvest LLC",
      address: "Tower B, Salt Lake Sector V, Kolkata, India",
      joined_date: "2026-02-10",
      status: "Active"
    },
    {
      id: "client_atrangi",
      name: "Priyanjana Roy",
      email: "priyanjana@atrangi.com",
      phone: "+91 7001402366",
      business_name: "Atrangi Gourmet",
      address: "Gariahat Main Road, South Kolkata, India",
      joined_date: "2026-04-05",
      status: "Active"
    }
  ],
  projects: [
    {
      id: "proj_v1",
      client_id: "client_truinvest",
      client_name: "Truinvest LLC",
      name: "Truinvest Financial Portal V2",
      description: "Perform visual design overhaul, integrate D3.js active analytics charts, and optimize backend dashboards.",
      progress: 85,
      status: "In Review",
      deadline: "2026-07-15",
      total_budget: 3500,
      milestones: [
        { id: "m1", title: "Figma UX Prototypes Approved", completed: true },
        { id: "m2", title: "Charts Setup & Frontend API integration", completed: true },
        { id: "m3", title: "Beta Deploy & Client Live Review", completed: false }
      ]
    },
    {
      id: "proj_v2",
      client_id: "client_atrangi",
      client_name: "Atrangi Gourmet",
      name: "Atrangi Pickle Shop",
      description: "Development of custom responsive e-commerce grocery storefront for premium handmade pickle items.",
      progress: 100,
      status: "Completed",
      deadline: "2026-05-18",
      total_budget: 2200,
      milestones: [
        { id: "mp1", title: "Interactive Mockups Drafted", completed: true },
        { id: "mp2", title: "Payment Gateway Enabled", completed: true },
        { id: "mp3", title: "Production Deployment", completed: true }
      ]
    }
  ],
  tasks: [
    {
      id: "task_1",
      project_id: "proj_v1",
      name: "Incorporate client feedback from testing phase",
      status: "In Progress",
      priority: "High",
      deadline: "2026-07-01"
    },
    {
      id: "task_2",
      project_id: "proj_v1",
      name: "Fix standard table display overflow on mobile",
      status: "Pending",
      priority: "Medium",
      deadline: "2026-07-05"
    }
  ],
  quotations: [
    {
      id: "qt_001",
      client_name: "Anand Verma",
      email: "anand.verma@apextech.in",
      phone: "+91 9830022114",
      website_type: "Business Website",
      pages: 12,
      ecommerce: false,
      features: ["SEO Optimization", "Contact Forms", "Interactive Maps"],
      estimated_cost: 1550,
      status: "Accepted",
      date: "2026-06-18",
      items: [
        { description: "Lead Generation Business Framework Development (up to 15 pages)", cost: 1200 },
        { description: "Required Add-on: Contact & Intake Forms configuration", cost: 150 },
        { description: "Required Add-on: SEO-ready meta-tag optimization", cost: 200 }
      ]
    },
    {
      id: "qt_002",
      client_name: "Shreya Ghoshal",
      email: "shreya@melodyacademy.org",
      phone: "+91 8240455987",
      website_type: "Starter Website",
      pages: 5,
      ecommerce: false,
      features: ["Mobile Responsive Styling"],
      estimated_cost: 499,
      status: "Pending",
      date: "2026-06-19",
      items: [
        { description: "Starter Standard Corporate Showcase Webpage Setup (up to 5 pages)", cost: 499 }
      ]
    }
  ],
  proposals: [
    {
      id: "prop_1",
      client_id: "client_truinvest",
      client_name: "Truinvest LLC",
      title: "Truinvest Wealth Portal Scaling & Mobile Conversion",
      overview: "Optimization project designed to increase mobile user acquisition and update UI architecture for live wealth tracking feeds.",
      scope: ["Develop high-conversion lightweight landing screens", "Upgrade API loading logic to prevent feed delays", "Add standard secure document lockboxes"],
      timeline: "4 Weeks Sprint",
      cost: 1800,
      status: "Approved",
      date: "2026-06-15"
    }
  ],
  invoices: [
    {
      id: "inv_101",
      invoice_number: "WN-2026-004",
      project_id: "proj_v1",
      project_name: "Truinvest Financial Portal V2",
      client_id: "client_truinvest",
      client_name: "Truinvest LLC",
      client_email: "rohit@truinvest.com",
      issue_date: "2026-06-01",
      due_date: "2026-06-30",
      subtotal: 3500,
      tax_rate: 18,
      discount: 200,
      total: 3930,
      status: "Unpaid",
      items: [
        { description: "Milestone payment: Interactive charting visual designs & D3.js integration", quantity: 1, unit_price: 2000 },
        { description: "Milestone payment: Secure admin database dashboard connectivity setup", quantity: 1, unit_price: 1500 }
      ]
    },
    {
      id: "inv_102",
      invoice_number: "WN-2026-003",
      project_id: "proj_v2",
      project_name: "Atrangi Pickle Shop",
      client_id: "client_atrangi",
      client_name: "Atrangi Gourmet",
      client_email: "priyanjana@atrangi.com",
      issue_date: "2026-05-15",
      due_date: "2026-05-30",
      subtotal: 2200,
      tax_rate: 18,
      discount: 0,
      total: 2596,
      status: "Paid",
      items: [
        { description: "Full Project Payment: Custom functional E-Commerce pickle catalog store development", quantity: 1, unit_price: 2200 }
      ]
    }
  ],
  contact_messages: [
    {
      id: "msg_1",
      name: "Saurabh Mukherjee",
      phone: "+91 9433120987",
      email: "saurabh@neotechic.com",
      business_name: "Neo Technic",
      message: "Hello WebNest support, we are looking to redesign our website so it complies with modern lighthouse performance standards. Please get in touch for a detailed consultation.",
      status: "Unread",
      date: "2026-06-20"
    }
  ],
  audits: [] as any[],
  documents: [
    {
      id: "doc_1",
      project_id: "proj_v1",
      client_id: "client_truinvest",
      name: "Brand_Style_Guide_Figma.png",
      size: "2.4 MB",
      uploaded_at: "2026-04-10"
    },
    {
      id: "doc_2",
      project_id: "proj_v1",
      client_id: "client_truinvest",
      name: "Payment_Gateway_Account_Details.pdf",
      size: "1.1 MB",
      uploaded_at: "2026-05-02"
    },
    {
      id: "doc_3",
      project_id: "proj_v2",
      client_id: "client_atrangi",
      name: "Product_Pricing_Catalog.xlsx",
      size: "820 KB",
      uploaded_at: "2026-05-10"
    }
  ],
  chat_messages: [
    {
      id: "chat_1",
      client_id: "client_truinvest",
      sender: "developer",
      message: "Welcome to your WebNest Support Channel! We have successfully completed the UX mockups. You can toggle milestones below to see your progress update live.",
      timestamp: "2026-06-18T10:00:00.000Z"
    },
    {
      id: "chat_2",
      client_id: "client_truinvest",
      sender: "client",
      message: "Fantastic! Thanks for the quick update. I uploaded our updated style guide pdf in the secure document panel.",
      timestamp: "2026-06-18T10:05:00.000Z"
    },
    {
      id: "chat_3",
      client_id: "client_atrangi",
      sender: "developer",
      message: "Hello Priyanjana, your Atrangi Pickle Shop is live and running fully updated. Let us know if you have any questions!",
      timestamp: "2026-06-19T14:00:00.000Z"
    }
  ]
};

// Ensure database file exists
function readDatabase(): any {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATABASE, null, 2));
      return INITIAL_DATABASE;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database file:", error);
    return INITIAL_DATABASE;
  }
}

function writeDatabase(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing database file:", error);
  }
}

// REST API Endpoints
app.get("/api/state", (req, res) => {
  const db = readDatabase();
  res.json(db);
});

// Dynamic Inquiries / Contact Form Handler
app.post("/api/contact", (req, res) => {
  const { name, phone, email, business_name, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const db = readDatabase();
  const newMessage = {
    id: "msg_" + Date.now(),
    name,
    phone,
    email,
    business_name,
    message,
    status: "Unread" as const,
    date: new Date().toISOString().split("T")[0],
  };

  db.contact_messages.unshift(newMessage);

  // Sync to Leads table
  const newLead = {
    id: "lead_" + Date.now(),
    name,
    email,
    phone,
    business_name,
    website: "",
    status: "New" as const,
    source: "Direct Inquiry" as const,
    notes: [`Initial Contact Message: "${message}"`],
    date: new Date().toISOString().split("T")[0],
  };
  db.leads.unshift(newLead);

  writeDatabase(db);
  res.json({ success: true, message: "Message sent and logged in CRM!", newMessage });
});

// Website Audit Tool Endpoint (Gemini-powered!)
app.post("/api/audit", async (req, res) => {
  const { url, name, email, phone } = req.body;
  if (!url || !name || !email) {
    return res.status(400).json({ error: "Please provide URL, Name, and Email" });
  }

  const db = readDatabase();
  const reportId = "audit_" + Date.now();
  const dateStr = new Date().toISOString().split("T")[0];

  // We lazily attempt to query Gemini AI for real-time audit suggestions
  const aiClient = getGemini();
  let generatedReport = null;

  if (aiClient) {
    try {
      const templatePrompt = `
        You are a highly detailed and professional Technical Website Auditor, UI/UX Designer, and SEO Expert.
        Conduct a expert-level simulated audit report for the website URL: "${url}".
        Since you cannot access the site directly, evaluate based on the industry expectations for premium sites, common issues related to this URL type/domain, and standard performance bottlenecks.

        Generate a JSON output of the website audit report following this exact structure.
        Do not output any introductory or summary text outside the JSON. Return only a valid JSON string.

        {
          "score": (integer between 65 and 94),
          "categories": {
            "performance": (integer between 60 and 96),
            "seo": (integer between 65 and 96),
            "mobile": (integer between 68 and 96),
            "security": (integer between 70 and 98)
          },
          "recommendations": [
            {
              "category": "Performance" | "SEO" | "Mobile Optimization" | "Security",
              "issue": "A specific technical issue (e.g. Uncompressed images, Missing WebP formats, Next.js hydration issues, Render-blocking resources)",
              "severity": "High" | "Medium" | "Low",
              "fix": "Specific, detailed step-by-step technical instructions on how to solve this in standard PHP, React, or regular hosting servers"
            },
            ... (output exactly 4 or 5 high-quality actionable technical recommendations)
          ]
        }
      `;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: templatePrompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are a professional web technologist. Return JSON results only.",
        },
      });

      const textOutput = response.text || "{}";
      const cleaned = textOutput.replace(/```json\n?|```/g, "").trim();
      const rawReport = JSON.parse(cleaned);

      generatedReport = {
        id: reportId,
        url,
        name,
        email,
        phone,
        date: dateStr,
        score: rawReport.score || 78,
        categories: rawReport.categories || { performance: 75, seo: 80, mobile: 78, security: 82 },
        recommendations: rawReport.recommendations || []
      };
    } catch (apiError) {
      console.error("Gemini Audit API error:", apiError);
    }
  }

  // Fallback if Gemini not available or fails
  if (!generatedReport) {
    // Generate randomized but extremely realistic professional report
    const randScore = Math.floor(Math.random() * 20) + 70; // 70 to 89
    const perfScore = Math.floor(Math.random() * 20) + 65;
    const seoScore = Math.floor(Math.random() * 20) + 75;
    const mobileScore = Math.floor(Math.random() * 15) + 75;
    const secureScore = Math.floor(Math.random() * 10) + 85;

    generatedReport = {
      id: reportId,
      url,
      name,
      email,
      phone,
      date: dateStr,
      score: randScore,
      categories: {
        performance: perfScore,
        seo: seoScore,
        mobile: mobileScore,
        security: secureScore
      },
      recommendations: [
        {
          category: "Performance",
          issue: "Unoptimized and uncompressed visual assets",
          severity: "High",
          fix: "Compress massive banner assets using TinyPNG or Convert them to premium WebP/AVIF formats. Implement standard lazy loading tag properties (<img loading=\"lazy\">)."
        },
        {
          category: "SEO",
          issue: "Missing semantic Schema.org annotations and unstructured layouts",
          severity: "Medium",
          fix: "Inject structured JSON-LD LocalBusiness metadata script block directly in corporate header views containing location Coordinates, business phone numbers, and official logo url."
        },
        {
          category: "Mobile Optimization",
          issue: "Cumulative Layout Shift (CLS) on dynamic viewport rendering",
          severity: "Medium",
          fix: "Explicitly declare exact pixel height / width proportions on banner wraps to reserve critical layout parameters in the HTML document before rendering lazy CSS."
        },
        {
          category: "Security",
          issue: "Missing or misconfigured Content Security Policy (CSP) headers",
          severity: "Low",
          fix: "Configure standard .htaccess rules or PHP headers to emit modern 'Content-Security-Policy' headers preventing arbitrary code injections."
        }
      ]
    };
  }

  // Save audit log
  if (!db.audits) db.audits = [];
  db.audits.unshift(generatedReport);

  // Sync to Leads table as high intent lead
  const emailExistsInLeads = db.leads.some((l: any) => l.email === email);
  if (!emailExistsInLeads) {
    db.leads.unshift({
      id: "lead_" + Date.now(),
      name,
      email,
      phone,
      website: url,
      business_name: "",
      status: "New",
      source: "Audit Tool",
      notes: [
        `Generated Website Audit for URL: ${url}`,
        `Report Score: ${generatedReport.score}% (Perf: ${generatedReport.categories.performance}%, SEO: ${generatedReport.categories.seo}%)`
      ],
      date: dateStr
    });
  } else {
    // Add audit note to existing lead
    const existing = db.leads.find((l: any) => l.email === email);
    if (existing) {
      existing.notes.unshift(`Generated secondary Audit Report for: ${url} (Score: ${generatedReport.score}%)`);
    }
  }

  writeDatabase(db);
  res.json({ success: true, report: generatedReport });
});

// Quotation Post Generator
app.post("/api/quotations", (req, res) => {
  const { client_name, email, phone, website_type, pages, ecommerce, features } = req.body;
  if (!client_name || !email || !website_type) {
    return res.status(400).json({ error: "Missing required details" });
  }

  const db = readDatabase();
  const quoteId = "qt_" + Math.floor(100 + Math.random() * 900);
  const dateStr = new Date().toISOString().split("T")[0];

  // Estimate costs: Starter: 499, Business: 1200, Premium: 2500, Ecom: 3500 base rates
  let baseCost = 499;
  let pageMultiplier = 20;

  if (website_type === "Business Website") {
    baseCost = 1200;
  } else if (website_type === "Premium Website") {
    baseCost = 2500;
  } else if (website_type === "E-Commerce Website") {
    baseCost = 3500;
  }

  let featuresTotal = 0;
  const itemsList = [];
  itemsList.push({ description: `${website_type} Base Development (Up to ${pages} Pages)`, cost: baseCost });

  if (pages > 5) {
    const extraPagesCharge = (pages - 5) * pageMultiplier;
    featuresTotal += extraPagesCharge;
    itemsList.push({ description: `Extra viewport configurations (${pages - 5} pages)`, cost: extraPagesCharge });
  }

  if (ecommerce) {
    featuresTotal += 800;
    itemsList.push({ description: "E-Commerce custom functional module activation & gateway config", cost: 800 });
  }

  if (features && Array.isArray(features)) {
    features.forEach((feat: string) => {
      let fCost = 150;
      if (feat.includes("SEO")) fCost = 250;
      if (feat.includes("Maintenance")) fCost = 300;
      if (feat.includes("Custom Design")) fCost = 400;
      featuresTotal += fCost;
      itemsList.push({ description: `Feature add-on: ${feat}`, cost: fCost });
    });
  }

  const totalCost = baseCost + featuresTotal;

  const newQuote = {
    id: quoteId,
    client_name,
    email,
    phone: phone || "",
    website_type,
    pages,
    ecommerce: !!ecommerce,
    features: features || [],
    estimated_cost: totalCost,
    status: "Pending" as const,
    date: dateStr,
    items: itemsList
  };

  db.quotations.unshift(newQuote);

  // Sync to Leads
  db.leads.unshift({
    id: "lead_" + Date.now(),
    name: client_name,
    email,
    phone: phone || "",
    website: "",
    business_name: "",
    status: "New",
    source: "Quote Generator",
    notes: [`Generated digital price Quote ${newQuote.id} under type ${newQuote.website_type}. Est Cost: $${totalCost}`],
    date: dateStr
  });

  writeDatabase(db);
  res.json({ success: true, quote: newQuote });
});

// Update standard CRM settings API
app.post("/api/settings", (req, res) => {
  const db = readDatabase();
  db.settings = { ...db.settings, ...req.body };
  writeDatabase(db);
  res.json({ success: true, message: "Agency parameters updated successfully!", settings: db.settings });
});

// Leads Management REST
app.post("/api/leads/add", (req, res) => {
  const db = readDatabase();
  const newLead = {
    id: "lead_" + Date.now(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    website: req.body.website || "",
    business_name: req.body.business_name || "",
    status: req.body.status || "New",
    source: req.body.source || "Direct Inquiry",
    notes: req.body.notes ? [req.body.notes] : [],
    date: new Date().toISOString().split("T")[0]
  };
  db.leads.unshift(newLead);
  writeDatabase(db);
  res.json({ success: true, lead: newLead });
});

app.post("/api/leads/edit", (req, res) => {
  const db = readDatabase();
  const index = db.leads.findIndex((l: any) => l.id === req.body.id);
  if (index !== -1) {
    db.leads[index] = { ...db.leads[index], ...req.body };
    writeDatabase(db);
    res.json({ success: true, lead: db.leads[index] });
  } else {
    res.status(404).json({ error: "Lead not found" });
  }
});

// Clients CRUD
app.post("/api/clients/add", (req, res) => {
  const db = readDatabase();
  const cId = "client_" + Date.now();
  const newClient = {
    id: cId,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    business_name: req.body.business_name,
    joined_date: new Date().toISOString().split("T")[0],
    address: req.body.address || "",
    status: "Active" as const
  };
  db.clients.unshift(newClient);
  writeDatabase(db);
  res.json({ success: true, client: newClient });
});

app.post("/api/clients/edit", (req, res) => {
  const db = readDatabase();
  const index = db.clients.findIndex((c: any) => c.id === req.body.id);
  if (index !== -1) {
    db.clients[index] = { ...db.clients[index], ...req.body };
    writeDatabase(db);
    res.json({ success: true, client: db.clients[index] });
  } else {
    res.status(440).json({ error: "Client not found" });
  }
});

// Projects CRM Updates
app.post("/api/projects/add", (req, res) => {
  const db = readDatabase();
  const pId = "proj_" + Date.now();
  const clientObj = db.clients.find((c: any) => c.id === req.body.client_id) || { name: "Direct Lead" };
  const newProj = {
    id: pId,
    client_id: req.body.client_id,
    client_name: clientObj.business_name || clientObj.name,
    name: req.body.name,
    description: req.body.description,
    progress: Number(req.body.progress || 0),
    status: req.body.status || "Planning",
    deadline: req.body.deadline,
    total_budget: Number(req.body.total_budget || 0),
    milestones: req.body.milestones || []
  };
  db.projects.unshift(newProj);
  writeDatabase(db);
  res.json({ success: true, project: newProj });
});

app.post("/api/projects/edit", (req, res) => {
  const db = readDatabase();
  const index = db.projects.findIndex((p: any) => p.id === req.body.id);
  if (index !== -1) {
    db.projects[index] = {
      ...db.projects[index],
      ...req.body,
      progress: Number(req.body.progress ?? db.projects[index].progress),
      total_budget: Number(req.body.total_budget ?? db.projects[index].total_budget)
    };
    writeDatabase(db);
    res.json({ success: true, project: db.projects[index] });
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// Invoices CRUD
app.post("/api/invoices/add", (req, res) => {
  const db = readDatabase();
  const iId = "inv_" + Date.now();
  const invNum = "WN-2026-" + Math.floor(100 + Math.random() * 900);
  const clientObj = db.clients.find((c: any) => c.id === req.body.client_id);
  const newInv = {
    id: iId,
    invoice_number: invNum,
    project_id: req.body.project_id || "",
    project_name: req.body.project_name || "",
    client_id: req.body.client_id,
    client_name: clientObj ? (clientObj.business_name || clientObj.name) : req.body.client_name,
    client_email: clientObj ? clientObj.email : (req.body.client_email || ""),
    issue_date: req.body.issue_date || new Date().toISOString().split("T")[0],
    due_date: req.body.due_date || "",
    subtotal: Number(req.body.subtotal),
    tax_rate: Number(req.body.tax_rate || 18),
    discount: Number(req.body.discount || 0),
    total: Number(req.body.total),
    status: req.body.status || "Unpaid",
    items: req.body.items || []
  };
  db.invoices.unshift(newInv);
  writeDatabase(db);
  res.json({ success: true, invoice: newInv });
});

app.post("/api/invoices/status", (req, res) => {
  const db = readDatabase();
  const index = db.invoices.findIndex((inv: any) => inv.id === req.body.id);
  if (index !== -1) {
    db.invoices[index].status = req.body.status;
    writeDatabase(db);
    res.json({ success: true, invoice: db.invoices[index] });
  } else {
    res.status(404).json({ error: "Invoice not found" });
  }
});

// Proposals CRUD
app.post("/api/proposals/add", (req, res) => {
  const db = readDatabase();
  const clientObj = db.clients.find((c: any) => c.id === req.body.client_id);
  const newProposal = {
    id: "prop_" + Date.now(),
    client_id: req.body.client_id,
    client_name: clientObj ? (clientObj.business_name || clientObj.name) : "",
    title: req.body.title,
    overview: req.body.overview,
    scope: req.body.scope || [],
    timeline: req.body.timeline || "4 Weeks",
    cost: Number(req.body.cost || 0),
    status: "Sent" as const,
    date: new Date().toISOString().split("T")[0]
  };
  db.proposals.unshift(newProposal);
  writeDatabase(db);
  res.json({ success: true, proposal: newProposal });
});

// Portfolio Manager CRUD
app.post("/api/portfolio/add", (req, res) => {
  const db = readDatabase();
  const newProject = {
    id: "p_" + Date.now(),
    title: req.body.title,
    category: req.body.category || "Web Development",
    image_url: req.body.image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    description: req.body.description,
    client_name: req.body.client_name,
    tech_stack: req.body.tech_stack || [],
    completion_date: req.body.completion_date || new Date().toISOString().split("T")[0],
    seo_title: req.body.seo_title,
    seo_description: req.body.seo_description
  };
  db.portfolio_projects.unshift(newProject);
  writeDatabase(db);
  res.json({ success: true, portfolioProject: newProject });
});

// Testimonials CRUD
app.post("/api/testimonials/add", (req, res) => {
  const db = readDatabase();
  const newTestimonial = {
    id: "t_" + Date.now(),
    name: req.body.name,
    company: req.body.company,
    role: req.body.role,
    rating: Number(req.body.rating || 5),
    feedback: req.body.feedback,
    approved: false
  };
  db.testimonials.unshift(newTestimonial);
  writeDatabase(db);
  res.json({ success: true, testimonial: newTestimonial });
});

app.post("/api/testimonials/approve", (req, res) => {
  const db = readDatabase();
  const index = db.testimonials.findIndex((t: any) => t.id === req.body.id);
  if (index !== -1) {
    db.testimonials[index].approved = req.body.approved;
    writeDatabase(db);
    res.json({ success: true, testimonial: db.testimonials[index] });
  } else {
    res.status(404).json({ error: "Testimonial not found" });
  }
});

// Reset Database API
app.post("/api/reset", (req, res) => {
  writeDatabase(INITIAL_DATABASE);
  res.json({ success: true, message: "Database reset successfully!", db: INITIAL_DATABASE });
});

// --- ADVANCED CLIENT EXPERIENCE PORTAL APIs ---

// Milestone Completion Toggler & visual progress calculator
app.post("/api/projects/milestone/toggle", (req, res) => {
  const { projectId, milestoneId, completed } = req.body;
  if (!projectId || !milestoneId) {
    return res.status(400).json({ error: "Missing projectId or milestoneId" });
  }

  const db = readDatabase();
  const proj = db.projects.find((p: any) => p.id === projectId);
  if (!proj) {
    return res.status(404).json({ error: "Project not found" });
  }

  const ms = proj.milestones.find((m: any) => m.id === milestoneId);
  if (!ms) {
    return res.status(404).json({ error: "Milestone not found" });
  }

  ms.completed = !!completed;

  // Dynamically calculate the overall project completion progress %
  const totalMs = proj.milestones.length;
  if (totalMs > 0) {
    const completedMs = proj.milestones.filter((m: any) => m.completed).length;
    proj.progress = Math.round((completedMs / totalMs) * 100);
  }

  writeDatabase(db);
  res.json({ success: true, project: proj });
});

// Document File System API
app.get("/api/documents", (req, res) => {
  const { clientId, projectId } = req.query;
  const db = readDatabase();
  let docs = db.documents || [];
  if (clientId) {
    docs = docs.filter((d: any) => d.client_id === clientId);
  }
  if (projectId) {
    docs = docs.filter((d: any) => d.project_id === projectId);
  }
  res.json(docs);
});

app.post("/api/documents/upload", (req, res) => {
  const { projectId, clientId, name, size, dataUrl } = req.body;
  if (!name || !clientId) {
    return res.status(400).json({ error: "Name and clientId are required" });
  }

  const db = readDatabase();
  if (!db.documents) db.documents = [];

  const newDoc = {
    id: "doc_" + Date.now(),
    project_id: projectId || "",
    client_id: clientId,
    name,
    size: size || "N/A",
    uploaded_at: new Date().toISOString().split("T")[0],
    dataUrl: dataUrl || ""
  };

  db.documents.unshift(newDoc);
  writeDatabase(db);
  res.json({ success: true, document: newDoc });
});

app.post("/api/documents/delete", (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "ID is required" });

  const db = readDatabase();
  if (!db.documents) db.documents = [];
  
  db.documents = db.documents.filter((d: any) => d.id !== id);
  writeDatabase(db);
  res.json({ success: true, message: "Document deleted" });
});

// Secure Chat Support System API
app.get("/api/chat", (req, res) => {
  const { clientId } = req.query;
  if (!clientId) {
    return res.status(400).json({ error: "clientId is required" });
  }

  const db = readDatabase();
  const chatMessages = db.chat_messages || [];
  const clientMessages = chatMessages.filter((msg: any) => msg.client_id === clientId);
  res.json(clientMessages);
});

app.post("/api/chat/send", (req, res) => {
  const { clientId, sender, message } = req.body;
  if (!clientId || !sender || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const db = readDatabase();
  if (!db.chat_messages) db.chat_messages = [];

  const newMsg = {
    id: "chat_" + Date.now(),
    client_id: clientId,
    sender,
    message,
    timestamp: new Date().toISOString()
  };

  db.chat_messages.push(newMsg);
  writeDatabase(db);
  res.json({ success: true, message: newMsg });
});

// Live app initialization & UI route handler
async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`WebNest Engine running on port ${PORT}`);
  });
}

startServer();
