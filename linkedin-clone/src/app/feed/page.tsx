"use client";

import { createClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Supabase ────────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const SESSION_KEY = "restock_session";
const AI_USERNAME = "restock-ai";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "home" | "network" | "jobs" | "messaging";
type ModalMode = "create" | "edit";
type AuthView = "login" | "signup";
type OccupationType = "Job" | "Business" | "Studying";

type Profile = {
  id: string;
  username: string;
  display_name: string;
  pfp_color: string;
  banner_color: string;
  occupation_type: OccupationType | string;
  headline: string;
  password?: string;
};

type Post = {
  id: string;
  author: string;
  initials: string;
  avatarColor: string;
  avatarImageUrl?: string;
  headline: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  likedByUser: boolean;
};

type DbMessage = {
  id: string;
  sender_username: string;
  receiver_username: string;
  message_text: string;
  created_at: string;
};

type RecommendedPerson = {
  id: string;
  name: string;
  initials: string;
  color: string;
  headline: string;
};

type ChatMessage = { role: "user" | "assistant"; text: string };

// ─── Constants ───────────────────────────────────────────────────────────────

const CARD_HOVER =
  "transition-all duration-200 hover:border-gray-300 hover:shadow-md";
const BTN_TRANSITION = "transition-all duration-200";
const SMOOTH_TRANSITION = "transition-all duration-300";
const INPUT_CLASS = `w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-500 focus:border-sky-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-600 ${BTN_TRANSITION}`;

const INDUSTRIES = [
  "Construction",
  "Information Technology",
  "Supply Chain & Procurement",
  "Facility Infrastructure Management",
  "Game Development",
  "Hardware Engineering",
];

const INDUSTRY_OTHER = "Other";
const INDUSTRY_OPTIONS = [...INDUSTRIES, INDUSTRY_OTHER];

const PFP_COLORS = [
  "bg-sky-800",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-rose-500",
  "bg-amber-600",
  "bg-indigo-500",
  "bg-teal-600",
  "bg-orange-500",
];

const BANNER_COLORS = [
  "from-sky-700 to-sky-500",
  "from-violet-600 to-purple-500",
  "from-emerald-600 to-teal-500",
  "from-rose-500 to-pink-500",
  "from-amber-600 to-orange-500",
  "from-indigo-600 to-blue-500",
];

const MESSAGE_CONTACTS = [
  {
    username: "sarah_chen",
    name: "Sarah Chen",
    initials: "SC",
    color: "bg-violet-600",
    subtitle: "VP of Operations",
  },
  {
    username: "marcus_rivera",
    name: "Marcus Rivera",
    initials: "MR",
    color: "bg-emerald-600",
    subtitle: "Procurement Lead",
  },
  {
    username: AI_USERNAME,
    name: "Restock AI Assistant",
    initials: "AI",
    color: "bg-sky-700",
    subtitle: "Always online",
  },
];

const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    author: "Sarah Chen",
    initials: "SC",
    avatarColor: "bg-violet-600",
    headline: "VP of Operations · Meridian Supply Co.",
    time: "2h",
    content:
      "Excited to share that our team reduced warehouse turnaround time by 18% this quarter. Small process changes — clearer pick paths, better shift handoffs — added up fast.",
    likes: 142,
    comments: 23,
    likedByUser: false,
  },
  {
    id: "2",
    author: "Marcus Rivera",
    initials: "MR",
    avatarColor: "bg-emerald-600",
    headline: "Procurement Lead · Northline Retail Group",
    time: "5h",
    content:
      "Three things I look for when evaluating a new supplier partnership: consistent lead times, transparent pricing, and a team that communicates before problems become crises.",
    likes: 89,
    comments: 17,
    likedByUser: false,
  },
  {
    id: "3",
    author: "Elena Okonkwo",
    initials: "EO",
    avatarColor: "bg-amber-600",
    headline: "Director of Inventory · Harbor & Co.",
    time: "1d",
    content:
      "Just wrapped a cross-functional planning session on seasonal demand. The best insight came from pairing sales forecasts with real-time stock levels.",
    likes: 214,
    comments: 41,
    likedByUser: false,
  },
];

const suggestedPeople = [
  { id: "p1", name: "James Liu", initials: "JL", color: "bg-rose-500", headline: "Supply Chain Analyst · Apex Logistics" },
  { id: "p2", name: "Dana Kim", initials: "DK", color: "bg-cyan-600", headline: "Inventory Planner · BrightMart" },
  { id: "p3", name: "Alex Patel", initials: "AP", color: "bg-indigo-500", headline: "Warehouse Manager · FlowTrack" },
  { id: "p4", name: "Rachel Moore", initials: "RM", color: "bg-orange-500", headline: "Procurement Specialist · Urban Goods" },
  { id: "p5", name: "Tom Nguyen", initials: "TN", color: "bg-teal-600", headline: "Operations Director · Summit Retail" },
  { id: "p6", name: "Priya Sharma", initials: "PS", color: "bg-fuchsia-600", headline: "Demand Planner · NorthStar Co." },
];

const jobOpenings = [
  { id: "j1", title: "Senior Supply Chain Manager", company: "Meridian Supply Co.", location: "Chicago, IL · Hybrid", posted: "2 days ago" },
  { id: "j2", title: "Inventory Control Specialist", company: "Northline Retail Group", location: "Austin, TX · On-site", posted: "4 days ago" },
  { id: "j3", title: "Procurement Analyst", company: "Harbor & Co.", location: "Remote · United States", posted: "1 week ago" },
  { id: "j4", title: "Warehouse Operations Lead", company: "FlowTrack Distribution", location: "Denver, CO · On-site", posted: "1 week ago" },
];

