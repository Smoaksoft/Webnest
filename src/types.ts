export interface PortfolioProject {
  id: string;
  title: string;
  category: "Web Design" | "Web Development" | "E-Commerce" | "SEO" | "WordPress";
  image_url: string;
  description: string;
  client_name: string;
  tech_stack: string[];
  completion_date: string;
  seo_title?: string;
  seo_description?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  rating: number;
  feedback: string;
  approved: boolean;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  website?: string;
  business_name?: string;
  status: "New" | "Contacted" | "In Negotiation" | "Converted" | "Lost";
  source: "Website Form" | "Audit Tool" | "Quote Generator" | "Direct Inquiry";
  notes: string[];
  date: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  business_name: string;
  joined_date: string;
  address?: string;
  status: "Active" | "Archived";
}

export interface Project {
  id: string;
  client_id: string;
  client_name: string;
  name: string;
  description: string;
  progress: number; // 0 to 100
  status: "Planning" | "In Progress" | "In Review" | "Completed";
  deadline: string;
  total_budget: number;
  milestones: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export interface Task {
  id: string;
  project_id: string;
  name: string;
  status: "Pending" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  deadline: string;
}

export interface Quotation {
  id: string;
  client_name: string;
  email: string;
  phone: string;
  website_type: string;
  pages: number;
  ecommerce: boolean;
  features: string[];
  estimated_cost: number;
  status: "Pending" | "Presented" | "Accepted" | "Expired";
  date: string;
  items: { description: string; cost: number }[];
}

export interface Proposal {
  id: string;
  client_id: string;
  client_name: string;
  title: string;
  overview: string;
  scope: string[];
  timeline: string;
  cost: number;
  status: "Draft" | "Sent" | "Approved" | "Declined";
  date: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  project_id?: string;
  project_name?: string;
  client_id: string;
  client_name: string;
  client_email: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number; // e.g. 18 for 18%
  discount: number; // USD amount
  total: number;
  status: "Paid" | "Unpaid" | "Overdue";
  items: { description: string; quantity: number; unit_price: number }[];
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  business_name?: string;
  message: string;
  status: "Unread" | "Read";
  date: string;
}

export interface AuditReport {
  id: string;
  url: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  score: number; // 0 - 100
  categories: {
    performance: number;
    seo: number;
    mobile: number;
    security: number;
  };
  recommendations: {
    category: string;
    issue: string;
    severity: "High" | "Medium" | "Low";
    fix: string;
  }[];
}

export interface AgencySettings {
  company_name: string;
  tagline: string;
  website: string;
  phone: string;
  email: string;
  brand_primary: string;
  brand_secondary: string;
  brand_accent: string;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_pass: string;
  social_facebook?: string;
  social_twitter?: string;
  social_linkedin?: string;
  social_instagram?: string;
}

export interface ProjectDocument {
  id: string;
  project_id: string;
  client_id: string;
  name: string;
  size: string;
  uploaded_at: string;
  dataUrl?: string;
}

export interface ChatMessage {
  id: string;
  client_id: string;
  sender: "client" | "developer";
  message: string;
  timestamp: string;
}
