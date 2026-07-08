import { useState, useEffect, useCallback, useRef } from "react";
import {
  Building2, LayoutDashboard, FileText, CheckSquare, Users, BarChart3,
  Settings, Bell, Search, LogOut, Plus, ChevronRight, ChevronDown,
  ChevronLeft, Clock, CheckCircle2, AlertCircle, MoreHorizontal,
  MapPin, Eye, Edit2, Trash2, Archive, Phone, Mail, Calendar,
  TrendingUp, Activity, Command, Star, List, LayoutGrid, Download,
  Shield, User, Lock, RefreshCw, Circle, Zap, Target, Award,
  Upload, Check, AlertTriangle, Info, XCircle, Loader2,
  CircleCheck, TriangleAlert, Columns, Send, BellRing, X,
  ChevronUp, SlidersHorizontal, ArrowUpRight, Layers,
  MessageSquare, Sparkles, GripVertical,
  MoreVertical, Building, History,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart as RechartsLine, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis,
} from "recharts";

// ─── Constants ──────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;
const TRANSACTION_TYPES = ["Sale", "Rent", "Off-Plan"];
const PROPERTY_STATUSES = ["Available", "Reserved", "Sold", "Rented", "Inactive"];
const LISTING_STATUSES = ["Draft", "Pending Approval", "Published", "Expired", "Inactive"];
const TASK_TYPES = ["Viewing", "Document", "Negotiation", "Follow-Up", "Administrative", "Site Visit", "Contract", "Inspection"];
const TASK_STATUSES = ["Pending", "In Progress", "Completed", "Cancelled"];
const TASK_PRIORITIES = ["Low", "medium", "Medium", "High", "Urgent"];
const BRANCHES = ["Dubai Marina Office", "Downtown Dubai Office", "JBR Office", "Business Bay Office", "Head Office"];
const DISTRICTS = ["Dubai Marina", "Palm Jumeirah", "Downtown Dubai", "JBR", "Business Bay", "Arabian Ranches", "JGE", "DIFC", "Meydan", "Al Barsha"];

// ─── Types ──────────────────────────────────────────────────────────────────────

type Role = "admin" | "consultant";
type Page =
  | "login" | "forgot"
  | "admin-dashboard" | "properties" | "property-detail" | "add-property" | "edit-property"
  | "listings" | "create-listing" | "listing-detail" | "edit-listing"
  | "tasks-kanban" | "tasks-timeline" | "tasks-calendar"
  | "consultants" | "add-consultant"
  | "follow-ups" | "create-followup"
  | "reports-consultant" | "reports-property" | "reports-listing" | "reports-task"
  | "activity"
  | "settings-workspace" | "settings-users" | "settings-permissions"
  | "consultant-dashboard" | "my-properties" | "my-listings" | "my-tasks" | "my-followups"
  | "my-profile" | "my-profile-edit" | "my-profile-security" | "my-profile-notifs";

interface TaskHistoryEntry { id: string; action: string; from?: string; to?: string; note?: string; user: string; time: string; }

// ─── Mock Data ──────────────────────────────────────────────────────────────────

const CONSULTANTS = [
  { id: "C001", name: "Layla Al-Rashidi", email: "layla@zaminex.ae", phone: "+971 50 312 4422", avatar: "LA", role: "Senior Consultant", branch: "Dubai Marina Office", joined: "2022-03-14", props: 12, listings: 8, tasks: 4, revenue: 4_200_000, deals: 7, rating: 4.8, active: true, score: 92 },
  { id: "C002", name: "Omar Fahad", email: "omar@zaminex.ae", phone: "+971 55 887 3310", avatar: "OF", role: "Consultant", branch: "Business Bay Office", joined: "2023-01-09", props: 8, listings: 5, tasks: 6, revenue: 2_800_000, deals: 4, rating: 4.5, active: true, score: 78 },
  { id: "C003", name: "Sara Mansouri", email: "sara@zaminex.ae", phone: "+971 52 441 9900", avatar: "SM", role: "Senior Consultant", branch: "Head Office", joined: "2021-07-22", props: 18, listings: 14, tasks: 2, revenue: 6_100_000, deals: 11, rating: 4.9, active: true, score: 97 },
  { id: "C004", name: "Tariq Hassan", email: "tariq@zaminex.ae", phone: "+971 56 223 0087", avatar: "TH", role: "Junior Consultant", branch: "JBR Office", joined: "2024-02-18", props: 4, listings: 3, tasks: 8, revenue: 820_000, deals: 1, rating: 4.2, active: true, score: 61 },
  { id: "C005", name: "Nadia Petrov", email: "nadia@zaminex.ae", phone: "+971 50 765 4321", avatar: "NP", role: "Consultant", branch: "Downtown Dubai Office", joined: "2023-06-11", props: 7, listings: 6, tasks: 3, revenue: 1_950_000, deals: 3, rating: 4.6, active: false, score: 74 },
];

const PROPERTIES = [
  { id: "P001", internalCode: "ZX-2204-MH", title: "Marina Heights Tower B – Unit 2204", type: "Apartment", transactionType: "Sale", floor: 22, constructionYear: 2019, fullAddress: "Unit 2204, Tower B, Marina Heights, Dubai Marina, Dubai, UAE", propertyStatus: "Available", archived: false, price: 2_850_000, area: 1420, beds: 3, district: "Dubai Marina", consultant: "Layla Al-Rashidi", consultantId: "C001", date: "2024-11-12", views: 312, listed: true, roi: 7.1, gradient: "from-teal-500 to-cyan-600" },
  { id: "P002", internalCode: "ZX-6C-PJ", title: "Palm Jumeirah Villa – Signature Series", type: "Villa", transactionType: "Sale", floor: 1, constructionYear: 2021, fullAddress: "Villa 6C, Signature Villas, Palm Jumeirah, Dubai, UAE", propertyStatus: "Reserved", archived: false, price: 14_500_000, area: 6800, beds: 5, district: "Palm Jumeirah", consultant: "Omar Fahad", consultantId: "C002", date: "2024-10-28", views: 541, listed: true, roi: 5.9, gradient: "from-violet-500 to-purple-700" },
  { id: "P003", internalCode: "ZX-48F-DT", title: "Downtown Burj Views – Penthouse 48F", type: "Penthouse", transactionType: "Sale", floor: 48, constructionYear: 2018, fullAddress: "Penthouse 48F, Burj Views, Downtown Dubai, Dubai, UAE", propertyStatus: "Sold", archived: false, price: 8_200_000, area: 3200, beds: 4, district: "Downtown Dubai", consultant: "Sara Mansouri", consultantId: "C003", date: "2024-09-03", views: 890, listed: false, roi: 9.2, gradient: "from-orange-400 to-red-500" },
  { id: "P004", internalCode: "ZX-STU-JBR", title: "JBR Walk – Beachfront Studio", type: "Studio", transactionType: "Rent", floor: 8, constructionYear: 2020, fullAddress: "Studio 801, JBR Walk Residences, JBR, Dubai, UAE", propertyStatus: "Available", archived: false, price: 1_150_000, area: 510, beds: 0, district: "JBR", consultant: "Tariq Hassan", consultantId: "C004", date: "2024-12-01", views: 178, listed: true, roi: 8.1, gradient: "from-blue-500 to-indigo-600" },
  { id: "P005", internalCode: "ZX-COM-BB", title: "Business Bay – Commercial Tower Office", type: "Commercial", transactionType: "Sale", floor: 14, constructionYear: 2017, fullAddress: "Office 1403, Commercial Tower, Business Bay, Dubai, UAE", propertyStatus: "Available", archived: false, price: 4_300_000, area: 2800, beds: 0, district: "Business Bay", consultant: "Layla Al-Rashidi", consultantId: "C001", date: "2024-11-20", views: 95, listed: false, roi: 6.4, gradient: "from-emerald-500 to-teal-600" },
  { id: "P006", internalCode: "ZX-VIL-AR3", title: "Arabian Ranches III – Corner Villa", type: "Villa", transactionType: "Sale", floor: 1, constructionYear: 2023, fullAddress: "Villa 28, Cluster A, Arabian Ranches III, Dubai, UAE", propertyStatus: "Reserved", archived: false, price: 5_900_000, area: 4100, beds: 4, district: "Arabian Ranches", consultant: "Omar Fahad", consultantId: "C002", date: "2024-12-05", views: 267, listed: true, roi: 5.3, gradient: "from-amber-400 to-orange-500" },
  { id: "P007", internalCode: "ZX-TH-JGE", title: "Jumeirah Golf Estates – Luxury Townhouse", type: "Townhouse", transactionType: "Sale", floor: 1, constructionYear: 2022, fullAddress: "Townhouse 4B, Jumeirah Golf Estates, Dubai, UAE", propertyStatus: "Available", archived: false, price: 3_750_000, area: 2900, beds: 3, district: "JGE", consultant: "Nadia Petrov", consultantId: "C005", date: "2024-11-30", views: 143, listed: true, roi: 6.8, gradient: "from-pink-500 to-rose-600" },
];

const LISTINGS = [
  { id: "L001", propertyId: "P001", property: "Marina Heights Tower B – Unit 2204", channels: ["Property Finder", "Bayut"], status: "Published", publishedAt: "2024-11-15", expires: "2025-02-15", views: 1240, consultant: "Layla Al-Rashidi", consultantId: "C001", score: 86 },
  { id: "L002", propertyId: "P002", property: "Palm Jumeirah Villa – Signature Series", channels: ["Dubizzle", "Bayut", "Property Finder"], status: "Pending Approval", publishedAt: null, expires: null, views: 0, consultant: "Omar Fahad", consultantId: "C002", score: 0 },
  { id: "L003", propertyId: "P004", property: "JBR Walk – Beachfront Studio", channels: ["Bayut"], status: "Published", publishedAt: "2024-12-02", expires: "2025-03-02", views: 440, consultant: "Tariq Hassan", consultantId: "C004", score: 71 },
  { id: "L004", propertyId: "P006", property: "Arabian Ranches III – Corner Villa", channels: ["Property Finder", "Dubizzle"], status: "Published", publishedAt: "2024-12-06", expires: "2025-03-06", views: 312, consultant: "Omar Fahad", consultantId: "C002", score: 79 },
  { id: "L005", propertyId: "P007", property: "JGE – Luxury Townhouse", channels: ["Bayut"], status: "Draft", publishedAt: null, expires: null, views: 0, consultant: "Nadia Petrov", consultantId: "C005", score: 0 },
  { id: "L006", propertyId: "P003", property: "Downtown Burj Views – Penthouse 48F", channels: ["Property Finder"], status: "Expired", publishedAt: "2024-08-01", expires: "2024-11-01", views: 890, consultant: "Sara Mansouri", consultantId: "C003", score: 94 },
];

const TASK_HISTORY_MAP: Record<string, TaskHistoryEntry[]> = {
  "T001": [
    { id: "TH1", action: "Status changed", from: "Pending", to: "In Progress", user: "Layla Al-Rashidi", time: "2024-12-14 10:30" },
    { id: "TH2", action: "Note added", note: "Client confirmed weekend availability at 10 AM.", user: "Layla Al-Rashidi", time: "2024-12-13 16:20" },
    { id: "TH3", action: "Task created", user: "Admin", time: "2024-12-12 09:00" },
  ],
  "T002": [
    { id: "TH4", action: "Assignee changed", from: "Admin", to: "Omar Fahad", user: "Admin", time: "2024-12-13 08:00" },
    { id: "TH5", action: "Task created", user: "Admin", time: "2024-12-12 09:00" },
  ],
};

const TASKS = [
  { id: "T001", title: "Schedule property viewing – Marina Heights", description: "Coordinate with the client to schedule a weekend viewing of Unit 2204. Prepare property info sheet.", status: "In Progress", priority: "high", taskType: "Viewing", creator: "Admin", assignee: "Layla Al-Rashidi", assigneeId: "C001", propertyId: "P001", property: "Marina Heights Tower B – Unit 2204", due: "2024-12-18", completionDate: null as string | null, notes: "Client requests weekend availability." },
  { id: "T002", title: "Prepare NOC documents for Palm Jumeirah transfer", description: "Collect all required NOC documents from the developer and prepare for the ownership transfer.", status: "In Progress", priority: "urgent", taskType: "Document", creator: "Admin", assignee: "Omar Fahad", assigneeId: "C002", propertyId: "P002", property: "Palm Jumeirah Villa – Signature Series", due: "2024-12-15", completionDate: null as string | null, notes: "Notary appointment booked 11:00 AM." },
  { id: "T003", title: "Send updated floor plan to Petrov client", description: "Email and WhatsApp the revised floor plan PDF to the interested buyer.", status: "Completed", priority: "medium", taskType: "Document", creator: "Sara Mansouri", assignee: "Nadia Petrov", assigneeId: "C005", propertyId: "P007", property: "JGE – Luxury Townhouse", due: "2024-12-10", completionDate: "2024-12-09", notes: "Sent via email and WhatsApp." },
  { id: "T004", title: "Upload property photos – Business Bay office", description: "Coordinate with photographer and upload professional shots to the portal.", status: "Pending", priority: "medium", taskType: "Administrative", creator: "Admin", assignee: "Layla Al-Rashidi", assigneeId: "C001", propertyId: "P005", property: "Business Bay – Commercial Tower Office", due: "2024-12-20", completionDate: null as string | null, notes: "Waiting on professional shoot." },
  { id: "T005", title: "Follow up with Hassan re: studio offer", description: "Present counter-offer at AED 1.12M and negotiate with the client.", status: "In Progress", priority: "high", taskType: "Negotiation", creator: "Admin", assignee: "Tariq Hassan", assigneeId: "C004", propertyId: "P004", property: "JBR Walk – Beachfront Studio", due: "2024-12-16", completionDate: null as string | null, notes: "Client offered 1.05M, counter at 1.12M." },
  { id: "T006", title: "Prepare SPA for Arabian Ranches deal", description: "Draft and review the Sale and Purchase Agreement with developer legal team.", status: "Pending", priority: "urgent", taskType: "Contract", creator: "Admin", assignee: "Omar Fahad", assigneeId: "C002", propertyId: "P006", property: "Arabian Ranches III – Corner Villa", due: "2024-12-14", completionDate: null as string | null, notes: "Developer legal team reviewing." },
  { id: "T007", title: "Quarterly performance review – Tariq", description: "Conduct Q4 performance appraisal for Tariq Hassan per HR schedule.", status: "Completed", priority: "low", taskType: "Administrative", creator: "Admin", assignee: "Admin", assigneeId: null as string | null, propertyId: null as string | null, property: null as string | null, due: "2024-12-08", completionDate: "2024-12-08", notes: "Feedback submitted to HR." },
];

const FOLLOWUPS = [
  { id: "FU001", type: "Call", title: "Follow-up call – Marina Heights viewing feedback", contact: "Ahmad Al-Mutairi", date: "2024-12-12 10:30", consultant: "Layla Al-Rashidi", consultantId: "C001", propertyId: "P001", outcome: "Interested – requests 2nd viewing", status: "completed", probability: 72 },
  { id: "FU002", type: "Meeting", title: "In-person negotiation – Palm Jumeirah villa", contact: "Priya Nair", date: "2024-12-14 14:00", consultant: "Omar Fahad", consultantId: "C002", propertyId: "P002", outcome: null as string | null, status: "scheduled", probability: 41 },
  { id: "FU003", type: "Email", title: "Send brochure – Townhouse shortlist", contact: "James Whitfield", date: "2024-12-11 09:00", consultant: "Nadia Petrov", consultantId: "C005", propertyId: "P007", outcome: "Brochure sent, awaiting reply", status: "completed", probability: 58 },
  { id: "FU004", type: "Call", title: "Offer discussion – JBR studio", contact: "Li Wei", date: "2024-12-16 11:00", consultant: "Tariq Hassan", consultantId: "C004", propertyId: "P004", outcome: null as string | null, status: "scheduled", probability: 33 },
  { id: "FU005", type: "Site Visit", title: "Site visit – Arabian Ranches corner villa", contact: "Khalid Al-Suwaidi", date: "2024-12-18 09:30", consultant: "Omar Fahad", consultantId: "C002", propertyId: "P006", outcome: null as string | null, status: "scheduled", probability: 67 },
];

const ACTIVITY_LOGS = [
  { id: "A001", user: "Layla Al-Rashidi", action: "Updated property status", target: "Marina Heights Tower B – Unit 2204", timestamp: "2024-12-12 14:23", type: "update" },
  { id: "A002", user: "Admin", action: "Created consultant account", target: "Tariq Hassan", timestamp: "2024-12-11 09:05", type: "create" },
  { id: "A003", user: "Omar Fahad", action: "Submitted listing for approval", target: "Palm Jumeirah Villa", timestamp: "2024-12-10 16:42", type: "submit" },
  { id: "A004", user: "Sara Mansouri", action: "Marked task completed", target: "Prepare SPA documents", timestamp: "2024-12-09 11:30", type: "complete" },
  { id: "A005", user: "Admin", action: "Exported report", target: "Consultant Performance – Q4 2024", timestamp: "2024-12-08 15:10", type: "export" },
  { id: "A006", user: "Nadia Petrov", action: "Archived property", target: "Old Town Courtyard Apartment", timestamp: "2024-12-07 10:05", type: "archive" },
  { id: "A007", user: "System", action: "AI insight generated", target: "Q4 Performance Analysis", timestamp: "2024-12-06 08:00", type: "system" },
];

const DASH_AREA = [
  { month: "Jul", revenue: 4.2, forecast: 4.8 }, { month: "Aug", revenue: 5.1, forecast: 5.0 },
  { month: "Sep", revenue: 3.8, forecast: 5.2 }, { month: "Oct", revenue: 6.9, forecast: 6.0 },
  { month: "Nov", revenue: 8.2, forecast: 7.5 }, { month: "Dec", revenue: 11.4, forecast: 10.0 },
];
const CHANNEL_PIE = [{ name: "Property Finder", value: 48 }, { name: "Bayut", value: 35 }, { name: "Dubizzle", value: 17 }];
const PIE_COLORS = ["#0BB68A", "#3B82F6", "#F59E0B"];
const SKILL_RADAR = [
  { skill: "Negotiation", value: 88 }, { skill: "Follow-Up", value: 72 }, { skill: "Listings", value: 91 },
  { skill: "Pipeline", value: 65 }, { skill: "Client Mgmt", value: 84 }, { skill: "Closure", value: 79 },
];

// ─── Utils ───────────────────────────────────────────────────────────────────────

const fmtShort = (n: number) => n >= 1_000_000 ? `AED ${(n / 1_000_000).toFixed(1)}M` : `AED ${(n / 1_000).toFixed(0)}K`;
const cx = (...args: (string | undefined | false | null)[]) => args.filter(Boolean).join(" ");

// ─── Toast ───────────────────────────────────────────────────────────────────────

interface ToastItem { id: string; message: string; type: "success" | "error" | "info" | "warning" }
let _toastEmit: ((t: Omit<ToastItem, "id">) => void) | null = null;
function useToastEmitter(fn: (t: Omit<ToastItem, "id">) => void) {
  useEffect(() => { _toastEmit = fn; return () => { _toastEmit = null; }; }, [fn]);
}
export function toast(t: Omit<ToastItem, "id">) { _toastEmit?.(t); }

function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const add = useCallback((t: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((p) => [...p, { ...t, id }]);
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 3500);
  }, []);
  useToastEmitter(add);
  const styles = { success: "border-emerald-200 text-emerald-700 bg-white", error: "border-red-200 text-red-700 bg-white", warning: "border-amber-200 text-amber-700 bg-white", info: "border-blue-200 text-blue-700 bg-white" };
  const icons = { success: <CircleCheck size={15} />, error: <XCircle size={15} />, warning: <TriangleAlert size={15} />, info: <Info size={15} /> };
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className={cx("flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium pointer-events-auto min-w-72", styles[t.type])}>
          {icons[t.type]}<span className="text-foreground">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Design Primitives ────────────────────────────────────────────────────────────

type BadgeV = "default" | "success" | "warning" | "danger" | "info" | "purple" | "muted" | "teal";
function Badge({ label, variant = "default", dot }: { label: string; variant?: BadgeV; dot?: boolean }) {
  const s: Record<BadgeV, string> = {
    default: "bg-secondary text-foreground",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
    purple: "bg-purple-50 text-purple-700 border border-purple-200",
    muted: "bg-muted text-muted-foreground",
    teal: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  };
  const dc: Record<BadgeV, string> = { default: "bg-foreground", success: "bg-emerald-500", warning: "bg-amber-500", danger: "bg-red-500", info: "bg-blue-500", purple: "bg-purple-500", muted: "bg-muted-foreground", teal: "bg-emerald-500" };
  return (
    <span className={cx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap", s[variant])}>
      {dot && <span className={cx("w-1.5 h-1.5 rounded-full flex-shrink-0", dc[variant])} />}
      {label}
    </span>
  );
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; variant: BadgeV }> = {
    "Available": { label: "Available", variant: "success" },
    "Reserved": { label: "Reserved", variant: "info" },
    "Sold": { label: "Sold", variant: "muted" },
    "Rented": { label: "Rented", variant: "purple" },
    "Inactive": { label: "Inactive", variant: "muted" },
    "Published": { label: "Published", variant: "success" },
    "Pending Approval": { label: "Pending Approval", variant: "warning" },
    "Draft": { label: "Draft", variant: "muted" },
    "Expired": { label: "Expired", variant: "danger" },
    "Pending": { label: "Pending", variant: "muted" },
    "In Progress": { label: "In Progress", variant: "info" },
    "Completed": { label: "Completed", variant: "success" },
    "Cancelled": { label: "Cancelled", variant: "danger" },
    "urgent": { label: "Urgent", variant: "danger" },
    "high": { label: "High", variant: "warning" },
    "medium": { label: "Medium", variant: "info" },
    "low": { label: "Low", variant: "muted" },
    "Call": { label: "Call", variant: "info" },
    "Meeting": { label: "Meeting", variant: "purple" },
    "Email": { label: "Email", variant: "muted" },
    "Site Visit": { label: "Site Visit", variant: "teal" },
    "completed": { label: "Completed", variant: "success" },
    "scheduled": { label: "Scheduled", variant: "purple" },
    "update": { label: "Update", variant: "info" },
    "create": { label: "Create", variant: "success" },
    "submit": { label: "Submit", variant: "purple" },
    "complete": { label: "Complete", variant: "success" },
    "export": { label: "Export", variant: "muted" },
    "archive": { label: "Archive", variant: "warning" },
    "system": { label: "System", variant: "muted" },
  };
  const cfg = map[status] ?? { label: status, variant: "default" as BadgeV };
  return <Badge label={cfg.label} variant={cfg.variant} dot />;
}