const trendingTopics = [
  { topic: "Supply chain resilience", readers: "12,483 readers" },
  { topic: "AI in inventory forecasting", readers: "9,102 readers" },
  { topic: "Sustainable sourcing", readers: "7,640 readers" },
  { topic: "B2B marketplace growth", readers: "6,218 readers" },
  { topic: "Warehouse automation", readers: "5,891 readers" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function isImageSource(value: string) {
  return (
    value.startsWith("blob:") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:")
  );
}

function resolveIndustry(industry: string, customIndustry: string) {
  return industry === INDUSTRY_OTHER ? customIndustry.trim() : industry;
}

function buildHeadline(
  occupation: OccupationType,
  industry: string,
  school: string,
) {
  if (occupation === "Studying") return `Studying at ${school}`;
  if (occupation === "Business") return `${industry} · Business Owner`;
  return `${industry} · Professional`;
}

function generateRecommendations(
  occupation: OccupationType,
  industry: string,
  school: string,
): RecommendedPerson[] {
  if (occupation === "Studying" && school) {
    return [
      { id: "r1", name: "Mia Torres", initials: "MT", color: "bg-cyan-600", headline: `Student · ${school}` },
      { id: "r2", name: "Jordan Blake", initials: "JB", color: "bg-indigo-500", headline: `Graduate Researcher · ${school}` },
      { id: "r3", name: "Sofia Ahmed", initials: "SA", color: "bg-rose-500", headline: `Business Student · ${school}` },
      { id: "r4", name: "Chris Park", initials: "CP", color: "bg-teal-600", headline: `Engineering Student · ${school}` },
    ];
  }
  const field = industry || "Supply Chain & Procurement";
  return [
    { id: "r1", name: "Elena Okonkwo", initials: "EO", color: "bg-amber-600", headline: `Director · ${field}` },
    { id: "r2", name: "David Walsh", initials: "DW", color: "bg-violet-600", headline: `Operations Manager · ${field}` },
    { id: "r3", name: "Nina Kowalski", initials: "NK", color: "bg-emerald-600", headline: `Team Lead · ${field}` },
    { id: "r4", name: "Ryan Osei", initials: "RO", color: "bg-orange-500", headline: occupation === "Business" ? `Founder · ${field}` : `Senior Analyst · ${field}` },
  ];
}

function getChatbotResponse(
  input: string,
  displayName: string,
  headline: string,
) {
  const lower = input.toLowerCase();

  if (
    lower.includes("help") ||
    lower.includes("features") ||
    lower.includes("what can i do")
  ) {
    return `Here's everything you can do on Restock, ${displayName}:

• Create posts from your home feed
• Edit or delete your own posts anytime
• Upload custom profile pictures and banner images
• Switch tabs to explore Jobs, Network, and Messaging
• Message other users and the Restock AI Assistant
• Edit your professional profile on the fly

What would you like to explore first?`;
  }

  if (lower.includes("news") || lower.includes("business")) {
    return `Global Business Brief for ${displayName}

Supply Chain
• Asia-Pacific port congestion is easing; firms are diversifying beyond single-source suppliers.
• Nearshoring investments up 18% as companies shorten lead times.

Procurement
• Raw material prices are stabilizing after two years of volatility.
• Long-term vendor contracts are trending up 12% year over year.

Tech Sector
• Warehouse automation and AI inventory forecasting lead enterprise spend.
• Cloud-based procurement platforms are seeing record adoption.

Ask me about "help" anytime for a full platform guide.`;
  }

  return `Thanks for reaching out, ${displayName}! As your Restock assistant, I'm here to support your professional goals. With your background in ${headline}, I'd suggest sharing an industry insight on the feed or connecting with peers in the Network tab. Type "help" for platform tips or "news" for market updates.`;
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function Icon({ children, className = "w-6 h-6" }: { children: React.ReactNode; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {children}
    </svg>
  );
}

function SearchIcon() { return <Icon className="w-4 h-4 text-gray-500"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>; }
function HomeIcon() { return <Icon><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></Icon>; }
function NetworkIcon() { return <Icon><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon>; }
function JobsIcon() { return <Icon><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></Icon>; }
function MessagingIcon() { return <Icon><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Icon>; }
function CommentIcon() { return <Icon className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Icon>; }
function ShareIcon() { return <Icon className="w-5 h-5"><path d="m4 12 8-8 8 8" /><path d="M12 4v16" /></Icon>; }
function TrendIcon() { return <Icon className="w-4 h-4 text-gray-500"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></Icon>; }
function CloseIcon() { return <Icon className="w-5 h-5"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Icon>; }
function MoreIcon() { return <Icon className="h-5 w-5"><circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" /></Icon>; }
function BotIcon() { return <Icon className="w-5 h-5"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></Icon>; }

function LikeIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

function Avatar({
  initials,
  color = "bg-sky-700",
  imageUrl,
  size = "md",
}: {
  initials: string;
  color?: string;
  imageUrl?: string;
  size?: "sm" | "md" | "xs";
}) {
  const sizeClass =
    size === "xs"
      ? "h-8 w-8 text-[10px]"
      : size === "sm"
        ? "h-10 w-10 text-xs"
        : "h-12 w-12 text-sm";
  const src = imageUrl ?? (isImageSource(color) ? color : undefined);

  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={`shrink-0 rounded-full object-cover ${sizeClass}`}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${sizeClass} ${color}`}
    >
      {initials}
    </div>
  );
}

function ProfileBanner({
  bannerColor,
  className = "h-14",
}: {
  bannerColor: string;
  className?: string;
}) {
  if (isImageSource(bannerColor)) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <img
          src={bannerColor}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r ${bannerColor} ${className}`} />
  );
}

const navItems: { id: Tab; label: string; icon: () => React.ReactNode }[] = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "network", label: "Network", icon: NetworkIcon },
  { id: "jobs", label: "Jobs", icon: JobsIcon },
  { id: "messaging", label: "Messaging", icon: MessagingIcon },
];

