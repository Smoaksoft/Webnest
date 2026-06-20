import React, { useState, useRef, useEffect } from "react";
import { 
  FolderLock, CheckSquare, FileText, Upload, Headphones, Power, Check, 
  Clock, DollarSign, ArrowRight, CornerDownRight, CheckSquare2, FileSignature,
  FileCode, FileSpreadsheet, FileArchive, Trash2, Download, Send, RefreshCw, AlertCircle
} from "lucide-react";
import { Client, Project, Invoice, Quotation, AgencySettings, ProjectDocument, ChatMessage } from "../types";

interface ClientDashboardProps {
  settings: AgencySettings;
  clients: Client[];
  projects: Project[];
  invoices: Invoice[];
  quotations: Quotation[];
  documents: ProjectDocument[];
  chatMessages: ChatMessage[];
  onPayInvoice: (invoiceId: string) => Promise<boolean>;
  onAddMessage: (msg: string) => void;
  onToggleMilestone: (projectId: string, milestoneId: string, completed: boolean) => Promise<boolean>;
  onUploadDocument: (projectId: string, clientId: string, name: string, size: string, dataUrl: string) => Promise<boolean>;
  onDeleteDocument: (id: string) => Promise<boolean>;
  onSendChatMessage: (clientId: string, sender: "client" | "developer", message: string) => Promise<boolean>;
}