function Btn({ children, variant = "primary", size = "md", onClick, disabled, type = "button", className, fullWidth }: {
  children: React.ReactNode; variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "xs" | "sm" | "md" | "lg"; onClick?: () => void; disabled?: boolean;
  type?: "button" | "submit"; className?: string; fullWidth?: boolean;
}) {
  const v: Record<string, string> = {
    primary: "bg-primary text-white hover:opacity-90 shadow-sm",
    secondary: "bg-white text-foreground hover:bg-secondary border border-border shadow-sm",
    ghost: "bg-transparent text-foreground hover:bg-secondary",
    danger: "bg-destructive text-white hover:opacity-90 shadow-sm",
    outline: "bg-transparent text-primary border border-primary hover:bg-primary/5",
  };
  const s: Record<string, string> = {
    xs: "px-2.5 py-1 text-xs gap-1.5 rounded-lg", sm: "px-3.5 py-1.5 text-xs gap-1.5 rounded-lg",
    md: "px-4 py-2 text-sm gap-2 rounded-xl", lg: "px-5 py-2.5 text-sm gap-2 rounded-xl",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={cx("inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed", v[variant], s[size], fullWidth && "w-full", className)}>
      {children}
    </button>
  );
}

function Input({ label, type = "text", placeholder, value, onChange, icon, error, required, textarea, rows }: {
  label?: string; type?: string; placeholder?: string; value: string;
  onChange: (v: string) => void; icon?: React.ReactNode; error?: string;
  required?: boolean; textarea?: boolean; rows?: number;
}) {
  const cls = "w-full rounded-xl border border-border bg-input-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:ring-2 focus:ring-ring focus:border-primary";
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-foreground">{label}{required && <span className="text-primary ml-1">*</span>}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
        {textarea
          ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows ?? 4} className={cx(cls, "resize-none")} />
          : <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={cx(cls, icon && "pl-10")} />}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SelectField({ label, value, onChange, options, required, placeholder }: {
  label?: string; value: string; onChange: (v: string) => void;
  options: { label: string; value: string }[]; required?: boolean; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-foreground">{label}{required && <span className="text-primary ml-1">*</span>}</label>}
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-input-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-primary">
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Card({ children, className, onClick, hover }: { children: React.ReactNode; className?: string; onClick?: () => void; hover?: boolean }) {
  return (
    <div onClick={onClick} className={cx("bg-card rounded-2xl border border-border", hover && "cursor-pointer hover:shadow-md transition-shadow duration-200", className)} style={{ boxShadow: "var(--shadow-md)" }}>
      {children}
    </div>
  );
}

function Avatar({ initials, size = "sm" }: { initials: string; size?: "xs" | "sm" | "md" | "lg" }) {
  const sizes = { xs: "w-6 h-6 text-xs", sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
  return <div className={cx("rounded-full bg-primary/15 text-primary flex items-center justify-center flex-shrink-0 font-semibold", sizes[size])}>{initials}</div>;
}

function KpiCard({ label, value, sub, icon, trend, trendUp, color }: {
  label: string; value: string; sub?: string; icon: React.ReactNode; trend?: string; trendUp?: boolean; color?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={cx("w-10 h-10 rounded-xl flex items-center justify-center", color || "bg-primary/10 text-primary")}>{icon}</div>
        {trend && <span className={cx("flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full", trendUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500")}>{trendUp ? <ChevronUp size={11} /> : <ChevronDown size={11} />}{trend}</span>}
      </div>
      <div className="text-2xl font-bold text-foreground tracking-tight">{value}</div>
      <div className="text-sm text-muted-foreground mt-0.5 font-medium">{label}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </Card>
  );
}

// ─── Consultant Combobox ──────────────────────────────────────────────────────────

function ConsultantCombobox({ value, onChange, label, required, disabled }: { value: string; onChange: (v: string) => void; label?: string; required?: boolean; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(0);
  const selected = CONSULTANTS.find((c) => c.id === value);
  const filtered = CONSULTANTS.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.role.toLowerCase().includes(q.toLowerCase()) || c.branch.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => { if (open) { setTimeout(() => inputRef.current?.focus(), 50); setFocused(0); } else setQ(""); }, [open]);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setFocused((p) => Math.min(p + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setFocused((p) => Math.max(p - 1, 0)); }
    if (e.key === "Enter" && filtered[focused]) { onChange(filtered[focused].id); setOpen(false); }
    if (e.key === "Escape") setOpen(false);
  };

  const hl = (text: string) => {
    if (!q) return <>{text}</>;
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return <>{text}</>;
    return <>{text.slice(0, i)}<mark className="bg-primary/20 text-primary rounded-sm not-italic">{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
  };

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      {label && <label className="text-sm font-medium text-foreground">{label}{required && <span className="text-primary ml-1">*</span>}</label>}
      <div className="relative">
        <button type="button" onClick={() => !disabled && setOpen(!open)} disabled={disabled}
          className={cx("w-full px-3 py-2 rounded-xl border border-border bg-white text-left text-sm flex items-center justify-between transition-colors",
            disabled ? "opacity-60 cursor-not-allowed" : "hover:border-primary/30")}>
          {selected
            ? <><Avatar initials={selected.avatar} size="xs" /><span className="flex-1 font-medium">{selected.name}</span><span className="text-xs text-muted-foreground">{selected.branch}</span></>
            : <span className="flex-1 text-muted-foreground">Select consultant…</span>}
          <ChevronDown size={14} className={cx("text-muted-foreground transition-transform flex-shrink-0", open && "rotate-180")} />
        </button>
        {open && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-card rounded-xl border border-border shadow-lg overflow-hidden">
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setFocused(0); }} onKeyDown={handleKey}
                  placeholder="Search name, role, branch…" className="w-full pl-8 pr-3 py-2 text-sm bg-secondary rounded-lg outline-none placeholder:text-muted-foreground" />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto py-1">
              {filtered.length === 0
                ? <p className="text-xs text-muted-foreground text-center py-4">No consultants found</p>
                : filtered.map((c, i) => (
                  <button key={c.id} type="button" onMouseEnter={() => setFocused(i)} onClick={() => { onChange(c.id); setOpen(false); }}
                    className={cx("w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors", i === focused ? "bg-secondary" : "hover:bg-secondary/50")}>
                    <Avatar initials={c.avatar} size="sm" />
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium">{hl(c.name)}</p><p className="text-xs text-muted-foreground">{c.role} · {c.branch}</p></div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className={cx("w-1.5 h-1.5 rounded-full", c.active ? "bg-emerald-400" : "bg-muted-foreground")} />
                      {value === c.id && <Check size={13} className="text-primary" />}
                    </div>
                  </button>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Property Combobox ────────────────────────────────────────────────────────────────

function PropertyCombobox({ value, onChange, label, required, locked, lockedLabel }: {
  value: string; onChange: (v: string) => void; label?: string; required?: boolean;
  locked?: boolean; lockedLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(0);
  const selected = PROPERTIES.find((p) => p.id === value);
  const filtered = PROPERTIES.filter((p) => !q || p.title.toLowerCase().includes(q.toLowerCase()) || p.internalCode.toLowerCase().includes(q.toLowerCase()) || p.district.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => { if (open) { setTimeout(() => inputRef.current?.focus(), 50); setFocused(0); } else setQ(""); }, [open]);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setFocused((p) => Math.min(p + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setFocused((p) => Math.max(p - 1, 0)); }
    if (e.key === "Enter" && filtered[focused]) { onChange(filtered[focused].id); setOpen(false); }
    if (e.key === "Escape") setOpen(false);
  };

  const hl = (text: string) => {
    if (!q) return <>{text}</>;
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return <>{text}</>;
    return <>{text.slice(0, i)}<mark className="bg-primary/20 text-primary rounded-sm not-italic">{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
  };

  if (locked) {
    return (
      <div className="flex flex-col gap-1.5">
        {label && <label className="text-sm font-medium text-foreground">{label}{required && <span className="text-primary ml-1">*</span>}</label>}
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted px-3.5 py-2.5 opacity-75 cursor-not-allowed">
          {selected && <div className={cx("w-6 h-6 rounded-lg bg-gradient-to-br flex-shrink-0", selected.gradient)} />}
          <span className="flex-1 text-sm font-medium text-foreground truncate">{lockedLabel || selected?.title || "—"}</span>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">Locked</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      {label && <label className="text-sm font-medium text-foreground">{label}{required && <span className="text-primary ml-1">*</span>}</label>}
      <div className="relative">
        <button type="button" onClick={() => setOpen(!open)}
          className={cx("w-full flex items-center gap-2.5 rounded-xl border border-border bg-input-background px-3.5 py-2.5 text-sm text-left transition-all outline-none focus:ring-2 focus:ring-ring", open && "border-primary ring-2 ring-ring")}>
          {selected ? (
            <><div className={cx("w-6 h-6 rounded-lg bg-gradient-to-br flex-shrink-0", selected.gradient)} /><span className="flex-1 font-medium truncate">{selected.title}</span><span className="text-xs text-muted-foreground flex-shrink-0">{fmtShort(selected.price)}</span></>
          ) : <span className="flex-1 text-muted-foreground">Search and select property…</span>}
          <ChevronDown size={14} className={cx("text-muted-foreground transition-transform flex-shrink-0", open && "rotate-180")} />
        </button>
        {open && (
          <div className="absolute z-50 w-full mt-1 bg-card rounded-xl border border-border shadow-lg overflow-hidden">
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setFocused(0); }} onKeyDown={handleKey}
                  placeholder="Search by title, code, district…" className="w-full pl-8 pr-3 py-2 text-sm bg-secondary rounded-lg outline-none placeholder:text-muted-foreground" />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto py-1">
              {filtered.length === 0
                ? <p className="text-xs text-muted-foreground text-center py-4">No properties found</p>
                : filtered.map((p, i) => (
                  <button key={p.id} type="button" onMouseEnter={() => setFocused(i)} onClick={() => { onChange(p.id); setOpen(false); }}
                    className={cx("w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors", i === focused ? "bg-secondary" : "hover:bg-secondary/50")}>
                    <div className={cx("w-8 h-8 rounded-lg bg-gradient-to-br flex-shrink-0", p.gradient)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{hl(p.title)}</p>
                      <p className="text-xs text-muted-foreground">{p.district} · {p.internalCode} · {fmtShort(p.price)}</p>
                    </div>
                    {value === p.id && <Check size={13} className="text-primary flex-shrink-0" />}
                  </button>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ─── Multi Property Combobox ─────────────────────────────────────────────────────────────
function MultiPropertyCombobox({
  values,
  onChange,
  label,
}: {
  values: string[]; // آرایه‌ای از ID ملک‌های انتخاب‌شده
  onChange: (v: string[]) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(0);

  const filtered = PROPERTIES.filter(
    (p) =>
      !q ||
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.internalCode.toLowerCase().includes(q.toLowerCase()) ||
      p.district.toLowerCase().includes(q.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setFocused(0);
    } else {
      setQ("");
    }
  }, [open]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggleSelect = (id: string) => {
    if (values.includes(id)) {
      onChange(values.filter((v) => v !== id));
    } else {
      onChange([...values, id]);
    }
  };

  const handleSelectAll = () => {
    if (values.length === PROPERTIES.length) {
      onChange([]); // لغو انتخاب همه
    } else {
      onChange(PROPERTIES.map((p) => p.id)); // انتخاب همه
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocused((p) => Math.min(p + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocused((p) => Math.max(p - 1, 0));
    }
    if (e.key === "Enter" && filtered[focused]) {
      e.preventDefault();
      toggleSelect(filtered[focused].id);
    }
    if (e.key === "Escape") setOpen(false);
  };

  const hl = (text: string) => {
    if (!q) return <>{text}</>;
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, i)}
        <mark className="bg-primary/20 text-primary rounded-sm not-italic">
          {text.slice(i, i + q.length)}
        </mark>
        {text.slice(i + q.length)}
      </>
    );
  };

  const isAllSelected = values.length === PROPERTIES.length;

  return (
    <div className="flex flex-col gap-1.5 w-full" ref={ref}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cx(
            "w-full flex items-center gap-2 rounded-xl border border-border bg-input-background px-3 py-1.5 text-xs text-left transition-all outline-none focus:ring-1 focus:ring-primary min-h-[32px]",
            open && "border-primary ring-1 ring-primary"
          )}
        >
          <div className="flex-1 flex flex-wrap gap-1 items-center truncate">
            {isAllSelected ? (
              <span className="font-semibold text-primary">All Properties</span>
            ) : values.length > 0 ? (
              <span className="font-medium text-foreground">
                Selected ({values.length})
              </span>
            ) : (
              <span className="text-muted-foreground">Select Properties…</span>
            )}
          </div>
          <ChevronDown size={12} className="text-muted-foreground ml-1" />
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-popover shadow-lg py-1 flex flex-col max-h-60 overflow-hidden">
            <div className="px-2 py-1.5 border-b border-border flex items-center gap-2">
              <Search size={12} className="text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search property..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={handleKey}
                className="w-full bg-transparent text-xs outline-none border-none p-0 focus:ring-0"
              />
            </div>

            <div className="p-1 border-b border-border">
              <button
                type="button"
                onClick={handleSelectAll}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium text-left hover:bg-secondary transition-colors"
              >
                <span>{isAllSelected ? "Deselect All" : "Select All"}</span>
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                  {PROPERTIES.length} total
                </span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-1 space-y-0.5">
              {filtered.length === 0 ? (
                <div className="text-xs text-muted-foreground p-3 text-center">
                  No properties found
                </div>
              ) : (
                filtered.map((p, idx) => {
                  const isSelected = values.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleSelect(p.id)}
                      className={cx(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors text-xs",
                        idx === focused && "bg-secondary/70",
                        isSelected
                          ? "bg-primary/5 text-foreground font-medium"
                          : "hover:bg-secondary text-muted-foreground"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5"
                      />
                      <div
                        className={cx(
                          "w-4 h-4 rounded bg-gradient-to-br flex-shrink-0",
                          p.gradient
                        )}
                      />
                      <span className="flex-1 truncate">{hl(p.title)}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ─── Multi Consultant Combobox ─────────────────────────────────────────────────────────────
function MultiConsultantCombobox({
  values,
  onChange,
  label,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(0);

  const filtered = CONSULTANTS.filter(
    (u) =>
      !q ||
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.role.toLowerCase().includes(q.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setFocused(0);
    } else {
      setQ("");
    }
  }, [open]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggleSelect = (id: string) => {
    if (values.includes(id)) {
      onChange(values.filter((v) => v !== id));
    } else {
      onChange([...values, id]);
    }
  };

  const handleSelectAll = () => {
    if (values.length === CONSULTANTS.length) {
      onChange([]);
    } else {
      onChange(CONSULTANTS.map((u) => u.id));
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocused((p) => Math.min(p + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocused((p) => Math.max(p - 1, 0));
    }
    if (e.key === "Enter" && filtered[focused]) {
      e.preventDefault();
      toggleSelect(filtered[focused].id);
    }
    if (e.key === "Escape") setOpen(false);
  };

  const hl = (text: string) => {
    if (!q) return <>{text}</>;
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, i)}
        <mark className="bg-primary/20 text-primary rounded-sm not-italic">
          {text.slice(i, i + q.length)}
        </mark>
        {text.slice(i + q.length)}
      </>
    );
  };

  const isAllSelected = values.length === CONSULTANTS.length;

  return (
    <div className="flex flex-col gap-1.5 w-full" ref={ref}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cx(
            "w-full flex items-center gap-2 rounded-xl border border-border bg-input-background px-3 py-1.5 text-xs text-left transition-all outline-none focus:ring-1 focus:ring-primary min-h-[32px]",
            open && "border-primary ring-1 ring-primary"
          )}
        >
          <div className="flex-1 flex flex-wrap gap-1 items-center truncate">
            {isAllSelected ? (
              <span className="font-semibold text-primary">All Consultants</span>
            ) : values.length > 0 ? (
              <span className="font-medium text-foreground">
                Selected ({values.length})
              </span>
            ) : (
              <span className="text-muted-foreground">Select Consultants…</span>
            )}
          </div>
          <ChevronDown size={12} className="text-muted-foreground ml-1" />
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-popover shadow-lg py-1 flex flex-col max-h-60 overflow-hidden">
            <div className="px-2 py-1.5 border-b border-border flex items-center gap-2">
              <Search size={12} className="text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search consultant..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={handleKey}
                className="w-full bg-transparent text-xs outline-none border-none p-0 focus:ring-0"
              />
            </div>

            <div className="p-1 border-b border-border">
              <button
                type="button"
                onClick={handleSelectAll}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium text-left hover:bg-secondary transition-colors"
              >
                <span>{isAllSelected ? "Deselect All" : "Select All"}</span>
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                  {CONSULTANTS.length} total
                </span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-1 space-y-0.5">
              {filtered.length === 0 ? (
                <div className="text-xs text-muted-foreground p-3 text-center">
                  No consultants found
                </div>
              ) : (
                filtered.map((u, idx) => {
                  const isSelected = values.includes(u.id);
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => toggleSelect(u.id)}
                      className={cx(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors text-xs",
                        idx === focused && "bg-secondary/70",
                        isSelected
                          ? "bg-primary/5 text-foreground font-medium"
                          : "hover:bg-secondary text-muted-foreground"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5"
                      />
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <div className="flex-1 truncate">
                        <span className="font-medium text-foreground block">
                          {hl(u.name)}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ─── District Combobox ─────────────────────────────────────────────────────────────

function DistrictCombobox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = DISTRICTS.filter((d) => !q || d.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); else setQ(""); }, [open]);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(!open)}
        className={cx("w-full flex items-center gap-2 rounded-xl border border-border bg-input-background px-3 py-2.5 text-sm text-left transition-all outline-none focus:ring-2 focus:ring-ring", open && "border-primary ring-2 ring-ring")}>
        <MapPin size={13} className="text-muted-foreground flex-shrink-0" />
        <span className={cx("flex-1 truncate", value ? "text-foreground font-medium" : "text-muted-foreground")}>{value || "All Districts"}</span>
        <ChevronDown size={13} className={cx("text-muted-foreground transition-transform flex-shrink-0", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute z-50 w-56 mt-1 bg-card rounded-xl border border-border shadow-lg overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="relative"><Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search districts…" className="w-full pl-7 pr-2 py-1.5 text-xs bg-secondary rounded-lg outline-none" />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            <button type="button" onClick={() => { onChange(""); setOpen(false); }} className={cx("w-full px-3 py-2 text-xs text-left transition-colors hover:bg-secondary", !value && "bg-primary/5 text-primary font-medium")}>All Districts</button>
            {filtered.map((d) => (
              <button key={d} type="button" onClick={() => { onChange(d); setOpen(false); }} className={cx("w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors hover:bg-secondary", value === d && "bg-primary/5 text-primary font-medium")}>
                {d}{value === d && <Check size={12} className="text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pagination ────────────────────────────────────────────────────────────────────

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

function Pagination({ page, total, pageSize, onPageChange, onPageSizeChange }: {
  page: number; total: number; pageSize: number;
  onPageChange: (p: number) => void; onPageSizeChange?: (s: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize) || 1;
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const [jumpVal, setJumpVal] = useState("");

  const pages = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, -1, totalPages];
    if (page >= totalPages - 3) return [1, -1, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, -1, page - 1, page, page + 1, -2, totalPages];
  })();

  const handleJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const n = parseInt(jumpVal);
      if (!isNaN(n) && n >= 1 && n <= totalPages) onPageChange(n);
      setJumpVal("");
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <p className="text-xs text-muted-foreground">
          {total === 0 ? "No results" : <>Showing <strong className="text-foreground">{start}–{end}</strong> of <strong className="text-foreground">{total}</strong></>}
        </p>
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Rows:</span>
            <select value={pageSize} onChange={(e) => { onPageSizeChange(Number(e.target.value)); onPageChange(1); }}
              className="text-xs rounded-lg border border-border bg-input-background px-2 py-1 outline-none focus:ring-1 focus:ring-ring">
              {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(1)} disabled={page === 1} title="First page"
          className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-muted-foreground"><ChevronLeft size={12} className="inline" /><ChevronLeft size={12} className="inline -ml-1.5" /></button>
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
          className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={14} /></button>
        {pages.map((p, i) =>
          p < 0 ? (
            <span key={p + "_" + i} className="px-1 text-xs text-muted-foreground select-none">…</span>
          ) : (
            <button key={p} onClick={() => onPageChange(p)}
              className={cx("w-8 h-8 rounded-lg text-xs font-semibold transition-colors", p === page ? "bg-primary text-white shadow-sm" : "hover:bg-secondary text-foreground")}>
              {p}
            </button>
          )
        )}
        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
          className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronRight size={14} /></button>
        <button onClick={() => onPageChange(totalPages)} disabled={page === totalPages} title="Last page"
          className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-muted-foreground"><ChevronRight size={12} className="inline" /><ChevronRight size={12} className="inline -ml-1.5" /></button>
        <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-border">
          <span className="text-xs text-muted-foreground">Go to</span>
          <input type="number" min={1} max={totalPages} value={jumpVal} onChange={(e) => setJumpVal(e.target.value)} onKeyDown={handleJump} placeholder="—"
            className="w-12 text-xs rounded-lg border border-border bg-input-background px-2 py-1 text-center outline-none focus:ring-1 focus:ring-ring" />
        </div>
      </div>
    </div>
  );
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }, (_, i) => (
        <td key={i} className="px-4 py-3"><div className="h-3 bg-muted rounded-full" style={{ width: `${60 + Math.random() * 30}%` }} /></td>
      ))}
    </tr>
  );
}

function BulkActionBar({ count, onArchive, onDelete, onClear }: { count: number; onArchive: () => void; onDelete: () => void; onClear: () => void }) {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-primary text-white rounded-xl shadow-lg text-sm">
      <span className="font-semibold">{count} selected</span>
      <div className="flex items-center gap-2 ml-2">
        <Btn variant="secondary" size="xs" onClick={onArchive} className="!bg-white/15 !text-white !border-white/20 hover:!bg-white/25"><Archive size={12} />Archive</Btn>
        <Btn variant="secondary" size="xs" onClick={onDelete} className="!bg-white/15 !text-white !border-white/20 hover:!bg-white/25"><Trash2 size={12} />Delete</Btn>
        <Btn variant="secondary" size="xs" onClick={() => toast({ type: "success", message: "Exported." })} className="!bg-white/15 !text-white !border-white/20 hover:!bg-white/25"><Download size={12} />Export</Btn>
      </div>
      <button onClick={onClear} className="ml-auto text-white/60 hover:text-white"><X size={14} /></button>
    </div>
  );
}

// ─── Confirm Modal ──────────────────────────────────────────────────────────────────

function ConfirmModal({ open, title, message, onConfirm, onCancel, danger = false }: {
  open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void; danger?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <Card className="w-full max-w-sm p-6 shadow-2xl">
        <div className={cx("w-11 h-11 rounded-xl flex items-center justify-center mb-4", danger ? "bg-red-100" : "bg-amber-50")}><TriangleAlert size={20} className={danger ? "text-red-600" : "text-amber-600"} /></div>
        <h3 className="text-base font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-5">{message}</p>
        <div className="flex gap-2 justify-end"><Btn variant="secondary" size="sm" onClick={onCancel}>Cancel</Btn><Btn variant={danger ? "danger" : "primary"} size="sm" onClick={onConfirm}><Check size={13} />Confirm</Btn></div>
      </Card>
    </div>
  );
}

// ─── Action Menu ────────────────────────────────────────────────────────────────────

function ActionMenu({ actions }: { actions: { label: string; icon: React.ReactNode; onClick: () => void; danger?: boolean }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"><MoreVertical size={14} /></button>
      {open && (
        <div className="absolute right-0 top-8 z-50 w-48 bg-card rounded-xl border border-border shadow-lg py-1 overflow-hidden">
          {actions.map((a) => (
            <button key={a.label} onClick={(e) => { e.stopPropagation(); a.onClick(); setOpen(false); }}
              className={cx("w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-left transition-colors", a.danger ? "text-destructive hover:bg-red-50" : "text-foreground hover:bg-secondary")}>
              {a.icon}{a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Command Palette ──────────────────────────────────────────────────────────────

function CommandPalette({ open, onClose, navigate }: { open: boolean; onClose: () => void; navigate: (p: Page) => void }) {
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (open) { setQ(""); setTimeout(() => ref.current?.focus(), 50); } }, [open]);
  if (!open) return null;
  const results = [
    { label: "Dashboard", page: "admin-dashboard" as Page, icon: <LayoutDashboard size={14} />, section: "Navigation" },
    { label: "Properties", page: "properties" as Page, icon: <Building2 size={14} />, section: "Navigation" },
    { label: "Listings", page: "listings" as Page, icon: <FileText size={14} />, section: "Navigation" },
    { label: "Tasks – Kanban", page: "tasks-kanban" as Page, icon: <Columns size={14} />, section: "Operations" },
    { label: "Consultants", page: "consultants" as Page, icon: <Users size={14} />, section: "People" },
    { label: "Follow-Ups", page: "follow-ups" as Page, icon: <BellRing size={14} />, section: "Operations" },
    { label: "Reports", page: "reports-consultant" as Page, icon: <BarChart3 size={14} />, section: "Intelligence" },
    { label: "Activity Log", page: "activity" as Page, icon: <Activity size={14} />, section: "Intelligence" },
    { label: "Settings", page: "settings-workspace" as Page, icon: <Settings size={14} />, section: "System" },
  ].filter((r) => !q || r.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <Card className="w-full max-w-lg shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search size={16} className="text-muted-foreground" />
          <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pages, properties, consultants…" className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
          <kbd className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-lg border border-border">ESC</kbd>
        </div>
        <div className="py-2 max-h-80 overflow-y-auto">
          {results.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">No results</p>
            : results.map((r) => (
              <button key={r.page} onClick={() => { navigate(r.page); onClose(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary transition-colors text-left">
                <span className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground flex-shrink-0">{r.icon}</span>
                <span className="flex-1">{r.label}</span>
                <span className="text-xs text-muted-foreground">{r.section}</span>
              </button>
            ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Notification Drawer ────────────────────────────────────────────────────────────

const NOTIFS = [
  { id: "N1", title: "New lead on Marina Heights", body: "Ahmad Al-Mutairi submitted a viewing request.", time: "5m ago", read: false, type: "lead" },
  { id: "N2", title: "Task overdue: NOC documents", body: "Task assigned to Omar Fahad is past its deadline.", time: "1h ago", read: false, type: "task" },
  { id: "N3", title: "Listing approved", body: "JBR Walk studio listing is now published on Bayut.", time: "3h ago", read: true, type: "listing" },
  { id: "N4", title: "New consultant registered", body: "Tariq Hassan account approved by admin.", time: "1d ago", read: true, type: "system" },
];

function NotifDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [notifs, setNotifs] = useState(NOTIFS);
  if (!open) return null;
  const cm: Record<string, string> = { lead: "bg-emerald-100 text-emerald-600", task: "bg-amber-100 text-amber-600", listing: "bg-blue-100 text-blue-600", system: "bg-secondary text-muted-foreground" };
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute top-16 right-4 w-80 bg-card rounded-2xl border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-lg)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border"><h3 className="text-sm font-semibold">Notifications</h3><button onClick={() => setNotifs((p) => p.map((n) => ({ ...n, read: true })))} className="text-xs text-primary hover:underline">Mark all read</button></div>
        <div className="max-h-96 overflow-y-auto divide-y divide-border">
          {notifs.map((n) => (
            <div key={n.id} className={cx("flex items-start gap-3 px-4 py-3.5 cursor-pointer hover:bg-secondary/50 transition-colors", !n.read && "bg-primary/[0.03]")} onClick={() => setNotifs((p) => p.map((x) => x.id === n.id ? { ...x, read: true } : x))}>
              <div className={cx("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", cm[n.type])}>{n.type === "lead" ? <User size={13} /> : n.type === "task" ? <CheckSquare size={13} /> : n.type === "listing" ? <FileText size={13} /> : <Settings size={13} />}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1"><p className="text-xs font-semibold text-foreground">{n.title}</p>{!n.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />}</div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Task Detail Modal ──────────────────────────────────────────────────────────────

function TaskDetailModal({ task, onClose }: { task: typeof TASKS[0]; onClose: () => void }) {
  const [status, setStatus] = useState(task.status);
  const [note, setNote] = useState("");
  const [completionDate, setCompletionDate] = useState(task.completionDate || "");
  const history = TASK_HISTORY_MAP[task.id] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between gap-4 p-5 border-b border-border flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">{statusBadge(task.priority)}<Badge label={task.taskType} variant="muted" /></div>
            <h2 className="text-base font-bold">{task.title}</h2>
            <p className="text-xs text-muted-foreground mt-1">Created by {task.creator} · Due {task.due}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"><X size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {task.description && (
            <div><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Description</p><p className="text-sm text-foreground leading-relaxed bg-secondary rounded-xl p-3">{task.description}</p></div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Update Status" value={status} onChange={setStatus} options={TASK_STATUSES.map((s) => ({ label: s, value: s }))} />
            {status === "Completed" && <Input label="Completion date" type="date" value={completionDate} onChange={setCompletionDate} />}
          </div>
          {task.property && <div className="flex items-center gap-2 p-3 bg-secondary rounded-xl text-xs"><Building2 size={13} className="text-muted-foreground" /><span className="text-muted-foreground">Property:</span><span className="font-medium">{task.property}</span></div>}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Add Note</p>
            <Input placeholder="Write a note about this task…" value={note} onChange={setNote} textarea rows={3} />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Change History</p>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-3 pl-8">
                {history.map((h) => (
                  <div key={h.id} className="relative">
                    <div className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-primary/50 border-2 border-white" />
                    <div className="bg-secondary rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1"><span className="text-xs font-semibold">{h.action}</span><span className="text-xs text-muted-foreground font-mono">{h.time.split(" ")[1]}</span></div>
                      {h.from && h.to && <p className="text-xs text-muted-foreground"><span className="line-through">{h.from}</span> → <span className="font-medium text-foreground">{h.to}</span></p>}
                      {h.note && <p className="text-xs text-muted-foreground italic">"{h.note}"</p>}
                      <p className="text-xs text-muted-foreground mt-1">by {h.user}</p>
                    </div>
                  </div>
                ))}
                {history.length === 0 && <p className="text-xs text-muted-foreground">No history yet.</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-end p-5 border-t border-border flex-shrink-0">
          <Btn variant="secondary" size="sm" onClick={onClose}>Close</Btn>
          <Btn variant="primary" size="sm" onClick={() => { toast({ type: "success", message: "Task updated." }); onClose(); }}><Check size={13} />Save Changes</Btn>
        </div>
      </Card>
    </div>
  );
}

// ─── Auth ─────────────────────────────────────────────────────────────────────────

function LoginPage({ onLogin, navigate }: { onLogin: (r: Role, n: string) => void; navigate: () => void }) {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const handle = () => {
    if (!email || !pw) { setError("Please enter your email and password."); return; }
    setError(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email.toLowerCase().includes("admin")) onLogin("admin", "Zaid Hassan");
      else if (email.toLowerCase().includes("consultant") || pw === "consultant") onLogin("consultant", "Layla Al-Rashidi");
      else setError("Invalid credentials. Try admin@zaminex.ae or any email / password 'consultant'.");
    }, 900);
  };
  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0D1829] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #0BB68A 0%, transparent 60%), radial-gradient(circle at 80% 20%, #3B82F6 0%, transparent 50%)" }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-16"><div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center"><Zap size={18} className="text-white" /></div><div><span className="text-white font-bold text-lg tracking-tight">Zaminex</span><p className="text-white/40 text-xs">Real Estate OS</p></div></div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-4">The Operating<br />System for<br /><span className="text-primary">Elite</span><br />Real Estate</h1>
          <p className="text-white/60 text-base max-w-xs leading-relaxed mb-10">Manage your entire real estate empire from a single AI-powered command center.</p>
          <div className="grid grid-cols-2 gap-3 mb-10">{[["12,000+", "Properties Managed"], ["500+", "Active Consultants"], ["$2.4B", "Portfolio Closed"], ["98.6%", "Client Satisfaction"]].map(([v, l]) => (<div key={l} className="bg-white/5 border border-white/10 rounded-xl p-4"><div className="text-2xl font-bold text-white mb-0.5">{v}</div><div className="text-white/50 text-xs">{l}</div></div>))}</div>
          {[["Property Intelligence", "AI-powered market analysis"], ["Consultant CRM", "Full relationship management"], ["Revenue Forecasting", "Predictive deal modeling"]].map(([t, d]) => (<div key={t} className="flex items-center gap-3 mb-3"><div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0"><Check size={14} className="text-primary" /></div><div><p className="text-white/90 text-sm font-medium">{t}</p><p className="text-white/40 text-xs">{d}</p></div></div>))}
        </div>
        <p className="relative z-10 text-white/25 text-xs">© 2024 Zaminex Real Estate Technology</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-8 lg:hidden"><div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center"><Zap size={16} className="text-white" /></div><span className="font-bold text-base">Zaminex</span></div>
          <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
          <p className="text-sm text-muted-foreground mb-7">Sign in to your enterprise dashboard</p>
          <div className="space-y-4">
            <Input label="Email address" type="email" placeholder="you@zaminex.ae" value={email} onChange={setEmail} icon={<Mail size={14} />} />
            <div>
              <Input label="Password" type="password" placeholder="••••••••" value={pw} onChange={setPw} icon={<Lock size={14} />} error={error} />
              <div className="flex justify-end mt-1.5"><button onClick={navigate} className="text-xs text-primary hover:underline">Forgot password?</button></div>
            </div>
            <Btn variant="primary" size="lg" onClick={handle} disabled={loading} fullWidth>{loading ? <><Loader2 size={14} className="animate-spin" />Signing in…</> : <>Sign In to Dashboard <ArrowUpRight size={14} /></>}</Btn>
            <p className="text-center text-xs text-muted-foreground">Secured by enterprise SSO</p>
            <div className="flex items-center gap-3"><div className="flex-1 h-px bg-border" /><span className="text-xs text-muted-foreground">or</span><div className="flex-1 h-px bg-border" /></div>
            <Btn variant="secondary" size="md" fullWidth><Shield size={14} />Sign in with SSO</Btn>
          </div>
          <div className="mt-6 p-3.5 bg-secondary rounded-xl text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Demo credentials</p>
            <p>Admin: <span className="font-mono text-foreground">admin@zaminex.ae</span> / any password</p>
            <p>Consultant: any email / <span className="font-mono text-foreground">consultant</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ForgotPage({ navigate }: { navigate: () => void }) {
  const [email, setEmail] = useState(""); const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <button onClick={navigate} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"><ChevronLeft size={14} />Back to sign in</button>
        {!sent ? (<><h2 className="text-2xl font-bold mb-1">Reset password</h2><p className="text-sm text-muted-foreground mb-6">Enter your email and we'll send a reset link.</p><div className="space-y-4"><Input label="Email address" type="email" placeholder="you@zaminex.ae" value={email} onChange={setEmail} icon={<Mail size={14} />} /><Btn variant="primary" size="lg" fullWidth onClick={() => setSent(true)}>Send reset link</Btn></div></>) : (
          <div className="text-center"><div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4"><Check size={26} className="text-emerald-600" /></div><h2 className="text-xl font-bold mb-2">Check your email</h2><p className="text-sm text-muted-foreground mb-6">We sent a reset link to <strong>{email}</strong>.</p><Btn variant="secondary" onClick={navigate} className="mx-auto">Back to sign in</Btn></div>
        )}
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────────

interface NavSection { heading?: string; items: { label: string; icon: React.ReactNode; page?: Page; children?: { label: string; page: Page }[]; badge?: number }[] }

function Sidebar({ role, page, navigate, collapsed, setCollapsed, userName, onLogout }: {
  role: Role; page: Page; navigate: (p: Page) => void; collapsed: boolean; setCollapsed: (v: boolean) => void; userName: string; onLogout: () => void;
}) {
  const adminSections: NavSection[] = [
    { items: [{ label: "Dashboard", icon: <LayoutDashboard size={16} />, page: "admin-dashboard" }, { label: "Properties", icon: <Building2 size={16} />, badge: 7, children: [{ label: "All Properties", page: "properties" }, { label: "Add Property", page: "add-property" }] }, { label: "Listings", icon: <FileText size={16} />, badge: 5, children: [{ label: "All Listings", page: "listings" }, { label: "Create Listing", page: "create-listing" }] }] },
    { heading: "OPERATIONS", items: [{ label: "Tasks", icon: <CheckSquare size={16} />, badge: 4, children: [{ label: "Kanban Board", page: "tasks-kanban" }, { label: "Timeline", page: "tasks-timeline" }, { label: "Calendar", page: "tasks-calendar" }] }, { label: "Follow-Ups", icon: <BellRing size={16} />, children: [{ label: "Timeline", page: "follow-ups" }, { label: "Create", page: "create-followup" }] }, { label: "Calendar", icon: <Calendar size={16} />, page: "tasks-calendar" }] },
    { heading: "PEOPLE", items: [{ label: "Consultants", icon: <Users size={16} />, children: [{ label: "Directory", page: "consultants" }, { label: "Add Consultant", page: "add-consultant" }] }] },
    { heading: "INTELLIGENCE", items: [{ label: "Analytics", icon: <BarChart3 size={16} />, children: [{ label: "Consultants", page: "reports-consultant" }, { label: "Properties", page: "reports-property" }, { label: "Listings", page: "reports-listing" }, { label: "Tasks", page: "reports-task" }] }, { label: "Activity Log", icon: <Activity size={16} />, page: "activity" }] },
  ];
  const consultantSections: NavSection[] = [
    { items: [{ label: "Dashboard", icon: <LayoutDashboard size={16} />, page: "consultant-dashboard" }, { label: "My Properties", icon: <Building2 size={16} />, children: [{ label: "All Properties", page: "my-properties" }, { label: "Add New", page: "add-property" }] }, { label: "My Listings", icon: <FileText size={16} />, page: "my-listings" }] },
    { heading: "OPERATIONS", items: [{ label: "My Tasks", icon: <CheckSquare size={16} />, page: "my-tasks" }, { label: "My Follow-Ups", icon: <BellRing size={16} />, children: [{ label: "Timeline", page: "my-followups" }, { label: "Create", page: "create-followup" }] }] },
    { heading: "PROFILE", items: [{ label: "My Profile", icon: <User size={16} />, children: [{ label: "Overview", page: "my-profile" }, { label: "Edit Profile", page: "my-profile-edit" }, { label: "Security", page: "my-profile-security" }, { label: "Notifications", page: "my-profile-notifs" }] }] },
  ];
  const sections = role === "admin" ? adminSections : consultantSections;
  const [expanded, setExpanded] = useState<string[]>(["Properties", "Tasks", "Analytics"]);
  const toggle = (l: string) => setExpanded((p) => p.includes(l) ? p.filter((x) => x !== l) : [...p, l]);
  const isActive = (p: Page) => page === p;
  const hasActive = (item: { children?: { page: Page }[] }) => item.children?.some((c) => isActive(c.page));

  return (
    <aside className={cx("flex flex-col h-full bg-sidebar transition-all duration-200 flex-shrink-0", collapsed ? "w-16" : "w-56")}>
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-sidebar-border h-14">
        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center flex-shrink-0"><Zap size={14} className="text-white" /></div>
        {!collapsed && <div className="flex-1 min-w-0"><span className="text-white font-bold text-sm tracking-tight">Zaminex</span><p className="text-white/35 text-xs leading-none">Real Estate OS</p></div>}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-white/30 hover:text-white transition-colors">{collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}</button>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-0.5" style={{ scrollbarWidth: "none" }}>
        {sections.map((section) => (
          <div key={section.heading || "main"} className="mb-1">
            {!collapsed && section.heading && <p className="text-white/25 text-xs font-semibold tracking-widest px-2.5 py-2 mt-1">{section.heading}</p>}
            {section.items.map((item) => {
              const active = item.page ? isActive(item.page) : hasActive(item);
              const open = expanded.includes(item.label);
              return (
                <div key={item.label}>
                  <button onClick={() => item.page ? navigate(item.page) : toggle(item.label)}
                    className={cx("w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all text-sm", active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white/90")}
                    title={collapsed ? item.label : undefined}>
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && (<><span className="flex-1 font-medium">{item.label}</span>{item.badge && !open && <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full">{item.badge}</span>}{item.children && <span className="text-white/30">{open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}</span>}</>)}
                  </button>
                  {!collapsed && item.children && open && (
                    <div className="ml-5 mt-0.5 flex flex-col gap-0.5 border-l border-white/10 pl-3">
                      {item.children.map((c) => <button key={c.page + c.label} onClick={() => navigate(c.page)} className={cx("text-left px-2 py-1.5 rounded-lg text-xs font-medium transition-colors", isActive(c.page) ? "text-white bg-white/10" : "text-white/45 hover:text-white hover:bg-white/5")}>{c.label}</button>)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
      {!collapsed && (
        <div className="mx-2 mb-2 rounded-xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0BB68A 0%, #059669 100%)" }}>
          <div className="p-3"><div className="flex items-center gap-2 mb-1"><Sparkles size={14} className="text-white" /><span className="text-white text-xs font-bold">Zaminex AI</span></div><p className="text-white/80 text-xs leading-relaxed mb-2">Get instant property insights & market intelligence</p><button className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-1.5 rounded-lg transition-colors">Ask AI Assistant</button></div>
        </div>
      )}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <button onClick={() => navigate("settings-workspace")} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-white/55 hover:bg-white/5 hover:text-white/90 transition-colors text-sm"><Settings size={15} />{!collapsed && <span className="font-medium">Settings</span>}</button>
        <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-white/55 hover:bg-white/5 hover:text-white/90 transition-colors text-sm"><LogOut size={15} />{!collapsed && <span className="font-medium">Sign Out</span>}</button>
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2.5 pt-2 mt-1 border-t border-sidebar-border">
            <Avatar initials={userName.split(" ").map((w) => w[0]).join("").slice(0, 2)} size="sm" />
            <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-white truncate">{userName}</p><p className="text-xs text-white/35 capitalize">{role === "admin" ? "Administrator" : "Consultant"}</p></div>
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────────

function TopBar({ userName, role, onCmd, onNotif, notifOpen }: { userName: string; role: Role; onCmd: () => void; onNotif: () => void; notifOpen: boolean }) {
  const unread = NOTIFS.filter((n) => !n.read).length;
  return (
    <header className="h-14 bg-white border-b border-border flex items-center gap-3 px-5 flex-shrink-0" style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.05)" }}>
      <button onClick={onCmd} className="flex items-center gap-2 flex-1 max-w-xs text-sm text-muted-foreground bg-secondary hover:bg-muted rounded-xl px-3.5 py-2 transition-colors">
        <Search size={13} /><span className="flex-1 text-left">Search everything…</span>
        <div className="flex items-center gap-0.5"><kbd className="text-xs bg-white border border-border rounded-md px-1.5 py-0.5"><Command size={9} /></kbd><kbd className="text-xs bg-white border border-border rounded-md px-1.5 py-0.5">K</kbd></div>
      </button>
      <div className="ml-auto flex items-center gap-2">
        <button onClick={onNotif} className={cx("relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors", notifOpen ? "bg-secondary" : "hover:bg-secondary")}>
          <Bell size={16} className="text-muted-foreground" />
          {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border-2 border-white" />}
        </button>
        <div className="flex items-center gap-2 pl-1 border-l border-border ml-1">
          <Avatar initials={userName.split(" ").map((w) => w[0]).join("").slice(0, 2)} size="sm" />
          <div className="hidden sm:block"><p className="text-xs font-semibold text-foreground leading-none">{userName}</p><p className="text-xs text-muted-foreground capitalize mt-0.5">{role === "admin" ? "Administrator" : "Consultant"}</p></div>
        </div>
      </div>
    </header>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────────

function EmptyState({ icon, title, description, action }: { icon: React.ReactNode; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground mb-4">{icon}</div>
      <h3 className="text-sm font-semibold mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-xs mb-4 leading-relaxed">{description}</p>
      {action}
    </div>
  );
}

function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div><h1 className="text-xl font-bold text-foreground tracking-tight">{title}</h1>{subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}</div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────────

function AdminDashboard({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Good morning, Zaid 👋</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-muted-foreground">Enterprise overview for Monday, June 14</p>
            <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Live data</span>
          </div>
        </div>
        <div className="flex gap-2"><Btn variant="secondary" size="sm" onClick={() => navigate("reports-consultant")}><Download size={13} />Export</Btn><Btn variant="primary" size="sm" onClick={() => navigate("add-property")}><Plus size={13} />Add Property</Btn></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="Total Properties" value="1,248" sub="+12 this month" icon={<Building2 size={18} />} trend="+4.2%" trendUp color="bg-blue-50 text-blue-600" />
        <KpiCard label="Active Listings" value="342" icon={<FileText size={18} />} trend="+8" trendUp color="bg-amber-50 text-amber-600" />
        <KpiCard label="Open Tasks" value="89" sub="4 overdue" icon={<CheckSquare size={18} />} color="bg-orange-50 text-orange-600" />
        <KpiCard label="Follow-Up Due" value="34" icon={<BellRing size={18} />} color="bg-purple-50 text-purple-600" />
        <KpiCard label="Consultants" value="52" sub="4 active" icon={<Users size={18} />} color="bg-primary/10 text-primary" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4"><h2 className="text-sm font-semibold">Revenue & Forecast</h2><Badge label="Monthly vs projections" variant="muted" /></div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={DASH_AREA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0BB68A" stopOpacity={0.15} /><stop offset="95%" stopColor="#0BB68A" stopOpacity={0} /></linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.08} /><stop offset="95%" stopColor="#3B82F6" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)" }} />
              <Area type="monotone" dataKey="revenue" stroke="#0BB68A" strokeWidth={2.5} fill="url(#g1)" dot={false} name="Revenue" />
              <Area type="monotone" dataKey="forecast" stroke="#3B82F6" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#g2)" dot={false} name="Forecast" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-1">Property Mix</h2>
          <p className="text-xs text-muted-foreground mb-4">Distribution by type</p>
          <ResponsiveContainer width="100%" height={140}>
            <RechartsPieChart><Pie data={CHANNEL_PIE} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value" stroke="none">{CHANNEL_PIE.map((d, i) => <Cell key={`mix-${d.name}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie><Tooltip contentStyle={{ fontSize: 12, borderRadius: 10 }} /></RechartsPieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-1">{[["Apartments", "45%", "#0BB68A"], ["Villas", "28%", "#3B82F6"], ["Commercial", "15%", "#F59E0B"], ["Land", "12%", "#8B5CF6"]].map(([name, pct, color]) => (<div key={name as string} className="flex items-center gap-2 text-xs"><div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color as string }} /><span className="flex-1 text-muted-foreground">{name}</span><span className="font-semibold">{pct}</span></div>))}</div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3"><h2 className="text-sm font-semibold">Top Consultants</h2><button onClick={() => navigate("consultants")} className="text-xs text-primary hover:underline">View all</button></div>
          <div className="space-y-3">{CONSULTANTS.slice(0, 4).map((c, i) => (<div key={c.id} className="flex items-center gap-3"><span className="text-xs text-muted-foreground w-4 font-mono">{i + 1}</span><Avatar initials={c.avatar} size="sm" /><div className="flex-1 min-w-0"><p className="text-xs font-semibold truncate">{c.name}</p><p className="text-xs text-muted-foreground">{c.branch}</p></div><span className="text-xs font-semibold text-emerald-600">{fmtShort(c.revenue)}</span></div>))}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3"><h2 className="text-sm font-semibold">Recent Activity</h2><button onClick={() => navigate("activity")} className="text-xs text-primary hover:underline">See all</button></div>
          <div className="space-y-3">{ACTIVITY_LOGS.slice(0, 4).map((a) => (<div key={a.id} className="flex items-start gap-2.5"><div className="w-6 h-6 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">{a.type === "create" ? <Plus size={11} className="text-emerald-600" /> : a.type === "complete" ? <Check size={11} className="text-emerald-600" /> : <Edit2 size={11} className="text-blue-600" />}</div><div className="min-w-0 flex-1"><p className="text-xs font-medium truncate">{a.action}</p><p className="text-xs text-muted-foreground">{a.user} · {a.timestamp.split(" ")[1]}</p></div></div>))}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3"><h2 className="text-sm font-semibold">Upcoming Follow-Ups</h2><button onClick={() => navigate("follow-ups")} className="text-xs text-primary hover:underline">See all</button></div>
          <div className="space-y-3">{FOLLOWUPS.filter((f) => f.status === "scheduled").slice(0, 3).map((fu) => (<div key={fu.id} className="flex items-center gap-3"><div className={cx("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs", fu.type === "Call" ? "bg-blue-500" : fu.type === "Meeting" ? "bg-purple-500" : "bg-emerald-500")}>{fu.type === "Call" ? <Phone size={12} /> : fu.type === "Meeting" ? <Users size={12} /> : <MapPin size={12} />}</div><div className="min-w-0 flex-1"><p className="text-xs font-semibold truncate">{fu.contact}</p><p className="text-xs text-muted-foreground">{fu.date.split(" ")[0]}</p></div><span className="text-xs font-semibold text-primary">{fu.probability}%</span></div>))}</div>
        </Card>
      </div>
    </div>
  );
}

// ─── Properties ──────────────────────────────────────────────────────────────────

function PropertiesPage({ navigate, role }: { navigate: (p: Page) => void; role: Role }) {
  const [view, setView] = useState<"card" | "table">("table");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ consultant: "", type: "", transactionType: "", district: "", propertyStatus: "", priceMin: "", priceMax: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmArchive, setConfirmArchive] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const setFilter = (k: string, v: string) => { setFilters((p) => ({ ...p, [k]: v })); setCurrentPage(1); setSelected(new Set()); };

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };
  const SortIcon = ({ col }: { col: string }) => sortCol !== col ? <span className="text-muted-foreground/30 ml-1">↕</span> : sortDir === "asc" ? <span className="text-primary ml-1">↑</span> : <span className="text-primary ml-1">↓</span>;

  const toggleSelect = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected((s) => s.size === paginated.length ? new Set() : new Set(paginated.map((p) => p.id)));
  const filtered = PROPERTIES.filter((p) => {
    if (p.archived) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.internalCode.toLowerCase().includes(search.toLowerCase()) && !p.district.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.consultant && p.consultantId !== filters.consultant) return false;
    if (filters.type && p.type !== filters.type) return false;
    if (filters.transactionType && p.transactionType !== filters.transactionType) return false;
    if (filters.district && p.district !== filters.district) return false;
    if (filters.propertyStatus && p.propertyStatus !== filters.propertyStatus) return false;
    if (filters.priceMin && p.price < Number(filters.priceMin)) return false;
    if (filters.priceMax && p.price > Number(filters.priceMax)) return false;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    if (!sortCol) return 0;
    const av = (a as any)[sortCol]; const bv = (b as any)[sortCol];
    if (typeof av === "number") return sortDir === "asc" ? av - bv : bv - av;
    return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const rowActions = (p: typeof PROPERTIES[0]) => [
    { label: "View detail", icon: <Eye size={12} />, onClick: () => navigate("property-detail") },
    { label: "Edit property", icon: <Edit2 size={12} />, onClick: () => navigate("edit-property") },
    { label: "Archive", icon: <Archive size={12} />, onClick: () => setConfirmArchive(p.id) },
    { label: "Delete", icon: <Trash2 size={12} />, onClick: () => setConfirmDelete(p.id), danger: true },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Property Hub" subtitle={`Managing ${filtered.length} of ${PROPERTIES.length} properties`}
        actions={<Btn variant="primary" size="sm" onClick={() => navigate("add-property")}><Plus size={13} />Add Property</Btn>}
      />
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="relative flex-1 min-w-48 max-w-72">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search title, code, district…" className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border border-border bg-white outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={cx("flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors", showFilters || activeFilterCount > 0 ? "border-primary bg-primary/5 text-primary" : "border-border bg-white hover:bg-secondary")}>
          <SlidersHorizontal size={12} />Filters{activeFilterCount > 0 && <span className="w-4 h-4 rounded-full bg-primary text-white text-xs flex items-center justify-center">{activeFilterCount}</span>}
        </button>
        {activeFilterCount > 0 && <button onClick={() => { setFilters({ consultant: "", type: "", transactionType: "", district: "", propertyStatus: "", priceMin: "", priceMax: "" }); setCurrentPage(1); }} className="text-xs text-destructive hover:underline">Clear filters</button>}
        <div className="ml-auto flex items-center border border-border rounded-xl overflow-hidden bg-white">
          <button onClick={() => setView("card")} className={cx("px-2.5 py-1.5 transition-colors", view === "card" ? "bg-primary text-white" : "hover:bg-secondary text-muted-foreground")}><LayoutGrid size={14} /></button>
          <button onClick={() => setView("table")} className={cx("px-2.5 py-1.5 transition-colors", view === "table" ? "bg-primary text-white" : "hover:bg-secondary text-muted-foreground")}><List size={14} /></button>
        </div>
      </div>

      {showFilters && (
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Consultant filter — searchable combobox */}
            <ConsultantCombobox label="" value={filters.consultant} onChange={(v) => setFilter("consultant", v)} />
            <SelectField placeholder="All Types" value={filters.type} onChange={(v) => setFilter("type", v)} options={["Apartment", "Villa", "Townhouse", "Studio", "Penthouse", "Commercial"].map((t) => ({ label: t, value: t }))} />
            <SelectField placeholder="All Transactions" value={filters.transactionType} onChange={(v) => setFilter("transactionType", v)} options={TRANSACTION_TYPES.map((t) => ({ label: t, value: t }))} />
            {/* District filter — inline searchable dropdown */}
            <DistrictCombobox value={filters.district} onChange={(v) => setFilter("district", v)} />
            <SelectField placeholder="All Statuses" value={filters.propertyStatus} onChange={(v) => setFilter("propertyStatus", v)} options={PROPERTY_STATUSES.map((s) => ({ label: s, value: s }))} />
            <div className="flex gap-1.5">
              <input type="number" placeholder="Min AED" value={filters.priceMin} onChange={(e) => setFilter("priceMin", e.target.value)} className="w-full rounded-xl border border-border bg-input-background px-2.5 py-2 text-xs outline-none focus:ring-2 focus:ring-ring" />
              <input type="number" placeholder="Max AED" value={filters.priceMax} onChange={(e) => setFilter("priceMax", e.target.value)} className="w-full rounded-xl border border-border bg-input-background px-2.5 py-2 text-xs outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </Card>
      )}

      {view === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((p) => (
            <Card key={p.id} hover onClick={() => navigate("property-detail")} className="overflow-hidden">
              <div className={cx("h-36 relative bg-gradient-to-br flex items-end p-4", p.gradient)}>
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">{statusBadge(p.propertyStatus)}<Badge label={p.transactionType} variant="muted" /></div>
                <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}><ActionMenu actions={rowActions(p)} /></div>
                <div><div className="text-2xl font-bold text-white">{fmtShort(p.price)}</div><div className="text-white/70 text-xs flex items-center gap-1"><MapPin size={10} />{p.district}</div></div>
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground font-mono mb-0.5">{p.internalCode}</p>
                <h3 className="text-sm font-semibold mb-2 line-clamp-1">{p.title}</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">{p.beds > 0 && <span>{p.beds} bd</span>}<span>{p.area.toLocaleString()} sqft</span><span>Fl. {p.floor}</span></div>
                  <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">{p.roi}% ROI</span>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  <Avatar initials={p.consultant.split(" ").map((w) => w[0]).join("")} size="xs" />
                  <span className="text-xs text-muted-foreground truncate flex-1">{p.consultant}</span>
                  <span className="text-xs text-muted-foreground">{p.views} views</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          {selected.size > 0 && (
            <div className="mb-3">
              <BulkActionBar count={selected.size}
                onArchive={() => { setSelected(new Set()); toast({ type: "success", message: `${selected.size} properties archived.` }); }}
                onDelete={() => { setSelected(new Set()); toast({ type: "error", message: `${selected.size} properties deleted.` }); }}
                onClear={() => setSelected(new Set())} />
            </div>
          )}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <input type="checkbox" checked={paginated.length > 0 && paginated.every((p) => selected.has(p.id))} onChange={toggleAll} className="rounded" />
                    </th>
                    {[["internalCode", "Code"], ["title", "Property"], ["type", "Type"], ["transactionType", "Transaction"], ["district", "District"], ["floor", "Floor"], ["constructionYear", "Year"], ["price", "Price"], ["propertyStatus", "Status"], ["consultant", "Consultant"]].map(([col, label]) => (
                      <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap cursor-pointer hover:text-foreground select-none" onClick={() => toggleSort(col)}>
                        {label}<SortIcon col={col} />
                      </th>
                    ))}
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginated.length === 0 ? (
                    <tr><td colSpan={12} className="px-4 py-12 text-center text-sm text-muted-foreground">No properties match your filters.</td></tr>
                  ) : paginated.map((p) => (
                    <tr key={p.id} className={cx("hover:bg-secondary/30 transition-colors", selected.has(p.id) && "bg-primary/5")}>
                      <td className="px-4 py-3"><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} className="rounded" onClick={(e) => e.stopPropagation()} /></td>
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{p.internalCode}</td>
                      <td className="px-4 py-3"><p className="font-medium text-xs max-w-40 truncate">{p.title}</p></td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{p.type}</td>
                      <td className="px-4 py-3"><Badge label={p.transactionType} variant="muted" /></td>
                      <td className="px-4 py-3 text-xs"><span className="flex items-center gap-1"><MapPin size={10} className="text-muted-foreground" />{p.district}</span></td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{p.floor}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{p.constructionYear}</td>
                      <td className="px-4 py-3 text-xs font-semibold font-mono">{fmtShort(p.price)}</td>
                      <td className="px-4 py-3">{statusBadge(p.propertyStatus)}</td>
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar initials={p.consultant.split(" ").map((w) => w[0]).join("")} size="xs" /><span className="text-xs">{p.consultant.split(" ")[0]}</span></div></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-0.5">
                          <button onClick={() => navigate("property-detail")} className="p-1.5 hover:bg-secondary rounded-lg transition-colors" title="View"><Eye size={13} className="text-muted-foreground" /></button>
                          <button onClick={() => navigate("edit-property")} className="p-1.5 hover:bg-secondary rounded-lg transition-colors" title="Edit"><Edit2 size={13} className="text-muted-foreground" /></button>
                          <button onClick={() => setConfirmArchive(p.id)} className="p-1.5 hover:bg-amber-50 rounded-lg transition-colors" title="Archive"><Archive size={13} className="text-muted-foreground" /></button>
                          <button onClick={() => setConfirmDelete(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={13} className="text-muted-foreground" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-border bg-white sticky bottom-0">
              <Pagination page={currentPage} total={sorted.length} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }} />
            </div>
          </Card>
        </div>
      )}
      {view === "card" && (
        <div className="mt-4 px-1">
          <Pagination page={currentPage} total={sorted.length} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }} />
        </div>
      )}
      <ConfirmModal open={!!confirmArchive} title="Archive property?" message="This property will be archived and hidden from active listings. It can be restored by an administrator." onConfirm={() => { setConfirmArchive(null); toast({ type: "success", message: "Property archived." }); }} onCancel={() => setConfirmArchive(null)} />
      <ConfirmModal open={!!confirmDelete} title="Delete property?" danger message="This will permanently delete the property and all associated data. This cannot be undone." onConfirm={() => { setConfirmDelete(null); toast({ type: "success", message: "Property deleted." }); }} onCancel={() => setConfirmDelete(null)} />
    </div>
  );
}

// ─── Property Detail ──────────────────────────────────────────────────────────────

function PropertyDetail({ navigate, role }: { navigate: (p: Page) => void; role: Role }) {
  const [tab, setTab] = useState("Overview");
  const [propStatus, setPropStatus] = useState(PROPERTIES[0].propertyStatus);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const p = PROPERTIES[0];
  const tabs = ["Overview", "Gallery", "Docs", "Listings", "Tasks", "Follow-Ups", "Log"];
  const GALLERY_IDS = ["1582268611958-ebfd161ef9cf", "1560448204-e02f11c3d0e2", "1484154218962-a197022b5858", "1505693416388-ac5ce068fe85", "1556909114-f6e7ad7d3136", "1502005229762-cf1b2da7c5d6"];
  const [gallery, setGallery] = useState(GALLERY_IDS);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-white px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground"><button onClick={() => navigate("properties")} className="hover:text-foreground">Properties</button><ChevronRight size={12} /><span className="text-foreground font-medium">{p.internalCode}</span></div>
            <h1 className="text-lg font-bold">{p.title}</h1>
            <div className="flex items-center gap-2 mt-1">{statusBadge(propStatus)}<Badge label={p.transactionType} variant="muted" /><span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={10} />{p.district}</span><span className="text-xs text-muted-foreground">· Floor {p.floor} · Built {p.constructionYear}</span></div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Btn variant="secondary" size="sm" onClick={() => navigate("edit-property")}><Edit2 size={13} />Edit</Btn>
            <Btn variant="secondary" size="sm" onClick={() => setConfirmArchive(true)}><Archive size={13} />Archive</Btn>
            <Btn variant="danger" size="sm" onClick={() => setConfirmDelete(true)}><Trash2 size={13} />Delete</Btn>
            <Btn variant="primary" size="sm" onClick={() => navigate("create-listing")}><Plus size={13} />Create Listing</Btn>
          </div>
        </div>
        <div className="flex gap-0 mt-4 -mb-4">{tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={cx("px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap", tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>{t}</button>)}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-background">
        {tab === "Overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-6xl">
            <div className="lg:col-span-2 space-y-5">
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Property Details</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Status:</span>
                    <select value={propStatus} onChange={(e) => setPropStatus(e.target.value)} className="text-xs rounded-lg border border-border bg-input-background px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-ring">
                      {PROPERTY_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <Btn variant="primary" size="xs" onClick={() => toast({ type: "success", message: "Status updated." })}><Check size={11} />Save</Btn>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[["Internal Code", p.internalCode], ["Type", p.type], ["Transaction", p.transactionType], ["Floor", p.floor], ["Built", p.constructionYear], ["Area", `${p.area.toLocaleString()} sqft`], ["Bedrooms", p.beds || "N/A"], ["Price", fmtShort(p.price)], ["ROI", `${p.roi}%`]].map(([k, v]) => (
                    <div key={k as string} className="p-3 bg-secondary rounded-xl"><p className="text-xs text-muted-foreground mb-1">{k}</p><p className="text-sm font-semibold">{v as string}</p></div>
                  ))}
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="text-sm font-semibold mb-2">Full Address</h3>
                <p className="text-sm text-foreground flex items-start gap-2"><MapPin size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />{p.fullAddress}</p>
              </Card>
            </div>
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Performance</h3>
                <div className="space-y-3">{[["Total views", p.views], ["Viewings", 5], ["Offers", 2]].map(([k, v]) => (<div key={k as string} className="flex justify-between items-center"><span className="text-xs text-muted-foreground">{k}</span><span className="text-sm font-bold font-mono">{v}</span></div>))}</div>
              </Card>
              <Card className="p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Consultant</h3>
                <div className="flex items-center gap-3 mb-3"><Avatar initials={p.consultant.split(" ").map((w) => w[0]).join("")} size="md" /><div><p className="text-sm font-semibold">{p.consultant}</p><p className="text-xs text-muted-foreground">Senior Consultant</p></div></div>
                <div className="flex gap-2"><Btn variant="secondary" size="sm" className="flex-1 justify-center"><Phone size={12} />Call</Btn><Btn variant="secondary" size="sm" className="flex-1 justify-center"><Mail size={12} />Email</Btn></div>
              </Card>
            </div>
          </div>
        )}
        {tab === "Gallery" && (
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-4"><p className="text-sm font-semibold">{gallery.length} photos</p><p className="text-xs text-muted-foreground">Drag to reorder · Hover to remove</p></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
              {gallery.map((id, i) => (
                <div key={id} className="aspect-square rounded-xl overflow-hidden bg-secondary group cursor-pointer relative">
                  <img src={`https://images.unsplash.com/photo-${id}?w=300&h=300&fit=crop&auto=format`} alt={`Photo ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <button onClick={() => setGallery((g) => g.filter((x) => x !== id))} className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={11} className="text-red-600" /></button>
                  <div className="absolute top-2 left-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"><GripVertical size={11} className="text-muted-foreground" /></div>
                </div>
              ))}
              <div className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"><Upload size={20} className="text-muted-foreground mb-2" /><span className="text-xs text-muted-foreground">Upload</span></div>
            </div>
            <div className="p-4 bg-secondary rounded-2xl border-2 border-dashed border-border flex items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"><Upload size={16} className="text-muted-foreground" /><span className="text-sm text-muted-foreground">Drag & drop multiple photos here to upload</span></div>
          </div>
        )}
        {tab !== "Overview" && tab !== "Gallery" && (
          <div className="max-w-3xl space-y-3">
            {(tab === "Tasks" ? TASKS.filter((t) => t.propertyId === p.id) : tab === "Follow-Ups" ? FOLLOWUPS.filter((f) => f.propertyId === p.id) : ACTIVITY_LOGS.slice(0, 4)).map((item: any) => (
              <Card key={item.id} className="p-4 flex items-start justify-between gap-3">
                <div><p className="text-sm font-medium">{item.title || item.action}</p><p className="text-xs text-muted-foreground mt-0.5">{item.assignee || item.consultant || item.user} · {item.due || item.date || item.timestamp}</p></div>
                {statusBadge(item.status || item.priority || item.type || "update")}
              </Card>
            ))}
          </div>
        )}
      </div>
      <ConfirmModal open={confirmArchive} title="Archive property?" message="This property will be archived and hidden from active listings. It can be restored later." onConfirm={() => { setConfirmArchive(false); toast({ type: "success", message: "Property archived." }); navigate("properties"); }} onCancel={() => setConfirmArchive(false)} />
      <ConfirmModal open={confirmDelete} danger title="Delete property?" message="This will permanently delete the property and all associated data. This cannot be undone." onConfirm={() => { setConfirmDelete(false); toast({ type: "success", message: "Property deleted." }); navigate("properties"); }} onCancel={() => setConfirmDelete(false)} />
    </div>
  );
}

// ─── Add Property Wizard ────────────────────────────────────────────────────────────

function AddPropertyWizard({ navigate, role }: { navigate: (p: Page) => void; role: Role }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: "", internalCode: "", type: "Apartment", transactionType: "Sale", price: "", beds: "", area: "", floor: "", constructionYear: "", district: "", fullAddress: "", description: "", consultant: "" });
  const [gallery, setGallery] = useState<string[]>([]);
  const total = 5;
  const labels = ["Basic Info", "Details", "Location", "Media", "Review"];
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-1.5 mb-6 text-xs text-muted-foreground"><button onClick={() => navigate("properties")} className="hover:text-foreground">Properties</button><ChevronRight size={12} /><span className="text-foreground font-medium">Add Property</span></div>
      <div className="flex items-center gap-0 mb-8">
        {labels.map((label, i) => {
          const n = i + 1; const done = n < step; const active = n === step;
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={cx("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all", done ? "bg-emerald-500 text-white" : active ? "bg-primary text-white shadow-md shadow-primary/30" : "bg-secondary text-muted-foreground border border-border")}>{done ? <Check size={14} /> : n}</div>
                <span className={cx("text-xs mt-1 whitespace-nowrap font-medium", active ? "text-primary" : done ? "text-emerald-600" : "text-muted-foreground")}>{label}</span>
              </div>
              {i < labels.length - 1 && <div className={cx("flex-1 h-0.5 mx-2 mb-4 rounded-full", done ? "bg-emerald-400" : "bg-border")} />}
            </div>
          );
        })}
      </div>

      <Card className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold mb-1">Basic Information</h2>
            <Input label="Property title" placeholder="e.g. Marina Heights Tower B – Unit 2204" value={form.title} onChange={(v) => set("title", v)} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Internal code" placeholder="e.g. ZX-2204-MH" value={form.internalCode} onChange={(v) => set("internalCode", v)} required />
              <SelectField label="Transaction type" value={form.transactionType} onChange={(v) => set("transactionType", v)} options={TRANSACTION_TYPES.map((t) => ({ label: t, value: t }))} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Property type" value={form.type} onChange={(v) => set("type", v)} options={["Apartment", "Villa", "Townhouse", "Studio", "Penthouse", "Commercial"].map((t) => ({ label: t, value: t }))} required />
              <Input label="Price (AED)" type="number" placeholder="2500000" value={form.price} onChange={(v) => set("price", v)} required />
            </div>
            <Input label="Bedrooms" type="number" placeholder="3 (leave blank if N/A)" value={form.beds} onChange={(v) => set("beds", v)} />
            {/* Consultant selector: Admin only */}
            {role === "admin" && <ConsultantCombobox label="Assign consultant" value={form.consultant} onChange={(v) => set("consultant", v)} required />}
            {role === "consultant" && <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center gap-2 text-xs text-primary"><User size={13} />This property will be assigned to you automatically.</div>}
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold mb-1">Property Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Area (sqft)" type="number" placeholder="1500" value={form.area} onChange={(v) => set("area", v)} required />
              <Input label="Floor number" type="number" placeholder="e.g. 22" value={form.floor} onChange={(v) => set("floor", v)} />
            </div>
            <Input label="Construction year" type="number" placeholder="e.g. 2019" value={form.constructionYear} onChange={(v) => set("constructionYear", v)} />
            <Input label="Description" placeholder="Describe the property features and key selling points…" value={form.description} onChange={(v) => set("description", v)} textarea rows={5} />
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold mb-1">Location & Map</h2>
            <SelectField label="District / Community" value={form.district} onChange={(v) => set("district", v)} placeholder="Select district…" options={DISTRICTS.map((d) => ({ label: d, value: d }))} required />
            <Input label="Full address" placeholder="Unit no., Building, Street, District, City, Country" value={form.fullAddress} onChange={(v) => set("fullAddress", v)} required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Latitude" placeholder="e.g. 25.0805" value="" onChange={() => {}} />
              <Input label="Longitude" placeholder="e.g. 55.1403" value="" onChange={() => {}} />
            </div>
            <div className="h-44 rounded-2xl bg-secondary border-2 border-dashed border-border flex items-center justify-center"><div className="text-center"><MapPin size={24} className="text-muted-foreground mx-auto mb-2" /><p className="text-sm text-muted-foreground">Click to place pin on map</p><p className="text-xs text-muted-foreground mt-1">Coordinates will auto-fill above</p></div></div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold mb-1">Media Upload</h2>
            <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer" onClick={() => setGallery((g) => [...g, `img-${g.length}`])}>
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4"><Upload size={22} className="text-muted-foreground" /></div>
              <p className="text-sm font-semibold mb-1">Drop photos here or click to browse</p>
              <p className="text-xs text-muted-foreground">JPEG, PNG, WebP · Max 20MB each · Up to 30 photos</p>
            </div>
            {gallery.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2"><p className="text-xs font-semibold">{gallery.length} photos queued</p><p className="text-xs text-muted-foreground">Drag to reorder · × to remove</p></div>
                <div className="grid grid-cols-5 gap-2">
                  {gallery.map((id, i) => (
                    <div key={id} className="aspect-square rounded-lg bg-secondary/80 border border-border flex flex-col items-center justify-center relative group text-xs text-muted-foreground cursor-grab">
                      Photo {i + 1}
                      <button onClick={() => setGallery((g) => g.filter((x) => x !== id))} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold mb-1">Review & Submit</h2>
            <div className="rounded-xl bg-secondary p-4 space-y-3">
              {[
                ["Title", form.title || "Marina Heights Tower B – Unit 2204"],
                ["Internal Code", form.internalCode || "ZX-2204-MH"],
                ["Transaction", form.transactionType],
                ["Type", form.type],
                ["Price", form.price ? fmtShort(Number(form.price)) : "AED 2.85M"],
                ["Bedrooms", form.beds || "N/A"],
                ["Area", `${form.area || "1,420"} sqft`],
                ["Floor", form.floor || "22"],
                ["Built", form.constructionYear || "2019"],
                ["District", form.district || "Dubai Marina"],
                ["Full Address", form.fullAddress || "Unit 2204, Tower B, Marina Heights, Dubai Marina"],
                role === "admin"
                  ? ["Consultant", CONSULTANTS.find((c) => c.id === form.consultant)?.name || "Not assigned"]
                  : ["Assigned to", "You (Layla Al-Rashidi)"],
                ["Photos", `${gallery.length} uploaded`],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between py-1.5 border-b border-border/50 last:border-0"><span className="text-sm text-muted-foreground">{k}</span><span className="text-sm font-semibold text-right max-w-xs truncate">{v}</span></div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2.5"><Info size={14} className="text-blue-600 flex-shrink-0 mt-0.5" /><p className="text-xs text-blue-700">After creation you can manage listings, documents, and tasks from the property detail page.</p></div>
          </div>
        )}
      </Card>

      <div className="flex justify-between mt-4">
        <Btn variant="secondary" onClick={() => step > 1 ? setStep(step - 1) : navigate("properties")}><ChevronLeft size={14} />{step > 1 ? "Back" : "Cancel"}</Btn>
        {step < total ? <Btn variant="primary" onClick={() => setStep(step + 1)}>Continue <ChevronRight size={14} /></Btn> : <Btn variant="primary" onClick={() => { toast({ type: "success", message: "Property created successfully!" }); navigate("properties"); }}><Check size={14} />Create Property</Btn>}
      </div>
    </div>
  );
}

// ─── Edit Property Workspace ──────────────────────────────────────────────────────

function EditPropertyWizard({ navigate, role }: { navigate: (p: Page) => void; role: Role }) {
  // Pre-fill from the first property as the "currently selected" one (in real app: from router param)
  const existing = PROPERTIES[0];
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: existing.title,
    internalCode: existing.internalCode,
    type: existing.type,
    transactionType: existing.transactionType,
    price: String(existing.price),
    beds: String(existing.beds),
    area: String(existing.area),
    floor: String(existing.floor),
    constructionYear: String(existing.constructionYear),
    district: existing.district,
    fullAddress: existing.fullAddress,
    description: "A stunning property in the heart of " + existing.district + ", offering panoramic views and premium finishes throughout.",
    consultant: existing.consultantId,
  });
  const total = 4;
  const labels = ["Basic Info", "Details", "Location", "Review"];
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-1.5 mb-6 text-xs text-muted-foreground">
        <button onClick={() => navigate("properties")} className="hover:text-foreground">Properties</button>
        <ChevronRight size={12} /><button onClick={() => navigate("property-detail")} className="hover:text-foreground">{existing.internalCode}</button>
        <ChevronRight size={12} /><span className="text-foreground font-medium">Edit Property</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold">Edit Property</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="text-xs text-amber-700 font-medium">Editing existing record — changes are saved on submit</span>
        </div>
      </div>

      <div className="flex items-center gap-0 mb-8">
        {labels.map((label, i) => {
          const n = i + 1; const done = n < step; const active = n === step;
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={cx("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all", done ? "bg-emerald-500 text-white" : active ? "bg-primary text-white shadow-md shadow-primary/30" : "bg-secondary text-muted-foreground border border-border")}>
                  {done ? <Check size={14} /> : n}
                </div>
                <span className={cx("text-xs mt-1 whitespace-nowrap font-medium", active ? "text-primary" : done ? "text-emerald-600" : "text-muted-foreground")}>{label}</span>
              </div>
              {i < labels.length - 1 && <div className={cx("flex-1 h-0.5 mx-2 mb-4 rounded-full", done ? "bg-emerald-400" : "bg-border")} />}
            </div>
          );
        })}
      </div>

      <Card className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold mb-1">Basic Information</h2>
            <Input label="Property title" value={form.title} onChange={(v) => set("title", v)} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Internal code" value={form.internalCode} onChange={(v) => set("internalCode", v)} required />
              <SelectField label="Transaction type" value={form.transactionType} onChange={(v) => set("transactionType", v)} options={TRANSACTION_TYPES.map((t) => ({ label: t, value: t }))} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Property type" value={form.type} onChange={(v) => set("type", v)} options={["Apartment", "Villa", "Townhouse", "Studio", "Penthouse", "Commercial"].map((t) => ({ label: t, value: t }))} required />
              <Input label="Price (AED)" type="number" value={form.price} onChange={(v) => set("price", v)} required />
            </div>
            <Input label="Bedrooms" type="number" value={form.beds} onChange={(v) => set("beds", v)} />
            {role === "admin" && <ConsultantCombobox label="Assigned consultant" value={form.consultant} onChange={(v) => set("consultant", v)} required />}
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold mb-1">Property Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Area (sqft)" type="number" value={form.area} onChange={(v) => set("area", v)} required />
              <Input label="Floor number" type="number" value={form.floor} onChange={(v) => set("floor", v)} />
            </div>
            <Input label="Construction year" type="number" value={form.constructionYear} onChange={(v) => set("constructionYear", v)} />
            <Input label="Description" value={form.description} onChange={(v) => set("description", v)} textarea rows={5} />
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold mb-1">Location</h2>
            <SelectField label="District / Community" value={form.district} onChange={(v) => set("district", v)} options={DISTRICTS.map((d) => ({ label: d, value: d }))} required />
            <Input label="Full address" value={form.fullAddress} onChange={(v) => set("fullAddress", v)} required />
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold mb-1">Review Changes</h2>
            <div className="rounded-xl bg-secondary p-4 space-y-3">
              {[["Title", form.title], ["Code", form.internalCode], ["Type", form.type], ["Transaction", form.transactionType], ["Price", fmtShort(Number(form.price))], ["Floor", form.floor], ["Built", form.constructionYear], ["District", form.district], ["Consultant", CONSULTANTS.find((c) => c.id === form.consultant)?.name || "—"]].map(([k, v]) => (
                <div key={k as string} className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{k}</span><span className="text-sm font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
              <Check size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" /><p className="text-xs text-emerald-700">Changes will be saved immediately. The property status and listings remain unchanged.</p>
            </div>
          </div>
        )}
      </Card>

      <div className="flex justify-between mt-4">
        <Btn variant="secondary" onClick={() => step > 1 ? setStep(step - 1) : navigate("property-detail")}><ChevronLeft size={14} />{step > 1 ? "Back" : "Cancel"}</Btn>
        {step < total
          ? <Btn variant="primary" onClick={() => setStep(step + 1)}>Continue <ChevronRight size={14} /></Btn>
          : <Btn variant="primary" onClick={() => { toast({ type: "success", message: "Property updated successfully." }); navigate("property-detail"); }}><Check size={14} />Save Changes</Btn>}
      </div>
    </div>
  );
}

// ─── Listings ──────────────────────────────────────────────────────────────────────

// Listing status metadata for rich status display
const LISTING_STATUS_META: Record<string, { icon: React.ReactNode; desc: string; next: string[] }> = {
  "Draft":            { icon: <Edit2 size={11} />,    desc: "Not yet submitted for review",          next: ["Pending Approval"] },
  "Pending Approval": { icon: <Clock size={11} />,    desc: "Awaiting administrator approval",       next: ["Published", "Draft"] },
  "Published":        { icon: <CheckCircle2 size={11} />, desc: "Live on selected portals",         next: ["Inactive", "Expired"] },
  "Expired":          { icon: <AlertCircle size={11} />,  desc: "Past expiration date",             next: ["Draft", "Inactive"] },
  "Inactive":         { icon: <Archive size={11} />,  desc: "Manually deactivated",                 next: ["Draft"] },
};

function StatusChangeModal({ listing, onClose, isAdmin }: { listing: typeof LISTINGS[0]; onClose: () => void; isAdmin: boolean }) {
  const meta = LISTING_STATUS_META[listing.status];
  const allowed = LISTING_STATUSES;
  const [next, setNext] = useState(allowed[0] || "");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <Card className="w-full max-w-sm p-6 shadow-2xl">
        <h3 className="text-base font-semibold mb-1">Change listing status</h3>
        <p className="text-xs text-muted-foreground mb-4">Current: {listing.status} — {meta?.desc}</p>
        <SelectField label="New status" value={next} onChange={setNext} options={allowed.map((s) => ({ label: s, value: s }))} />
        <div className="flex gap-2 justify-end mt-4">
          <Btn variant="secondary" size="sm" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" size="sm" onClick={() => { toast({ type: "success", message: `Listing moved to "${next}".` }); onClose(); }}><Check size={13} />Apply</Btn>
        </div>
      </Card>
    </div>
  );
}

function ListingsPage({ navigate, role, currentConsultantId }: { navigate: (p: Page) => void; role?: Role; currentConsultantId?: string | null }) {
  const isAdmin = role === "admin";
  const [view, setView] = useState<"table" | "card">("table");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", consultant: "", property: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [statusModal, setStatusModal] = useState<typeof LISTINGS[0] | null>(null);

  const setFilter = (k: string, v: string) => { setFilters((p) => ({ ...p, [k]: v })); setCurrentPage(1); setSelected(new Set()); };
  const toggleSort = (col: string) => { if (sortCol === col) setSortDir((d) => d === "asc" ? "desc" : "asc"); else { setSortCol(col); setSortDir("asc"); } };
  const SortIcon = ({ col }: { col: string }) => sortCol !== col ? <span className="text-muted-foreground/30 ml-1">↕</span> : sortDir === "asc" ? <span className="text-primary ml-1">↑</span> : <span className="text-primary ml-1">↓</span>;
  
  const filtered = LISTINGS.filter((l) => {
    if (role === "consultant" && currentConsultantId && l.consultantId !== currentConsultantId) return false;
    if (search && !l.property.toLowerCase().includes(search.toLowerCase()) && !l.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.status && l.status !== filters.status) return false;
    if (filters.consultant && l.consultantId !== filters.consultant) return false;
    if (filters.property && l.propertyId !== filters.property) return false;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    if (!sortCol) return 0;
    const av = (a as any)[sortCol]; const bv = (b as any)[sortCol];
    if (typeof av === "number") return sortDir === "asc" ? av - bv : bv - av;
    return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelect = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected((s) => s.size === paginated.length ? new Set() : new Set(paginated.map((l) => l.id)));

  const rowActions = (l: typeof LISTINGS[0]) => [
    { label: "View detail", icon: <Eye size={12} />, onClick: () => navigate("listing-detail") },
    { label: "Edit listing", icon: <Edit2 size={12} />, onClick: () => navigate(`edit-listing?id=${l.id}` as any) },
    { label: "Change status", icon: <RefreshCw size={12} />, onClick: () => setStatusModal(l) },
    { label: "Archive", icon: <Archive size={12} />, onClick: () => toast({ type: "warning", message: "Listing archived." }) },
    { label: "Delete", icon: <Trash2 size={12} />, onClick: () => setConfirmDelete(l.id), danger: true },
  ];

  const totalViews = LISTINGS.reduce((s, l) => s + l.views, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Listings Command Center" subtitle={`${LISTINGS.filter((l) => l.status === "Published").length} published · ${LISTINGS.length} total`}
        actions={<Btn variant="primary" size="sm" onClick={() => navigate("create-listing")}><Plus size={13} />New Listing</Btn>}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <KpiCard label="Published" value={LISTINGS.filter((l) => l.status === "Published").length.toString()} icon={<FileText size={16} />} color="bg-primary/10 text-primary" />
        <KpiCard label="Total Impressions" value={`${(totalViews / 1000).toFixed(1)}K`} icon={<Eye size={16} />} color="bg-blue-50 text-blue-600" />
        <KpiCard label="Avg. Score" value="86/100" icon={<Award size={16} />} color="bg-purple-50 text-purple-600" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="relative min-w-48 flex-1 max-w-64">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search listings…" className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border border-border bg-white outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {["", ...LISTING_STATUSES].map((s) => (
            <button key={s || "all"} onClick={() => setFilter("status", s)} className={cx("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1", filters.status === s ? "bg-primary text-white shadow-sm" : "bg-white border border-border hover:bg-secondary")}>
              {s && LISTING_STATUS_META[s]?.icon}{s || "All"}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {isAdmin && <ConsultantCombobox label="" value={filters.consultant} onChange={(v) => setFilter("consultant", v)} />}
          <PropertyCombobox label="" value={filters.property} onChange={(v) => setFilter("property", v)} />
          {(filters.status || filters.consultant || filters.property || search) && <button onClick={() => { setFilters({ status: "", consultant: "", property: "" }); setSearch(""); setCurrentPage(1); }} className="text-xs text-destructive hover:underline whitespace-nowrap">Clear</button>}
          {/* View toggle — same pattern as Property List */}
          <div className="flex items-center border border-border rounded-xl overflow-hidden bg-white ml-1">
            <button onClick={() => setView("table")} className={cx("px-2.5 py-1.5 transition-colors", view === "table" ? "bg-primary text-white" : "hover:bg-secondary text-muted-foreground")} title="Table view"><List size={14} /></button>
            <button onClick={() => setView("card")} className={cx("px-2.5 py-1.5 transition-colors", view === "card" ? "bg-primary text-white" : "hover:bg-secondary text-muted-foreground")} title="Card view"><LayoutGrid size={14} /></button>
          </div>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="mb-3">
          <BulkActionBar count={selected.size}
            onArchive={() => { setSelected(new Set()); toast({ type: "success", message: `${selected.size} listings archived.` }); }}
            onDelete={() => { setSelected(new Set()); toast({ type: "error", message: `${selected.size} listings deleted.` }); }}
            onClear={() => setSelected(new Set())} />
        </div>
      )}

      {/* Card view */}
      {view === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.length === 0 ? (
            <div className="col-span-full py-16 text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center"><FileText size={20} className="text-muted-foreground" /></div>
              <p className="text-sm font-medium">No listings found</p>
              <Btn variant="primary" size="sm" onClick={() => navigate("create-listing")}><Plus size={13} />Create first listing</Btn>
            </div>
          ) : paginated.map((l) => {
            const prop = PROPERTIES.find((p) => p.id === l.propertyId);
            return (
              <Card key={l.id} hover onClick={() => navigate("listing-detail")} className="overflow-hidden">
                <div className={cx("h-28 relative flex items-end p-4", prop ? `bg-gradient-to-br ${prop.gradient}` : "bg-gradient-to-br from-slate-400 to-slate-600")}>
                  <div className="absolute top-3 left-3">{statusBadge(l.status)}</div>
                  <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}><ActionMenu actions={rowActions(l)} /></div>
                  {l.score > 0 && <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-0.5"><span className={cx("text-xs font-bold text-white")}>{l.score}/100</span></div>}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold mb-1 truncate">{l.property}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{l.id}</p>
                  <div className="flex flex-wrap gap-1 mb-3">{l.channels.map((c) => <Badge key={c} label={c} variant="muted" />)}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><p className="text-muted-foreground">Views</p><p className="font-semibold">{l.views.toLocaleString()}</p></div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                    <Avatar initials={l.consultant.split(" ").map((w) => w[0]).join("")} size="xs" />
                    <span className="text-xs text-muted-foreground truncate flex-1">{l.consultant}</span>
                    {l.status === "Pending Approval" && isAdmin && <Btn variant="primary" size="xs" onClick={(e) => { e.stopPropagation(); toast({ type: "success", message: "Listing approved." }); }}><Check size={11} />Approve</Btn>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Table */}
      {view === "table" && <Card className="overflow-hidden">
        <div className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 w-10"><input type="checkbox" checked={paginated.length > 0 && paginated.every((l) => selected.has(l.id))} onChange={toggleAll} className="rounded" /></th>
                {[["status", "Status"], ["property", "Property"], ["channels", "Channels"], ["views", "Views"], ["score", "Score"], ["publishedAt", "Published"], ["expires", "Expires"], ["consultant", "Consultant"]].map(([col, label]) => (
                  <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap cursor-pointer hover:text-foreground select-none" onClick={() => toggleSort(col)}>
                    {label}<SortIcon col={col} />
                  </th>
                ))}
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.length === 0 ? (
                <tr><td colSpan={11} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center"><FileText size={20} className="text-muted-foreground" /></div>
                    <p className="text-sm font-medium">No listings found</p>
                    <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
                    <Btn variant="primary" size="sm" onClick={() => navigate("create-listing")}><Plus size={13} />Create first listing</Btn>
                  </div>
                </td></tr>
              ) : paginated.map((l) => (
                <tr key={l.id} className={cx("hover:bg-secondary/30 transition-colors", selected.has(l.id) && "bg-primary/5")}>
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.has(l.id)} onChange={() => toggleSelect(l.id)} className="rounded" /></td>
                  <td className="px-4 py-3">{statusBadge(l.status)}</td>
                  <td className="px-4 py-3"><p className="text-xs font-semibold max-w-44 truncate">{l.property}</p><p className="text-xs text-muted-foreground">{l.id}</p></td>
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{l.channels.map((c) => <Badge key={c} label={c} variant="muted" />)}</div></td>
                  <td className="px-4 py-3 text-xs font-mono font-semibold">{l.views.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {l.score > 0 ? <div className="flex items-center gap-2"><div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${l.score}%` }} /></div><span className={cx("text-xs font-semibold", l.score >= 80 ? "text-emerald-600" : l.score >= 60 ? "text-amber-600" : "text-red-500")}>{l.score}</span></div> : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{l.publishedAt || "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{l.expires || "—"}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar initials={l.consultant.split(" ").map((w) => w[0]).join("")} size="xs" /><span className="text-xs">{l.consultant.split(" ")[0]}</span></div></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      {l.status === "Pending Approval" && isAdmin && <Btn variant="primary" size="xs" onClick={() => toast({ type: "success", message: "Listing approved." })}><Check size={11} />Approve</Btn>}
                      <ActionMenu actions={rowActions(l)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border bg-white sticky bottom-0">
          <Pagination page={currentPage} total={sorted.length} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }} />
        </div>
      </Card>}

      {/* Card view pagination */}
      {view === "card" && paginated.length > 0 && (
        <div className="mt-4">
          <Pagination page={currentPage} total={sorted.length} pageSize={pageSize} onPageChange={setCurrentPage} onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }} />
        </div>
      )}

      <ConfirmModal open={!!confirmDelete} title="Delete listing?" danger message="This listing will be permanently removed from all channels." onConfirm={() => { setConfirmDelete(null); toast({ type: "success", message: "Listing deleted." }); }} onCancel={() => setConfirmDelete(null)} />
      {statusModal && <StatusChangeModal listing={statusModal} onClose={() => setStatusModal(null)} isAdmin={isAdmin} />}
    </div>
  );
}

// ─── Create Listing Wizard ────────────────────────────────────────────────────────

function CreateListingWizard({ navigate, role, preselectedPropertyId, currentConsultant }: { 
  navigate: (p: Page) => void; role?: Role; preselectedPropertyId?: string; currentConsultant?: typeof CONSULTANTS[number] | null 
}) {
  // If launched from Property Details, skip directly to step 2 and lock the property field
  const [step, setStep] = useState(preselectedPropertyId ? 2 : 1);
  const propertyLocked = !!preselectedPropertyId;
  const total = 4;
  const labels = ["Basic Info", "Property", "Publication", "Review"];
  const [form, setForm] = useState(() => {
    const base = {
      title: "", 
      description: "", 
      propertyId: preselectedPropertyId || "",
      priority: "Medium",
      createdBy: "",
      assignedTo: "",
      channels: [] as string[], 
      publishDate: "", 
      expiryDate: "",
      featured: false,
    };

    return base;
  });
  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (role === "consultant" && currentConsultant) {
      setForm((p) => ({ ...p, createdBy: currentConsultant.id, assignedTo: currentConsultant.id }));
    }
  }, [role, currentConsultant]);
  const toggleChannel = (c: string) => set("channels", form.channels.includes(c) ? form.channels.filter((x) => x !== c) : [...form.channels, c]);
  const selectedProp = PROPERTIES.find((p) => p.id === form.propertyId);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-1.5 mb-6 text-xs text-muted-foreground">
        <button onClick={() => navigate("listings")} className="hover:text-foreground">Listings</button>
        <ChevronRight size={12} /><span className="text-foreground font-medium">Create Listing</span>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8">
        {labels.map((label, i) => {
          const n = i + 1; const done = n < step; const active = n === step;
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={cx("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all", done ? "bg-emerald-500 text-white" : active ? "bg-primary text-white shadow-md shadow-primary/30" : "bg-secondary text-muted-foreground border border-border")}>
                  {done ? <Check size={14} /> : n}
                </div>
                <span className={cx("text-xs mt-1 whitespace-nowrap font-medium", active ? "text-primary" : done ? "text-emerald-600" : "text-muted-foreground")}>{label}</span>
              </div>
              {i < labels.length - 1 && <div className={cx("flex-1 h-0.5 mx-2 mb-4 rounded-full", done ? "bg-emerald-400" : "bg-border")} />}
            </div>
          );
        })}
      </div>

      <Card className="p-6">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold mb-1">Basic Information</h2>
            <Input label="Listing title" placeholder="e.g. Marina Heights – Stunning 3BR with Sea View" value={form.title} onChange={(v) => set("title", v)} required />
            <Input label="Description" placeholder="Describe this listing's key highlights for portal visitors…" value={form.description} onChange={(v) => set("description", v)} textarea rows={5} />
            <SelectField label="Priority" value={form.priority} onChange={(v) => set("priority", v)} 
              options={[{ label: "Low", value: "Low" }, { label: "Medium", value: "Medium" }, { label: "High", value: "High" }]} required />
            <div className="space-y-3">
              {[
                ["featured", form.featured, "Featured listing", "Highlighted at the top of search results (additional cost applies)"]
              ].map(([key, checked, label, desc]) => (
                <div key={key as string} className="flex items-start gap-3 p-3 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer" onClick={() => set(key as string, !checked)}>
                  <input type="checkbox" checked={checked as boolean} onChange={() => {}} className="rounded mt-0.5" />
                  <div><p className="text-sm font-medium">{label as string}</p><p className="text-xs text-muted-foreground">{desc as string}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Related Property Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold mb-1">Select Property</h2>
                <p className="text-xs text-muted-foreground">{propertyLocked ? "Property pre-selected from Property Details — locked to this listing." : "Choose the property this listing will represent on portals."}</p>
              </div>
              {propertyLocked && <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-xl text-xs text-primary font-medium flex-shrink-0"><Check size={12} />Pre-selected</div>}
            </div>
            <PropertyCombobox
              label="Property" value={form.propertyId} onChange={(v) => set("propertyId", v)}
              locked={propertyLocked} lockedLabel={selectedProp?.title} required
            />
            {selectedProp && (
              <div className="p-4 bg-secondary rounded-xl border border-border">
                <div className="flex items-center gap-3">
                  <div className={cx("w-12 h-12 rounded-xl bg-gradient-to-br flex-shrink-0", selectedProp.gradient)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{selectedProp.title}</p>
                    <p className="text-xs text-muted-foreground">{selectedProp.district} · {selectedProp.internalCode}</p>
                    <p className="text-xs font-semibold text-emerald-600 mt-0.5">{fmtShort(selectedProp.price)} · {selectedProp.area.toLocaleString()} sqft · Fl. {selectedProp.floor}</p>
                  </div>
                </div>
              </div>
            )}
            {!form.propertyId && <p className="text-xs text-destructive">Please select a property to continue.</p>}
          </div>
        )}

        {/* Step 3: Publication Information */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold mb-1">Publication Information</h2>
            <div>
              <label className="text-sm font-medium mb-2 block">Portals & Channels <span className="text-primary">*</span></label>
              <div className="grid grid-cols-3 gap-2">
                {["Property Finder", "Bayut", "Dubizzle", "Houza", "JustProperty", "Yalla"].map((c) => (
                  <button key={c} type="button" onClick={() => toggleChannel(c)}
                    className={cx("px-3 py-2 rounded-xl border text-xs font-medium transition-all", form.channels.includes(c) ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/30")}>
                    {c}
                  </button>
                ))}
              </div>
              {form.channels.length === 0 && <p className="text-xs text-destructive mt-1">Select at least one channel.</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Publish date" type="date" value={form.publishDate} onChange={(v) => set("publishDate", v)} required />
              <Input label="Expiry date" type="date" value={form.expiryDate} onChange={(v) => set("expiryDate", v)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Created by <span className="text-primary">*</span></label>
              <ConsultantCombobox value={form.createdBy} onChange={(v) => set("createdBy", v)} 
                disabled={role === "consultant"} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Assigned to <span className="text-primary">*</span></label>
              <ConsultantCombobox value={form.assignedTo} onChange={(v) => set("assignedTo", v)} 
                disabled={role === "consultant"} />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold mb-1">Review & Submit</h2>
            <div className="rounded-xl bg-secondary p-4 space-y-3">
              {[
                ["Title", form.title || "Untitled"],
                ["Property", selectedProp?.title?.slice(0, 50) || "— Not selected —"],
                ["Channels", form.channels.join(", ") || "— None selected —"],
                ["Assigned to", form.assignedTo || "— Not selected —"],
                ["Created by", form.createdBy || "Manager (or Admin)"],
                ["Publish date", form.publishDate || "Immediately"],
                ["Featured", form.featured || "False"],
                ["Priority", form.priority],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{k}</span>
                  <span className="text-sm font-semibold text-right max-w-xs truncate">{v}</span>
                </div>
              ))}
            </div>
            {form.channels.length === 0 && <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2"><AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" /><p className="text-xs text-red-600">No channels selected. Please go back and select at least one portal.</p></div>}
            {form.channels.length > 0 && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2"><Info size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" /><p className="text-xs text-emerald-700">Listing will be submitted for admin approval before going live on portals.</p></div>}
          </div>
        )}
      </Card>

      <div className="flex justify-between mt-4">
        <Btn variant="secondary" onClick={() => step > 1 ? setStep(step - 1) : navigate("listings")}><ChevronLeft size={14} />{step > 1 ? "Back" : "Cancel"}</Btn>
        {step < total
          ? <Btn variant="primary" onClick={() => { if (step === 2 && !form.propertyId) { toast({ type: "error", message: "Please select a property." }); return; } if (step === 3 && form.channels.length === 0) { toast({ type: "error", message: "Select at least one channel." }); return; } setStep(step + 1); }}>Continue <ChevronRight size={14} /></Btn>
          : <Btn variant="primary" disabled={form.channels.length === 0} onClick={() => { toast({ type: "success", message: "Listing submitted for approval!" }); navigate("listings"); }}><Check size={14} />Submit Listing</Btn>
        }
      </div>
    </div>
  );
}

// ─── Tasks Kanban ──────────────────────────────────────────────────────────────────

function TasksKanban() {
  const [allTasks, setAllTasks] = useState(TASKS);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<typeof TASKS[0] | null>(null);
  const [search, setSearch] = useState("");
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium", taskType: "Viewing", assignee: "", propertyId: "", due: "", estimatedCompletion: "", status: "Pending", notes: "", attachments: false });

  // ── Filter panel state ──
  const [showFilter, setShowFilter] = useState(false);
  const [taskFilters, setTaskFilters] = useState({
    statuses: [] as string[], priorities: [] as string[], assignees: [] as string[],
    properties: [] as string[], taskTypes: [] as string[],
    dueDateFrom: "", dueDateTo: "", completionStatus: "",
  });

  const toggleMulti = (key: "statuses" | "priorities" | "assignees" | "properties" | "taskTypes", val: string) => {
    setTaskFilters((f) => ({ ...f, [key]: f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val] }));
  };
  const clearFilters = () => {
    setTaskFilters({
      statuses: [],
      priorities: [],
      assignees: [],
      properties: [],
      taskTypes: [],
      dueDateFrom: "",
      dueDateTo: "",
      completionStatus: "",
    });
    setSearch("");
  };

  const hasActiveFilter = search.length > 0 || taskFilters.statuses.length > 0 || taskFilters.priorities.length > 0 || taskFilters.assignees.length > 0 || taskFilters.properties.length > 0 || taskFilters.taskTypes.length > 0 || taskFilters.dueDateFrom || taskFilters.dueDateTo || taskFilters.completionStatus;

  const tasks = allTasks.filter((t) => {
  const q = search.trim().toLowerCase();

  if (
    q &&
    !(
      t.title.toLowerCase().includes(q) ||
      (t.description || "").toLowerCase().includes(q)
    )
  ) {
    return false;
  }

  if (taskFilters.statuses.length > 0 && !taskFilters.statuses.includes(t.status)) return false;
  if (taskFilters.priorities.length > 0 && !taskFilters.priorities.includes(t.priority)) return false;
  if (taskFilters.assignees.length > 0 && !taskFilters.assignees.includes(t.assigneeId || "")) return false;
  if (taskFilters.properties.length > 0 && !taskFilters.properties.includes(t.propertyId || "")) return false;
  if (taskFilters.taskTypes.length > 0 && !taskFilters.taskTypes.includes(t.taskType)) return false;
  if (taskFilters.completionStatus === "completed" && t.status !== "Completed") return false;
  if (taskFilters.completionStatus === "open" && t.status === "Completed") return false;
  if (taskFilters.dueDateFrom && t.due < taskFilters.dueDateFrom) return false;
  if (taskFilters.dueDateTo && t.due > taskFilters.dueDateTo) return false;

  return true;
});


  const cols = [
    { id: "Pending", label: "To Do", color: "bg-slate-400" },
    { id: "In Progress", label: "In Progress", color: "bg-blue-500" },
    { id: "Completed", label: "Done", color: "bg-emerald-500" },
    { id: "Cancelled", label: "Cancelled", color: "bg-red-400" },
  ];
  const move = (tid: string, status: string) => { setAllTasks((p) => p.map((t) => t.id === tid ? { ...t, status } : t)); toast({ type: "success", message: `Task moved to ${status}.` }); };
  const taskActions = (t: typeof TASKS[0]) => [
    { label: "View & edit", icon: <Edit2 size={12} />, onClick: () => setSelectedTask(t) },
    { label: "Archive", icon: <Archive size={12} />, onClick: () => toast({ type: "warning", message: "Task archived." }) },
    { label: "Delete", icon: <Trash2 size={12} />, onClick: () => toast({ type: "error", message: "Task deleted." }), danger: true },
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-5">
        <div className="flex-1">
          <h1 className="text-xl font-bold">Task Management</h1>
          <p className="text-sm text-muted-foreground">
            {tasks.length} tasks across all consultants
          </p>
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks…"
            className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border border-border bg-white outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <Btn
          variant="secondary"
          size="sm"
          onClick={() => setShowFilter(!showFilter)}
          className={hasActiveFilter || search ? "!border-primary !text-primary !bg-primary/5" : ""}
        >
          <SlidersHorizontal size={13} />
          Filter
          {hasActiveFilter && (
            <span className="w-4 h-4 rounded-full bg-primary text-white text-xs flex items-center justify-center">
              {[
                taskFilters.statuses.length,
                taskFilters.priorities.length,
                taskFilters.assignees.length,
                taskFilters.properties.length,
                taskFilters.taskTypes.length,
              ].reduce((s, n) => s + (n > 0 ? 1 : 0), 0)}
            </span>
          )}
        </Btn>

        {hasActiveFilter && (
          <button
            type="button"
            onClick={clearFilters}
            className="px-2.5 py-1 text-[10px] rounded-lg border text-red-500 border-red-200 bg-red-200 hover:bg-secondary hover:text-foreground transition-colors"
          >
            Clear Filters
          </button>
        )}

        <Btn variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
          <Plus size={13} />
          New Task
        </Btn>
      </div>

      {/* ── Task Filter Panel ── */}
      {showFilter && (
        <Card className="p-4 mb-4 border border-border/80 shadow-sm bg-card rounded-2xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
            <h3 className="text-xs font-semibold text-foreground/80">Advanced Filters</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Status Select */}
            <div>
              <label className="block text-[10px] font-medium text-muted-foreground mb-1">Status</label>
              <select 
                value={taskFilters.statuses[0] || ""} 
                onChange={(e) => setTaskFilters(p => ({ ...p, statuses: e.target.value ? [e.target.value] : [] }))}
                className="w-full px-3 py-1.5 rounded-xl border border-border bg-white text-xs outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">All Statuses</option>
                {TASK_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Priority Select */}
            <div>
              <label className="block text-[10px] font-medium text-muted-foreground mb-1">Priority</label>
              <select 
                value={taskFilters.priorities[0] || ""} 
                onChange={(e) => setTaskFilters(p => ({ ...p, priorities: e.target.value ? [e.target.value] : [] }))}
                className="w-full px-3 py-1.5 rounded-xl border border-border bg-white text-xs outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">All Priorities</option>
                {TASK_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Consultant (Assignee) Combobox */}
            <div>
              <label className="block text-[10px] font-medium text-muted-foreground mb-1">Assignee</label>
              <MultiConsultantCombobox
                values={taskFilters.assignees || []}
                onChange={(selectedIds) =>
                  setTaskFilters((p) => ({ ...p, assignees: selectedIds }))
                }
              />
            </div>

            {/* Property Filter */}
            <div>
              <label className="block text-[10px] font-medium text-muted-foreground mb-1">Property Link</label>
              <MultiPropertyCombobox
                values={taskFilters.properties}
                onChange={(selectedIds) =>
                  setTaskFilters((p) => ({ ...p, properties: selectedIds }))
                }
              />
            </div>

            {/* Task Type Select */}
            <div>
              <label className="block text-[10px] font-medium text-muted-foreground mb-1">Task Type</label>
              <select 
                value={taskFilters.taskTypes[0] || ""} 
                onChange={(e) => setTaskFilters(p => ({ ...p, taskTypes: e.target.value ? [e.target.value] : [] }))}
                className="w-full px-3 py-1.5 rounded-xl border border-border bg-white text-xs outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">All Types</option>
                {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Completion Status */}
            <div>
              <label className="block text-[10px] font-medium text-muted-foreground mb-1">Completion</label>
              <select 
                value={taskFilters.completionStatus} 
                onChange={(e) => setTaskFilters(p => ({ ...p, completionStatus: e.target.value }))}
                className="w-full px-3 py-1.5 rounded-xl border border-border bg-white text-xs outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">All Tasks</option>
                <option value="open">Open Tasks Only</option>
                <option value="completed">Completed Tasks Only</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-[10px] font-medium text-muted-foreground mb-1">Due From</label>
              <input 
                type="date" 
                value={taskFilters.dueDateFrom} 
                onChange={(e) => setTaskFilters(p => ({ ...p, dueDateFrom: e.target.value }))}
                className="w-full px-3 py-1.5 rounded-xl border border-border bg-white text-xs outline-none focus:ring-1 focus:ring-primary text-muted-foreground"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-[10px] font-medium text-muted-foreground mb-1">Due To</label>
              <input 
                type="date" 
                value={taskFilters.dueDateTo} 
                onChange={(e) => setTaskFilters(p => ({ ...p, dueDateTo: e.target.value }))}
                className="w-full px-3 py-1.5 rounded-xl border border-border bg-white text-xs outline-none focus:ring-1 focus:ring-primary text-muted-foreground"
              />
            </div>
          </div>
        </Card>
      )}

      <div className="flex gap-1 mb-5 flex-wrap">
        {cols.map((c) => { const count = tasks.filter((t) => t.status === c.id).length; return (<span key={c.id} className="flex items-center gap-1 px-2.5 py-1 bg-white border border-border rounded-full text-xs"><span className={cx("w-1.5 h-1.5 rounded-full", c.color)} />{c.label}: <strong>{count}</strong></span>); })}
        {hasActiveFilter && <span className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary font-medium"><SlidersHorizontal size={10} />Filters active — {tasks.length} result{tasks.length !== 1 ? "s" : ""}</span>}
      </div>
      <div className="flex gap-4 flex-1 overflow-x-auto pb-2">
        {cols.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="flex-shrink-0 w-72 flex flex-col">
              <div className="flex items-center gap-2 mb-3 px-1"><div className={cx("w-2.5 h-2.5 rounded-full", col.color)} /><span className="text-sm font-semibold">{col.label}</span><span className="ml-auto text-xs text-muted-foreground bg-white border border-border px-2 py-0.5 rounded-full font-semibold">{colTasks.length}</span></div>
              <div className="flex flex-col gap-2.5 flex-1">
                {colTasks.map((task) => (
                  <Card key={task.id} className="p-3.5 cursor-pointer" onClick={() => setSelectedTask(task)}>
                    <div className="flex items-start justify-between gap-2 mb-2"><p className="text-xs font-semibold leading-snug flex-1">{task.title}</p><div onClick={(e) => e.stopPropagation()}><ActionMenu actions={taskActions(task)} /></div></div>
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">{statusBadge(task.priority)}<Badge label={task.taskType} variant="muted" /></div>
                    {task.description && <p className="text-xs text-muted-foreground mb-2.5 line-clamp-2">{task.description}</p>}
                    <div className="flex items-center justify-between text-xs text-muted-foreground"><div className="flex items-center gap-1"><Clock size={10} />{task.due}</div><Avatar initials={task.assignee.split(" ").map((w) => w[0]).join("").slice(0, 2)} size="xs" /></div>
                    {col.id !== "Completed" && col.id !== "Cancelled" && (
                      <div className="mt-2.5 pt-2.5 border-t border-border flex gap-2 flex-wrap">
                        {cols.filter((c) => c.id !== col.id && c.id !== "Cancelled").map((c) => (<button key={c.id} onClick={(e) => { e.stopPropagation(); move(task.id, c.id); }} className="text-xs text-primary hover:underline">→ {c.label}</button>))}
                      </div>
                    )}
                  </Card>
                ))}
                <button onClick={() => setCreateOpen(true)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-2 rounded-xl hover:bg-secondary transition-colors border border-dashed border-border"><Plus size={12} />Add task</button>
              </div>
            </div>
          );
        })}
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <Card className="w-full max-w-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border flex-shrink-0">
              <h3 className="text-base font-semibold">Create Task</h3>
              <button onClick={() => setCreateOpen(false)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors"><X size={15} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Section: Core */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Task details</p>
                <Input label="Title" placeholder="e.g. Schedule property viewing for client" value={newTask.title} onChange={(v) => setNewTask((p) => ({ ...p, title: v }))} required />
                <Input label="Description" placeholder="Describe the full scope of this task…" value={newTask.description} onChange={(v) => setNewTask((p) => ({ ...p, description: v }))} textarea rows={3} />
              </div>
              {/* Section: Classification */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Classification</p>
                <div className="grid grid-cols-2 gap-3">
                  <SelectField label="Task type" value={newTask.taskType} onChange={(v) => setNewTask((p) => ({ ...p, taskType: v }))} options={TASK_TYPES.map((t) => ({ label: t, value: t }))} />
                  <SelectField label="Priority" value={newTask.priority} onChange={(v) => setNewTask((p) => ({ ...p, priority: v }))} options={["urgent", "high", "medium", "low"].map((p) => ({ label: p.charAt(0).toUpperCase() + p.slice(1), value: p }))} />
                </div>
                <SelectField label="Initial status" value={newTask.status} onChange={(v) => setNewTask((p) => ({ ...p, status: v }))} options={TASK_STATUSES.map((s) => ({ label: s, value: s }))} />
              </div>
              {/* Section: Assignment */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Assignment</p>
                <ConsultantCombobox label="Assign to consultant" value={newTask.assignee} onChange={(v) => setNewTask((p) => ({ ...p, assignee: v }))} />
                <SelectField label="Related property" value={newTask.propertyId} onChange={(v) => setNewTask((p) => ({ ...p, propertyId: v }))} placeholder="— Optional —" options={PROPERTIES.map((p) => ({ label: p.title.slice(0, 40), value: p.id }))} />
              </div>
              {/* Section: Dates */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Timeline</p>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Due date" type="date" value={newTask.due} onChange={(v) => setNewTask((p) => ({ ...p, due: v }))} required />
                  <Input label="Est. completion date" type="date" value={newTask.estimatedCompletion} onChange={(v) => setNewTask((p) => ({ ...p, estimatedCompletion: v }))} />
                </div>
              </div>
              {/* Section: Notes — REQUIRED */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Notes <span className="text-destructive">*</span></p>
                <Input label="" placeholder="Add initial notes, context, or instructions for this task…" value={newTask.notes} onChange={(v) => setNewTask((p) => ({ ...p, notes: v }))} textarea rows={3} />
                {!newTask.notes.trim() && <p className="text-xs text-muted-foreground">Notes are required for task creation.</p>}
              </div>
              {/* Section: Attachments */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Attachments (optional)</p>
                <div className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                  <Upload size={16} className="text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Drop files here or click to browse · PDF, DOC, XLS, JPG</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end p-5 border-t border-border flex-shrink-0">
              <Btn variant="secondary" size="sm" onClick={() => setCreateOpen(false)}>Cancel</Btn>
              <Btn variant="primary" size="sm"
                disabled={!newTask.title.trim() || !newTask.notes.trim()}
                onClick={() => { if (!newTask.title.trim()) { toast({ type: "error", message: "Task title is required." }); return; } if (!newTask.notes.trim()) { toast({ type: "error", message: "Notes field is required." }); return; } setCreateOpen(false); toast({ type: "success", message: "Task created successfully." }); }}>
                <Check size={13} />Create Task
              </Btn>
            </div>
          </Card>
        </div>
      )}
      {selectedTask && <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  );
}

// ─── Tasks Timeline & Calendar ────────────────────────────────────────────────────

function TasksTimeline() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Task Timeline" actions={<Btn variant="primary" size="sm"><Plus size={13} />New Task</Btn>} />
      <Card className="overflow-hidden">
        <div className="border-b border-border px-5 py-3 bg-secondary/30"><div className="grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground"><div className="col-span-3">Task</div>{["Dec 10", "Dec 12", "Dec 14", "Dec 16", "Dec 18", "Dec 20", "Dec 22", "Dec 24", "Dec 26"].map((d) => <div key={d} className="text-center">{d}</div>)}</div></div>
        <div className="divide-y divide-border">
          {TASKS.map((t) => {
            const d = parseInt(t.due.split("-")[2]); const barStart = Math.max(0, (d - 12) / 16);
            return (
              <div key={t.id} className="grid grid-cols-12 gap-2 px-5 py-3 hover:bg-secondary/20 items-center">
                <div className="col-span-3"><p className="text-xs font-medium line-clamp-1">{t.title}</p><p className="text-xs text-muted-foreground">{t.taskType} · {t.assignee.split(" ")[0]}</p></div>
                <div className="col-span-9 relative h-6 flex items-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full h-0.5 bg-border rounded" /></div>
                  <div className={cx("absolute h-5 rounded-lg flex items-center px-2", t.status === "Completed" ? "bg-emerald-500" : t.priority === "urgent" ? "bg-red-400" : "bg-primary")} style={{ left: `${barStart * 100}%`, width: "10%" }}>
                    <span className="text-white truncate" style={{ fontSize: "9px" }}>{t.title.slice(0, 15)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function TasksCalendar() {
  const tasksByDay: Record<number, typeof TASKS> = {};
  TASKS.forEach((t) => { const d = parseInt(t.due.split("-")[2]); tasksByDay[d] = [...(tasksByDay[d] || []), t]; });
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6"><h1 className="text-xl font-bold">Task Calendar</h1><div className="flex items-center gap-1 bg-white border border-border rounded-xl px-2 py-1"><button className="p-1.5 hover:bg-secondary rounded-lg"><ChevronLeft size={14} /></button><span className="text-sm font-semibold px-2">December 2024</span><button className="p-1.5 hover:bg-secondary rounded-lg"><ChevronRight size={14} /></button></div></div>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="py-2.5 text-center text-xs font-semibold text-muted-foreground border-r last:border-0 border-border">{d}</div>)}</div>
        <div className="grid grid-cols-7">
          {Array.from({ length: 42 }, (_, idx) => { const day = idx - 6; const inMonth = day >= 1 && day <= 31; const tasks = inMonth ? (tasksByDay[day] || []) : []; const isToday = day === 16;
            return (<div key={idx} className={cx("min-h-24 border-b border-r last:border-r-0 border-border p-1.5", !inMonth && "bg-secondary/20", isToday && "bg-primary/[0.04]")}>
              {inMonth && (<><div className={cx("w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 font-medium", isToday ? "bg-primary text-white font-bold" : "text-foreground")}>{day}</div>{tasks.map((t) => <div key={t.id} className={cx("text-xs px-1.5 py-0.5 rounded-lg mb-0.5 truncate font-medium", t.status === "Completed" ? "bg-emerald-100 text-emerald-700" : t.priority === "urgent" ? "bg-red-100 text-red-700" : "bg-primary/10 text-primary")}>{t.title.slice(0, 16)}</div>)}</>)}
            </div>);
          })}
        </div>
      </Card>
    </div>
  );
}

// ─── Consultants Split View ─────────────────────────────────────────────────────────

function ConsultantsPage({ navigate }: { navigate: (p: Page) => void }) {
  const [selected, setSelected] = useState(CONSULTANTS[0]);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const filtered = CONSULTANTS.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase()) || c.branch.toLowerCase().includes(search.toLowerCase()));

  const cActions = (c: typeof CONSULTANTS[0]) => [
    { label: "Edit consultant", icon: <Edit2 size={12} />, onClick: () => toast({ type: "info", message: `Editing ${c.name}…` }) },
    { label: "Archive account", icon: <Archive size={12} />, onClick: () => toast({ type: "warning", message: `${c.name} archived.` }) },
    { label: "Delete account", icon: <Trash2 size={12} />, onClick: () => setConfirmDelete(c.id), danger: true },
  ];

  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-72 flex-shrink-0 border-r border-border bg-white flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3"><h2 className="text-sm font-bold">Consultant Workspace</h2><Btn variant="primary" size="xs" onClick={() => navigate("add-consultant")}><Plus size={11} />Add</Btn></div>
          <p className="text-xs text-muted-foreground mb-3">{CONSULTANTS.filter((c) => c.active).length} active · {CONSULTANTS.length} total</p>
          <div className="relative"><Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, role, branch…" className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-border bg-secondary outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
        <div className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: "none" }}>
          {filtered.map((c) => (
            <button key={c.id} onClick={() => setSelected(c)} className={cx("w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/50 group", selected.id === c.id && "bg-primary/5 border-r-2 border-primary")}>
              <div className="relative flex-shrink-0"><Avatar initials={c.avatar} size="md" /><div className={cx("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white", c.active ? "bg-emerald-400" : "bg-muted-foreground")} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between"><p className="text-xs font-semibold truncate">{c.name}</p><div onClick={(e) => e.stopPropagation()}><ActionMenu actions={cActions(c)} /></div></div>
                <p className="text-xs text-muted-foreground truncate">{c.role}</p>
                <p className="text-xs text-muted-foreground truncate">{c.branch}</p>
                <p className="text-xs font-semibold text-emerald-600 mt-0.5">{fmtShort(c.revenue)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-background p-6">
        <div className="max-w-3xl mx-auto space-y-5">
          <Card className="p-5">
            <div className="flex items-start gap-4">
              <div className="relative"><Avatar initials={selected.avatar} size="lg" /><div className={cx("absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white", selected.active ? "bg-emerald-400" : "bg-muted-foreground")} /></div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">{selected.name}</h2>
                    <p className="text-sm text-muted-foreground">{selected.role} · {selected.branch}</p>
                    <div className="flex items-center gap-2 mt-1"><Badge label={selected.active ? "Active" : "Inactive"} variant={selected.active ? "success" : "muted"} dot /><span className="text-xs text-amber-500 flex items-center gap-1 font-semibold"><Star size={11} fill="currentColor" />{selected.rating}</span></div>
                  </div>
                  <div className="flex gap-2">
                    <Btn variant="secondary" size="sm"><Edit2 size={12} />Edit</Btn>
                    <Btn variant="secondary" size="sm"><Archive size={12} />Archive</Btn>
                    <Btn variant="danger" size="sm" onClick={() => setConfirmDelete(selected.id)}><Trash2 size={12} />Delete</Btn>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-5">
              {[["Deals", selected.deals, "bg-primary/10 text-primary"], ["Revenue", fmtShort(selected.revenue), "bg-emerald-50 text-emerald-600"], ["Tasks", selected.tasks, "bg-amber-50 text-amber-600"], ["Score", `${selected.score}/100`, "bg-purple-50 text-purple-600"]].map(([k, v, c]) => (
                <div key={k as string} className={cx("rounded-xl p-3 text-center", c as string)}><p className="text-lg font-bold">{v}</p><p className="text-xs font-medium mt-0.5 opacity-70">{k}</p></div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-5">
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-4">Monthly Deals</h3>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={DASH_AREA} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0BB68A" stopOpacity={0.15} /><stop offset="95%" stopColor="#0BB68A" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10 }} />
                  <Area type="monotone" dataKey="deals" stroke="#0BB68A" strokeWidth={2} fill="url(#cg)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-4">Skill Profile</h3>
              <ResponsiveContainer width="100%" height={160}>
                <RadarChart data={SKILL_RADAR} cx="50%" cy="50%" outerRadius={55}>
                  <PolarGrid stroke="rgba(0,0,0,0.08)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 9, fill: "#9CA3AF" }} />
                  <Radar dataKey="value" stroke="#0BB68A" fill="#0BB68A" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-3">Contact & Branch</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-2.5 p-3 bg-secondary rounded-xl"><Mail size={14} className="text-muted-foreground flex-shrink-0" /><div><p className="text-xs text-muted-foreground">Email</p><p className="text-xs font-medium">{selected.email}</p></div></div>
              <div className="flex items-center gap-2.5 p-3 bg-secondary rounded-xl"><Phone size={14} className="text-muted-foreground flex-shrink-0" /><div><p className="text-xs text-muted-foreground">Phone</p><p className="text-xs font-medium">{selected.phone}</p></div></div>
              <div className="flex items-center gap-2.5 p-3 bg-secondary rounded-xl col-span-2"><Building size={14} className="text-muted-foreground flex-shrink-0" /><div><p className="text-xs text-muted-foreground">Branch</p><p className="text-xs font-medium">{selected.branch}</p></div></div>
            </div>
            <div className="flex gap-2"><Btn variant="primary" size="sm"><Phone size={12} />Call</Btn><Btn variant="secondary" size="sm"><Mail size={12} />Email</Btn><Btn variant="secondary" size="sm"><MessageSquare size={12} />Message</Btn></div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-3">Assigned Properties</h3>
            <div className="space-y-2.5">
              {PROPERTIES.filter((p) => p.consultantId === selected.id).map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                  <div className={cx("w-8 h-8 rounded-lg bg-gradient-to-br flex-shrink-0", p.gradient)} />
                  <div className="flex-1 min-w-0"><p className="text-xs font-semibold truncate">{p.title}</p><p className="text-xs text-muted-foreground">{p.district} · {p.internalCode}</p></div>
                  <div className="flex-shrink-0">{statusBadge(p.propertyStatus)}</div>
                </div>
              ))}
              {PROPERTIES.filter((p) => p.consultantId === selected.id).length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No properties assigned</p>}
            </div>
          </Card>
        </div>
      </div>
      <ConfirmModal open={!!confirmDelete} title="Delete consultant?" danger message="This will permanently delete the consultant account and all associated data." onConfirm={() => { setConfirmDelete(null); toast({ type: "success", message: "Consultant deleted." }); }} onCancel={() => setConfirmDelete(null)} />
    </div>
  );
}

// ─── Add Consultant ──────────────────────────────────────────────────────────────────

function AddConsultantPage({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-1.5 mb-6 text-xs text-muted-foreground"><button onClick={() => navigate("consultants")} className="hover:text-foreground">Consultants</button><ChevronRight size={12} /><span className="text-foreground font-medium">Add Consultant</span></div>
      <Card className="p-6 space-y-4">
        <h2 className="text-base font-semibold">New Consultant Account</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input label="First name" value="" onChange={() => {}} required />
          <Input label="Last name" value="" onChange={() => {}} required />
          <Input label="Email address" type="email" value="" onChange={() => {}} required />
          <Input label="Phone" value="" onChange={() => {}} />
          <SelectField label="Role" value="Consultant" onChange={() => {}} options={["Junior Consultant", "Consultant", "Senior Consultant"].map((r) => ({ label: r, value: r }))} required />
          <SelectField label="Branch" value="" onChange={() => {}} placeholder="Select branch…" options={BRANCHES.map((b) => ({ label: b, value: b }))} required />
          <Input label="Temporary password" type="password" value="" onChange={() => {}} required />
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Btn variant="secondary" onClick={() => navigate("consultants")}>Cancel</Btn>
          <Btn variant="primary" onClick={() => { toast({ type: "success", message: "Consultant account created. Invite sent." }); navigate("consultants"); }}><Check size={13} />Create Account</Btn>
        </div>
      </Card>
    </div>
  );
}

// ─── Follow-Ups ──────────────────────────────────────────────────────────────────────

function FollowUpsPage({ navigate }: { navigate: (p: Page) => void }) {
  const [typeFilter, setTypeFilter] = useState("all");
  const shown = FOLLOWUPS.filter((f) => typeFilter === "all" || f.type === typeFilter);
  const fuActions = (fu: typeof FOLLOWUPS[0]) => [
    { label: "Edit follow-up", icon: <Edit2 size={12} />, onClick: () => toast({ type: "info", message: "Opening editor…" }) },
    { label: "Archive", icon: <Archive size={12} />, onClick: () => toast({ type: "warning", message: "Archived." }) },
    { label: "Delete", icon: <Trash2 size={12} />, onClick: () => toast({ type: "error", message: "Deleted." }), danger: true },
  ];
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Follow-Up Intelligence" subtitle={`${FOLLOWUPS.filter((f) => f.status === "scheduled").length} due today · ${FOLLOWUPS.length} this week`}
        actions={<Btn variant="primary" size="sm" onClick={() => navigate("create-followup")}><Plus size={13} />Schedule Follow-Up</Btn>}
      />
      <div className="flex gap-1.5 mb-5">
        {["all", "Call", "Meeting", "Email", "Site Visit"].map((t) => (
          <button key={t} onClick={() => setTypeFilter(t)} className={cx("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", typeFilter === t ? "bg-primary text-white shadow-sm" : "bg-white border border-border hover:bg-secondary")}>{t === "all" ? "All Types" : t}</button>
        ))}
      </div>
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
        <div className="space-y-4">
          {shown.map((fu) => (
            <div key={fu.id} className="flex gap-4">
              <div className="relative z-10 flex-shrink-0"><div className={cx("w-10 h-10 rounded-xl flex items-center justify-center text-white", fu.type === "Call" ? "bg-blue-500" : fu.type === "Meeting" ? "bg-purple-500" : fu.type === "Email" ? "bg-slate-400" : "bg-emerald-500")}>{fu.type === "Call" ? <Phone size={14} /> : fu.type === "Meeting" ? <Users size={14} /> : fu.type === "Email" ? <Mail size={14} /> : <MapPin size={14} />}</div></div>
              <Card className="flex-1 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1"><div className="flex items-center gap-2 mb-1">{statusBadge(fu.type)}{statusBadge(fu.status)}</div><h3 className="text-sm font-semibold">{fu.title}</h3><p className="text-xs text-muted-foreground mt-1">Contact: <strong>{fu.contact}</strong> · {fu.consultant} · {fu.date}</p>{fu.outcome && <div className="mt-2 px-3 py-2 bg-secondary rounded-xl text-xs"><span className="font-medium">Outcome:</span> {fu.outcome}</div>}</div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    <div className="text-center"><div className={cx("text-lg font-bold", fu.probability >= 60 ? "text-emerald-600" : fu.probability >= 40 ? "text-amber-600" : "text-red-500")}>{fu.probability}%</div><div className="text-xs text-muted-foreground">Probability</div></div>
                    <ActionMenu actions={fuActions(fu)} />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CreateFollowUp({ navigate, role }: { navigate: (p: Page) => void; role?: Role }) {
  const isConsultant = role === "consultant";
  // Auto-fill current consultant when role is consultant; admin gets editable combobox
  const [form, setForm] = useState({
    title: "", type: "Call", contact: "", date: "", propertyId: "",
    consultant: isConsultant ? "C001" : "", // C001 = Layla (current consultant in demo)
    notes: "",
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const currentConsultant = CONSULTANTS.find((c) => c.id === "C001");

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-1.5 mb-6 text-xs text-muted-foreground">
        <button onClick={() => navigate(isConsultant ? "my-followups" : "follow-ups")} className="hover:text-foreground">Follow-Ups</button>
        <ChevronRight size={12} /><span className="text-foreground font-medium">Create Follow-Up</span>
      </div>
      <Card className="p-6 space-y-4">
        <h2 className="text-base font-semibold">New Follow-Up</h2>
        <Input label="Title" placeholder="e.g. Follow-up call after property viewing" value={form.title} onChange={(v) => set("title", v)} required />
        <div className="grid grid-cols-2 gap-4">
          <SelectField label="Type" value={form.type} onChange={(v) => set("type", v)} options={["Call", "Meeting", "Email", "Site Visit"].map((t) => ({ label: t, value: t }))} required />
          <Input label="Contact name" placeholder="e.g. Ahmad Al-Mutairi" value={form.contact} onChange={(v) => set("contact", v)} required />
        </div>
        <Input label="Scheduled date & time" type="datetime-local" value={form.date} onChange={(v) => set("date", v)} />

        {/* Assigned To — locked for consultant, editable for admin */}
        {isConsultant ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Assigned To</label>
            <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted px-3.5 py-2.5 opacity-75 cursor-not-allowed">
              <Avatar initials={currentConsultant?.avatar || "LA"} size="xs" />
              <span className="flex-1 text-sm font-medium text-foreground">{currentConsultant?.name || "Layla Al-Rashidi"}</span>
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">Auto-assigned</span>
            </div>
            <p className="text-xs text-muted-foreground">Follow-ups are automatically assigned to you as the logged-in advisor.</p>
          </div>
        ) : (
          <ConsultantCombobox label="Assigned consultant" value={form.consultant} onChange={(v) => set("consultant", v)} required />
        )}

        {/* Linked Property — searchable combobox */}
        <PropertyCombobox label="Linked property" value={form.propertyId} onChange={(v) => set("propertyId", v)} />

        <Input label="Notes" placeholder="Preparation notes or context…" value={form.notes} onChange={(v) => set("notes", v)} textarea rows={3} />
        <div className="flex gap-2 justify-end pt-2">
          <Btn variant="secondary" onClick={() => navigate(isConsultant ? "my-followups" : "follow-ups")}>Cancel</Btn>
          <Btn variant="primary" onClick={() => { toast({ type: "success", message: "Follow-up created." }); navigate(isConsultant ? "my-followups" : "follow-ups"); }}><Check size={13} />Save Follow-Up</Btn>
        </div>
      </Card>
    </div>
  );
}

// ─── Listing Detail ───────────────────────────────────────────────────────────────────

function ListingDetailPage({ navigate, role }: { navigate: (p: Page) => void; role: Role }) {
  const l = LISTINGS[0];
  const isAdmin = role === "admin";
  const [statusModal, setStatusModal] = useState(false);
  const [status, setStatus] = useState(l.status);
  const meta = LISTING_STATUS_META[status];
  const statusHistory = [
    { action: "Status changed to Published", user: "Admin", time: "2024-11-15 10:00" },
    { action: "Submitted for approval", user: l.consultant, time: "2024-11-14 16:30" },
    { action: "Created as Draft", user: l.consultant, time: "2024-11-12 09:00" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-white px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground">
              <button onClick={() => navigate("listings")} className="hover:text-foreground">Listings</button>
              <ChevronRight size={12} /><span className="text-foreground font-medium">{l.id}</span>
            </div>
            <h1 className="text-lg font-bold">{l.property}</h1>
            <div className="flex items-center gap-2 mt-1">
              {statusBadge(status)}
              <span className="text-xs text-muted-foreground">{meta?.desc}</span>
              <div className="flex flex-wrap gap-1 ml-1">{l.channels.map((c) => <Badge key={c} label={c} variant="muted" />)}</div>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Btn variant="secondary" size="sm"><Edit2 size={13} />Edit</Btn>
            {isAdmin && <Btn variant="outline" size="sm" onClick={() => setStatusModal(true)}><RefreshCw size={13} />Change Status</Btn>}
            <Btn variant="danger" size="sm"><Trash2 size={13} />Delete</Btn>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-4">Listing Performance</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[["Views", l.views, "bg-primary/10 text-primary"], ["Score", l.score || "—", "bg-amber-50 text-amber-600"], ["Days Live", "42", "bg-blue-50 text-blue-600"]].map(([k, v, c]) => (
                  <div key={k as string} className={cx("rounded-xl p-3 text-center", c as string)}>
                    <p className="text-xl font-bold">{v}</p><p className="text-xs font-medium opacity-70 mt-0.5">{k}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-3">Publication Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {[["Published", l.publishedAt || "—"], ["Expires", l.expires || "—"], ["Channels", l.channels.join(", ")], ["Consultant", l.consultant]].map(([k, v]) => (
                  <div key={k as string} className="p-3 bg-secondary rounded-xl"><p className="text-xs text-muted-foreground mb-1">{k}</p><p className="text-sm font-semibold">{v}</p></div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-3">Status History</h3>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-3 pl-8">
                  {statusHistory.map((h, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-primary/50 border-2 border-white" />
                      <div className="bg-secondary rounded-xl p-3">
                        <div className="flex items-center justify-between"><span className="text-xs font-semibold">{h.action}</span><span className="text-xs text-muted-foreground font-mono">{h.time.split(" ")[1]}</span></div>
                        <p className="text-xs text-muted-foreground mt-0.5">by {h.user} · {h.time.split(" ")[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {isAdmin && l.status === "Pending Approval" && <Btn variant="primary" size="sm" fullWidth onClick={() => { setStatus("Published"); toast({ type: "success", message: "Listing approved and published." }); }}><Check size={13} />Approve & Publish</Btn>}
                <Btn variant="secondary" size="sm" fullWidth><Download size={13} />Export Report</Btn>
                <Btn variant="secondary" size="sm" fullWidth><Archive size={13} />Archive Listing</Btn>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Linked Property</h3>
              {(() => { const prop = PROPERTIES.find((p) => p.id === l.propertyId); return prop ? (
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("property-detail")}>
                  <div className={cx("w-10 h-10 rounded-lg bg-gradient-to-br flex-shrink-0", prop.gradient)} />
                  <div className="min-w-0"><p className="text-xs font-semibold truncate">{prop.title}</p><p className="text-xs text-muted-foreground">{prop.district} · {fmtShort(prop.price)}</p></div>
                </div>
              ) : <p className="text-xs text-muted-foreground">No property linked</p>; })()}
            </Card>
          </div>
        </div>
      </div>

      {statusModal && (
        <StatusChangeModal listing={{ ...l, status }} onClose={() => setStatusModal(false)} isAdmin={isAdmin} />
      )}
    </div>
  );
}

// ─── Reports ──────────────────────────────────────────────────────────────────────────

function ReportsPage({ type }: { type: string }) {
  const titles: Record<string, string> = { "reports-consultant": "Executive Analytics", "reports-property": "Property Growth", "reports-listing": "Listing Performance", "reports-task": "Task Completion" };
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <PageHeader title={titles[type] || "Analytics"} subtitle="Enterprise reporting · YTD 2025" actions={<Btn variant="secondary" size="sm"><Download size={13} />Export Report</Btn>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Revenue" value="$44.9M" icon={<TrendingUp size={16} />} trend="+18.2%" trendUp color="bg-emerald-50 text-emerald-600" />
        <KpiCard label="Deals Closed" value="475" icon={<CheckCircle2 size={16} />} trend="+15%" trendUp color="bg-primary/10 text-primary" />
        <KpiCard label="Avg. Deal Size" value="$945K" icon={<BarChart3 size={16} />} trend="+8.1%" trendUp color="bg-blue-50 text-blue-600" />
        <KpiCard label="Pipeline Value" value="$128M" icon={<Target size={16} />} trend="+12%" trendUp color="bg-purple-50 text-purple-600" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-4">Revenue vs Target</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DASH_AREA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: "none" }} />
              <Bar dataKey="revenue" name="Revenue" fill="#0BB68A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-4">Lead Funnel</h3>
          <div className="space-y-3 mt-2">
            {[["Inquired", 1040, "#0BB68A"], ["Qualified", 920, "#3B82F6"], ["Viewing", 510, "#F59E0B"], ["Negotiation", 228, "#8B5CF6"], ["Closed", 102, "#EF4444"]].map(([label, count, color]) => (
              <div key={label as string}><div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{label}</span><span className="font-semibold">{(count as number).toLocaleString()}</span></div><div className="h-2 bg-secondary rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${((count as number) / 1040) * 100}%`, background: color as string }} /></div></div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">Overall Conversion: <strong className="text-foreground">6.09%</strong></p>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border"><h3 className="text-sm font-semibold">Consultant Leaderboard</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/30"><tr>{["#", "Consultant", "Branch", "Deals", "Revenue", "Score", "Rating", "Actions"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {[...CONSULTANTS].sort((a, b) => b.revenue - a.revenue).map((c, i) => (
                <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar initials={c.avatar} size="xs" /><p className="text-xs font-semibold">{c.name}</p></div></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{c.branch}</td>
                  <td className="px-4 py-3 text-xs font-mono font-semibold">{c.deals}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-emerald-600">{fmtShort(c.revenue)}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex-1 max-w-16 h-1.5 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${c.score}%` }} /></div><span className="text-xs font-semibold">{c.score}</span></div></td>
                  <td className="px-4 py-3"><span className="flex items-center gap-1 text-xs text-amber-500 font-semibold"><Star size={10} fill="currentColor" />{c.rating}</span></td>
                  <td className="px-4 py-3"><div className="flex gap-0.5"><button className="p-1.5 hover:bg-secondary rounded-lg"><Eye size={12} className="text-muted-foreground" /></button><button className="p-1.5 hover:bg-secondary rounded-lg"><Edit2 size={12} className="text-muted-foreground" /></button><button className="p-1.5 hover:bg-secondary rounded-lg"><Archive size={12} className="text-muted-foreground" /></button><button className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={12} className="text-muted-foreground" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Activity Log ─────────────────────────────────────────────────────────────────────

function ActivityLogPage() {
  const [filter, setFilter] = useState("all");
  const types = ["all", "update", "create", "submit", "complete", "export", "archive", "system"];
  const shown = ACTIVITY_LOGS.filter((a) => filter === "all" || a.type === filter);
  const icons: Record<string, React.ReactNode> = { update: <Edit2 size={13} />, create: <Plus size={13} />, submit: <Send size={13} />, complete: <Check size={13} />, export: <Download size={13} />, archive: <Archive size={13} />, system: <Zap size={13} /> };
  const colors: Record<string, string> = { update: "bg-blue-100 text-blue-600", create: "bg-emerald-100 text-emerald-600", submit: "bg-purple-100 text-purple-600", complete: "bg-emerald-100 text-emerald-600", export: "bg-secondary text-muted-foreground", archive: "bg-amber-100 text-amber-600", system: "bg-primary/10 text-primary" };
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div><div className="flex items-center gap-2 mb-1"><h1 className="text-xl font-bold">Activity Intelligence</h1><span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Live feed</span></div><p className="text-sm text-muted-foreground">Real-time activity log across your entire organization</p></div>
        <div className="flex gap-2"><Btn variant="secondary" size="sm"><Search size={13} />Search</Btn><Btn variant="secondary" size="sm"><Download size={13} />Export</Btn></div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="Today" value="47" icon={<Activity size={16} />} color="bg-primary/10 text-primary" />
        <KpiCard label="This Week" value="8" icon={<Calendar size={16} />} color="bg-blue-50 text-blue-600" />
        <KpiCard label="Tasks Completed" value="23" icon={<CheckCircle2 size={16} />} color="bg-emerald-50 text-emerald-600" />
        <KpiCard label="AI Actions" value="12" icon={<Sparkles size={16} />} color="bg-purple-50 text-purple-600" />
      </div>
      <div className="flex gap-4">
        <div className="w-44 flex-shrink-0">
          <Card className="p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2 px-1">FILTER BY TYPE</p>
            {types.map((t) => (
              <button key={t} onClick={() => setFilter(t)} className={cx("w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs font-medium transition-colors capitalize mb-0.5", filter === t ? "bg-primary text-white" : "hover:bg-secondary text-foreground")}>
                <span>{t === "all" ? "All Activity" : t.charAt(0).toUpperCase() + t.slice(1)}</span>
                <span className={cx("px-1.5 py-0.5 rounded-full text-xs", filter === t ? "bg-white/20 text-white" : "bg-secondary text-muted-foreground")}>{t === "all" ? ACTIVITY_LOGS.length : ACTIVITY_LOGS.filter((a) => a.type === t).length}</span>
              </button>
            ))}
          </Card>
        </div>
        <div className="flex-1">
          <Card className="overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-secondary/30 text-xs font-semibold text-muted-foreground">TODAY</div>
            <div className="divide-y divide-border">
              {shown.map((log) => (
                <div key={log.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/30 transition-colors">
                  <div className={cx("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0", colors[log.type])}>{icons[log.type]}</div>
                  <div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-0.5">{statusBadge(log.type)}<span className="text-xs text-muted-foreground truncate">{log.target}</span></div><p className="text-xs font-medium">{log.action}</p></div>
                  <div className="text-right flex-shrink-0"><p className="text-xs font-semibold">{log.user}</p><p className="text-xs text-muted-foreground font-mono">{log.timestamp.split(" ")[1]}</p></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────────────

function SettingsPage({ page, navigate }: { page: Page; navigate: (p: Page) => void }) {
  const tabs: { label: string; page: Page }[] = [{ label: "Workspace", page: "settings-workspace" }, { label: "Users", page: "settings-users" }, { label: "Permissions", page: "settings-permissions" }];
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Settings" />
      <div className="flex gap-1 border-b border-border mb-5">{tabs.map((t) => <button key={t.page} onClick={() => navigate(t.page)} className={cx("px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors", page === t.page ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>{t.label}</button>)}</div>
      {page === "settings-workspace" && (
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-semibold">Company Information</h2>
          <div className="grid grid-cols-2 gap-4"><Input label="Company name" value="Zaminex Real Estate LLC" onChange={() => {}} /><Input label="RERA license no." value="RERA-2021-0034" onChange={() => {}} /><Input label="Registered email" value="admin@zaminex.ae" onChange={() => {}} /><Input label="Office phone" value="+971 4 555 0000" onChange={() => {}} /></div>
          <Input label="Office address" value="Office 1202, Marina Plaza, Dubai Marina, Dubai, UAE" onChange={() => {}} textarea rows={2} />
          <Btn variant="primary" onClick={() => toast({ type: "success", message: "Settings saved." })}><Check size={13} />Save Changes</Btn>
        </Card>
      )}
      {page === "settings-users" && (
        <div className="space-y-3">
          <div className="flex justify-end"><Btn variant="primary" size="sm"><Plus size={13} />Invite User</Btn></div>
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/30"><tr>{["Name", "Email", "Role", "Branch", "Status", "Actions"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-border">
                {[...CONSULTANTS, { id: "ADMIN", name: "Zaid Hassan", email: "admin@zaminex.ae", role: "Admin", branch: "Head Office", active: true, avatar: "ZH" }].map((u: any) => (
                  <tr key={u.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3"><div className="flex items-center gap-2.5"><Avatar initials={(u.avatar || "??").slice(0, 2)} size="sm" /><span className="text-xs font-semibold">{u.name}</span></div></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3"><Badge label={u.role} variant={u.role === "Admin" ? "info" : "muted"} /></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.branch}</td>
                    <td className="px-4 py-3">{statusBadge(u.active ? "Available" : "Inactive")}</td>
                    <td className="px-4 py-3"><div className="flex gap-0.5"><button className="p-1.5 hover:bg-secondary rounded-lg"><Edit2 size={12} className="text-muted-foreground" /></button><button className="p-1.5 hover:bg-secondary rounded-lg"><Archive size={12} className="text-muted-foreground" /></button><button className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={12} className="text-muted-foreground" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
      {page === "settings-permissions" && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/30"><tr><th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Permission</th>{["Admin", "Senior", "Consultant", "Junior"].map((r) => <th key={r} className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">{r}</th>)}</tr></thead>
              <tbody className="divide-y divide-border">
                {[["Create properties", true, true, true, false], ["Archive properties", true, false, false, false], ["Delete properties", true, false, false, false], ["Approve listings", true, false, false, false], ["View all consultants", true, true, false, false], ["Export reports", true, true, false, false], ["Manage users", true, false, false, false], ["Create tasks", true, true, true, true], ["Edit own tasks", true, true, true, true], ["View activity log", true, true, false, false]].map(([label, ...perms]) => (
                  <tr key={label as string} className="hover:bg-secondary/30"><td className="px-4 py-3 text-xs font-medium">{label}</td>{(perms as boolean[]).map((p, i) => <td key={i} className="px-4 py-3 text-center">{p ? <CheckCircle2 size={14} className="text-emerald-500 mx-auto" /> : <XCircle size={14} className="text-muted-foreground/30 mx-auto" />}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Consultant Portal ─────────────────────────────────────────────────────────────────

function ConsultantDashboard({ navigate }: { navigate: (p: Page) => void }) {
  const me = CONSULTANTS[0];
  const myTasks = TASKS.filter((t) => t.assigneeId === me.id);
  const myFUs = FOLLOWUPS.filter((f) => f.consultantId === me.id);
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Good morning, Layla 👋</h1><p className="text-sm text-muted-foreground mt-0.5">Workspace overview for Monday, Dec 16</p></div>
        <div className="flex gap-2"><Btn variant="secondary" size="sm" onClick={() => navigate("add-property")}><Plus size={13} />Add Property</Btn><Btn variant="primary" size="sm" onClick={() => navigate("create-followup")}><Plus size={13} />Log Follow-Up</Btn></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="My Properties" value={me.props.toString()} icon={<Building2 size={16} />} trend="+2" trendUp color="bg-primary/10 text-primary" />
        <KpiCard label="Active Listings" value={me.listings.toString()} icon={<FileText size={16} />} color="bg-blue-50 text-blue-600" />
        <KpiCard label="Open Tasks" value={myTasks.filter((t) => t.status !== "Completed").length.toString()} icon={<CheckSquare size={16} />} color="bg-amber-50 text-amber-600" />
        <KpiCard label="Revenue (Q4)" value={fmtShort(me.revenue)} icon={<TrendingUp size={16} />} trend="+18%" trendUp color="bg-emerald-50 text-emerald-600" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3"><h2 className="text-sm font-semibold">My Tasks</h2><button onClick={() => navigate("my-tasks")} className="text-xs text-primary hover:underline">View all</button></div>
            <div className="space-y-2.5">
              {myTasks.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="flex-shrink-0">{t.status === "Completed" ? <CheckCircle2 size={15} className="text-emerald-500" /> : <Circle size={15} className="text-muted-foreground" />}</div>
                  <div className="flex-1 min-w-0"><p className="text-xs font-semibold truncate">{t.title}</p><p className="text-xs text-muted-foreground">{t.taskType} · Due {t.due}</p></div>
                  {statusBadge(t.priority)}
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3"><h2 className="text-sm font-semibold">Upcoming Follow-Ups</h2><button onClick={() => navigate("my-followups")} className="text-xs text-primary hover:underline">View all</button></div>
            <div className="space-y-2.5">
              {myFUs.map((fu) => (
                <div key={fu.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className={cx("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white", fu.type === "Call" ? "bg-blue-500" : fu.type === "Meeting" ? "bg-purple-500" : "bg-emerald-500")}>{fu.type === "Call" ? <Phone size={12} /> : fu.type === "Meeting" ? <Users size={12} /> : <Mail size={12} />}</div>
                  <div className="flex-1 min-w-0"><p className="text-xs font-semibold truncate">{fu.title}</p><p className="text-xs text-muted-foreground">{fu.contact} · {fu.date}</p></div>
                  <span className={cx("text-xs font-bold", fu.probability >= 60 ? "text-emerald-600" : "text-amber-600")}>{fu.probability}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-4"><h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Quick Actions</h3>
            <div className="space-y-1">{[["Add Property", "add-property" as Page, <Building2 size={13} />], ["Log Follow-Up", "create-followup" as Page, <BellRing size={13} />], ["My Properties", "my-properties" as Page, <Building2 size={13} />], ["My Profile", "my-profile" as Page, <User size={13} />]].map(([l, p, icon]) => (<button key={l as string} onClick={() => navigate(p as Page)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors text-xs font-medium text-left"><span className="text-primary">{icon as React.ReactNode}</span>{l}</button>))}</div>
          </Card>
          <Card className="p-4"><h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">My Performance</h3>
            <div className="space-y-3">{[["Branch", me.branch], ["Rating", `${me.rating} / 5 ⭐`], ["Deals", me.deals], ["Score", `${me.score}/100`]].map(([k, v]) => (<div key={k as string} className="flex justify-between items-center"><span className="text-xs text-muted-foreground">{k}</span><span className="text-xs font-bold">{v}</span></div>))}</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MyPropertiesPage({ navigate }: { navigate: (p: Page) => void }) {
  const mine = PROPERTIES.filter((p) => p.consultantId === "C001");
  const [confirmArchive, setConfirmArchive] = useState<string | null>(null);
  const rowActions = (p: typeof PROPERTIES[0]) => [
    { label: "View detail", icon: <Eye size={12} />, onClick: () => navigate("property-detail") },
    { label: "Edit", icon: <Edit2 size={12} />, onClick: () => toast({ type: "info", message: "Opening editor…" }) },
    { label: "Archive", icon: <Archive size={12} />, onClick: () => setConfirmArchive(p.id) },
  ];
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader title="My Properties" subtitle={`${mine.length} assigned to me`} actions={<Btn variant="primary" size="sm" onClick={() => navigate("add-property")}><Plus size={13} />Add Property</Btn>} />
      {mine.length === 0 ? <EmptyState icon={<Building2 size={28} />} title="No properties" description="Properties assigned to you will appear here." action={<Btn variant="primary" size="sm" onClick={() => navigate("add-property")}><Plus size={13} />Add first property</Btn>} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mine.map((p) => (
            <Card key={p.id} hover onClick={() => navigate("property-detail")} className="overflow-hidden">
              <div className={cx("h-32 relative bg-gradient-to-br flex items-end p-4", p.gradient)}>
                <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}><ActionMenu actions={rowActions(p)} /></div>
                <div><div className="text-xl font-bold text-white">{fmtShort(p.price)}</div><div className="text-white/70 text-xs">{p.district} · Fl. {p.floor}</div></div>
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground font-mono mb-0.5">{p.internalCode}</p>
                <h3 className="text-xs font-semibold mb-2 line-clamp-1">{p.title}</h3>
                <div className="flex items-center justify-between">{statusBadge(p.propertyStatus)}<span className="text-xs text-muted-foreground">{p.views} views</span></div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <ConfirmModal open={!!confirmArchive} title="Archive property?" message="This property will be archived. As a consultant, you can only archive properties you created." onConfirm={() => { setConfirmArchive(null); toast({ type: "success", message: "Property archived." }); }} onCancel={() => setConfirmArchive(null)} />
    </div>
  );
}

function MyTasksPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState<typeof TASKS[0] | null>(null);
  const me = CONSULTANTS[0];
  const myTasks = TASKS.filter((t) => t.assigneeId === me.id);
  const shown = myTasks.filter((t) => statusFilter === "all" || t.status === statusFilter);

  const taskActions = (t: typeof TASKS[0]) => [
    { label: "View & edit", icon: <Edit2 size={12} />, onClick: () => setSelectedTask(t) },
    { label: "Archive", icon: <Archive size={12} />, onClick: () => toast({ type: "warning", message: "Task archived." }) },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PageHeader title="My Tasks" />
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {["all", ...TASK_STATUSES].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={cx("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", statusFilter === s ? "bg-primary text-white shadow-sm" : "bg-white border border-border hover:bg-secondary")}>
            {s === "all" ? "All Tasks" : s}
          </button>
        ))}
      </div>
      {shown.length === 0 ? <EmptyState icon={<CheckCircle2 size={28} />} title="No tasks" description="No tasks match the current filter." /> : (
        <div className="space-y-3">
          {shown.map((t) => (
            <Card key={t.id} className="p-4 flex items-start gap-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedTask(t)}>
              <div className="mt-0.5 flex-shrink-0">{t.status === "Completed" ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} className="text-muted-foreground" />}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{t.title}</p>
                {t.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{t.description}</p>}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  {statusBadge(t.priority)}<Badge label={t.taskType} variant="muted" />
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={10} />Due {t.due}</span>
                  {t.completionDate && <span className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 size={10} />Done {t.completionDate}</span>}
                </div>
              </div>
              <div onClick={(e) => e.stopPropagation()}><ActionMenu actions={taskActions(t)} /></div>
            </Card>
          ))}
        </div>
      )}
      {selectedTask && <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  );
}

function MyProfilePage({ page, navigate }: { page: Page; navigate: (p: Page) => void }) {
  const me = CONSULTANTS[0];
  const tabs: { label: string; page: Page }[] = [{ label: "Overview", page: "my-profile" }, { label: "Edit Profile", page: "my-profile-edit" }, { label: "Security", page: "my-profile-security" }, { label: "Notifications", page: "my-profile-notifs" }];
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PageHeader title="My Profile" />
      <div className="flex gap-1 border-b border-border mb-5">{tabs.map((t) => <button key={t.page} onClick={() => navigate(t.page)} className={cx("px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors", page === t.page ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>{t.label}</button>)}</div>
      {page === "my-profile" && (
        <Card className="p-6">
          <div className="flex items-center gap-5 mb-6"><Avatar initials={me.avatar} size="lg" /><div><h2 className="text-lg font-bold">{me.name}</h2><p className="text-sm text-muted-foreground">{me.role}</p><p className="text-xs text-muted-foreground">{me.branch} · Joined {me.joined}</p><div className="flex items-center gap-2 mt-1"><Badge label="Active" variant="success" dot /><span className="text-xs text-amber-500 flex items-center gap-1 font-semibold"><Star size={10} fill="currentColor" />{me.rating}/5</span></div></div></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">{[["Props", me.props, "bg-primary/10 text-primary"], ["Listings", me.listings, "bg-blue-50 text-blue-600"], ["Deals", me.deals, "bg-emerald-50 text-emerald-600"], ["Score", me.score, "bg-purple-50 text-purple-600"]].map(([k, v, c]) => (<div key={k as string} className={cx("rounded-xl p-3 text-center", c as string)}><p className="text-lg font-bold">{v}</p><p className="text-xs font-medium opacity-70">{k}</p></div>))}</div>
          <div className="space-y-2 text-sm border-t border-border pt-4">
            <div className="flex items-center gap-2 text-muted-foreground"><Mail size={14} /><span className="text-xs">{me.email}</span></div>
            <div className="flex items-center gap-2 text-muted-foreground"><Phone size={14} /><span className="text-xs">{me.phone}</span></div>
            <div className="flex items-center gap-2 text-muted-foreground"><Building size={14} /><span className="text-xs">{me.branch}</span></div>
          </div>
        </Card>
      )}
      {page === "my-profile-edit" && (
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-semibold">Edit Profile</h2>
          <div className="grid grid-cols-2 gap-4"><Input label="First name" value="Layla" onChange={() => {}} /><Input label="Last name" value="Al-Rashidi" onChange={() => {}} /><Input label="Email" type="email" value={me.email} onChange={() => {}} /><Input label="Phone" value={me.phone} onChange={() => {}} /></div>
          <SelectField label="Branch" value={me.branch} onChange={() => {}} options={BRANCHES.map((b) => ({ label: b, value: b }))} />
          <Input label="Bio" value="Senior property consultant specialising in luxury Dubai Marina and Palm Jumeirah units." onChange={() => {}} textarea rows={3} />
          <Btn variant="primary" onClick={() => toast({ type: "success", message: "Profile updated." })}><Check size={13} />Save Changes</Btn>
        </Card>
      )}
      {page === "my-profile-security" && (
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-semibold">Change Password</h2>
          <Input label="Current password" type="password" value="" onChange={() => {}} />
          <Input label="New password" type="password" value="" onChange={() => {}} />
          <Input label="Confirm new password" type="password" value="" onChange={() => {}} />
          <div className="pt-3 border-t border-border"><div className="flex items-center justify-between"><div><p className="text-sm font-medium">Two-factor authentication</p><p className="text-xs text-muted-foreground">Add an extra layer of security</p></div><Btn variant="outline" size="sm"><Shield size={12} />Enable 2FA</Btn></div></div>
          <Btn variant="primary"><Check size={13} />Update Password</Btn>
        </Card>
      )}
      {page === "my-profile-notifs" && (
        <Card className="p-6">
          <h2 className="text-sm font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            {[["Email notifications", "Receive email for task assignments and follow-up reminders"], ["Push notifications", "Browser push for urgent tasks and lead alerts"], ["In-app notifications", "Bell alerts and badges within the platform"], ["Weekly digest", "Summary of your activity sent every Monday"]].map(([title, desc]) => (
              <div key={title as string} className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
                <div><p className="text-sm font-medium">{title}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
                <div className="w-10 flex-shrink-0 cursor-pointer mt-0.5 relative" style={{ height: "22px" }}><div className="w-10 bg-primary rounded-full absolute inset-0" /><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────────────

export default function App() {
  const [auth, setAuth] = useState<"login" | "forgot" | "app">("login");
  const [role, setRole] = useState<Role>("admin");
  const [userName, setUserName] = useState("");
  const [currentConsultant, setCurrentConsultant] = useState<typeof CONSULTANTS[number] | null>(null);
  const [currentConsultantId, setCurrentConsultantId] = useState<string | null>(null);
  const [page, setPage] = useState<Page>("admin-dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const navigate = useCallback((p: Page) => { setPage(p); setNotifOpen(false); setCmdOpen(false); }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen((p) => !p); }
      if (e.key === "Escape") { setCmdOpen(false); setNotifOpen(false); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const handleLogin = (r: Role, name: string) => {
    setRole(r); setUserName(name);
    if (r === "consultant") {
      const found = CONSULTANTS.find(c => c.name === name) || null;
      setCurrentConsultant(found);
      setCurrentConsultantId(found ? found.id : "C001");
    } else {
      setCurrentConsultant(null);
      setCurrentConsultantId(null);
    }
    setPage(r === "admin" ? "admin-dashboard" : "consultant-dashboard");
    setAuth("app");
  };

  if (auth === "login") return <><LoginPage onLogin={handleLogin} navigate={() => setAuth("forgot")} /><ToastContainer /></>;
  if (auth === "forgot") return <><ForgotPage navigate={() => setAuth("login")} /><ToastContainer /></>;

  const renderPage = () => {
    switch (page) {
      case "admin-dashboard": return <AdminDashboard navigate={navigate} />;
      case "properties": return <PropertiesPage navigate={navigate} role={role} />;
      case "property-detail": return <PropertyDetail navigate={navigate} role={role} />;
      case "add-property": return <AddPropertyWizard navigate={navigate} role={role} />;
      case "edit-property": return <EditPropertyWizard navigate={navigate} role={role} />;
      case "edit-listing": return <CreateListingWizard navigate={navigate} role={role} currentConsultant={currentConsultant} />;
      case "listings": case "my-listings": return <ListingsPage navigate={navigate} role={role} currentConsultantId={currentConsultantId} />;
      case "create-listing": return <CreateListingWizard navigate={navigate} role={role} currentConsultant={currentConsultant} />;
      case "listing-detail": return <ListingDetailPage navigate={navigate} role={role} />;
      case "tasks-kanban": return <TasksKanban />;
      case "tasks-timeline": return <TasksTimeline />;
      case "tasks-calendar": return <TasksCalendar />;
      case "consultants": return <ConsultantsPage navigate={navigate} />;
      case "add-consultant": return <AddConsultantPage navigate={navigate} />;
      case "follow-ups": case "my-followups": return <FollowUpsPage navigate={navigate} />;
      case "create-followup": return <CreateFollowUp navigate={navigate} role={role} />;
      case "reports-consultant": case "reports-property": case "reports-listing": case "reports-task": return <ReportsPage type={page} />;
      case "activity": return <ActivityLogPage />;
      case "settings-workspace": case "settings-users": case "settings-permissions": return <SettingsPage page={page} navigate={navigate} />;
      case "consultant-dashboard": return <ConsultantDashboard navigate={navigate} />;
      case "my-properties": return <MyPropertiesPage navigate={navigate} />;
      case "my-tasks": return <MyTasksPage />;
      case "my-profile": case "my-profile-edit": case "my-profile-security": case "my-profile-notifs": return <MyProfilePage page={page} navigate={navigate} />;
      default: return <div className="p-6"><EmptyState icon={<Layers size={28} />} title="Coming soon" description="This section is under development." /></div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar role={role} page={page} navigate={navigate} collapsed={collapsed} setCollapsed={setCollapsed} userName={userName} onLogout={() => setLogoutConfirm(true)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar userName={userName} role={role} onCmd={() => setCmdOpen(true)} onNotif={() => setNotifOpen((p) => !p)} notifOpen={notifOpen} />
        <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>{renderPage()}</main>
      </div>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} navigate={navigate} />
      <NotifDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
      <ConfirmModal open={logoutConfirm} title="Sign out?" message="You'll be returned to the login screen." onConfirm={() => { setLogoutConfirm(false); setAuth("login"); }} onCancel={() => setLogoutConfirm(false)} />
      <ToastContainer />
    </div>
  );
}