function PostAction({ icon: ActionIcon, label, active = false, onClick }: { icon: () => React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-semibold ${BTN_TRANSITION} hover:bg-gray-100 ${active ? "text-sky-700" : "text-gray-600 hover:text-gray-800"}`}>
      <ActionIcon />{label}
    </button>
  );
}

function TabContent({ tabKey, children }: { tabKey: string; children: React.ReactNode }) {
  return <div key={tabKey} className="restock-tab-enter min-w-0 space-y-4">{children}</div>;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Home() {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<Profile | null>(null);
  const [authView, setAuthView] = useState<AuthView>("login");
  const [authError, setAuthError] = useState("");

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupStep, setSignupStep] = useState(1);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pfpColor, setPfpColor] = useState(PFP_COLORS[0]);
  const [bannerColor, setBannerColor] = useState(BANNER_COLORS[0]);
  const [occupationType, setOccupationType] = useState<OccupationType>("Job");
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [customIndustry, setCustomIndustry] = useState("");
  const [school, setSchool] = useState("");
  const [signupConnections, setSignupConnections] = useState<Set<string>>(new Set());
  const [signupSubmitting, setSignupSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postDraft, setPostDraft] = useState("");
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);

  const [profileDraft, setProfileDraft] = useState({ display_name: "", headline: "", pfp_color: "", banner_color: "", occupation_type: "Job" as OccupationType });

  const [selectedContact, setSelectedContact] = useState(MESSAGE_CONTACTS[0].username);
  const [dmMessages, setDmMessages] = useState<DbMessage[]>([]);
  const [dmDraft, setDmDraft] = useState("");
  const [dmSending, setDmSending] = useState(false);
  const dmEndRef = useRef<HTMLDivElement>(null);

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([]);
  const [aiDraft, setAiDraft] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const aiEndRef = useRef<HTMLDivElement>(null);
  const aiTypingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const pfpFileRef = useRef<HTMLInputElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  const resolvedIndustry = resolveIndustry(industry, customIndustry);
  const recommendations = generateRecommendations(
    occupationType,
    resolvedIndustry,
    school,
  );

  const persistSession = useCallback((profile: Profile) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ username: profile.username }));
    setUser(profile);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setAuthView("login");
  }, []);

  const fetchProfile = useCallback(async (uname: string) => {
    const { data, error } = await supabase.from("profiles").select("*").eq("username", uname).maybeSingle();
    if (error || !data) return null;
    const { password: _pw, ...profile } = data as Profile;
    return profile as Profile;
  }, []);

  useEffect(() => {
    async function restoreSession() {
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (raw) {
          const { username: storedUsername } = JSON.parse(raw);
          const profile = await fetchProfile(storedUsername);
          if (profile) setUser(profile);
        }
      } finally {
        setAuthLoading(false);
      }
    }
    restoreSession();
  }, [fetchProfile]);

  const fetchDmMessages = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_username.eq.${user.username},receiver_username.eq.${selectedContact}),and(sender_username.eq.${selectedContact},receiver_username.eq.${user.username})`,
      )
      .order("created_at", { ascending: true });
    if (data) setDmMessages(data as DbMessage[]);
  }, [user, selectedContact]);

  useEffect(() => {
    if (!user || activeTab !== "messaging") return;
    fetchDmMessages();
    const interval = setInterval(fetchDmMessages, 2500);
    return () => clearInterval(interval);
  }, [user, activeTab, selectedContact, fetchDmMessages]);

  useEffect(() => {
    dmEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dmMessages]);

  useEffect(() => {
    aiEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, isAiOpen, aiTyping]);

  useEffect(() => {
    if (!isAiOpen || !user || aiMessages.length > 0) return;
    setAiMessages([
      {
        role: "assistant",
        text: `Hello ${user.display_name}! I'm Restock AI, your professional assistant. Ask me about help, features, news, or anything else on the platform.`,
      },
    ]);
  }, [isAiOpen, user, aiMessages.length]);

  useEffect(() => {
    return () => {
      if (aiTypingTimerRef.current) clearTimeout(aiTypingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpenMenuPostId(null);
    }
    if (openMenuPostId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenuPostId]);

  useEffect(() => {
    if (user && isProfileModalOpen) {
      setProfileDraft({
        display_name: user.display_name,
        headline: user.headline,
        pfp_color: user.pfp_color,
        banner_color: user.banner_color,
        occupation_type: (user.occupation_type as OccupationType) || "Job",
      });
    }
  }, [user, isProfileModalOpen]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", loginUsername.trim())
      .eq("password", loginPassword)
      .maybeSingle();
    if (error || !data) {
      setAuthError("Invalid username or password.");
      return;
    }
    const { password: _pw, ...profile } = data as Profile;
    persistSession(profile as Profile);
  }

  async function handleSignupFinish() {
    setAuthError("");
    setSignupSubmitting(true);
    const headline = buildHeadline(
      occupationType,
      resolvedIndustry,
      school,
    );
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        username: username.trim(),
        password,
        display_name: displayName.trim(),
        pfp_color: pfpColor,
        banner_color: bannerColor,
        occupation_type: occupationType,
        headline,
      })
      .select()
      .single();
    setSignupSubmitting(false);
    if (error) {
      setAuthError(error.message.includes("duplicate") ? "Username already taken." : `Registration failed: ${error.message}`);
      return;
    }
    const { password: _pw, ...profile } = data as Profile;
    persistSession(profile as Profile);
    setSignupStep(1);
  }

  async   function handleImageUpload(
    file: File | undefined,
    field: "pfp_color" | "banner_color",
  ) {
    if (!file || !user) return;
    const objectUrl = URL.createObjectURL(file);
    setProfileDraft((d) => ({ ...d, [field]: objectUrl }));
    setUser((prev) => (prev ? { ...prev, [field]: objectUrl } : prev));

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (!dataUrl) return;
      setProfileDraft((d) => ({ ...d, [field]: dataUrl }));
      setUser((prev) => (prev ? { ...prev, [field]: dataUrl } : prev));
      URL.revokeObjectURL(objectUrl);
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveProfile() {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: profileDraft.display_name,
        headline: profileDraft.headline,
        pfp_color: profileDraft.pfp_color,
        banner_color: profileDraft.banner_color,
        occupation_type: profileDraft.occupation_type,
      })
      .eq("username", user.username);
    if (error) return;
    const updated = { ...user, ...profileDraft };
    persistSession(updated);
    setIsProfileModalOpen(false);
  }

  async function sendDm(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !dmDraft.trim() || dmSending) return;
    setDmSending(true);
    const text = dmDraft.trim();
    setDmDraft("");
    await supabase.from("messages").insert({
      sender_username: user.username,
      receiver_username: selectedContact,
      message_text: text,
    });
    if (selectedContact === AI_USERNAME) {
      await supabase.from("messages").insert({
        sender_username: AI_USERNAME,
        receiver_username: user.username,
        message_text: getChatbotResponse(text, user.display_name, user.headline),
      });
    }
    await fetchDmMessages();
    setDmSending(false);
  }

  function sendAiMessage(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user || !aiDraft.trim() || aiTyping) return;

    const text = aiDraft.trim();
    const displayName = user.display_name;
    const headline = user.headline;

    setAiDraft("");
    setAiMessages((prev) => [...prev, { role: "user", text }]);
    setAiTyping(true);

    if (aiTypingTimerRef.current) clearTimeout(aiTypingTimerRef.current);

    aiTypingTimerRef.current = setTimeout(() => {
      setAiMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: getChatbotResponse(text, displayName, headline),
        },
      ]);
      setAiTyping(false);
      aiTypingTimerRef.current = null;
    }, 1000);
  }

  function handleToggleLike(postId: string) {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const likedByUser = !post.likedByUser;
        return { ...post, likedByUser, likes: likedByUser ? post.likes + 1 : post.likes - 1 };
      }),
    );
  }

  function openCreateModal() {
    setModalMode("create");
    setEditingPostId(null);
    setPostDraft("");
    setIsPostModalOpen(true);
  }

  function openEditModal(post: Post) {
    setModalMode("edit");
    setEditingPostId(post.id);
    setPostDraft(post.content);
    setOpenMenuPostId(null);
    setIsPostModalOpen(true);
  }

  function handleSavePost() {
    if (!user) return;
    const trimmed = postDraft.trim();
    if (!trimmed) return;
    if (modalMode === "edit" && editingPostId) {
      setPosts((prev) => prev.map((p) => (p.id === editingPostId ? { ...p, content: trimmed } : p)));
    } else {
      setPosts((prev) => [{
        id: `user-${Date.now()}`,
        author: user.display_name,
        initials: getInitials(user.display_name),
        avatarColor: isImageSource(user.pfp_color) ? PFP_COLORS[0] : user.pfp_color,
        avatarImageUrl: isImageSource(user.pfp_color) ? user.pfp_color : undefined,
        headline: user.headline,
        time: "Just now",
        content: trimmed,
        likes: 0,
        comments: 0,
        likedByUser: false,
      }, ...prev]);
    }
    setIsPostModalOpen(false);
    setPostDraft("");
    setEditingPostId(null);
    setModalMode("create");
  }

  function handleDeletePost(postId: string) {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setOpenMenuPostId(null);
  }

  function validateSignupStep(step: number) {
    setAuthError("");
    if (step === 1) {
      if (!displayName.trim() || !username.trim() || !password || !confirmPassword) {
        setAuthError("All fields are required.");
        return false;
      }
      if (password !== confirmPassword) {
        setAuthError("Passwords do not match.");
        return false;
      }
      if (password.length < 6) {
        setAuthError("Password must be at least 6 characters.");
        return false;
      }
    }
    if (step === 3) {
      if (occupationType === "Studying" && !school.trim()) {
        setAuthError("Please enter your school, college, or university.");
        return false;
      }
      if (
        occupationType !== "Studying" &&
        industry === INDUSTRY_OTHER &&
        !customIndustry.trim()
      ) {
        setAuthError("Please type your industry/occupation.");
        return false;
      }
    }
    return true;
  }

  function renderAuthGate() {
    if (authView === "login") {
      return (
        <div className="mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-center text-2xl font-bold text-black">Restock</h1>
          <p className="mt-1 text-center text-sm text-gray-600">Sign in to your professional network</p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Username</label>
              <input className={INPUT_CLASS} value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} placeholder="your_username" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Password</label>
              <input type="password" className={INPUT_CLASS} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {authError && <p className="text-sm text-red-600">{authError}</p>}
            <button type="submit" className={`w-full rounded-full bg-sky-600 py-2.5 text-sm font-semibold text-white ${BTN_TRANSITION} hover:bg-sky-700`}>Sign in</button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            New to Restock?{" "}
            <button type="button" onClick={() => { setAuthView("signup"); setAuthError(""); }} className={`font-semibold text-sky-700 ${BTN_TRANSITION} hover:text-sky-800`}>Create account</button>
          </p>
        </div>
      );
    }

    return (
      <div className="mx-auto w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-black">Join Restock</h1>
          <span className="text-xs font-medium text-gray-500">Step {signupStep} of 4</span>
        </div>
        <div className="mb-6 flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${BTN_TRANSITION} ${s <= signupStep ? "bg-sky-600" : "bg-gray-200"}`} />
          ))}
        </div>

        {signupStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Full / Display Name</label>
              <input className={INPUT_CLASS} value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Alex Johnson" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Username</label>
              <input className={INPUT_CLASS} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="alex_j" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Password</label>
              <input type="password" className={INPUT_CLASS} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Confirm Password</label>
              <input type="password" className={INPUT_CLASS} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          </div>
        )}

        {signupStep === 2 && (
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-900">Profile picture color</p>
              <div className="flex flex-wrap gap-3">
                {PFP_COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => setPfpColor(c)} className={`h-10 w-10 rounded-full ${c} ${BTN_TRANSITION} ${pfpColor === c ? "ring-2 ring-sky-600 ring-offset-2" : "hover:scale-110"}`} />
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <Avatar initials={getInitials(displayName || "YO")} color={pfpColor} />
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-900">Banner color</p>
              <div className="grid grid-cols-2 gap-3">
                {BANNER_COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => setBannerColor(c)} className={`h-12 rounded-lg bg-gradient-to-r ${c} ${BTN_TRANSITION} ${bannerColor === c ? "ring-2 ring-sky-600 ring-offset-2" : "hover:opacity-90"}`} />
                ))}
              </div>
            </div>
          </div>
        )}

        {signupStep === 3 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">Occupation Type</label>
              <select className={INPUT_CLASS} value={occupationType} onChange={(e) => setOccupationType(e.target.value as OccupationType)}>
                <option value="Job">Job</option>
                <option value="Business">Business</option>
                <option value="Studying">Studying</option>
              </select>
            </div>
            {occupationType === "Studying" ? (
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">School, College, or University</label>
                <input className={INPUT_CLASS} value={school} onChange={(e) => setSchool(e.target.value)} placeholder="e.g. Stanford University" />
              </div>
            ) : (
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Industry</label>
                <select
                  className={INPUT_CLASS}
                  value={industry}
                  onChange={(e) => {
                    setIndustry(e.target.value);
                    if (e.target.value !== INDUSTRY_OTHER) setCustomIndustry("");
                  }}
                >
                  {INDUSTRY_OPTIONS.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
                <div
                  className={`overflow-hidden ${SMOOTH_TRANSITION} ${
                    industry === INDUSTRY_OTHER
                      ? "mt-3 max-h-20 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Type your industry/occupation
                  </label>
                  <input
                    className={INPUT_CLASS}
                    value={customIndustry}
                    onChange={(e) => setCustomIndustry(e.target.value)}
                    placeholder="e.g. Renewable Energy Consulting"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {signupStep === 4 && (
          <div>
            <h2 className="text-base font-semibold text-gray-900">Recommended connections for you</h2>
            <p className="mt-1 text-sm text-gray-600">Based on your professional background.</p>
            <div className="mt-4 space-y-3">
              {recommendations.map((person) => {
                const connected = signupConnections.has(person.id);
                return (
                  <div key={person.id} className={`flex items-center gap-3 rounded-lg border border-gray-200 p-3 ${CARD_HOVER}`}>
                    <Avatar initials={person.initials} color={person.color} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900">{person.name}</p>
                      <p className="truncate text-xs text-gray-600">{person.headline}</p>
                    </div>
                    <button type="button" onClick={() => setSignupConnections((prev) => { const n = new Set(prev); connected ? n.delete(person.id) : n.add(person.id); return n; })} className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${BTN_TRANSITION} ${connected ? "border-gray-400 text-gray-600" : "border-sky-600 text-sky-700 hover:bg-sky-50"}`}>
                      {connected ? "Added" : "Connect"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {authError && <p className="mt-4 text-sm text-red-600">{authError}</p>}

        <div className="mt-6 flex gap-3">
          {signupStep > 1 && (
            <button type="button" onClick={() => { setSignupStep((s) => s - 1); setAuthError(""); }} className={`flex-1 rounded-full border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 ${BTN_TRANSITION} hover:bg-gray-50`}>Back</button>
          )}
          {signupStep < 4 ? (
            <button type="button" onClick={() => { if (validateSignupStep(signupStep)) setSignupStep((s) => s + 1); }} className={`flex-1 rounded-full bg-sky-600 py-2.5 text-sm font-semibold text-white ${BTN_TRANSITION} hover:bg-sky-700`}>Continue</button>
          ) : (
            <button type="button" onClick={handleSignupFinish} disabled={signupSubmitting} className={`flex-1 rounded-full bg-sky-600 py-2.5 text-sm font-semibold text-white ${BTN_TRANSITION} hover:bg-sky-700 disabled:opacity-50`}>{signupSubmitting ? "Creating..." : "Finish"}</button>
          )}
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button type="button" onClick={() => { setAuthView("login"); setAuthError(""); setSignupStep(1); }} className={`font-semibold text-sky-700 ${BTN_TRANSITION} hover:text-sky-800`}>Sign in</button>
        </p>
      </div>
    );
  }

  function renderCenterContent() {
    if (!user) return null;
    switch (activeTab) {
      case "home":
        return (
          <TabContent tabKey="home">
            <div className={`rounded-lg border border-gray-200 bg-white p-4 ${CARD_HOVER}`}>
              <button type="button" onClick={openCreateModal} className={`flex w-full items-start gap-3 text-left ${BTN_TRANSITION}`}>
                <Avatar
                  initials={getInitials(user.display_name)}
                  color={user.pfp_color}
                  imageUrl={isImageSource(user.pfp_color) ? user.pfp_color : undefined}
                />
                <span className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 hover:border-gray-400 hover:bg-gray-100">Start a post</span>
              </button>
            </div>
            {posts.map((post) => {
              const isOwnPost = post.author === user.display_name;
              const postAvatarImage =
                isOwnPost && isImageSource(user.pfp_color)
                  ? user.pfp_color
                  : post.avatarImageUrl;
              return (
              <article key={post.id} className={`rounded-lg border border-gray-200 bg-white ${CARD_HOVER}`}>
                <div className="relative flex items-start gap-3 p-4 pb-3">
                  <Avatar
                    initials={post.initials}
                    color={post.avatarColor}
                    imageUrl={postAvatarImage}
                  />
                  <div className="min-w-0 flex-1 pr-8">
                    <h3 className="text-sm font-semibold text-gray-900">{post.author}</h3>
                    <p className="truncate text-xs text-gray-600">{post.headline}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{post.time}</p>
                  </div>
                  {post.author === user.display_name && (
                    <div ref={openMenuPostId === post.id ? menuRef : undefined} className="absolute right-3 top-3">
                      <button type="button" onClick={() => setOpenMenuPostId((p) => (p === post.id ? null : post.id))} className={`rounded-full p-1.5 text-gray-500 ${BTN_TRANSITION} hover:bg-gray-100`} aria-label="Post options"><MoreIcon /></button>
                      {openMenuPostId === post.id && (
                        <div className="restock-dropdown-enter absolute right-0 top-full z-10 mt-1 w-36 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                          <button type="button" onClick={() => openEditModal(post)} className={`w-full px-4 py-2 text-left text-sm text-gray-700 ${BTN_TRANSITION} hover:bg-gray-100`}>Edit</button>
                          <button type="button" onClick={() => handleDeletePost(post.id)} className={`w-full px-4 py-2 text-left text-sm text-red-600 ${BTN_TRANSITION} hover:bg-red-50`}>Delete</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="px-4 pb-3"><p className="text-sm leading-relaxed text-gray-800">{post.content}</p></div>
                <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2 text-xs text-gray-500">
                  <span>{post.likes} likes</span><span>{post.comments} comments</span>
                </div>
                <div className="flex border-t border-gray-200 px-2 py-1">
                  <PostAction icon={() => <LikeIcon filled={post.likedByUser} />} label="Like" active={post.likedByUser} onClick={() => handleToggleLike(post.id)} />
                  <PostAction icon={CommentIcon} label="Comment" />
                  <PostAction icon={ShareIcon} label="Share" />
                </div>
              </article>
            );
            })}
          </TabContent>
        );

      case "network":
        return (
          <TabContent tabKey="network">
            <div className={`rounded-lg border border-gray-200 bg-white p-4 sm:p-6 ${CARD_HOVER}`}>
              <h2 className="text-lg font-semibold text-gray-900">People you may know</h2>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {suggestedPeople.map((person) => {
                  const isConnected = connectedIds.has(person.id);
                  return (
                    <div key={person.id} className={`flex flex-col items-center rounded-lg border border-gray-200 bg-[#f3f2ef] p-5 text-center ${CARD_HOVER}`}>
                      <Avatar initials={person.initials} color={person.color} />
                      <h3 className="mt-3 text-sm font-semibold text-gray-900">{person.name}</h3>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-600">{person.headline}</p>
                      <button type="button" onClick={() => setConnectedIds((prev) => { const n = new Set(prev); isConnected ? n.delete(person.id) : n.add(person.id); return n; })} className={`mt-4 w-full rounded-full border px-4 py-1.5 text-sm font-semibold ${BTN_TRANSITION} ${isConnected ? "border-gray-400 bg-white text-gray-600" : "border-sky-600 text-sky-700 hover:bg-sky-50"}`}>{isConnected ? "Pending" : "Connect"}</button>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabContent>
        );

      case "jobs":
        return (
          <TabContent tabKey="jobs">
            <div className={`rounded-lg border border-gray-200 bg-white p-4 sm:p-6 ${CARD_HOVER}`}>
              <h2 className="text-lg font-semibold text-gray-900">Recommended for you</h2>
            </div>
            {jobOpenings.map((job) => {
              const hasApplied = appliedJobIds.has(job.id);
              return (
                <article key={job.id} className={`rounded-lg border border-gray-200 bg-white p-4 sm:p-5 ${CARD_HOVER}`}>
                  <h3 className="text-base font-semibold text-sky-700">{job.title}</h3>
                  <p className="mt-0.5 text-sm text-gray-900">{job.company}</p>
                  <p className="mt-1 text-xs text-gray-600">{job.location}</p>
                  <div className="mt-4 flex justify-end">
                    <button type="button" onClick={() => setAppliedJobIds((p) => new Set(p).add(job.id))} disabled={hasApplied} className={`rounded-full px-5 py-1.5 text-sm font-semibold ${BTN_TRANSITION} ${hasApplied ? "bg-gray-100 text-gray-500" : "bg-sky-600 text-white hover:bg-sky-700"}`}>{hasApplied ? "Applied" : "Easy Apply"}</button>
                  </div>
                </article>
              );
            })}
          </TabContent>
        );

      case "messaging": {
        const contact = MESSAGE_CONTACTS.find((c) => c.username === selectedContact)!;
        return (
          <TabContent tabKey="messaging">
            <div className={`flex h-[520px] overflow-hidden rounded-lg border border-gray-200 bg-white ${CARD_HOVER}`}>
              <div className="w-1/3 min-w-[140px] border-r border-gray-200">
                <div className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900">Messaging</div>
                {MESSAGE_CONTACTS.map((c) => (
                  <button key={c.username} type="button" onClick={() => setSelectedContact(c.username)} className={`flex w-full items-center gap-3 px-4 py-3 text-left ${BTN_TRANSITION} ${selectedContact === c.username ? "bg-sky-50" : "hover:bg-gray-50"}`}>
                    <Avatar initials={c.initials} color={c.color} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">{c.name}</p>
                      <p className="truncate text-xs text-gray-500">{c.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
                  <Avatar initials={contact.initials} color={contact.color} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.subtitle}</p>
                  </div>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {dmMessages.length === 0 && <p className="text-center text-sm text-gray-500">No messages yet. Say hello!</p>}
                  {dmMessages.map((msg) => {
                    const isMine = msg.sender_username === user.username;
                    return (
                      <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${isMine ? "bg-sky-600 text-white" : "bg-gray-100 text-gray-800"}`}>{msg.message_text}</div>
                      </div>
                    );
                  })}
                  <div ref={dmEndRef} />
                </div>
                <form onSubmit={sendDm} className="flex gap-2 border-t border-gray-200 p-3">
                  <input className={`flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:border-sky-600 focus:outline-none ${BTN_TRANSITION}`} value={dmDraft} onChange={(e) => setDmDraft(e.target.value)} placeholder="Write a message..." />
                  <button type="submit" disabled={!dmDraft.trim() || dmSending} className={`rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white ${BTN_TRANSITION} hover:bg-sky-700 disabled:opacity-50`}>Send</button>
                </form>
              </div>
            </div>
          </TabContent>
        );
      }
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f2ef]">
        <p className="text-sm text-gray-600">Loading Restock...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f2ef] px-4 py-8">
        {renderAuthGate()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f2ef] text-gray-900">
      <style>{`
        @keyframes restock-tab-slide { from { opacity: 0; transform: translateX(1.5rem); } to { opacity: 1; transform: translateX(0); } }
        @keyframes restock-backdrop-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes restock-modal-scale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes restock-dropdown-scale { from { opacity: 0; transform: scale(0.95) translateY(-4px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .restock-tab-enter { animation: restock-tab-slide 0.3s ease-out forwards; }
        .restock-backdrop-enter { animation: restock-backdrop-fade 0.2s ease-out forwards; }
        .restock-modal-enter { animation: restock-modal-scale 0.2s ease-out forwards; }
        .restock-dropdown-enter { animation: restock-dropdown-scale 0.15s ease-out forwards; }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-[1128px] items-center gap-4 px-4 sm:gap-6 sm:px-6">
          <button type="button" onClick={() => setActiveTab("home")} className={`shrink-0 text-xl font-bold tracking-tight text-black sm:text-2xl ${BTN_TRANSITION} hover:opacity-80`}>Restock</button>
          <div className="hidden min-w-0 flex-1 sm:block">
            <div className="relative max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center"><SearchIcon /></div>
              <input type="search" placeholder="Search" className={`w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm ${BTN_TRANSITION} focus:border-sky-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-600`} />
            </div>
          </div>
          <nav className="ml-auto flex items-center gap-1 sm:gap-2">
            {navItems.map(({ id, label, icon: NavIcon }) => {
              const isActive = activeTab === id;
              return (
                <button key={id} type="button" onClick={() => setActiveTab(id)} className={`relative flex min-w-[52px] flex-col items-center rounded-md px-2 py-1 ${BTN_TRANSITION} sm:min-w-[64px] ${isActive ? "text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                  <NavIcon />
                  <span className="mt-0.5 hidden text-[11px] font-medium sm:block">{label}</span>
                  <span className={`absolute -bottom-[9px] left-1/2 hidden h-0.5 max-w-[52px] -translate-x-1/2 bg-gray-900 sm:block ${BTN_TRANSITION} ${isActive ? "w-full opacity-100" : "w-0 opacity-0"}`} />
                </button>
              );
            })}
            <Avatar
              initials={getInitials(user.display_name)}
              color={user.pfp_color}
              imageUrl={isImageSource(user.pfp_color) ? user.pfp_color : undefined}
              size="xs"
            />
            <button type="button" onClick={clearSession} className={`ml-1 hidden rounded-md px-2 py-1 text-[11px] font-medium text-gray-500 sm:block ${BTN_TRANSITION} hover:bg-gray-50 hover:text-gray-800`}>Sign out</button>
          </nav>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1128px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[225px_minmax(0,1fr)_300px]">
        <aside className="hidden space-y-2 lg:block">
          <div className={`overflow-hidden rounded-lg border border-gray-200 bg-white text-center ${CARD_HOVER}`}>
            <ProfileBanner bannerColor={user.banner_color} />
            <div className="-mt-8 flex justify-center">
              <Avatar
                initials={getInitials(user.display_name)}
                color={user.pfp_color}
                imageUrl={isImageSource(user.pfp_color) ? user.pfp_color : undefined}
              />
            </div>
            <div className="mt-3 px-4 pb-4">
              <h2 className="text-base font-semibold text-gray-900">{user.display_name}</h2>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{user.headline}</p>
              <button type="button" onClick={() => setIsProfileModalOpen(true)} className={`mt-3 rounded-full border border-sky-600 px-4 py-1 text-xs font-semibold text-sky-700 ${BTN_TRANSITION} hover:bg-sky-50`}>Edit profile</button>
            </div>
          </div>
        </aside>

        <section className="min-w-0 overflow-hidden">{renderCenterContent()}</section>

        <aside className="space-y-2">
          <div className={`rounded-lg border border-gray-200 bg-white p-4 ${CARD_HOVER}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Restock News &amp; Trends</h2>
              <TrendIcon />
            </div>
            <ul className="mt-4 space-y-4">
              {trendingTopics.map((item, index) => (
                <li key={item.topic}>
                  <button type="button" className={`w-full text-left ${BTN_TRANSITION} hover:text-sky-700`}>
                    <p className="text-xs text-gray-500">{index + 1} · Trending</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-900">{item.topic}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{item.readers}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>

      {/* Post Modal */}
      {isPostModalOpen && (
        <div className="restock-backdrop-enter fixed inset-0 z-[100] flex items-start justify-center bg-black/50 px-4 pt-[10vh]" onClick={() => setIsPostModalOpen(false)} role="presentation">
          <div className="restock-modal-enter w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h2 className="flex-1 text-center text-base font-semibold">{modalMode === "edit" ? "Edit post" : "Create a post"}</h2>
              <button type="button" onClick={() => setIsPostModalOpen(false)} className={`rounded-full p-1.5 ${BTN_TRANSITION} hover:bg-gray-100`}><CloseIcon /></button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <Avatar
                  initials={getInitials(user.display_name)}
                  color={user.pfp_color}
                  imageUrl={isImageSource(user.pfp_color) ? user.pfp_color : undefined}
                  size="sm"
                />
                <div><p className="text-sm font-semibold">{user.display_name}</p><p className="text-xs text-gray-600">{user.headline}</p></div>
              </div>
              <textarea value={postDraft} onChange={(e) => setPostDraft(e.target.value)} placeholder="What do you want to talk about?" rows={6} className="mt-4 w-full resize-none border-0 bg-transparent text-sm focus:outline-none" autoFocus />
            </div>
            <div className="flex justify-end border-t border-gray-200 px-4 py-3">
              <button type="button" onClick={handleSavePost} disabled={!postDraft.trim()} className={`rounded-full bg-sky-600 px-6 py-2 text-sm font-semibold text-white ${BTN_TRANSITION} hover:bg-sky-700 disabled:opacity-50`}>{modalMode === "edit" ? "Save" : "Post"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {isProfileModalOpen && (
        <div className="restock-backdrop-enter fixed inset-0 z-[100] flex items-start justify-center bg-black/50 px-4 pt-[10vh]" onClick={() => setIsProfileModalOpen(false)} role="presentation">
          <div className="restock-modal-enter w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h2 className="flex-1 text-center text-base font-semibold">Edit profile</h2>
              <button type="button" onClick={() => setIsProfileModalOpen(false)} className={`rounded-full p-1.5 ${BTN_TRANSITION} hover:bg-gray-100`}><CloseIcon /></button>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Display Name</label>
                <input className={INPUT_CLASS} value={profileDraft.display_name} onChange={(e) => setProfileDraft((d) => ({ ...d, display_name: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Headline</label>
                <input className={INPUT_CLASS} value={profileDraft.headline} onChange={(e) => setProfileDraft((d) => ({ ...d, headline: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Occupation Type</label>
                <select className={INPUT_CLASS} value={profileDraft.occupation_type} onChange={(e) => setProfileDraft((d) => ({ ...d, occupation_type: e.target.value as OccupationType }))}>
                  <option value="Job">Job</option><option value="Business">Business</option><option value="Studying">Studying</option>
                </select>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-gray-700">Profile picture</p>
                <input
                  ref={pfpFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files?.[0], "pfp_color")}
                />
                <button
                  type="button"
                  onClick={() => pfpFileRef.current?.click()}
                  className={`w-full rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 ${SMOOTH_TRANSITION} hover:border-sky-600 hover:bg-sky-50 hover:text-sky-700`}
                >
                  Upload profile photo
                </button>
                {isImageSource(profileDraft.pfp_color) && (
                  <div className="mt-3 flex justify-center">
                    <Avatar
                      initials={getInitials(profileDraft.display_name)}
                      color={PFP_COLORS[0]}
                      imageUrl={profileDraft.pfp_color}
                      size="sm"
                    />
                  </div>
                )}
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-gray-700">Banner image</p>
                <input
                  ref={bannerFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files?.[0], "banner_color")}
                />
                <button
                  type="button"
                  onClick={() => bannerFileRef.current?.click()}
                  className={`w-full rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 ${SMOOTH_TRANSITION} hover:border-sky-600 hover:bg-sky-50 hover:text-sky-700`}
                >
                  Upload banner image
                </button>
                {isImageSource(profileDraft.banner_color) && (
                  <div className="mt-3 overflow-hidden rounded-lg">
                    <ProfileBanner bannerColor={profileDraft.banner_color} className="h-20" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end border-t border-gray-200 px-4 py-3">
              <button type="button" onClick={handleSaveProfile} className={`rounded-full bg-sky-600 px-6 py-2 text-sm font-semibold text-white ${BTN_TRANSITION} hover:bg-sky-700`}>Save changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Chatbot */}
      <div className="fixed bottom-6 right-6 z-[90]">
        {isAiOpen && (
          <div className={`restock-modal-enter mb-3 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl sm:w-96 ${CARD_HOVER}`}>
            <div className="flex items-center justify-between border-b border-gray-200 bg-sky-600 px-4 py-3 text-white">
              <div className="flex items-center gap-2"><BotIcon /><span className="text-sm font-semibold">Restock AI</span></div>
              <button type="button" onClick={() => setIsAiOpen(false)} className={`rounded-full p-1 ${BTN_TRANSITION} hover:bg-sky-700`}><CloseIcon /></button>
            </div>
            <div className="h-64 space-y-3 overflow-y-auto p-4">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-sky-600 text-white"
                        : "whitespace-pre-wrap bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiTyping && (
                <div className="flex justify-start">
                  <div className={`rounded-2xl bg-gray-100 px-3 py-2 text-sm italic text-gray-500 ${SMOOTH_TRANSITION}`}>
                    AI is typing...
                  </div>
                </div>
              )}
              <div ref={aiEndRef} />
            </div>
            <form
              onSubmit={sendAiMessage}
              className="flex gap-2 border-t border-gray-200 p-3"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                className={`flex-1 rounded-full border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-sky-600 focus:outline-none ${BTN_TRANSITION}`}
                value={aiDraft}
                onChange={(e) => setAiDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendAiMessage(e);
                  }
                }}
                placeholder="Ask Restock AI..."
                disabled={aiTyping}
              />
              <button
                type="submit"
                disabled={!aiDraft.trim() || aiTyping}
                className={`rounded-full bg-sky-600 px-3 py-2 text-sm font-semibold text-white ${BTN_TRANSITION} hover:bg-sky-700 disabled:opacity-50`}
              >
                Send
              </button>
            </form>
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsAiOpen((o) => !o);
          }}
          className={`flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg ${BTN_TRANSITION} hover:bg-sky-700 hover:shadow-xl`}
          aria-label="Open AI assistant"
        >
          {isAiOpen ? <CloseIcon /> : <BotIcon />}
        </button>
      </div>
    </div>
  );
}
