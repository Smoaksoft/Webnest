import React, { useState } from "react";
import WebNestLogo from "./WebNestLogo";
import { 
  Users, BarChart3, TrendingUp, DollarSign, FolderOpen, FileCheck, TextQuote, 
  Settings, Layers, Plus, Search, Edit2, Check, X, Copy, MailWarning, FileText, 
  HelpCircle, Trash2, Calendar, FilePlus2, UserCheck
} from "lucide-react";
import { 
  Lead, Client, Project, Quotation, Proposal, Invoice, 
  PortfolioProject, Testimonial, AgencySettings, ProjectDocument, ChatMessage 
} from "../types";
import { PHP_EXPORT_FILES, PHPTemplateFile } from "../data/phpCodeTemplates";

interface AdminPanelProps {
  settings: AgencySettings;
  leads: Lead[];
  clients: Client[];
  projects: Project[];
  quotations: Quotation[];
  proposals: Proposal[];
  invoices: Invoice[];
  portfolio: PortfolioProject[];
  testimonials: Testimonial[];
  documents: ProjectDocument[];
  chatMessages: ChatMessage[];
  
  onAddLead: (lead: Partial<Lead>) => Promise<boolean>;
  onEditLead: (lead: Partial<Lead>) => Promise<boolean>;
  onAddClient: (client: Partial<Client>) => Promise<boolean>;
  onEditClient: (client: Partial<Client>) => Promise<boolean>;
  onAddProject: (proj: Partial<Project>) => Promise<boolean>;
  onEditProject: (proj: Partial<Project>) => Promise<boolean>;
  onAddInvoice: (inv: Partial<Invoice>) => Promise<boolean>;
  onUpdateInvoiceStatus: (id: string, status: "Paid" | "Unpaid") => Promise<boolean>;
  onAddProposal: (proposal: Partial<Proposal>) => Promise<boolean>;
  onAddPortfolio: (port: Partial<PortfolioProject>) => Promise<boolean>;
  onApproveTestimonial: (id: string, approved: boolean) => Promise<boolean>;
  onSaveSettings: (settings: AgencySettings) => Promise<boolean>;
  onResetDatabase: () => Promise<void>;
  onToggleMilestone: (projectId: string, milestoneId: string, completed: boolean) => Promise<boolean>;
  onUploadDocument: (projectId: string, clientId: string, name: string, size: string, dataUrl: string) => Promise<boolean>;
  onDeleteDocument: (id: string) => Promise<boolean>;
  onSendChatMessage: (clientId: string, sender: "client" | "developer", message: string) => Promise<boolean>;
}