export default function ClientDashboard({
  settings,
  clients,
  projects,
  invoices,
  quotations,
  documents,
  chatMessages,
  onPayInvoice,
  onAddMessage,
  onToggleMilestone,
  onUploadDocument,
  onDeleteDocument,
  onSendChatMessage
}: ClientDashboardProps) {
  // Active Client experience simulator
  const [activeClientId, setActiveClientId] = useState<string>(clients[0]?.id || "client_truinvest");
  const [isDragging, setIsDragging] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  // Ref for chat auto-scroll
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeClient = clients.find(c => c.id === activeClientId) || clients[0];
  
  // Filter core client models based on simulator selection
  const clientProjects = projects.filter(p => p.client_id === activeClientId);
  const clientInvoices = invoices.filter(inv => inv.client_id === activeClientId);
  const clientQuotations = quotations.filter(q => q.email === activeClient?.email);
  const clientDocs = documents.filter(doc => doc.client_id === activeClientId);
  const clientMessages = chatMessages.filter(msg => msg.client_id === activeClientId);

  // Auto scroll to chat bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [clientMessages]);

  const handlePayInvoiceSimulate = async (invId: string) => {
    const ok = await onPayInvoice(invId);
    if (ok) {
      alert("Payment Captured Successfully (Simulated)! Invoice marked as PAID and client ledger balances updated.");
    }
  };

  // Convert File to Base64 dataUrl and trigger upload
  const processUploadedFile = (file: File) => {
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const dataUrl = e.target?.result as string;
        const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + " MB";
        
        // Use active project ID if available
        const defaultProjectId = clientProjects[0]?.id || "proj_general";
        
        const ok = await onUploadDocument(
          defaultProjectId,
          activeClientId,
          file.name,
          sizeStr,
          dataUrl
        );
        
        if (ok) {
          onAddMessage(`[SYSTEM LOG] User "${activeClient?.name}" uploaded secure document: "${file.name}"`);
        }
      } catch (err) {
        console.error("Document upload failed:", err);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleDownloadFile = (doc: ProjectDocument) => {
    if (doc.dataUrl) {
      const link = document.createElement("a");
      link.href = doc.dataUrl;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Fallback fallback generator for mock start documents
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
  };

  const handleMilestoneClick = async (projectId: string, milestoneId: string, completed: boolean) => {
    await onToggleMilestone(projectId, milestoneId, completed);
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    
    const messageText = supportMessage.trim();
    setSupportMessage("");
    
    const ok = await onSendChatMessage(activeClientId, "client", messageText);
    if (ok) {
      // Also write down CRM status notification
      onAddMessage(`[SUPPORT CHAT MESSAGE] ${activeClient?.name}: "${messageText}"`);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return <FileText className="w-5 h-5 text-rose-500" />;
    if (["xlsx", "xls", "csv"].includes(ext || "")) return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
    if (["zip", "rar", "7z"].includes(ext || "")) return <FileArchive className="w-5 h-5 text-amber-500" />;
    if (["html", "css", "js", "ts", "php", "json"].includes(ext || "")) return <FileCode className="w-5 h-5 text-indigo-500" />;
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10" id="client-dashboard-root">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Toggler Bar for switching active test client */}
        <div id="experience-simulator-header" className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-500 tracking-wider">CLIENT EXPERIENCE SIMULATOR PROFILE:</span>
          </div>
          <div id="simulator-toggle-buttons" className="flex space-x-2">
            {clients.map(c => (
              <button
                key={c.id}
                id={`sim-client-btn-${c.id}`}
                onClick={() => setActiveClientId(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeClientId === c.id 
                    ? "bg-[#0A66FF] text-white shadow-md shadow-blue-500/10" 
                    : "bg-slate-50 text-slate-705 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                {c.business_name || c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Client Welcome header */}
        <div id="welcome-header-section" className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#001B5E]">Welcome back, {activeClient?.name || "Corporate Partner"}!</h2>
            <p className="text-xs text-slate-500 font-medium font-mono">
              Business Account: <span className="text-slate-800 font-bold">{activeClient?.business_name || "Enterprise Account"}</span> | Joined {activeClient?.joined_date || "N/A"}
            </p>
          </div>
          <div className="p-2 border border-blue-100 bg-blue-50 rounded-lg text-xs flex items-center gap-2 shrink-0">
            <FolderLock className="w-4 h-4 text-[#0A66FF]" />
            <span className="font-mono text-blue-800 font-bold tracking-tight">Secure Socket Gateway: ACTIVE</span>
          </div>
        </div>

        {/* Grid metrics */}
        <div id="metrics-grid" className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div id="metric-active-projects" className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">My Active Projects</span>
            <div className="text-3xl font-black text-slate-800">{clientProjects.length}</div>
            <p className="text-[10px] text-slate-400">Contracts under delivery</p>
          </div>
          <div id="metric-unpaid-invoices" className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Unpaid Invoices</span>
            <div className="text-3xl font-black text-rose-500">
              {clientInvoices.filter(inv => inv.status !== "Paid").length}
            </div>
            <p className="text-[10px] text-slate-400">Awaiting bank receipts</p>
          </div>
          <div id="metric-documents" className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Secure Lockbox files</span>
            <div className="text-3xl font-black text-indigo-500">{clientDocs.length}</div>
            <p className="text-[10px] text-slate-400">Project specifications</p>
          </div>
          <div id="metric-available-quotations" className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Saved Quotations</span>
            <div className="text-3xl font-black text-[#0A66FF]">{clientQuotations.length}</div>
            <p className="text-[10px] text-slate-400">Interactive drafts archived</p>
          </div>
        </div>

        {/* Projects and Milestones section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            
            {/* Active Project Tracking */}
            <div id="project-tracking-container" className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-6">
              <h3 className="text-base font-bold text-slate-900 border-l-4 border-[#0A66FF] pl-2 flex items-center justify-between">
                <span>Active Project Development Tracking</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wide font-mono">Live Sync</span>
              </h3>
              
              {clientProjects.length === 0 ? (
                <div className="text-center py-12 border border-slate-100 rounded-xl bg-slate-50/50">
                  <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-pulse" />
                  <p className="text-xs text-slate-500">No active projects logged under this client block.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {clientProjects.map(p => {
                    const totalMilestones = p.milestones.length;
                    const completedMilestones = p.milestones.filter(m => m.completed).length;

                    return (
                      <div key={p.id} id={`project-item-${p.id}`} className="pb-8 last:border-none last:pb-0 space-y-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-slate-800">{p.name}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">{p.description}</p>
                          </div>
                          <span className={`text-[10.5px] font-bold px-2.5 py-1 rounded-full ${
                            p.status === "Completed" ? "bg-emerald-50 text-emerald-700 font-semibold" :
                            p.status === "In Review" ? "bg-amber-50 text-amber-700 font-semibold" :
                            "bg-blue-50 text-blue-700"
                          }`}>
                            {p.status}
                          </span>
                        </div>
                        
                        {/* Budget and deadline indicators */}
                        <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-500 max-w-sm">
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span>Deadline: <strong className="text-slate-800">{p.deadline}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                            <DollarSign className="w-4 h-4 text-slate-400" />
                            <span>Budget: <strong className="text-slate-800">${p.total_budget}</strong></span>
                          </div>
                        </div>

                        {/* Progress bar info */}
                        <div className="space-y-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                          <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-700">Project Delivery Progression</span>
                              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                                {completedMilestones} of {totalMilestones} met
                              </span>
                            </div>
                            <span className="font-mono text-blue-600 font-black">{p.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#0A66FF] h-full transition-all duration-500" style={{ width: `${p.progress}%` }}></div>
                          </div>
                        </div>

                        {/* Interactive Milestone Check List */}
                        <div className="space-y-3">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Milestone Checklist & Roadmap (Toggle to test)</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {p.milestones.map((ms) => (
                              <button
                                key={ms.id}
                                onClick={() => handleMilestoneClick(p.id, ms.id, !ms.completed)}
                                className={`flex items-start text-left p-3 rounded-xl border transition group outline-none ${
                                  ms.completed 
                                    ? "bg-emerald-50/40 border-emerald-100 hover:bg-emerald-50/70 text-slate-700 font-sans" 
                                    : "bg-white border-slate-150 hover:border-blue-300 text-slate-600 hover:bg-slate-50/40 font-sans"
                                }`}
                              >
                                <div className="mt-0.5 shrink-0 mr-3">
                                  {ms.completed ? (
                                    <CheckSquare className="w-4.5 h-4.5 text-emerald-500 fill-emerald-100" />
                                  ) : (
                                    <div className="w-4.5 h-4.5 rounded border border-slate-300 group-hover:border-blue-500 transition-colors" />
                                  )}
                                </div>
                                <div className="space-y-0.5">
                                  <p className={`text-xs font-bold leading-none ${ms.completed ? "line-through text-slate-400" : "text-slate-800"}`}>
                                    {ms.title}
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-mono">
                                    {ms.completed ? "Step achieved successfully" : "Awaiting validation"}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Invoices panel */}
            <div id="invoices-container" className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-l-4 border-emerald-500 pl-2">Invoices & Financial Receipts</h3>
              
              {clientInvoices.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No invoicing logs captured for your profile.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAFBFD] text-slate-400 uppercase font-mono font-bold border-b border-slate-100">
                      <tr>
                        <th className="p-3">INVOICE NO.</th>
                        <th className="p-3">PROJECT</th>
                        <th className="p-3">AMOUNT</th>
                        <th className="p-3">DUE DATE</th>
                        <th className="p-3">STATUS</th>
                        <th className="p-3 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {clientInvoices.map(inv => (
                        <tr key={inv.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono font-bold text-slate-800">{inv.invoice_number}</td>
                          <td className="p-3 text-slate-600 truncate max-w-[140px] font-medium">{inv.project_name || "General Scope"}</td>
                          <td className="p-3 font-bold text-slate-900 font-mono">${inv.total}</td>
                          <td className="p-3 text-slate-400 font-mono">{inv.due_date}</td>
                          <td className="p-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              inv.status === "Paid" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600 animate-pulse"
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {inv.status !== "Paid" ? (
                              <button
                                onClick={() => handlePayInvoiceSimulate(inv.id)}
                                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-lg text-[10px] shadow-sm shadow-emerald-500/10 cursor-pointer"
                              >
                                Pay Invoice
                              </button>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400">Paid Receipt</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar: Document lockbox & chat support */}
          <div className="space-y-6">
            
            {/* File Drag-and-Drop Uploader & Lockbox */}
            <div id="secure-document-vault" className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-2">Secure Document Lockbox</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Upload and securely download technical designs, client checklists, and deliverables.</p>
              
              {/* Uploader dropzone */}
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    processUploadedFile(e.dataTransfer.files[0]);
                  }
                }}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer relative ${
                  isDragging 
                    ? "border-[#0A66FF] bg-blue-50/50" 
                    : "border-slate-200 hover:border-[#0A66FF] bg-slate-50/30 hover:bg-white"
                }`}
              >
                <input 
                  type="file" 
                  onChange={handleFileUploadSimulate}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  id="uploader-mainInput" 
                />
                <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging || isUploading ? "text-[#0A66FF] animate-bounce" : "text-slate-400"}`} />
                {isUploading ? (
                  <p className="text-[11px] text-[#0A66FF] font-bold animate-pulse">Encrypting & writing to file system...</p>
                ) : (
                  <>
                    <p className="text-[11px] text-slate-700 font-bold mb-1">Drag file here, or click to choose</p>
                    <p className="text-[9px] text-slate-400">Any design or doc file up to 25MB (Encrypted)</p>
                  </>
                )}
              </div>

              {/* Uploaded files listing */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Vault Files</span>
                
                {clientDocs.length === 0 ? (
                  <p className="text-[10.5px] text-slate-400 text-center py-4 bg-slate-50/50 rounded-lg">No secure files added yet.</p>
                ) : (
                  <div className="space-y-2 max-h-[190px] overflow-y-auto scrollbar-none pr-1">
                    {clientDocs.map((f) => (
                      <div key={f.id} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] group hover:bg-slate-100 transition">
                        <div className="truncate max-w-[130px] space-y-0.5">
                          <p className="font-bold text-slate-705 truncate cursor-pointer hover:text-[#0A66FF]" onClick={() => handleDownloadFile(f)} title="Click to download">
                            {f.name}
                          </p>
                          <p className="text-[9px] text-slate-400 font-mono">Uploaded: {f.uploaded_at}</p>
                        </div>
                        <div className="flex items-center space-x-1 shrink-0">
                          <span className="text-[8.5px] text-slate-500 font-mono font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded mr-1">
                            {f.size}
                          </span>
                          <button
                            onClick={() => handleDownloadFile(f)}
                            className="p-1 text-[#0A66FF] hover:bg-white rounded border border-transparent hover:border-slate-100 shadow-sm"
                            title="Download File"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Confirm deleting document "${f.name}" permanently from secure lockbox?`)) {
                                await onDeleteDocument(f.id);
                                onAddMessage(`[SYSTEM LOG] User deleted lockbox document: "${f.name}"`);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-500 hover:bg-white rounded border border-transparent hover:border-slate-100 ml-1"
                            title="Delete permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Direct Client-Developer Chat Terminal */}
            <div id="live-chat-support-box" className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col h-[350px] space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Headphones className="w-4.5 h-4.5 text-[#0A66FF]" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-none">Security Chat Support</h3>
                    <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Developer Office Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[9px] bg-slate-105 px-2 py-0.5 rounded font-mono text-slate-500 font-black">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  LIVE FEED
                </div>
              </div>

              {/* Scrollable messages container */}
              <div className="grow overflow-y-auto space-y-3 pr-1 text-xs scrollbar-none scroll-smooth">
                {clientMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-4 space-y-1">
                    <AlertCircle className="w-5 h-5 text-slate-300" />
                    <p className="text-[10.5px]">No support tickets logged. Initiate contact below.</p>
                  </div>
                ) : (
                  clientMessages.map((msg) => {
                    const isClient = msg.sender === "client";
                    return (
                      <div 
                        key={msg.id} 
                        className={`flex flex-col max-w-[85%] ${isClient ? "ml-auto items-end" : "mr-auto items-start"}`}
                      >
                        <span className="text-[9px] text-slate-400 font-mono mb-0.5 px-1 font-semibold">
                          {isClient ? "You" : "Senior Developer Team"} &bull; {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        <div className={`p-3 rounded-2xl leading-relaxed text-[11.5px] shadow-sm ${
                          isClient 
                            ? "bg-[#0A66FF] text-white rounded-tr-none" 
                            : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Support input line */}
              <form onSubmit={handleSupportSubmit} className="flex gap-2 shrink-0 pt-2 border-t border-slate-100">
                <input 
                  type="text" 
                  value={supportMessage}
                  required
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Type support query or milestone request..."
                  className="grow border border-slate-200 focus:border-[#0A66FF] text-xs px-3 py-2 rounded-xl outline-none"
                />
                <button 
                  type="submit" 
                  className="p-2.5 bg-[#001B5E] text-white hover:bg-[#0A66FF] rounded-xl transition cursor-pointer flex items-center justify-center shrink-0 shadow-md shadow-blue-500/5"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}
