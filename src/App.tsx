import { useState, useEffect } from "react";
import { 
  Building2, Globe, ShieldCheck, User, FolderLock, Laptop, ArrowRight 
} from "lucide-react";

import { 
  Lead, Client, Project, Quotation, Proposal, Invoice, 
  PortfolioProject, Testimonial, AgencySettings, AuditReport,
  ProjectDocument, ChatMessage
} from "./types";


import FrontendWebsite from "./components/FrontendWebsite";
import ClientDashboard from "./components/ClientDashboard";
import AdminPanel from "./components/AdminPanel";
import WebNestLogo from "./components/WebNestLogo";

export default function App() {
  const [activePortal, setActivePortal] = useState<"website" | "client" | "admin">("website");
  const [currentWebTab, setCurrentWebTab] = useState<string>("home");

  const [dbState, setDbState] = useState<{
    settings: AgencySettings;
    portfolio_projects: PortfolioProject[];
    testimonials: Testimonial[];
    leads: Lead[];
    clients: Client[];
    projects: Project[];
    quotations: Quotation[];
    proposals: Proposal[];
    invoices: Invoice[];
    documents?: ProjectDocument[];
    chat_messages?: ChatMessage[];
  } | null>(null);

  const fetchState = async () => {
    try {
      const res = await fetch("/api/state");
      if (res.ok) {
        const state = await res.json();
        setDbState(state);
      }
    } catch (err) {
      console.error("Error fetching CRM database state:", err);
    }
  };

  useEffect(() => {
    fetchState();
    
    // Parse URL pathnames for SPA SEO routing on initial load
    const path = window.location.pathname;
    if (
      path === "/website-development-company" || 
      path === "/web-development-services" ||
      path === "/seo-services" ||
      path === "/mobile-app-development" ||
      path === "/ecommerce-solutions" ||
      path === "/ui-ux-design" ||
      path === "/digital-marketing-agency" ||
      path === "/digital-marketing"
    ) {
      setActivePortal("website");
      setCurrentWebTab("services");
    } else if (path === "/blogs" || path.startsWith("/blogs/")) {
      setActivePortal("website");
      setCurrentWebTab("blogs");
    } else if (path === "/portfolio") {
      setActivePortal("website");
      setCurrentWebTab("portfolio");
    } else if (path === "/pricing") {
      setActivePortal("website");
      setCurrentWebTab("pricing");
    } else if (path === "/audit") {
      setActivePortal("website");
      setCurrentWebTab("audit");
    } else if (path === "/quote") {
      setActivePortal("website");
      setCurrentWebTab("quote");
    } else if (path === "/about") {
      setActivePortal("website");
      setCurrentWebTab("about");
    } else if (path === "/contact") {
      setActivePortal("website");
      setCurrentWebTab("contact");
    } else if (path === "/admin") {
      setActivePortal("admin");
    } else if (path === "/client") {
      setActivePortal("client");
    }

    const interval = setInterval(() => {
      fetchState();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleInquirySubmit = async (name: string, email: string, phone: string, biz: string, msg: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, business_name: biz, message: msg })
      });
      if (res.ok) {
        await fetchState();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const handleTriggerAudit = async (url: string, name: string, email: string, phone: string): Promise<AuditReport | null> => {
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, name, email, phone })
      });
      if (res.ok) {
        const data = await res.json();
        await fetchState();
        return data.report;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const handleTriggerQuote = async (
    client_name: string, email: string, phone: string, 
    website_type: string, pages: number, ecommerce: boolean, features: string[]
  ): Promise<Quotation | null> => {
    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_name, email, phone, website_type, pages, ecommerce, features })
      });
      if (res.ok) {
        const data = await res.json();
        await fetchState();
        return data.quote;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const handlePayInvoice = async (invoiceId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/invoices/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: invoiceId, status: "Paid" })
      });
      if (res.ok) {
        await fetchState();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const handleToggleMilestone = async (projectId: string, milestoneId: string, completed: boolean): Promise<boolean> => {
    try {
      const res = await fetch("/api/projects/milestone/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, milestoneId, completed })
      });
      if (res.ok) {
        await fetchState();
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const handleUploadDocument = async (projectId: string, clientId: string, name: string, size: string, dataUrl: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, clientId, name, size, dataUrl })
      });
      if (res.ok) {
        await fetchState();
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const handleDeleteDocument = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/documents/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        await fetchState();
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const handleSendChatMessage = async (clientId: string, sender: "client" | "developer", message: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, sender, message })
      });
      if (res.ok) {
        await fetchState();
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const handleAddMessageLog = async (msg: string) => {
    // Helper to log support threads inside inquiry DB on server
    await handleInquirySubmit(
      dbState?.settings.company_name || "System Server", 
      dbState?.settings.email || "support@webnest.com", 
      "", 
      "", 
      msg
    );
  };

  // Admin triggers
  const handleAddLead = async (lead: Partial<Lead>): Promise<boolean> => {
    try {
      const res = await fetch("/api/leads/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead)
      });
      if (res.ok) {
        await fetchState();
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const handleEditLead = async (lead: Partial<Lead>): Promise<boolean> => {
    try {
      const res = await fetch("/api/leads/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead)
      });
      if (res.ok) {
        await fetchState();
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const handleAddClient = async (client: Partial<Client>): Promise<boolean> => {
    try {
      const res = await fetch("/api/clients/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client)
      });
      if (res.ok) {
        await fetchState();
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const handleEditClient = async (client: Partial<Client>): Promise<boolean> => {
    try {
      const res = await fetch("/api/clients/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client)
      });
      if (res.ok) {
        await fetchState();
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const handleAddProject = async (proj: Partial<Project>): Promise<boolean> => {
    try {
      const res = await fetch("/api/projects/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proj)
      });
      if (res.ok) {
        await fetchState();
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const handleEditProject = async (proj: Partial<Project>): Promise<boolean> => {
    try {
      const res = await fetch("/api/projects/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proj)
      });
      if (res.ok) {
        await fetchState();
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const handleAddInvoice = async (inv: Partial<Invoice>): Promise<boolean> => {
    try {
      const res = await fetch("/api/invoices/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inv)
      });
      if (res.ok) {
        await fetchState();
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const handleUpdateInvoiceStatus = async (id: string, status: "Paid" | "Unpaid"): Promise<boolean> => {
    try {
      const res = await fetch("/api/invoices/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        await fetchState();
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const handleAddProposal = async (proposal: Partial<Proposal>): Promise<boolean> => {
    try {
      const res = await fetch("/api/proposals/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proposal)
      });
      if (res.ok) {
        await fetchState();
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const handleAddPortfolio = async (port: Partial<PortfolioProject>): Promise<boolean> => {
    try {
      const res = await fetch("/api/portfolio/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(port)
      });
      if (res.ok) {
        await fetchState();
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const handleApproveTestimonial = async (id: string, approved: boolean): Promise<boolean> => {
    try {
      const res = await fetch("/api/testimonials/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, approved })
      });
      if (res.ok) {
        await fetchState();
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const handleSaveSettings = async (settingsForm: AgencySettings): Promise<boolean> => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        await fetchState();
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  };

  const handleResetDatabase = async () => {
    try {
      const res = await fetch("/api/reset", { method: "POST" });
      if (res.ok) {
        await fetchState();
      }
    } catch (e) { console.error(e); }
  };

  if (!dbState) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center space-y-4 flex-col">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#0A66FF] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="font-mono text-xs text-slate-500 uppercase tracking-widest">Compiling WebNest environment state...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans select-none antialiased">
      {/* Dynamic Header toolbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 h-16 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActivePortal("website"); setCurrentWebTab("home"); }}>
            <WebNestLogo size="sm" showText={true} />
          </div>

          {/* Top bar switcher menu hidden per user request to maximize aesthetic focus */}
          
        </div>
      </header>

      {/* Main Switchboard Routing */}
      <main className="grow flex flex-col">
        {activePortal === "website" && (
          <FrontendWebsite 
            settings={dbState.settings}
            portfolio={dbState.portfolio_projects}
            testimonials={dbState.testimonials}
            onSubmitInquiry={handleInquirySubmit}
            onTriggerAudit={handleTriggerAudit}
            onTriggerQuote={handleTriggerQuote}
            initialTab={currentWebTab}
          />
        )}

        {activePortal === "client" && (
          <ClientDashboard 
            settings={dbState.settings}
            clients={dbState.clients}
            projects={dbState.projects}
            invoices={dbState.invoices}
            quotations={dbState.quotations}
            documents={dbState.documents || []}
            chatMessages={dbState.chat_messages || []}
            onPayInvoice={handlePayInvoice}
            onAddMessage={handleAddMessageLog}
            onToggleMilestone={handleToggleMilestone}
            onUploadDocument={handleUploadDocument}
            onDeleteDocument={handleDeleteDocument}
            onSendChatMessage={handleSendChatMessage}
          />
        )}

        {activePortal === "admin" && (
          <AdminPanel 
            settings={dbState.settings}
            leads={dbState.leads}
            clients={dbState.clients}
            projects={dbState.projects}
            quotations={dbState.quotations}
            proposals={dbState.proposals}
            invoices={dbState.invoices}
            portfolio={dbState.portfolio_projects}
            testimonials={dbState.testimonials}
            documents={dbState.documents || []}
            chatMessages={dbState.chat_messages || []}
            onAddLead={handleAddLead}
            onEditLead={handleEditLead}
            onAddClient={handleAddClient}
            onEditClient={handleEditClient}
            onAddProject={handleAddProject}
            onEditProject={handleEditProject}
            onAddInvoice={handleAddInvoice}
            onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
            onAddProposal={handleAddProposal}
            onAddPortfolio={handleAddPortfolio}
            onApproveTestimonial={handleApproveTestimonial}
            onSaveSettings={handleSaveSettings}
            onResetDatabase={handleResetDatabase}
            onToggleMilestone={handleToggleMilestone}
            onUploadDocument={handleUploadDocument}
            onDeleteDocument={handleDeleteDocument}
            onSendChatMessage={handleSendChatMessage}
          />
        )}
      </main>
    </div>
  );
}