export default function AdminPanel({
  settings, leads, clients, projects, quotations, proposals,
  invoices, portfolio, testimonials, documents, chatMessages,
  onAddLead, onEditLead, onAddClient, onEditClient,
  onAddProject, onEditProject, onAddInvoice, onUpdateInvoiceStatus,
  onAddProposal, onAddPortfolio, onApproveTestimonial,
  onSaveSettings, onResetDatabase,
  onToggleMilestone, onUploadDocument, onDeleteDocument, onSendChatMessage
}: AdminPanelProps) {
  
  const [activeSideTab, setActiveSideTab] = useState<string>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<AgencySettings>({ ...settings });

  // Developer CRM Chat & File locker panel states
  const [adminChatClientId, setAdminChatClientId] = useState<string>(clients[0]?.id || "client_truinvest");
  const [adminChatMessageText, setAdminChatMessageText] = useState("");

  
  // Selected Export Code File state
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copiedFileIndex, setCopiedFileIndex] = useState<number | null>(null);

  // Forms / Modal state
  const [showAddLead, setShowAddLead] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "", website: "", business_name: "", notes: "", status: "New" as any, source: "Direct Inquiry" as any });

  const [showAddClient, setShowAddClient] = useState(false);
  const [clientForm, setClientForm] = useState({ name: "", email: "", phone: "", business_name: "", address: "" });

  const [showAddProject, setShowAddProject] = useState(false);
  const [projectForm, setProjectForm] = useState({ client_id: clients[0]?.id || "", name: "", description: "", deadline: "2026-08-30", total_budget: 1500 });

  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [newInvClientId, setNewInvClientId] = useState(clients[0]?.id || "");
  const [newInvSubtotal, setNewInvSubtotal] = useState(1500);
  const [newInvDesc, setNewInvDesc] = useState("Custom Website Core Engineering");

  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [newPortTitle, setNewPortTitle] = useState("");
  const [newPortCategory, setNewPortCategory] = useState<any>("Web Development");
  const [newPortDesc, setNewPortDesc] = useState("");
  const [newPortClient, setNewPortClient] = useState("");
  const [newPortTech, setNewPortTech] = useState("React, TailwindCSS, PHP");

  // Sum active finances
  const totalRevenue = invoices.filter(inv => inv.status === "Paid").reduce((acc, cur) => acc + cur.total, 0);
  const pendingRevenue = invoices.filter(inv => inv.status === "Unpaid").reduce((acc, cur) => acc + cur.total, 0);

  const handleCopyCode = (index: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFileIndex(index);
    setTimeout(() => setCopiedFileIndex(null), 3000);
  };

  // Submit operations handlers
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onAddLead(leadForm);
    if (ok) {
      setShowAddLead(false);
      setLeadForm({ name: "", email: "", phone: "", website: "", business_name: "", notes: "", status: "New", source: "Direct Inquiry" });
    }
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onAddClient(clientForm);
    if (ok) {
      setShowAddClient(false);
      setClientForm({ name: "", email: "", phone: "", business_name: "", address: "" });
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onAddProject(projectForm);
    if (ok) {
      setShowAddProject(false);
      setProjectForm({ client_id: clients[0]?.id || "", name: "", description: "", deadline: "2026-08-30", total_budget: 1500 });
    }
  };

  const handleInvoiceCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const taxValue = 18;
    const grossTotal = newInvSubtotal + (newInvSubtotal * (taxValue / 100));
    const payload = {
      client_id: newInvClientId,
      subtotal: newInvSubtotal,
      total: grossTotal,
      tax_rate: taxValue,
      items: [{ description: newInvDesc, quantity: 1, unit_price: newInvSubtotal }]
    };
    const ok = await onAddInvoice(payload);
    if (ok) {
      setShowAddInvoice(false);
      setNewInvDesc("Custom Website Core Engineering");
      setNewInvSubtotal(1500);
    }
  };

  const handlePortfolioAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: newPortTitle,
      category: newPortCategory,
      description: newPortDesc,
      client_name: newPortClient,
      tech_stack: newPortTech.split(",").map(s => s.trim())
    };
    const ok = await onAddPortfolio(payload);
    if (ok) {
      setShowAddPortfolio(false);
      setNewPortTitle("");
      setNewPortDesc("");
      setNewPortClient("");
    }
  };

  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onSaveSettings(settingsForm);
    if (ok) {
      alert("Settings parameters locked in DB!");
    }
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen flex flex-col md:flex-row">
      
      {/* Sidebar navigation */}
      <div className="w-full md:w-64 bg-slate-900 text-slate-400 border-r border-slate-800 flex flex-col pt-6 shrink-0">
        <div className="px-5 mb-8 flex flex-col gap-1.5">
          <WebNestLogo size="sm" showText={true} theme="dark" />
          <p className="text-[10px] text-blue-400 font-mono font-bold mt-1"># ADMINISTRATIVE INTERFACE</p>
        </div>
        
        <div className="space-y-1 block max-h-[80vh] overflow-y-auto px-4 grow scrollbar-none pb-12">
          {[
            { id: "dashboard", label: "Dashboard Hub", icon: <Layers className="w-4 h-4" /> },
            { id: "leads", label: "Leads Manager", icon: <Users className="w-4 h-4" /> },
            { id: "clients", label: "Client Directory", icon: <UserCheck className="w-4 h-4" /> },
            { id: "projects", label: "Contracts & Deliveries", icon: <FolderOpen className="w-4 h-4" /> },
            { id: "invoices", label: "Invoicing & Revenue", icon: <DollarSign className="w-4 h-4" /> },
            { id: "portfolio", label: "Showcase Editor", icon: <FolderOpen className="w-4 h-4" /> },
            { id: "testimonials", label: "Customer Reviews", icon: <TextQuote className="w-4 h-4" /> },
            { id: "settings", label: "System Config", icon: <Settings className="w-4 h-4" /> },
            { id: "chat", label: "Client Support Chats", icon: <HelpCircle className="w-4 h-4" /> },
            { id: "documents", label: "Vault Documents", icon: <FileText className="w-4 h-4" /> },
            { id: "exporter", label: "🛠️ PHP Code Export", icon: <Copy className="w-4 h-4" /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveSideTab(item.id); setSearchTerm(""); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2.5 ${
                activeSideTab === item.id 
                  ? "bg-[#0A66FF] text-white" 
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Admin workspace board */}
      <div className="grow p-6 md:p-10 space-y-8 overflow-x-hidden">
        
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
          <div>
            <h2 className="text-xl font-black text-[#001B5E] capitalize">{activeSideTab.replace("_", " ")} Workspace</h2>
            <p className="text-[11px] text-slate-500 font-medium">WebNest Agency Administrative desk settings active</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={async () => {
                if (confirm("Reset database back to standard sample values? This will erase new inquiries.")) {
                  await onResetDatabase();
                  alert("Database structure reset successfully!");
                }
              }}
              className="px-3 py-1.5 border border-rose-100 text-rose-600 hover:bg-rose-50 rounded text-xs font-bold transition"
            >
              Reset Database
            </button>
          </div>
        </div>

        {/* 1. DASHBOARD HUB STATE */}
        {activeSideTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Total CRM Leads</span>
                <div className="text-3xl font-black text-slate-800">{leads.length}</div>
                <div className="text-[10px] text-[#0A66FF] font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> High acquisition intent
                </div>
              </div>
              <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Completed Projects</span>
                <div className="text-3xl font-black text-slate-800">
                  {projects.filter(p => p.status === "Completed").length}
                </div>
                <p className="text-[10px] text-slate-400">Contracts archived</p>
              </div>
              <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Paid Revenue Capture</span>
                <div className="text-3xl font-black text-emerald-500">${totalRevenue}</div>
                <p className="text-[10px] text-slate-400">Tax audited and settled</p>
              </div>
              <div className="p-5 bg-white rounded-xl border border-[#0A66FF]/20 shadow-sm space-y-2">
                <span className="text-[10px] text-[#0A66FF] font-bold uppercase tracking-wider font-mono">Outstanding Receivable</span>
                <div className="text-3xl font-black text-rose-500">${pendingRevenue}</div>
                <p className="text-[10px] text-slate-400">Awaiting clients bank clearings</p>
              </div>
            </div>

            {/* Custom Bezier SVG Chart representing Monthly Sales Trend (Pure React 19 safe Chart) */}
            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest font-mono">Revenue & Contracts Performance Chart</h3>
                  <p className="text-xs text-slate-400">Visual trend comparing payments receipts ($) against project delivery schedules.</p>
                </div>
              </div>

              {/* Custom SVG Drawing */}
              <div className="relative w-full overflow-hidden h-[240px] pt-4">
                <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                  {/* Grids */}
                  <line x1="0" y1="50" x2="600" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="150" x2="600" y2="150" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="200" x2="600" y2="200" stroke="#f1f5f9" strokeWidth="1" />

                  {/* Bezier Curves */}
                  {/* Data points: (Jan: 15, Feb: 30, Mar: 60, Apr: 45, May: 110, Jun: 140) */}
                  <path 
                    d="M 50,180 C 150,150 150,120 250,90 C 350,120 350,60 450,45 C 500,40 550,20 550,20" 
                    fill="none" 
                    stroke="url(#gradient-blue-line)" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                  />
                  
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="gradient-blue-line" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4DA3FF" />
                      <stop offset="100%" stopColor="#0A66FF" />
                    </linearGradient>
                  </defs>

                  {/* Nodes & text labels */}
                  {[
                    { cx: 50, cy: 180, val: "$500", month: "Jan" },
                    { cx: 150, cy: 150, val: "$1200", month: "Feb" },
                    { cx: 250, cy: 90, val: "$3500", month: "Mar" },
                    { cx: 350, cy: 110, val: "$2200", month: "Apr" },
                    { cx: 450, cy: 45, val: "$6100", month: "May" },
                    { cx: 550, cy: 20, val: `$${totalRevenue}`, month: "Jun" }
                  ].map((node, i) => (
                    <g key={i} className="group cursor-pointer">
                      <circle cx={node.cx} cy={node.cy} r="6" fill="#FFFFFF" stroke="#0A66FF" strokeWidth="3" />
                      <text x={node.cx} y={node.cy - 12} textAnchor="middle" fontSize="9" fontWeight="bold" fontFamily="monospace" fill="#0A66FF">
                        {node.val}
                      </text>
                      <text x={node.cx} y="195" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#94a3b8">
                        {node.month}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* 2. LEADS MANAGER */}
        {activeSideTab === "leads" && (
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm space-y-4 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search lead record parameters..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-slate-200 outline-none rounded pl-9 pr-3 py-2 text-xs"
                />
              </div>
              <button 
                onClick={() => setShowAddLead(true)}
                className="px-3 py-2 bg-[#0A66FF] hover:bg-opacity-95 text-white text-xs font-bold rounded flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Lead Profile
              </button>
            </div>

            {/* Create Lead Form Modal */}
            {showAddLead && (
              <form onSubmit={handleLeadSubmit} className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b pb-2">Add New CRM Lead Profile</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Contact Person *</label>
                    <input type="text" required value={leadForm.name} onChange={(e) => setLeadForm({...leadForm, name: e.target.value})} className="w-full border p-2 bg-white rounded outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Email Address *</label>
                    <input type="email" required value={leadForm.email} onChange={(e) => setLeadForm({...leadForm, email: e.target.value})} className="w-full border p-2 bg-white rounded outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Phone</label>
                    <input type="text" value={leadForm.phone} onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})} className="w-full border p-2 bg-white rounded outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Business Company Name</label>
                    <input type="text" value={leadForm.business_name} onChange={(e) => setLeadForm({...leadForm, business_name: e.target.value})} className="w-full border p-2 bg-white rounded outline-none" />
                  </div>
                </div>
                <div className="text-xs space-y-2">
                  <label className="font-bold text-slate-500">Inquiry notes / initial requirements</label>
                  <textarea value={leadForm.notes} onChange={(e) => setLeadForm({...leadForm, notes: e.target.value})} className="w-full border p-2 bg-white rounded outline-none" rows={3} />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowAddLead(false)} className="px-3 py-1.5 border hover:bg-slate-100 rounded text-xs font-bold">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white hover:bg-opacity-95 rounded text-xs font-bold">Add to CRM Log</button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAFBFD] uppercase text-slate-400 font-mono font-bold">
                  <tr>
                    <th className="p-3">DATE</th>
                    <th className="p-3">LEAD PROFILE</th>
                    <th className="p-3">SOURCE TRACKING</th>
                    <th className="p-3">STATUS FEED</th>
                    <th className="p-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.email.toLowerCase().includes(searchTerm.toLowerCase())).map(lead => (
                    <tr key={lead.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-400 font-mono">{lead.date}</td>
                      <td className="p-3 space-y-0.5">
                        <p className="font-bold text-slate-800">{lead.name}</p>
                        <p className="text-[10px] text-slate-400">{lead.email}</p>
                        {lead.business_name && <p className="text-[10px] uppercase font-bold text-slate-500 font-mono">BIZ: {lead.business_name}</p>}
                      </td>
                      <td className="p-3 font-mono">
                        <span className="text-[10px] bg-blue-50 text-[#0A66FF] border border-blue-100 px-2 py-0.5 rounded-full font-bold">
                          {lead.source}
                        </span>
                      </td>
                      <td className="p-3">
                        <select 
                          value={lead.status}
                          onChange={async (e) => {
                            await onEditLead({ id: lead.id, status: e.target.value as any });
                          }}
                          className={`border outline-none rounded p-1 text-[10px] font-bold ${
                            lead.status === "Converted" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                            lead.status === "Lost" ? "bg-rose-50 text-rose-800 border-rose-200" :
                            "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          <option>New</option>
                          <option>Contacted</option>
                          <option>In Negotiation</option>
                          <option>Converted</option>
                          <option>Lost</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <div className="space-y-1 max-h-[80px] overflow-y-auto text-[10px] text-slate-500">
                          {lead.notes.map((n, i) => <p key={i} className="line-clamp-1 italic">"{n}"</p>)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. CLIENT DIRECTORY */}
        {activeSideTab === "clients" && (
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm space-y-4 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search client index..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-slate-200 outline-none rounded pl-9 pr-3 py-2 text-xs"
                />
              </div>
              <button 
                onClick={() => setShowAddClient(true)}
                className="px-3 py-2 bg-[#0A66FF] hover:bg-opacity-95 text-white text-xs font-bold rounded flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Client Profile
              </button>
            </div>

            {showAddClient && (
              <form onSubmit={handleClientSubmit} className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b pb-2">Create New Client Account record</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Account Owner Name *</label>
                    <input type="text" required value={clientForm.name} onChange={(e) => setClientForm({...clientForm, name: e.target.value})} className="w-full border p-2 bg-white rounded outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Corporate Email *</label>
                    <input type="email" required value={clientForm.email} onChange={(e) => setClientForm({...clientForm, email: e.target.value})} className="w-full border p-2 bg-white rounded outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Direct Telephone No</label>
                    <input type="text" value={clientForm.phone} onChange={(e) => setClientForm({...clientForm, phone: e.target.value})} className="w-full border p-2 bg-white rounded outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Business Brand Name *</label>
                    <input type="text" required value={clientForm.business_name} onChange={(e) => setClientForm({...clientForm, business_name: e.target.value})} className="w-full border p-2 bg-white rounded outline-none" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowAddClient(false)} className="px-3 py-1.5 border hover:bg-slate-100 rounded text-xs font-bold">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white hover:bg-opacity-95 rounded text-xs font-bold">Install Client Account</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.business_name.toLowerCase().includes(searchTerm.toLowerCase())).map(client => (
                <div key={client.id} className="border border-slate-100 rounded-xl p-5 bg-white shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-mono">ID: {client.id}</span>
                      <h4 className="text-sm font-extrabold text-slate-900">{client.business_name}</h4>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                      {client.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 space-y-1 border-t pt-3">
                    <p>👨 Account Rep: <strong className="text-slate-700">{client.name}</strong></p>
                    <p>📧 Email: <strong className="text-slate-700 font-mono">{client.email}</strong></p>
                    <p>📞 Phone: <strong className="text-slate-700 font-mono">{client.phone}</strong></p>
                    <p>📅 Joined: <strong className="text-slate-700 font-mono">{client.joined_date}</strong></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. PROJECTS MANAGER */}
        {activeSideTab === "projects" && (
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm space-y-4 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Current Production Projects</h3>
              <button 
                onClick={() => setShowAddProject(true)}
                className="px-3 py-2 bg-[#0A66FF] hover:bg-opacity-95 text-white text-xs font-bold rounded flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Start Delivery Project
              </button>
            </div>

            {showAddProject && (
              <form onSubmit={handleProjectSubmit} className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b pb-2">Start Production Project Contract</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Link Client Record *</label>
                    <select value={projectForm.client_id} onChange={(e) => setProjectForm({...projectForm, client_id: e.target.value})} className="w-full border p-2 bg-white rounded outline-none h-[38px]">
                      {clients.map(c => <option key={c.id} value={c.id}>{c.business_name} ({c.name})</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Project Reference Name *</label>
                    <input type="text" required value={projectForm.name} onChange={(e) => setProjectForm({...projectForm, name: e.target.value})} className="w-full border p-2 bg-white rounded outline-none" placeholder="E-Commerce Expansion" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Contract Deadline *</label>
                    <input type="date" required value={projectForm.deadline} onChange={(e) => setProjectForm({...projectForm, deadline: e.target.value})} className="w-full border p-2 bg-white rounded outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Total Contract Budget (USD) *</label>
                    <input type="number" required value={projectForm.total_budget} onChange={(e) => setProjectForm({...projectForm, total_budget: Number(e.target.value)})} className="w-full border p-2 bg-white rounded outline-none" />
                  </div>
                </div>
                <div className="text-xs space-y-2">
                  <label className="font-bold text-slate-500">Scope detail overview</label>
                  <textarea value={projectForm.description} onChange={(e) => setProjectForm({...projectForm, description: e.target.value})} className="w-full border p-2 bg-white rounded outline-none" rows={3} />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowAddProject(false)} className="px-3 py-1.5 border hover:bg-slate-100 rounded text-xs font-bold">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white hover:bg-opacity-95 rounded text-xs font-bold">Launch Project</button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {projects.map(proj => (
                <div key={proj.id} className="border border-slate-100 rounded-xl p-5 bg-white shadow-sm space-y-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="space-y-1 grow max-w-lg">
                    <span className="text-[9px] bg-blue-50 text-blue-600 font-mono font-bold px-2 py-0.5 rounded">ID: {proj.id} | CLIENT: {proj.client_name}</span>
                    <h4 className="text-sm font-bold text-slate-900">{proj.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{proj.description}</p>
                    <div className="flex gap-4 text-[10px] text-slate-400 font-bold font-mono">
                      <span>📆 Due: {proj.deadline}</span>
                      <span>💰 Value: ${proj.total_budget}</span>
                    </div>
                  </div>
                  
                  {/* Progress panel slider */}
                  <div className="space-y-1 w-full sm:w-48 shrink-0">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-500">Delivery Status</span>
                      <span className="font-bold font-mono">{proj.progress}%</span>
                    </div>
                    <input 
                      type="range" 
                      min={0} 
                      max={100} 
                      value={proj.progress}
                      onChange={async(e) => {
                        await onEditProject({ id: proj.id, progress: Number(e.target.value) });
                      }}
                      className="w-full accent-[#0A66FF] cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. INVOICES */}
        {activeSideTab === "invoices" && (
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm space-y-4 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Receivables Ledgers</h3>
              </div>
              <button 
                onClick={() => setShowAddInvoice(true)}
                className="px-3 py-2 bg-blue-600 text-white hover:bg-opacity-95 text-xs font-bold rounded flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Issue Invoice
              </button>
            </div>

            {showAddInvoice && (
              <form onSubmit={handleInvoiceCreate} className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b pb-2">Issue New Invoice Receipt</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Client Record *</label>
                    <select value={newInvClientId} onChange={(e) => setNewInvClientId(e.target.value)} className="w-full border p-2 bg-white rounded outline-none h-[38px]">
                      {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Invoice Amount Subtotal (USD) *</label>
                    <input type="number" required value={newInvSubtotal} onChange={(e) => setNewInvSubtotal(Number(e.target.value))} className="w-full border p-2 bg-white rounded outline-none" />
                  </div>
                </div>
                <div className="text-xs space-y-2">
                  <label className="font-bold text-slate-500">Itemized line description *</label>
                  <input type="text" required value={newInvDesc} onChange={(e) => setNewInvDesc(e.target.value)} className="w-full border p-2 bg-white rounded outline-none" />
                </div>
                <div className="bg-slate-100 p-3 rounded text-[10px] text-slate-500 flex justify-between">
                  <span>Standard CGST/SGST Setup: <strong>18% flat added</strong></span>
                  <span>Calculated aggregate bill: <strong>${(newInvSubtotal * 1.18).toFixed(2)}</strong></span>
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowAddInvoice(false)} className="px-3 py-1.5 border hover:bg-slate-100 rounded text-xs font-bold">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white hover:bg-opacity-95 rounded text-xs font-bold">Issue Ledger Invoice</button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAFBFD] uppercase text-slate-400 font-mono font-bold">
                  <tr>
                    <th className="p-3">INVOICE</th>
                    <th className="p-3">CLIENT</th>
                    <th className="p-3">DATE ISSUED</th>
                    <th className="p-3">SUBTOTAL</th>
                    <th className="p-3">TOTAL TAX</th>
                    <th className="p-3">STATUS</th>
                    <th className="p-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map(inv => (
                    <tr key={inv.id}>
                      <td className="p-3 space-y-0.5">
                        <span className="font-mono font-bold text-slate-800">{inv.invoice_number}</span>
                        <p className="text-[10px] text-slate-400">ID: {inv.id}</p>
                      </td>
                      <td className="p-3 font-bold text-slate-700">{inv.client_name}</td>
                      <td className="p-3 text-slate-500 font-mono">{inv.issue_date}</td>
                      <td className="p-3 text-slate-600 font-mono">${inv.subtotal}</td>
                      <td className="p-3 font-bold text-slate-900 font-mono">${inv.total}</td>
                      <td className="p-3">
                        <select 
                          value={inv.status}
                          onChange={async(e) => {
                            await onUpdateInvoiceStatus(inv.id, e.target.value as any);
                          }}
                          className={`border p-1 outline-none text-[10px] font-bold rounded ${
                            inv.status === "Paid" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-[#001B5E] border-rose-200"
                          }`}
                        >
                          <option>Paid</option>
                          <option>Unpaid</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button onClick={() => window.print()} className="px-2 py-1 bg-slate-50 hover:bg-slate-100 rounded text-[10px] font-bold border">
                          Print Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. PORTFOLIO MANAGER */}
        {activeSideTab === "portfolio" && (
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm space-y-4 p-6">
            <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-100 rounded">
              <span className="text-xs font-bold text-slate-700">Showcase Management</span>
              <button onClick={() => setShowAddPortfolio(true)} className="px-3 py-1.5 bg-[#0a66ff] text-white text-xs font-bold rounded">
                + Add Work Project
              </button>
            </div>

            {showAddPortfolio && (
              <form onSubmit={handlePortfolioAdd} className="bg-slate-50 border p-4 space-y-4 rounded text-xs font-medium">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold">Project Title *</label>
                    <input type="text" required value={newPortTitle} onChange={(e) => setNewPortTitle(e.target.value)} className="w-full bg-white border p-2 rounded outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold">Category *</label>
                    <select value={newPortCategory} onChange={(e) => setNewPortCategory(e.target.value as any)} className="w-full bg-white border p-2 rounded outline-none h-[38px]">
                      <option>Web Design</option>
                      <option>Web Development</option>
                      <option>E-Commerce</option>
                      <option>WordPress</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold">Client Name *</label>
                  <input type="text" required value={newPortClient} onChange={(e) => setNewPortClient(e.target.value)} className="w-full bg-white border p-2 rounded outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold">Tech Stack (comma separated) *</label>
                  <input type="text" value={newPortTech} onChange={(e) => setNewPortTech(e.target.value)} className="w-full bg-white border p-2 rounded outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold">Description *</label>
                  <textarea required value={newPortDesc} onChange={(e) => setNewPortDesc(e.target.value)} className="w-full bg-white border p-2 rounded outline-none" rows={3} />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowAddPortfolio(false)} className="px-3 py-1 border rounded font-bold">Cancel</button>
                  <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded font-bold">Add Project</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.map(item => (
                <div key={item.id} className="border p-4 rounded flex bg-slate-50 gap-4">
                  <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded shadow-sm" />
                  <div className="space-y-1 text-xs">
                    <h4 className="font-bold text-slate-800 leading-tight">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Category: {item.category}</p>
                    <p className="text-[11px] text-slate-600 line-clamp-2">"{item.description}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. TESTIMONIALS MANAGER */}
        {activeSideTab === "testimonials" && (
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm space-y-4 p-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Approve Customer Testimonials</h3>
            <div className="space-y-4">
              {testimonials.map(item => (
                <div key={item.id} className="border border-slate-100 p-4 rounded-xl flex justify-between items-start text-xs bg-slate-50 gap-4">
                  <div className="space-y-2 max-w-xl">
                    <p className="font-bold text-slate-800">{item.name} <span className="text-slate-400 font-normal">({item.role}, {item.company})</span></p>
                    <p className="italic text-slate-600">"{item.feedback}"</p>
                    <div className="text-amber-500 font-mono font-bold">{"★".repeat(item.rating)}</div>
                  </div>
                  <button 
                    onClick={async () => {
                      await onApproveTestimonial(item.id, !item.approved);
                    }}
                    className={`px-3 py-1.5 font-bold rounded select-none ${
                      item.approved 
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                        : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                    }`}
                  >
                    {item.approved ? "Approved" : "Pending Approval"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. SMTP & SYSTEM SETTINGS */}
        {activeSideTab === "settings" && (
          <form onSubmit={handleSaveSettingsSubmit} className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 border-l-4 border-blue-500 pl-2 uppercase tracking-wide">Agency Branding Settings</h3>
              <p className="text-xs text-slate-400">Lock general identity parameters in system relational setting tables.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Corporate Company Name</label>
                <input type="text" value={settingsForm.company_name} onChange={(e) => setSettingsForm({...settingsForm, company_name: e.target.value})} className="w-full border p-2 rounded outline-none" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Official Web Phone helpline</label>
                <input type="text" value={settingsForm.phone} onChange={(e) => setSettingsForm({...settingsForm, phone: e.target.value})} className="w-full border p-2 rounded outline-none" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Corporate Contact Email</label>
                <input type="email" value={settingsForm.email} onChange={(e) => setSettingsForm({...settingsForm, email: e.target.value})} className="w-full border p-2 rounded outline-none" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Official website url</label>
                <input type="text" value={settingsForm.website} onChange={(e) => setSettingsForm({...settingsForm, website: e.target.value})} className="w-full border p-2 rounded outline-none" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 border-l-4 border-slate-400 pl-2 uppercase tracking-wide">SMTP Email settings</h3>
              <p className="text-xs text-slate-400">SMTP Host credentials utilized to emit PDF proposals automatically from the PHP server.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">SMTP Host name</label>
                <input type="text" value={settingsForm.smtp_host} onChange={(e) => setSettingsForm({...settingsForm, smtp_host: e.target.value})} className="w-full border p-2 rounded outline-none" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500">SMTP Server Port</label>
                <input type="number" value={settingsForm.smtp_port} onChange={(e) => setSettingsForm({...settingsForm, smtp_port: Number(e.target.value)})} className="w-full border p-2 rounded outline-none" />
              </div>
              <div className="space-y-1 font-mono">
                <label className="font-bold text-slate-500 font-sans">SMTP User credential</label>
                <input type="text" value={settingsForm.smtp_user} onChange={(e) => setSettingsForm({...settingsForm, smtp_user: e.target.value})} className="w-full border p-2 rounded outline-none" />
              </div>
            </div>
            
            <button type="submit" className="px-4 py-2 bg-[#0A66FF] text-white hover:bg-[#001B5E] text-xs font-bold rounded transition">
              Save Parameters
            </button>
          </form>
        )}

        {/* 9. PHP CODE EXPORTER */}
        {activeSideTab === "exporter" && (
          <div className="bg-slate-950 text-white rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[600px] border border-slate-800">
            {/* Sidebar list */}
            <div className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
              <div className="p-4 border-b border-slate-800">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest font-mono">Source Files Directory</h4>
              </div>
              <div className="divide-y divide-slate-800/40 overflow-y-auto grow scrollbar-none">
                {PHP_EXPORT_FILES.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`w-full text-left p-3 text-xs flex flex-col gap-1 select-none transition ${
                      selectedFileIndex === idx 
                        ? "bg-slate-800 text-[#4DA3FF]" 
                        : "text-slate-400 hover:bg-slate-800/40 hover:text-white"
                    }`}
                  >
                    <span className="font-bold truncate">{file.name}</span>
                    <span className="font-mono text-[9.5px] text-slate-500 truncate">{file.path}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Code viewer workspace */}
            <div className="grow flex flex-col min-w-0">
              <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex justify-between items-center h-[56px] shrink-0">
                <div className="truncate min-w-0 pr-4">
                  <span className="text-[10px] uppercase font-mono font-bold text-blue-400 shrink-0">PATH: {PHP_EXPORT_FILES[selectedFileIndex].path}</span>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{PHP_EXPORT_FILES[selectedFileIndex].description}</p>
                </div>
                <button
                  onClick={() => handleCopyCode(selectedFileIndex, PHP_EXPORT_FILES[selectedFileIndex].content)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 hover:text-[#4DA3FF] text-[10px] font-bold rounded flex items-center gap-1.5 shrink-0 transition"
                >
                  {copiedFileIndex === selectedFileIndex ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>

              {/* Code display screen */}
              <div className="grow overflow-auto p-5 font-mono text-xs bg-slate-950/80 leading-relaxed text-slate-300">
                <pre className="select-text whitespace-pre overflow-x-auto selection:bg-blue-600/30 selection:text-white pb-12">
                  <code>{PHP_EXPORT_FILES[selectedFileIndex].content}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* 10. CLIENT SUPPORT CHATS TAB */}
        {activeSideTab === "chat" && (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 border-l-4 border-blue-600 pl-2">Client Support Messaging System</h3>
                <p className="text-xs text-slate-400 mt-1">View and respond to secure private support feeds from active clients in real time.</p>
              </div>
              <div className="flex items-center gap-2 text-xs bg-blue-50 text-blue-800 font-mono font-bold px-2.5 py-1 rounded-full border border-blue-105">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                LIVE SUPPORT STATUS
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[500px]">
              {/* Clients thread selection */}
              <div className="border border-slate-150 rounded-xl overflow-hidden flex flex-col bg-slate-50/20 shadow-inner">
                <div className="p-3 bg-slate-100/60 border-b border-slate-100 font-mono text-[10px] uppercase font-bold text-slate-405">Direct Threads</div>
                <div className="divide-y divide-slate-100 overflow-y-auto grow">
                  {clients.map(c => {
                    const clientMsgs = chatMessages.filter(m => m.client_id === c.id);
                    const lastMsg = clientMsgs[clientMsgs.length - 1];

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setAdminChatClientId(c.id)}
                        className={`w-full text-left p-3 text-xs transition flex flex-col gap-1 outline-none ${
                          adminChatClientId === c.id 
                            ? "bg-blue-50/65 text-blue-900 border-l-4 border-blue-500" 
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span className="font-bold truncate text-slate-800">{c.business_name || c.name}</span>
                        {lastMsg ? (
                          <span className="text-[10px] text-slate-400 truncate font-medium">
                            {lastMsg.sender === "developer" ? "You: " : ""}{lastMsg.message}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-350 italic font-medium">No messages yet</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chat thread console */}
              <div className="md:col-span-3 border border-slate-150 rounded-xl overflow-hidden flex flex-col h-full bg-slate-50/10 shadow-inner">
                {(() => {
                  const targetClient = clients.find(c => c.id === adminChatClientId) || clients[0];
                  const threadMessages = chatMessages.filter(m => m.client_id === adminChatClientId);

                  return (
                    <>
                      <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-800">{targetClient?.name || "Target Client"}</span>
                          <p className="text-[10px] font-mono text-slate-400 font-bold uppercase">{targetClient?.business_name || "Enterprise account"}</p>
                        </div>
                        <span className="text-[9px] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-mono text-blue-600 font-semibold uppercase">Channel Active</span>
                      </div>

                      {/* Messages grid */}
                      <div className="grow overflow-y-auto p-4 space-y-3 font-sans text-xs flex flex-col">
                        {threadMessages.length === 0 ? (
                          <div className="h-full grow flex flex-col items-center justify-center text-center text-slate-430 p-8 space-y-1">
                            <span className="text-3xl">💬</span>
                            <p className="font-bold text-slate-500 text-[11px]">No active communication history.</p>
                            <p className="text-[10px] text-slate-400 font-sans">Send an initial welcoming greeting to the client above.</p>
                          </div>
                        ) : (
                          threadMessages.map(msg => {
                            const isDev = msg.sender === "developer";
                            return (
                              <div key={msg.id} className={`flex flex-col max-w-[80%] ${isDev ? "ml-auto items-end" : "mr-auto items-start"}`}>
                                <span className="text-[9px] text-slate-400 font-mono mb-0.5 px-1 font-semibold">
                                  {isDev ? "You (Developer Rep)" : "Client Representative"} &bull; {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                                <div className={`p-3 rounded-2xl leading-relaxed text-[11px] shadow-sm select-text ${
                                  isDev 
                                    ? "bg-[#0A66FF] text-white rounded-tr-none" 
                                    : "bg-white text-slate-800 rounded-tl-none border border-slate-200 animate-fade-in"
                                }`}>
                                  {msg.message}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Send bar */}
                      <form 
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!adminChatMessageText.trim()) return;
                          const text = adminChatMessageText.trim();
                          setAdminChatMessageText("");
                          await onSendChatMessage(adminChatClientId, "developer", text);
                        }}
                        className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0 animate-fade-in"
                      >
                        <input
                          type="text"
                          value={adminChatMessageText}
                          onChange={(e) => setAdminChatMessageText(e.target.value)}
                          placeholder={`Type direct response to ${targetClient?.name || "client"}...`}
                          className="grow border border-slate-200 focus:border-[#0A66FF] text-xs px-3 py-2 rounded-xl outline-none"
                        />
                        <button type="submit" className="px-5 py-2 bg-[#001B5E] hover:bg-[#0A66FF] text-white text-xs font-black rounded-xl transition shadow-md cursor-pointer select-none">
                          Reply Message
                        </button>
                      </form>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* 11. DOCUMENTS VAULT TAB */}
        {activeSideTab === "documents" && (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-l-4 border-[#0A66FF] pl-2">Agency Global Document Vault</h3>
            <p className="text-xs text-slate-500">Monitor all files uploaded by clients, download deliverables, or permanently purge files from storage server.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAFBFD] text-slate-400 uppercase font-mono font-bold border-b border-slate-100">
                  <tr>
                    <th className="p-3">FILE NAME</th>
                    <th className="p-3">CLIENT ACCOUNT</th>
                    <th className="p-3">SIZE</th>
                    <th className="p-3">UPLOAD DATE</th>
                    <th className="p-3">ENCRYPTION ENGINE</th>
                    <th className="p-3 text-right">OPERATIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">No project files uploaded to the server lockbox.</td>
                    </tr>
                  ) : (
                    documents.map(doc => {
                      const associatedClient = clients.find(c => c.id === doc.client_id);
                      return (
                        <tr key={doc.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-800 flex items-center gap-2">
                            <span className="text-blue-500 font-sans">📄</span>
                            <span className="truncate max-w-[200px]" title={doc.name}>{doc.name}</span>
                          </td>
                          <td className="p-3 text-slate-650 font-bold">{associatedClient?.business_name || associatedClient?.name || "General Lockbox"}</td>
                          <td className="p-3 font-mono font-medium text-slate-500">{doc.size}</td>
                          <td className="p-3 font-mono text-slate-400">{doc.uploaded_at}</td>
                          <td className="p-3 text-slate-400">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9.5px] bg-indigo-50 text-indigo-700 font-mono font-bold border border-indigo-100 tracking-tight">
                              AES-256 HMAC
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if (doc.dataUrl) {
                                    const link = document.createElement("a");
                                    link.href = doc.dataUrl;
                                    link.download = doc.name;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  } else {
                                    // Simulated download fallback
                                    const simulatedText = `Content stream for ${doc.name}\nGenerated on WebNest Cloud Storage Security Server.`;
                                    const blob = new Blob([simulatedText], { type: "text/plain" });
                                    const url = URL.createObjectURL(blob);
                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.download = doc.name;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    URL.revokeObjectURL(url);
                                  }
                                }}
                                className="px-2.5 py-1 bg-[#0A66FF] text-white text-[10px] font-bold rounded hover:bg-[#001B5E] transition cursor-pointer font-sans"
                              >
                                Download
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  if (confirm(`Purge document "${doc.name}" permanently from server memory?`)) {
                                    await onDeleteDocument(doc.id);
                                  }
                                }}
                                className="px-2.5 py-1 text-rose-500 hover:bg-rose-55 border border-transparent hover:border-rose-100 rounded cursor-pointer font-bold text-[10px] font-sans"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
