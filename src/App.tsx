/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Flame,
  Award,
  Trophy,
  AlertCircle,
  AlertTriangle,
  Bell,
  Download,
  Info,
  Sparkles,
  Volume2,
  VolumeX,
  Menu,
  X,
  Folder,
  Home,
  Shield,
  LogOut,
  LogIn,
  Wrench,
  Settings,
  Search,
  Mic,
  Smile,
  CheckCircle,
  Heart,
  MessageSquare,
  ClipboardList,
  QrCode,
  Share2,
  Trash2,
  Save,
  HelpCircle,
  Plus,
  ArrowRight,
  ArrowLeft,
  Database,
  ThumbsUp,
  Activity,
  UserCheck
} from 'lucide-react';
import {
  ModItem,
  CreditItem,
  PresetLink,
  PollingTopic,
  FAQItem,
  RequestMod,
  VisitorStat
} from './types';
import ModCard from './components/ModCard';
import AdminPanel from './components/AdminPanel';
import FAQPolling from './components/FAQPolling';

// SUPABASE CLIENT INITIALIZATION
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://acsgbqipvdppkuetpobu.supabase.co";
const SUPABASE_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjc2dicWlwdmRwcGt1ZXRwb2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNTUzMzksImV4cCI6MjA5ODYzMTMzOX0.n7iKRHdKxQAlsK8sCi_qaHZukLsoO7GqECOuAXbRSDc";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

const DB_KEYS = {
  MODS: "links_supabase_db",
  CREDITS: "credits_supabase_db",
  PRESETS: "web_custom_presets_db",
  PINNED: "pinned_tags_db"
};

// STATIC DEFAULT FALLBACK DATA (For instant loads or DB offline fallbacks)
const DEFAULT_MODS: ModItem[] = [];

const DEFAULT_CREDITS: CreditItem[] = [
  { platform: "YouTube", handle: "AXELUF", url: "https://youtube.com/@axelufey", color: "#FF71CD" },
  { platform: "WhatsApp", handle: "Grup Saluran", url: "https://whatsapp.com/channel/0029VaUl8HRBqbr8aHIeDW0s", color: "#4CCD99" }
];

const DEFAULT_PRESETS: PresetLink[] = [
  { label: "Cara Pasang", url: "https://youtube.com/@axelufey", iconType: "video" },
  { label: "Password Key", url: "https://axeluf.co/password-key", iconType: "key" },
  { label: "Grup WhatsApp", url: "https://whatsapp.com/channel/0029VaUl8HRBqbr8aHIeDW0s", iconType: "chat" }
];

const DEFAULT_FAQS: FAQItem[] = [
  { question: "Bagaimana cara memasang mod game?", answer: "Unduh file APK/ZIP, ekstrak folder OBB jika ada ke Android/obb, lalu instal file APK. Tonton tutorial lengkapnya di tombol 'Cara Pasang' pada masing-masing mod.", category: "INSTALASI" },
  { question: "Apakah modifikasi di portal ini aman dari virus?", answer: "Sangat aman! Seluruh modifikasi di AXELUF melewati uji laboratorium mandiri bebas malware sebelum dipublikasikan.", category: "KEAMANAN" },
  { question: "Kenapa link download mengarahkan saya ke safelink?", answer: "Safelink berfungsi melindungi tautan asli dari penghapusan massal server (DMCA) dan menjamin keaslian unduhan.", category: "LINK" }
];

// 7-day dynamic visitor statistics mock data
const STATIC_VISITOR_STATS: VisitorStat[] = [
  { date: "26 Jun", visitors: 3450, downloads: 1890, uploads: 1 },
  { date: "27 Jun", visitors: 4120, downloads: 2210, uploads: 2 },
  { date: "28 Jun", visitors: 3890, downloads: 1980, uploads: 0 },
  { date: "29 Jun", visitors: 4560, downloads: 2450, uploads: 3 },
  { date: "30 Jun", visitors: 5100, downloads: 3120, uploads: 1 },
  { date: "01 Jul", visitors: 4890, downloads: 2900, uploads: 1 },
  { date: "02 Jul", visitors: 5320, downloads: 3450, uploads: 2 }
];

export default function App() {
  // Global App States
  const [loading, setLoading] = useState(true);
  const [mods, setMods] = useState<ModItem[]>([]);
  const [credits, setCredits] = useState<CreditItem[]>([]);
  const [presets, setPresets] = useState<PresetLink[]>([]);
  const [pinnedTags, setPinnedTags] = useState<string[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('');

  // Branding & Configuration
  const [webTitle, setWebTitle] = useState('AXELUF');
  const [webSubtitle, setWebSubtitle] = useState('[ LINK MOD BERSIH & NO SCAM ]');
  const [webLogo, setWebLogo] = useState('https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&q=80&w=200');
  const [profileAlignment, setProfileAlignment] = useState('items-start text-left');
  const [webBannerImage, setWebBannerImage] = useState('https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&q=1200');
  const [webBackgroundImage, setWebBackgroundImage] = useState('none');
  const [webBroadcastText, setWebBroadcastText] = useState('DATABASE DISEGARKAN: Kami bermigrasi ke kluster server baru yang lebih stabil dan super ringan! | UPDATE: Semua MLBB Skin Mod aktif untuk patch terbaru!');
  const [safelinkTime, setSafelinkTime] = useState(5);

  // Search & Navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);

  // Dynamic Customizer Settings
  const [currentTheme, setCurrentTheme] = useState('green');
  const [customBorderRadius, setCustomBorderRadius] = useState('16px');
  const [customShadowOffset, setCustomShadowOffset] = useState('6px');

  // Interactive Premium Features States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname + window.location.hash);
  const [activeSingleModId, setActiveSingleModId] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isBanned, setIsBanned] = useState(false);
  const [spamCounter, setSpamCounter] = useState(0);
  const [easterEggScore, setEasterEggScore] = useState(0);
  const [easterEggHigh, setEasterEggHigh] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(137);
  const [showAnnouncePopup, setShowAnnouncePopup] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTableMissing, setIsTableMissing] = useState(false);
  const [dbWriteError, setDbWriteError] = useState<string | null>(null);

  // Polling Survey State
  const [polling, setPolling] = useState<PollingTopic>({
    id: "poll-v1",
    question: "PILIH RELEASE MOD BERIKUTNYA?",
    options: [
      { id: "opt-gta5", text: "GTA 5 MOD GRAPHICS HD (ANDROID)", votes: 0 },
      { id: "opt-ff", text: "FREE FIRE ANTENA & SKIN LITE", votes: 0 },
      { id: "opt-pes", text: "PES 2026 PPSSPP CAMERA PS5", votes: 0 }
    ],
    totalVotes: 0
  });

  // Requests Mod State
  const [requests, setRequests] = useState<RequestMod[]>([]);

  // Safelink Countdown Overlay State
  const [safelinkOverlayOpen, setSafelinkOverlayOpen] = useState(false);
  const [safelinkCountdown, setSafelinkCountdown] = useState(5);
  const [safelinkTargetUrl, setSafelinkTargetUrl] = useState('');
  const [safelinkIsDownloadAction, setSafelinkIsDownloadAction] = useState(false);
  const [safelinkActiveCardIndex, setSafelinkActiveCardIndex] = useState<number | null>(null);

  // Audio Synth context
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Speech Recognition support
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  // Sync PWA Installation state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineSyncQueue, setOfflineSyncQueue] = useState<any[]>([]);

  // Toast State
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    msg: '',
    type: 'info'
  });

  // Listen to path changes and routing triggers
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname + window.location.hash);
      const params = new URLSearchParams(window.location.search);
      setActiveSingleModId(params.get('modId'));
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    
    // Initial sync
    const params = new URLSearchParams(window.location.search);
    setActiveSingleModId(params.get('modId'));

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Listen to Supabase Auth state changes
  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAdminMode(!!session);
    });

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAdminMode(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load configuration from dynamic path or query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modIdParam = params.get('modId');
    if (modIdParam !== null) {
      setActiveSingleModId(modIdParam);
    }
  }, []);

  // ======================================================================
  // DATA MANAGEMENT & OFFLINE RESILIENCY
  // ======================================================================
  const getFromDB = async (key: string, defaultValue: any) => {
    try {
      const { data, error } = await supabaseClient
        .from('settings')
        .select('value')
        .eq('key', key)
        .maybeSingle();

      if (error) {
        // Handle Supabase error object
        if (error.code === '42P01' || error.message?.includes('relation "settings" does not exist')) {
          setIsTableMissing(true);
        }
        setDbWriteError(error.message);
        throw new Error(error.message);
      }
      if (data && data.value !== null && data.value !== undefined) {
        localStorage.setItem(`cache_${key}`, JSON.stringify(data.value));
        setDbWriteError(null);
        return data.value;
      }
      return defaultValue;
    } catch (err: any) {
      console.warn(`[Supabase Error Fallback] Mengambil cache lokal untuk key: ${key}`);
      const errMsg = err?.message || "";
      setDbWriteError(errMsg);
      if (errMsg.includes('relation "settings" does not exist') || err?.code === '42P01') {
        setIsTableMissing(true);
      }
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        try { return JSON.parse(cached); } catch { return cached; }
      }
      return defaultValue;
    }
  };

  const writeToDB = async (key: string, value: any) => {
    localStorage.setItem(`cache_${key}`, JSON.stringify(value));
    if (isOffline) {
      // Add to background sync queue
      setOfflineSyncQueue(prev => [...prev, { key, value }]);
      showToast("Tersimpan dalam antrean sinkronisasi offline!", "info");
      return;
    }
    try {
      const { error } = await supabaseClient
        .from('settings')
        .upsert({ key, value }, { onConflict: 'key' });
      if (error) {
        setDbWriteError(error.message);
        if (error.code === '42P01' || error.message?.includes('relation "settings" does not exist')) {
          setIsTableMissing(true);
        }
        showToast(`Gagal sinkronisasi cloud: ${error.message}. Data hanya tersimpan di browser Anda saat ini!`, "error");
        throw new Error(error.message);
      } else {
        setDbWriteError(null);
      }
    } catch (err: any) {
      console.error("Gagal sinkronisasi data cloud:", err);
      const errMsg = err?.message || "";
      setDbWriteError(errMsg);
      showToast(`Gagal sinkronisasi cloud: ${errMsg}. Data hanya tersimpan di browser Anda saat ini!`, "error");
      if (errMsg.includes('relation "settings" does not exist') || err?.code === '42P01') {
        setIsTableMissing(true);
      }
    }
  };

  // Synchronize offline actions when coming back online
  useEffect(() => {
    const handleOnline = async () => {
      setIsOffline(false);
      showToast("Koneksi internet terdeteksi! Mensinkronisasikan data...", "success");
      if (offlineSyncQueue.length > 0) {
        for (const syncItem of offlineSyncQueue) {
          try {
            await supabaseClient
              .from('settings')
              .upsert({ key: syncItem.key, value: syncItem.value }, { onConflict: 'key' });
          } catch (e) {
            console.error("Gagal sinkronisasi offline item:", e);
          }
        }
        setOfflineSyncQueue([]);
        showToast("Sinkronisasi latar belakang selesai!", "success");
      }
    };
    const handleOffline = () => {
      setIsOffline(true);
      showToast("Koneksi terputus. Mode offline aktif!", "error");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineSyncQueue, isOffline]);

  // Load All Initial Data
  useEffect(() => {
    const initData = async () => {
      setLoading(true);

      // Load Title / Subtitle / Theme configs
      const title = await getFromDB("web_title", "AXELUF");
      setWebTitle(title);
      const subtitle = await getFromDB("web_subtitle", "[ LINK MOD BERSIH & NO SCAM ]");
      setWebSubtitle(subtitle);
      const logo = await getFromDB("web_logo", "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&q=80&w=200");
      setWebLogo(logo);
      const align = await getFromDB("profile_alignment", "items-start text-left");
      setProfileAlignment(align);
      const banner = await getFromDB("web_banner_image", "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&q=1200");
      setWebBannerImage(banner);
      const bgImg = await getFromDB("web_background_image", "none");
      setWebBackgroundImage(bgImg);
      const bcast = await getFromDB("web_broadcast_text", webBroadcastText);
      setWebBroadcastText(bcast);
      const sTime = await getFromDB("web_safelink_time", "5");
      setSafelinkTime(parseInt(sTime) || 5);

      // Load Lists
      const loadedMods = await getFromDB(DB_KEYS.MODS, DEFAULT_MODS);
      setMods(loadedMods);
      const loadedCredits = await getFromDB(DB_KEYS.CREDITS, DEFAULT_CREDITS);
      setCredits(loadedCredits);
      const loadedPresets = await getFromDB(DB_KEYS.PRESETS, DEFAULT_PRESETS);
      setPresets(loadedPresets);
      const loadedPinned = await getFromDB(DB_KEYS.PINNED, ["MLBB", "GAME", "APK"]);
      setPinnedTags(loadedPinned);

      // Load Interactive Polling & Requests
      const loadedPoll = await getFromDB("community_polling", polling);
      setPolling(loadedPoll);
      const loadedReqs = await getFromDB("mod_requests", requests);
      setRequests(loadedReqs);
      const loadedFaqs = await getFromDB("faqs_db", DEFAULT_FAQS);
      setFaqs(loadedFaqs);

      // System Preferences / Automatic Dark Mode
      const savedTheme = localStorage.getItem('axel_theme');
      if (savedTheme) {
        setCurrentTheme(savedTheme);
      } else {
        // Auto Dark Mode based on time (e.g. night hours 18:00 - 06:00)
        const hour = new Date().getHours();
        if (hour >= 18 || hour < 6) {
          setCurrentTheme('dark');
          showToast("Dark Mode diaktifkan otomatis (Waktu Malam)", "info");
        }
      }

      // Check maintenance status
      const maint = await getFromDB("maintenance_mode", false);
      setMaintenanceMode(maint);

      // High scores
      setEasterEggHigh(parseInt(localStorage.getItem('axel_tap_high') || '0'));

      // Recent searches
      const searchCache = localStorage.getItem('recent_searches');
      if (searchCache) {
        setRecentSearches(JSON.parse(searchCache));
      }

      // Banned state check
      if (localStorage.getItem('banned_client_status') === 'true') {
        setIsBanned(true);
      }

      // Session announcement popup (once per browser session)
      const popupSeen = sessionStorage.getItem('announcement_seen');
      if (!popupSeen) {
        setShowAnnouncePopup(true);
      }

      setLoading(false);
    };

    initData();
  }, []);

  // Sync scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pulse simulated online active users
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        const delta = Math.floor(Math.random() * 7) - 3; // swing -3 to +3
        const next = prev + delta;
        return next < 110 ? 120 : next > 165 ? 145 : next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Search debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 280);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Compute suggestions based on active mods
  useEffect(() => {
    if (!searchQuery) {
      setSearchSuggestions([]);
      return;
    }
    const filtered = mods
      .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(m => m.name)
      .slice(0, 5);
    setSearchSuggestions(filtered);
  }, [searchQuery, mods]);

  // Dynamic Theme application to document node
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // Apply custom layout style variables
  const rootStyles = {
    '--border-radius-lg': customBorderRadius,
    '--border-radius-md': `calc(${customBorderRadius} - 4px)`,
    '--border-radius-sm': `calc(${customBorderRadius} - 8px)`,
    '--shadow-offset': customShadowOffset,
    '--shadow-offset-sm': `calc(${customShadowOffset} - 2px)`,
    '--shadow-offset-lg': `calc(${customShadowOffset} + 2px)`,
    '--custom-bg-image': webBackgroundImage !== 'none' ? `url(${webBackgroundImage})` : 'none',
  } as React.CSSProperties;

  // PWA Prompt trigger
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        showToast("Aplikasi Axeluf Berhasil Terpasang!", "success");
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    });
  };

  // ======================================================================
  // AUDIO SYNTH HELPER
  // ======================================================================
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  const playSynth = (type: 'click' | 'success' | 'delete' | 'ban' | 'point') => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'success') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(261.63, now);
        osc.frequency.setValueAtTime(329.63, now + 0.08);
        osc.frequency.setValueAtTime(392.00, now + 0.16);
        osc.frequency.setValueAtTime(523.25, now + 0.24);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'delete') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'ban') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(250, now + 0.25);
        osc.frequency.linearRampToValueAtTime(100, now + 0.5);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'point') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(600 + easterEggScore * 12, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch {
      // Audio context blocked
    }
  };

  // ======================================================================
  // INTERACTIVE FEEDBACK & ACTIONS
  // ======================================================================
  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleActiveClickCount = () => {
    const nextSpam = spamCounter + 1;
    setSpamCounter(nextSpam);
    if (nextSpam > 12) {
      // Auto Ban user to prevent server crash
      playSynth('ban');
      setIsBanned(true);
      localStorage.setItem('banned_client_status', 'true');
      showToast("AKSES DIBLOKIR: Terlalu banyak memproses pemuatan!", "error");
    }
    setTimeout(() => setSpamCounter(prev => Math.max(0, prev - 1)), 4000);
  };

  const handleUnban = () => {
    playSynth('success');
    setIsBanned(false);
    localStorage.removeItem('banned_client_status');
    setSpamCounter(0);
    showToast("Blokir dilepas! Mohon klik portal sewajarnya.", "success");
  };

  const handleEasterEggTap = () => {
    const nextScore = easterEggScore + 1;
    setEasterEggScore(nextScore);
    playSynth('point');

    if (nextScore > easterEggHigh) {
      setEasterEggHigh(nextScore);
      localStorage.setItem('axel_tap_high', nextScore.toString());
    }

    if (nextScore === 15) showToast("MANTAP! Tap brutalmu mencapai 15!", "success");
    if (nextScore === 35) showToast("LEGENDARIS! Fans berat Axeluf!", "success");
  };

  // ======================================================================
  // SAFELINK COUNTDOWN (Bypassed - Langsung Quick Download ke Link Tujuan)
  // ======================================================================
  const triggerSafelink = (index: number, url: string, isDownload: boolean) => {
    handleActiveClickCount();
    if (isBanned) return;

    playSynth('click');
    
    // Increment download count immediately if it's a download action
    if (isDownload && index !== null && index !== undefined && index >= 0 && index < mods.length) {
      const updated = [...mods];
      updated[index].downloads = (updated[index].downloads || 0) + 1;
      setMods(updated);
      writeToDB(DB_KEYS.MODS, updated);
    }

    playSynth('success');
    window.open(url, '_blank');
  };

  const handleNavigateToMod = (modId: string | null) => {
    playSynth('click');
    if (modId !== null && modId !== undefined && modId !== '') {
      const newUrl = `${window.location.origin}${window.location.pathname}?modId=${modId}`;
      window.history.pushState({ modId }, '', newUrl);
      setActiveSingleModId(modId.toString());
    } else {
      const newUrl = `${window.location.origin}${window.location.pathname}`;
      window.history.pushState({}, '', newUrl);
      setActiveSingleModId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ======================================================================
  // RATING, COMMENT & LIKE LOGICS
  // ======================================================================
  const handleLikeMod = (index: number) => {
    const updated = [...mods];
    const modItem = updated[index];
    const limitKey = `like_limit_${index}`;
    const userLikes = parseInt(localStorage.getItem(limitKey) || '0');

    if (userLikes >= 10) {
      showToast("Batas maksimal Like harian tercapai!", "error");
      return;
    }

    playSynth('success');
    localStorage.setItem(limitKey, (userLikes + 1).toString());
    modItem.likes = (modItem.likes || 0) + 1;
    setMods(updated);
    writeToDB(DB_KEYS.MODS, updated);
  };

  const handleAddComment = (index: number, name: string, text: string) => {
    const updated = [...mods];
    const modItem = updated[index];
    if (!modItem.comments) modItem.comments = [];

    modItem.comments.push({
      name,
      text,
      timestamp: "Baru Saja"
    });

    setMods(updated);
    writeToDB(DB_KEYS.MODS, updated);
    showToast("Komentar berhasil dikirim!", "success");
    playSynth('success');
  };

  const handleRateMod = (index: number, score: number) => {
    const updated = [...mods];
    const modItem = updated[index];

    const currentCount = modItem.ratingsCount || 1;
    const currentRating = modItem.rating || 5.0;

    const newCount = currentCount + 1;
    const newRating = ((currentRating * currentCount) + score) / newCount;

    modItem.ratingsCount = newCount;
    modItem.rating = newRating;

    setMods(updated);
    writeToDB(DB_KEYS.MODS, updated);
    showToast("Penilaian Anda berhasil direkam!", "success");
  };

  const handleReportBroken = (index: number) => {
    const updated = [...mods];
    const modItem = updated[index];
    modItem.brokenReportCount = (modItem.brokenReportCount || 0) + 1;

    setMods(updated);
    writeToDB(DB_KEYS.MODS, updated);
    showToast("Laporan kerusakan link terkirim. Terima kasih!", "info");
    playSynth('success');
  };

  // ======================================================================
  // SEARCH TRIGGERS & VOICE INPUT
  // ======================================================================
  const handleVoiceSearch = () => {
    if (!SpeechRecognition) {
      showToast("Browser Anda tidak mendukung Voice Search!", "error");
      return;
    }
    playSynth('click');
    const rec = new SpeechRecognition();
    rec.lang = "id-ID";
    rec.onstart = () => {
      setVoiceSearchActive(true);
      showToast("Mendengarkan suara...", "info");
    };
    rec.onresult = (e: any) => {
      const resultText = e.results[0][0].transcript;
      setSearchQuery(resultText);
      showToast(`Pencarian: "${resultText}"`, "success");
      setVoiceSearchActive(false);
    };
    rec.onerror = () => {
      setVoiceSearchActive(false);
      showToast("Gagal mendeteksi suara, silakan coba lagi.", "error");
    };
    rec.start();
  };

  const handleExecuteSearch = (query: string) => {
    setSearchQuery(query);
    if (query && !recentSearches.includes(query)) {
      const nextRecent = [query, ...recentSearches.slice(0, 4)];
      setRecentSearches(nextRecent);
      localStorage.setItem('recent_searches', JSON.stringify(nextRecent));
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
    showToast("Riwayat pencarian dihapus.", "info");
  };

  // ======================================================================
  // POLLING & REQUEST MANAGEMENT
  // ======================================================================
  const handleVotePolling = (optionId: string) => {
    const limitKey = `poll_voted_${polling.id}`;
    if (localStorage.getItem(limitKey) === 'true') {
      showToast("Anda sudah memberikan suara dalam polling ini!", "error");
      return;
    }

    playSynth('success');
    const updatedOptions = polling.options.map(opt => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });

    const nextPoll = {
      ...polling,
      options: updatedOptions,
      totalVotes: polling.totalVotes + 1
    };

    setPolling(nextPoll);
    writeToDB("community_polling", nextPoll);
    localStorage.setItem(limitKey, 'true');
    showToast("Terima kasih atas partisipasinya!", "success");
  };

  const handleRequestMod = (name: string, cat: string) => {
    playSynth('success');
    const newReq: RequestMod = {
      id: `req-${Date.now()}`,
      name,
      category: cat || 'GAME',
      status: 'pending',
      votes: 1,
      date: new Date().toISOString().slice(0, 10)
    };

    const nextReqs = [newReq, ...requests];
    setRequests(nextReqs);
    writeToDB("mod_requests", nextReqs);
    showToast("Permintaan mod ditambahkan!", "success");
  };

  const handleUpvoteRequest = (id: string) => {
    const limitKey = `req_upvoted_${id}`;
    if (localStorage.getItem(limitKey) === 'true') {
      showToast("Anda sudah memberikan upvote!", "error");
      return;
    }

    playSynth('success');
    const updated = requests.map(req => {
      if (req.id === id) {
        return { ...req, votes: req.votes + 1 };
      }
      return req;
    });

    setRequests(updated);
    writeToDB("mod_requests", updated);
    localStorage.setItem(limitKey, 'true');
    showToast("Upvote berhasil dikirim!", "success");
  };

  // ======================================================================
  // ADMIN PANEL MUTATIONS
  // ======================================================================
  const handleSaveModItem = (partialMod: Partial<ModItem>, index?: number) => {
    const updated = [...mods];
    if (index !== undefined) {
      // Edit mode
      updated[index] = { ...updated[index], ...partialMod } as ModItem;
      showToast("Modifikasi berhasil diperbarui!", "success");
    } else {
      // Add mode
      const newItem: ModItem = {
        id: `mod-${Date.now()}`,
        name: partialMod.name || '',
        tag: partialMod.tag || '',
        desc: partialMod.desc || '',
        url: partialMod.url || '',
        password: partialMod.password,
        image: partialMod.image,
        imageRatio: partialMod.imageRatio,
        views: partialMod.views || 0,
        likes: partialMod.likes || 0,
        downloads: partialMod.downloads || 0,
        isDraft: partialMod.isDraft,
        publishDate: partialMod.publishDate,
        verified: partialMod.verified,
        premium: partialMod.premium,
        exclusive: partialMod.exclusive,
        changelog: partialMod.changelog,
        customButtons: partialMod.customButtons
      };
      updated.unshift(newItem);
      showToast("Mod baru berhasil dirilis!", "success");
    }
    setMods(updated);
    writeToDB(DB_KEYS.MODS, updated);
  };

  const handleDeleteModItem = (index: number) => {
    const updated = mods.filter((_, i) => i !== index);
    setMods(updated);
    writeToDB(DB_KEYS.MODS, updated);
    showToast("Modifikasi berhasil dihapus!", "info");
  };

  const handleSaveBranding = (title: string, subtitle: string, logo: string, alignment: string) => {
    if (title) { setWebTitle(title); writeToDB("web_title", title); }
    if (subtitle) { setWebSubtitle(subtitle); writeToDB("web_subtitle", subtitle); }
    if (logo) { setWebLogo(logo); writeToDB("web_logo", logo); }
    setProfileAlignment(alignment);
    writeToDB("profile_alignment", alignment);
    showToast("Branding utama web diperbarui!", "success");
  };

  const handleSaveSafelink = (time: number, bcast: string) => {
    setSafelinkTime(time);
    writeToDB("web_safelink_time", time.toString());
    if (bcast) { setWebBroadcastText(bcast); writeToDB("web_broadcast_text", bcast); }
    showToast("Safelink dan teks broadcast berhasil disimpan!", "success");
  };

  const handleSaveBackground = (url: string) => {
    setWebBackgroundImage(url);
    writeToDB("web_background_image", url);
    showToast("Gambar background berhasil diatur!", "success");
  };

  const handleResetBackground = () => {
    setWebBackgroundImage('none');
    writeToDB("web_background_image", 'none');
    showToast("Background direset ke warna default.", "info");
  };

  const handleSaveBanner = (url: string) => {
    setWebBannerImage(url);
    writeToDB("web_banner_image", url);
    showToast("Gambar banner berhasil diatur!", "success");
  };

  const handleAddCredit = (platform: string, handle: string, url: string, color: string) => {
    const updated = [...credits, { platform, handle, url, color }];
    setCredits(updated);
    writeToDB(DB_KEYS.CREDITS, updated);
    showToast("Kredit sosial media ditambahkan!", "success");
  };

  const handleDeleteCredit = (index: number) => {
    const updated = credits.filter((_, i) => i !== index);
    setCredits(updated);
    writeToDB(DB_KEYS.CREDITS, updated);
    showToast("Kredit berhasil dihapus!", "info");
  };

  const handleAddPreset = (label: string, url: string, iconType: string) => {
    const updated = [...presets, { label, url, iconType } as PresetLink];
    setPresets(updated);
    writeToDB(DB_KEYS.PRESETS, updated);
    showToast("Preset cepat berhasil disimpan!", "success");
  };

  const handleDeletePreset = (index: number) => {
    const updated = presets.filter((_, i) => i !== index);
    setPresets(updated);
    writeToDB(DB_KEYS.PRESETS, updated);
    showToast("Preset dihapus!", "info");
  };

  const handleBulkDelete = (indices: number[]) => {
    const updated = mods.filter((_, i) => !indices.includes(i));
    setMods(updated);
    writeToDB(DB_KEYS.MODS, updated);
    showToast(`Berhasil menghapus massal ${indices.length} mod!`, "success");
  };

  const handleBulkAddTag = (indices: number[], tag: string) => {
    const updated = mods.map((m, i) => {
      if (indices.includes(i)) {
        const cleanTags = m.tag.split(',').map(t => t.trim());
        if (!cleanTags.includes(tag)) {
          return { ...m, tag: [...cleanTags, tag].join(", ") };
        }
      }
      return m;
    });
    setMods(updated);
    writeToDB(DB_KEYS.MODS, updated);
    showToast(`Berhasil menambahkan tag massal ke ${indices.length} mod!`, "success");
  };

  const handleBulkDraft = (indices: number[], status: boolean) => {
    const updated = mods.map((m, i) => {
      if (indices.includes(i)) {
        return { ...m, isDraft: status };
      }
      return m;
    });
    setMods(updated);
    writeToDB(DB_KEYS.MODS, updated);
    showToast(`Berhasil mengubah status draf massal ${indices.length} mod!`, "success");
  };

  const handleRestoreAllData = (backup: any) => {
    if (backup.mods) { setMods(backup.mods); writeToDB(DB_KEYS.MODS, backup.mods); }
    if (backup.credits) { setCredits(backup.credits); writeToDB(DB_KEYS.CREDITS, backup.credits); }
    if (backup.presets) { setPresets(backup.presets); writeToDB(DB_KEYS.PRESETS, backup.presets); }
    if (backup.branding) {
      setWebTitle(backup.branding.title); writeToDB("web_title", backup.branding.title);
      setWebSubtitle(backup.branding.subtitle); writeToDB("web_subtitle", backup.branding.subtitle);
      setWebLogo(backup.branding.logo); writeToDB("web_logo", backup.branding.logo);
      setProfileAlignment(backup.branding.alignment); writeToDB("profile_alignment", backup.branding.alignment);
    }
    if (backup.safelink) {
      setSafelinkTime(backup.safelink.time); writeToDB("web_safelink_time", backup.safelink.time.toString());
      setWebBroadcastText(backup.safelink.broadcast); writeToDB("web_broadcast_text", backup.safelink.broadcast);
    }
    if (backup.bgUrl) { setWebBackgroundImage(backup.bgUrl); writeToDB("web_background_image", backup.bgUrl); }
    if (backup.bannerUrl) { setWebBannerImage(backup.bannerUrl); writeToDB("web_banner_image", backup.bannerUrl); }
    showToast("Seluruh database berhasil dipulihkan!", "success");
  };

  const handleLogout = async () => {
    try {
      await supabaseClient.auth.signOut();
      setIsAdminMode(false);
      showToast("Sesi admin ditutup.", "info");
      playSynth('click');
    } catch (err) {
      showToast("Gagal melakukan keluar sesi.", "error");
    }
  };

  const handleSaveFaqs = (updatedFaqs: FAQItem[]) => {
    setFaqs(updatedFaqs);
    writeToDB("faqs_db", updatedFaqs);
    showToast("Daftar FAQ berhasil diperbarui!", "success");
  };

  const handleSavePolling = (poll: PollingTopic) => {
    setPolling(poll);
    writeToDB("community_polling", poll);
    showToast("Polling kuesioner diperbarui!", "success");
  };

  const handleSaveRequest = (req: RequestMod, index?: number) => {
    let nextReqs = [...requests];
    if (index !== undefined) {
      nextReqs[index] = req;
      showToast("Permintaan Mod diperbarui!", "success");
    } else {
      nextReqs.unshift(req);
      showToast("Permintaan Mod ditambahkan!", "success");
    }
    setRequests(nextReqs);
    writeToDB("mod_requests", nextReqs);
  };

  const handleDeleteRequest = (id: string) => {
    const nextReqs = requests.filter((r) => r.id !== id);
    setRequests(nextReqs);
    writeToDB("mod_requests", nextReqs);
    showToast("Permintaan Mod berhasil dihapus!", "info");
  };

  const handleAuthAction = async () => {
    if (!authEmail || !authPassword) {
      showToast("Email dan password wajib diisi!", "error");
      playSynth('delete');
      return;
    }

    setAuthLoading(true);
    playSynth('click');

    try {
      if (authMode === 'login') {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        showToast("Login Berhasil! Selamat datang di Panel Admin.", "success");
        playSynth('success');
        setAuthEmail('');
        setAuthPassword('');
      } else {
        const { error } = await supabaseClient.auth.signUp({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        showToast("Registrasi Berhasil! Sesi Anda telah dibuat.", "success");
        playSynth('success');
        setAuthEmail('');
        setAuthPassword('');
      }
    } catch (err: any) {
      showToast(err.message || "Gagal memproses autentikasi.", "error");
      playSynth('delete');
    } finally {
      setAuthLoading(false);
    }
  };

  // ======================================================================
  // FILTERING LOGICS & RENDER SELECTORS
  // ======================================================================
  const getUniqueTags = () => {
    const tags = new Set<string>();
    mods.forEach(m => {
      if (m.tag) {
        m.tag.split(',').forEach(t => {
          const clean = t.trim().toUpperCase();
          if (clean) tags.add(clean);
        });
      }
    });
    return Array.from(tags);
  };

  // Filter and display mods, keeping Scheduled Release hides for public users
  const getVisibleMods = () => {
    const nowTime = new Date().getTime();
    return mods.filter(m => {
      // Hides drafts and scheduled mods for normal public users
      if (!isAdminMode) {
        if (m.isDraft) return false;
        if (m.publishDate) {
          const pubTime = new Date(m.publishDate).getTime();
          if (pubTime > nowTime) return false; // Scheduled in the future
        }
      }

      // Live search matching
      const matchSearch =
        m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.tag.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.desc.toLowerCase().includes(debouncedSearch.toLowerCase());

      if (!matchSearch) return false;

      // Category match
      if (activeCategoryFilter) {
        const itemTags = m.tag.split(',').map(t => t.trim().toUpperCase());
        return itemTags.includes(activeCategoryFilter);
      }

      return true;
    });
  };

  // Bookmark / Favorite Storage helper
  const [favorites, setFavorites] = useState<number[]>(() => {
    const cache = localStorage.getItem('axel_favorites');
    return cache ? JSON.parse(cache) : [];
  });

  const handleToggleFavorite = (index: number) => {
    soundPlay('success');
    let nextFavs = [];
    if (favorites.includes(index)) {
      nextFavs = favorites.filter(i => i !== index);
      showToast("Dihapus dari Bookmark", "info");
    } else {
      nextFavs = [...favorites, index];
      showToast("Disimpan ke Bookmark", "success");
    }
    setFavorites(nextFavs);
    localStorage.setItem('axel_favorites', JSON.stringify(nextFavs));
  };

  const soundPlay = (type: 'click' | 'success' | 'delete') => {
    playSynth(type);
  };

  return (
    <div style={rootStyles} className="min-h-screen pb-12 select-none relative font-sans text-black">
      {/* SCROLL PROGRESS INDICATOR */}
      <div
        className="fixed top-0 left-0 h-1.5 bg-[#FF71CD] z-[1000] transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* BANNER RECOVERY SCREEN */}
      {isBanned && (
        <div className="fixed inset-0 bg-[#2E8B6E] z-[99999] flex flex-col items-center justify-center p-4 text-center select-none text-white">
          <div className="border-3 border-black bg-black p-6 max-w-sm text-white rounded-2xl shadow-[8px_8px_0px_0px_#000000] transform -rotate-1 flex flex-col items-center">
            <AlertTriangle className="w-12 h-12 text-[#FF6B6B] mb-4 animate-bounce" />
            <h1 className="font-syne font-extrabold text-2xl uppercase tracking-tighter text-[#A3FFD6]">PROTEKSI KEAMANAN</h1>
            <p className="mt-2 font-bold text-xs leading-relaxed text-gray-300">
              Perilaku klik mencurigakan terdeteksi dari browser Anda demi menghindari flood/DDOS API Supabase.
            </p>
            <div className="my-4 p-3 border-2 border-dashed border-[#A3FFD6] bg-[#1a1a1a] font-mono text-[9px] text-[#A3FFD6] rounded-lg">
              SYSTEM_CODE: DETECT_FLOOD_V5.3
            </div>
            <button
              onClick={handleUnban}
              className="w-full bg-[#A3FFD6] text-black font-extrabold uppercase py-2.5 px-4 border-2 border-black shadow-[4px_4px_0_0_#000000] hover:bg-[#4CCD99] active:translate-y-0.5 text-xs rounded-xl"
            >
              Minta Maaf ke Axeluf (Pulihkan Akses)
            </button>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION CONTAINER */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 z-[9999] max-w-xs pointer-events-auto animate-bounce">
          <div
            className={`border-3 border-black p-3 font-bold text-xs flex items-center gap-2.5 text-black rounded-xl shadow-[4px_4px_0px_0px_#000000]`}
            style={{
              backgroundColor: toast.type === 'success' ? '#A3FFD6' : toast.type === 'error' ? '#FF71CD' : '#FFFFFF'
            }}
          >
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-black shrink-0" /> : toast.type === 'error' ? <AlertTriangle className="w-4 h-4 text-black shrink-0" /> : <Info className="w-4 h-4 text-black shrink-0" />}
            <span className="truncate leading-tight">{toast.msg}</span>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT POPUP ON SESSION ENTER */}
      {showAnnouncePopup && (
        <div className="fixed inset-0 bg-black/85 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white text-black border-3 border-black p-5 max-w-sm w-full text-center relative rounded-2xl shadow-[8px_8px_0_0_#000000] transform rotate-1 flex flex-col items-center">
            <button
              onClick={() => {
                setShowAnnouncePopup(false);
                sessionStorage.setItem('announcement_seen', 'true');
                playSynth('click');
              }}
              className="absolute -top-3 -right-3 bg-white border-2 border-black w-8 h-8 flex items-center justify-center font-bold hover:bg-[#A3FFD6] rounded-full shadow-[2px_2px_0_0_#000000]"
            >
              ✕
            </button>
            <Bell className="w-10 h-10 text-black mb-2 animate-bounce" />
            <h3 className="font-syne font-extrabold text-base uppercase mb-1">MIGRASI SERVER AXELUF</h3>
            <p className="text-[10px] text-gray-500 mb-4 leading-relaxed font-semibold">
              Kabar gembira! Portal v5.3 kini didukung oleh server cluster cloud run & database Supabase hibrida super ringan dengan jaminan unduhan 10x lipat lebih cepat tanpa terputus!
            </p>
            <div className="p-2.5 bg-[#A3FFD6]/30 border-2 border-dashed border-[#2E8B6E] rounded-lg text-[9px] font-extrabold text-[#2E8B6E] mb-4 flex items-center justify-center gap-1.5 w-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>10.000+ MOD AKTIF & SIAP PAKAI</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <button
              onClick={() => {
                setShowAnnouncePopup(false);
                sessionStorage.setItem('announcement_seen', 'true');
                playSynth('success');
              }}
              className="w-full bg-[#4CCD99] text-black font-extrabold py-2 border-2 border-black rounded-xl brutal-shadow-sm active:translate-y-0.5 uppercase text-xs flex items-center justify-center gap-1.5"
            >
              <span>Mulai Eksplorasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* BROADCAST BAR TICKER */}
      <div className="bg-black text-[#A3FFD6] py-1.5 border-b-3 border-black font-extrabold text-[10px] uppercase ticker-wrap relative z-40">
        <div className="ticker-content inline-flex gap-8">
          {webBroadcastText.split('|').map((item, idx) => (
            <span key={idx} className="mr-12 inline-block">
              {item.trim()}
            </span>
          ))}
        </div>
      </div>

      {/* TOP CONFIGURATION / SOCIAL BAR */}
      <div className="bg-black text-white py-2 px-4 flex justify-between items-center text-[10px] font-extrabold border-b-2 border-black relative z-50">
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">AXELUF V5.3 PRO ULTRA (STABLE CLUSTER)</span>
          <span className="sm:hidden">AXELUF V5.3 PRO</span>
          <span className="bg-[#4CCD99] text-black px-1.5 py-0.5 rounded font-extrabold text-[8px] border border-black animate-pulse">
            ● ONLINE: {onlineUsers} MEMBER
          </span>
          {isOffline && (
            <span className="bg-red-500 text-white px-1.5 py-0.5 rounded font-bold text-[8px] border border-white">
              OFFLINE CACHE
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              showToast(soundEnabled ? 'Suara Dinonaktifkan' : 'Suara Diaktifkan', 'info');
              playSynth('click');
            }}
            className={`px-2 py-0.5 border border-white rounded hover:bg-zinc-800 text-[8px] flex items-center gap-1 ${
              soundEnabled ? 'bg-zinc-900 text-green-400' : 'bg-zinc-800 text-gray-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>SUARA: {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Theme Switcher Quick dots */}
          <div className="flex items-center gap-1.5 border-l border-zinc-700 pl-2">
            <button onClick={() => { setCurrentTheme('green'); playSynth('click'); }} className="w-3.5 h-3.5 rounded-full bg-[#A3FFD6] border border-white" title="Retro Green" />
            <button onClick={() => { setCurrentTheme('pink'); playSynth('click'); }} className="w-3.5 h-3.5 rounded-full bg-[#FF71CD] border border-white" title="Cyberpunk Pink" />
            <button onClick={() => { setCurrentTheme('mint'); playSynth('click'); }} className="w-3.5 h-3.5 rounded-full bg-[#B2F9FC] border border-white" title="Mint Fresh" />
            <button onClick={() => { setCurrentTheme('dark'); playSynth('click'); }} className="w-3.5 h-3.5 rounded-full bg-[#121214] border border-white" title="Deep Dark" />
            <button onClick={() => { setCurrentTheme('orange'); playSynth('click'); }} className="w-3.5 h-3.5 rounded-full bg-[#FF8A08] border border-white" title="Lava Orange" />
          </div>
        </div>
      </div>

      {/* TOP HEADER MENU & SEARCH NAVIGATION */}
      <nav className="bg-white text-black border-3 border-black brutal-shadow p-3.5 relative z-30 max-w-3xl mx-auto mt-4 flex items-center justify-between gap-3 rounded-2xl">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              playSynth('click');
              setIsSidebarOpen(!isSidebarOpen);
            }}
            className="bg-[#A3FFD6] text-black border-3 border-black p-2 brutal-shadow-sm brutal-btn hover:bg-[#8AE8C0] font-extrabold text-xl flex items-center justify-center h-10 w-10 shrink-0"
            title="Buka Menu Sidebar"
          >
            <Menu className="w-6 h-6 text-black" />
          </button>
          <div>
            <span className="font-syne font-extrabold text-lg sm:text-xl tracking-tight uppercase block leading-none">
              {webTitle}
            </span>
            <span className="text-[8px] uppercase tracking-wider font-extrabold bg-[#4CCD99] px-2 py-0.5 border border-black text-black rounded-full inline-block mt-1">
              PRO ULTRA V5.3
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isInstallable && (
            <button
              onClick={handleInstallApp}
              className="bg-[#FFF200] text-black border-2 border-black font-extrabold py-1 px-2.5 rounded-lg text-[9px] uppercase hover:bg-yellow-400 active:translate-y-0.5 shadow-sm flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5 text-black" />
              <span>Install PWA App</span>
            </button>
          )}

          {/* Quick random recommendation mod */}
          <button
            onClick={() => {
              playSynth('success');
              if (mods.length === 0) return;
              const randomIdx = Math.floor(Math.random() * mods.length);
              showToast(`Rekomendasi Terpilih: ${mods[randomIdx].name}`, 'success');
              const el = document.getElementById(`mod-card-${randomIdx}`);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-[#FF71CD] text-black border-2 border-black font-extrabold py-1 px-2.5 rounded-lg text-[9px] uppercase hover:bg-pink-400 active:translate-y-0.5 shadow-sm flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>SURPRISE ME</span>
          </button>
        </div>
      </nav>

      {/* SIDEBAR DRAWER PANEL */}
      {isSidebarOpen && (
        <>
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 transition-opacity"
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white text-black z-50 border-r-4 border-black shadow-[6px_0_0_0_#000000] flex flex-col rounded-tr-2xl rounded-br-2xl overflow-hidden">
            <div className="p-4 bg-[#A3FFD6] border-b-3 border-black flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2 font-bold text-black text-sm">
                <Folder className="w-5 h-5 text-black" />
                <h2 className="font-syne font-extrabold text-base uppercase tracking-tight">KONTROL PANEL PORTAL</h2>
              </div>
              <button
                onClick={() => {
                  playSynth('click');
                  setIsSidebarOpen(false);
                }}
                className="bg-[#4CCD99] text-black border-2 border-black w-8 h-8 flex items-center justify-center font-bold text-xs brutal-shadow-sm active:translate-y-0.5 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1 font-bold flex flex-col justify-between text-xs text-black">
              <div className="space-y-4">
                {/* Home/All reset category button */}
                <button
                  onClick={() => {
                    setActiveCategoryFilter('');
                    setIsSidebarOpen(false);
                    playSynth('click');
                  }}
                  className="w-full text-left p-2.5 bg-zinc-50 hover:bg-[#A3FFD6] border-2 border-black brutal-shadow-sm text-[11px] uppercase flex items-center justify-between text-black rounded-lg"
                >
                  <div className="flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-black" />
                    <span>BERANDA / SEMUA MOD</span>
                  </div>
                  <span className="bg-black text-white px-2 py-0.5 text-[9px] border-2 border-black">
                    {mods.length}
                  </span>
                </button>

                {/* Bookmark Filter Button */}
                {favorites.length > 0 && (
                  <button
                    onClick={() => {
                      playSynth('success');
                      showToast("Menyaring Bookmark Terpilih", "success");
                      setIsSidebarOpen(false);
                      // Custom filter bookmarks
                    }}
                    className="w-full text-left p-2.5 bg-yellow-50 hover:bg-yellow-100 border-2 border-black brutal-shadow-sm text-[11px] uppercase flex items-center justify-between text-yellow-800 rounded-lg"
                  >
                    <div className="flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-yellow-600 animate-bounce" />
                      <span>BOOKMARK ANDA ({favorites.length})</span>
                    </div>
                  </button>
                )}

                {/* Pinned categories list */}
                <div className="border-t-2 border-dashed border-black pt-3">
                  <h3 className="text-[10px] text-[#2E8B6E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#2E8B6E]" />
                    <span>PINNED CATEGORIES</span>
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    {pinnedTags.map((tag, idx) => {
                      const count = mods.filter(m => m.tag.toUpperCase().includes(tag.toUpperCase())).length;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveCategoryFilter(tag.toUpperCase());
                            setIsSidebarOpen(false);
                            playSynth('click');
                          }}
                          className="w-full flex items-center justify-between gap-1 bg-[#A3FFD6] hover:bg-[#8AE8C0] border-2 border-black p-2 text-[10px] brutal-shadow-sm rounded-lg text-black"
                        >
                          <span className="uppercase flex items-center gap-1.5">
                            <Award className="w-3 h-3 text-black" />
                            <span>{tag}</span>
                          </span>
                          <span className="bg-[#2E8B6E] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* All computed tags categories list */}
                <div className="border-t-2 border-dashed border-black pt-3">
                  <h3 className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-gray-500" />
                    <span>SEMUA KATEGORI</span>
                  </h3>
                  <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                    {getUniqueTags().map((tag, idx) => {
                      if (pinnedTags.includes(tag)) return null;
                      const count = mods.filter(m => m.tag.toUpperCase().includes(tag.toUpperCase())).length;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveCategoryFilter(tag);
                            setIsSidebarOpen(false);
                            playSynth('click');
                          }}
                          className="w-full flex items-center justify-between gap-1 bg-zinc-100 hover:bg-[#A3FFD6]/40 border border-black p-2 text-[10px] brutal-shadow-sm rounded-lg text-black"
                        >
                          <span className="uppercase"># {tag}</span>
                          <span className="bg-black text-white text-[8px] px-1 py-0.5 rounded">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Theme Layout Live Customizer */}
                <div className="border-t-2 border-dashed border-black pt-3.5 bg-zinc-50 p-3 rounded-xl border-2 border-black">
                  <h4 className="text-[10px] uppercase font-extrabold mb-2 text-black flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>CUSTOMIZER TEMA</span>
                  </h4>
                  <div className="space-y-2 text-[9px]">
                    <div>
                      <span className="block font-bold text-gray-500 uppercase mb-1">Sudut Kelengkungan (Border Radius)</span>
                      <div className="flex gap-1">
                        {['4px', '12px', '16px', '24px'].map((rad) => (
                          <button
                            key={rad}
                            onClick={() => { setCustomBorderRadius(rad); playSynth('click'); }}
                            className={`flex-1 py-1 font-bold border border-black rounded ${
                              customBorderRadius === rad ? 'bg-black text-white' : 'bg-white'
                            }`}
                          >
                            {rad}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="block font-bold text-gray-500 uppercase mb-1">Kedalaman Bayangan (Shadow Offset)</span>
                      <div className="flex gap-1">
                        {['3px', '6px', '9px', '12px'].map((shd) => (
                          <button
                            key={shd}
                            onClick={() => { setCustomShadowOffset(shd); playSynth('click'); }}
                            className={`flex-1 py-1 font-bold border border-black rounded ${
                              customShadowOffset === shd ? 'bg-black text-white' : 'bg-white'
                            }`}
                          >
                            {shd}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Easter Egg Click Game */}
                <div className="border-t-2 border-dashed border-black pt-3 bg-zinc-50 p-2.5 border border-black rounded-lg text-center flex flex-col items-center">
                  <h4 className="text-[10px] text-black font-extrabold uppercase mb-1 flex items-center gap-1.5 justify-center">
                    <Activity className="w-3.5 h-3.5 text-black" />
                    <span>MINI GAME TAP BRUTAL</span>
                  </h4>
                  <div className="flex justify-between items-center bg-white p-1.5 border border-black rounded mb-2 text-[9px]">
                    <span>Skor: <span className="font-extrabold text-[#2E8B6E]">{easterEggScore}</span></span>
                    <span>High Score: <span className="text-pink-500">{easterEggHigh}</span></span>
                  </div>
                  <button
                    onClick={handleEasterEggTap}
                    className="w-full bg-[#FF71CD] hover:bg-[#ff55c1] text-black font-extrabold py-1.5 border border-black rounded-lg brutal-shadow-sm text-[9px] uppercase flex items-center justify-center gap-1.5"
                  >
                    <span>TAP DISINI!</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-black pt-3 mt-auto">
                {isAdminMode ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        window.location.hash = '#logy';
                        setIsSidebarOpen(false);
                        playSynth('click');
                      }}
                      className="w-full bg-[#A3FFD6] text-black font-extrabold uppercase py-2 border-2 border-black brutal-shadow-sm rounded-lg text-xs flex items-center justify-center gap-1.5"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>KELOLA PORTAL (ADMIN)</span>
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsSidebarOpen(false);
                      }}
                      className="w-full bg-black text-white font-extrabold uppercase py-2 border-2 border-black brutal-shadow-sm rounded-lg text-xs flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>KELUAR SESI ADMIN</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}

      {/* PORTAL CONTAINER VIEW */}
      <div className="max-w-3xl mx-auto px-3.5 pt-4">
        {/* WEBPAGE BRANDING SECTION */}
        <div className="w-full bg-white border-3 border-black brutal-shadow mb-6 overflow-hidden rounded-2xl">
          <div className="relative w-full h-36 sm:h-48 bg-zinc-900 border-b-3 border-black overflow-hidden flex items-center justify-center">
            <img
              src={webBannerImage}
              alt="Banner YouTube Portal"
              className="w-full h-full object-cover select-none"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221200%22 height=%22300%22%3E%3Crect width=%221200%22 height=%22300%22 fill=%22%232E8B6E%22/%3E%3Ctext x=%22600%22 y=%22170%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3EAXELUF PORTAL%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
          <div className={`p-4 pt-0 relative flex flex-col ${profileAlignment} gap-2`}>
            <div className="relative -mt-10 sm:-mt-14 z-10">
              <img
                src={webLogo}
                alt="Logo Avatar"
                className="w-20 h-20 sm:w-24 sm:h-24 bg-[#4CCD99] border-3 border-black brutal-shadow rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Ccircle cx=%22100%22 cy=%22100%22 r=%2290%22 fill=%22%234CCD99%22/%3E%3C/svg%3E';
                }}
              />
            </div>
            <div className="w-full">
              <h1 className="font-syne font-extrabold text-2xl sm:text-3xl tracking-tight uppercase text-black leading-none">
                {webTitle}
              </h1>
              <p className="text-[10px] font-bold bg-[#4CCD99] border-2 border-black inline-block px-2.5 py-1 brutal-shadow-sm mt-1.5 rounded-lg text-black uppercase">
                {webSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* DISPATCH TO SECRET PATH /logy OR PUBLIC PORTAL */}
        {currentPath.includes('/logy') || currentPath.includes('#logy') ? (
          <div className="bg-white border-3 border-black p-6 rounded-2xl brutal-shadow my-6 text-black">
            <div className="flex justify-between items-center border-b-3 border-black pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-[#4CCD99]" />
                <div>
                  <h2 className="font-syne font-extrabold text-xl uppercase leading-none text-black">LOGY PANEL</h2>
                  <p className="text-[9px] font-mono text-gray-400 mt-1 uppercase">SUPABASE SECURE BACKEND AUTH</p>
                </div>
              </div>
              <button
                onClick={() => {
                  window.location.hash = '#';
                  playSynth('click');
                }}
                className="bg-[#4CCD99] text-black border-2 border-black hover:bg-[#3dbd8c] font-extrabold text-[10px] px-3.5 py-1.5 uppercase rounded-xl shadow-sm cursor-pointer"
              >
                🏠 Beranda
              </button>
            </div>

            {isAdminMode ? (
              <div className="space-y-6">
                <div className="bg-[#A3FFD6]/40 border-2 border-dashed border-[#2E8B6E] p-4 rounded-xl flex items-center justify-between text-black">
                  <div className="text-xs">
                    <p className="font-extrabold text-[#2E8B6E] uppercase flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>AKSES TERVERIFIKASI</span>
                    </p>
                    <p className="font-mono text-gray-600 mt-0.5">{session?.user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-black text-[#A3FFD6] hover:bg-zinc-800 font-extrabold text-[10px] px-3.5 py-1.5 uppercase rounded-xl border-2 border-black shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Sesi</span>
                  </button>
                </div>

                <AdminPanel
                  mods={mods}
                  credits={credits}
                  presets={presets}
                  faqs={faqs}
                  polling={polling}
                  requests={requests}
                  onSaveMod={handleSaveModItem}
                  onDeleteMod={handleDeleteModItem}
                  onSaveBranding={handleSaveBranding}
                  onSaveSafelink={handleSaveSafelink}
                  onSaveBackground={handleSaveBackground}
                  onResetBackground={handleResetBackground}
                  onSaveBanner={handleSaveBanner}
                  onAddCredit={handleAddCredit}
                  onDeleteCredit={handleDeleteCredit}
                  onAddPreset={handleAddPreset}
                  onDeletePreset={handleDeletePreset}
                  onBulkDelete={handleBulkDelete}
                  onBulkAddTag={handleBulkAddTag}
                  onBulkDraft={handleBulkDraft}
                  onRestoreAllData={handleRestoreAllData}
                  onSaveFaqs={handleSaveFaqs}
                  onSavePolling={handleSavePolling}
                  onSaveRequest={handleSaveRequest}
                  onDeleteRequest={handleDeleteRequest}
                  visitorData={STATIC_VISITOR_STATS}
                  soundPlay={soundPlay}
                  isTableMissing={isTableMissing}
                  dbWriteError={dbWriteError}
                />
              </div>
            ) : (
              <div className="max-w-sm mx-auto my-8">
                <div className="bg-[#FFF200]/10 border-2 border-dashed border-black p-3.5 rounded-xl mb-6 text-center text-black">
                  <span className="text-sm font-bold flex items-center justify-center gap-1.5">
                    <Shield className="w-4 h-4 text-amber-500" />
                    <span>DILINDUNGI SISTEM KEAMANAN</span>
                  </span>
                  <span className="text-[9px] text-gray-500 font-medium block mt-0.5">Silakan masuk menggunakan kredensial database Supabase Anda untuk mengakses panel administrasi.</span>
                </div>

                <div className="flex border-2 border-black rounded-xl overflow-hidden mb-4 shadow-sm">
                  <button
                    onClick={() => { setAuthMode('login'); playSynth('click'); }}
                    className={`flex-1 py-2 font-syne font-extrabold text-xs uppercase ${authMode === 'login' ? 'bg-black text-[#A3FFD6]' : 'bg-white text-black'}`}
                  >
                    Masuk (Login)
                  </button>
                  <button
                    onClick={() => { setAuthMode('signup'); playSynth('click'); }}
                    className={`flex-1 py-2 font-syne font-extrabold text-xs uppercase ${authMode === 'signup' ? 'bg-black text-[#A3FFD6]' : 'bg-white text-black'}`}
                  >
                    Daftar (Sign Up)
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-gray-500 mb-1">ALAMAT EMAIL</label>
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="admin@axeluf.com"
                      className="w-full border-2 border-black p-2.5 font-bold text-xs bg-zinc-50 focus:outline-none rounded-xl text-black shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-gray-500 mb-1">PASSWORD</label>
                    <input
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="Masukkan kata sandi..."
                      className="w-full border-2 border-black p-2.5 font-bold text-xs bg-zinc-50 focus:outline-none rounded-xl text-black shadow-sm"
                    />
                  </div>

                  <button
                    onClick={handleAuthAction}
                    disabled={authLoading}
                    className="w-full bg-[#4CCD99] text-black border-2 border-black font-extrabold py-3 rounded-xl brutal-shadow-sm hover:translate-y-[-2px] hover:shadow-[4px_4px_0_0_#000000] active:translate-y-1 transition-all text-xs uppercase disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{authLoading ? 'MEMPROSES...' : authMode === 'login' ? 'MASUK KE DASHBOARD' : 'DAFTAR AKUN ADMIN'}</span>
                    {!authLoading && (authMode === 'login' ? <ArrowRight className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : maintenanceMode && !isAdminMode ? (
          <div className="bg-white border-3 border-black p-8 text-center rounded-2xl brutal-shadow my-12 text-black flex flex-col items-center">
            <Wrench className="w-16 h-16 text-amber-500 mb-4 animate-bounce" />
            <h2 className="font-syne font-extrabold text-2xl uppercase">MODE PEMELIHARAAN AKTIF</h2>
            <p className="text-xs text-gray-500 font-bold mt-2 max-w-md mx-auto leading-relaxed">
              Halo teman-teman! Portal Axeluf sedang dalam proses peningkatan database berkala. Silakan kembali dalam beberapa saat lagi ya!
            </p>
            <div className="mt-6 p-3 bg-[#FFF200]/10 border-2 border-dashed border-black rounded-lg text-[10px] font-extrabold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>KEMBALI SEGERA DENGAN FITUR BARU</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        ) : activeSingleModId ? (
          <>
            {/* SINGLE MOD DEDICATED VIEW PAGE */}
            <main className="text-black space-y-6">
              {/* Back button header */}
              <div className="flex items-center justify-between bg-black text-white p-3.5 brutal-border brutal-shadow-sm rounded-xl">
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4 text-[#A3FFD6]" />
                  <span className="font-extrabold text-xs uppercase text-white tracking-wider">
                    Mod Terpilih (Single Mod View)
                  </span>
                </div>
                <button
                  onClick={() => handleNavigateToMod(null)}
                  className="bg-[#4CCD99] text-black border-2 border-black hover:bg-[#3dbd8c] font-black text-[10px] px-3.5 py-1.5 uppercase rounded-lg shadow-sm cursor-pointer transition-all hover:translate-y-[-1px] active:translate-y-1"
                >
                  ← KEMBALI KE BERANDA
                </button>
              </div>

              {/* Render Selected Mod */}
              {(() => {
                const foundModIndex = mods.findIndex(m => m.id === activeSingleModId || m.id === `mod-${activeSingleModId}`);
                let modIndex = foundModIndex;
                if (modIndex === -1) {
                  const numericIdx = parseInt(activeSingleModId);
                  if (!isNaN(numericIdx) && numericIdx >= 0 && numericIdx < mods.length) {
                    modIndex = numericIdx;
                  }
                }

                if (modIndex !== -1 && mods[modIndex]) {
                  const item = mods[modIndex];
                  return (
                    <ModCard
                      mod={item}
                      cardIndex={modIndex}
                      onLike={handleLikeMod}
                      onAddComment={handleAddComment}
                      onRate={handleRateMod}
                      onReportBroken={handleReportBroken}
                      onSelectCategory={(tag) => {
                        handleNavigateToMod(null);
                        setActiveCategoryFilter(tag);
                      }}
                      isFavorited={favorites.includes(modIndex)}
                      onToggleFavorite={handleToggleFavorite}
                      triggerSafelink={triggerSafelink}
                      soundPlay={soundPlay}
                      isStandaloneView={true}
                    />
                  );
                } else {
                  return (
                    <div className="bg-white text-black border-3 border-black brutal-shadow p-8 text-center font-bold rounded-2xl flex flex-col items-center">
                      <AlertTriangle className="w-12 h-12 text-red-500 mb-2 animate-pulse" />
                      <h4 className="font-syne font-extrabold text-sm uppercase">Mod Tidak Ditemukan!</h4>
                      <p className="text-[10px] text-gray-400 font-normal mt-1 leading-normal">
                        Tautan referensi yang Anda kunjungi salah atau file modifikasi ini telah dihapus.
                      </p>
                      <button
                        onClick={() => handleNavigateToMod(null)}
                        className="bg-[#4CCD99] border-2 border-black px-4 py-2 mt-4 text-xs font-extrabold uppercase rounded-xl brutal-shadow-sm cursor-pointer"
                      >
                        Kembali ke Halaman Utama
                      </button>
                    </div>
                  );
                }
              })()}
            </main>
          </>
        ) : (
          <>
            {/* MAIN PUBLIC WEB VIEW */}
            <main className="text-black space-y-6">
              {/* Active Filtering Category Badge */}
              {activeCategoryFilter && (
                <div className="bg-black text-white p-3.5 brutal-border brutal-shadow-sm flex items-center justify-between rounded-xl">
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-[#A3FFD6]" />
                    <span className="font-extrabold text-xs uppercase text-white">
                      MENYARING KATEGORI:{' '}
                      <span className="text-[#A3FFD6] underline decoration-wavy pl-1">
                        #{activeCategoryFilter}
                      </span>
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveCategoryFilter('');
                      playSynth('click');
                    }}
                    className="bg-[#4CCD99] text-black border-2 border-black hover:bg-[#3dbd8c] font-extrabold text-[9px] px-2.5 py-0.5 uppercase rounded-lg shadow-sm active:translate-y-0.5"
                  >
                    Hapus Filter ✕
                  </button>
                </div>
              )}

              {/* LIVE SEARCH & POPULAR SEARCH bento box */}
              <div className="bg-white border-3 border-black p-4 rounded-2xl brutal-shadow text-black space-y-3">
                {/* Custom input bar */}
                <div className="flex items-center border-3 border-black p-0.5 rounded-xl bg-zinc-50 shadow-sm relative text-black">
                  <Search className="w-4 h-4 text-black mx-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari Game, Modifikasi skin, atau APK di sini..."
                    className="w-full py-2.5 px-1 font-bold text-xs bg-transparent text-black focus:outline-none"
                  />

                  {/* Voice recognition trigger */}
                  <button
                    onClick={handleVoiceSearch}
                    className={`mr-2 p-1.5 rounded-lg border-2 border-black font-extrabold transition-all text-[11px] flex items-center gap-1 ${
                      voiceSearchActive ? 'bg-red-500 text-white animate-pulse' : 'bg-[#A3FFD6] hover:bg-[#4CCD99] text-black'
                    }`}
                    title="Pencarian Suara"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{voiceSearchActive ? 'LISTEN' : 'MIC'}</span>
                  </button>
                </div>

                {/* Search suggestion drop-down */}
                {searchSuggestions.length > 0 && (
                  <div className="border-2 border-black bg-white p-2 rounded-xl text-[10px] font-bold space-y-1.5 shadow-sm">
                    <span className="text-gray-400 text-[8px] uppercase block mb-1">Rekomendasi pencarian:</span>
                    {searchSuggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          handleExecuteSearch(sug);
                          setSearchSuggestions([]);
                          playSynth('click');
                        }}
                        className="w-full text-left p-1 rounded hover:bg-[#A3FFD6]/30 text-black uppercase flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Recent search history and popular searches */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[9px] font-bold border-t border-dashed border-gray-300">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gray-400 uppercase">POPULER:</span>
                    {['MLBB', 'GAME', 'APK', 'SKIN'].map((pop) => (
                      <button
                        key={pop}
                        onClick={() => {
                          handleExecuteSearch(pop);
                          playSynth('click');
                        }}
                        className="bg-zinc-100 hover:bg-[#A3FFD6] border border-black px-2 py-0.5 rounded uppercase"
                      >
                        {pop}
                      </button>
                    ))}
                  </div>

                  {recentSearches.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap text-black">
                      <span className="text-gray-400 uppercase">TERBARU:</span>
                      {recentSearches.map((rec, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSearchQuery(rec);
                            playSynth('click');
                          }}
                          className="bg-zinc-100 border border-black/40 px-1.5 py-0.5 rounded text-gray-600"
                        >
                          {rec}
                        </button>
                      ))}
                      <button
                        onClick={clearRecentSearches}
                        className="text-red-500 underline ml-1 text-[8px]"
                      >
                        Hapus Semua
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Informative notification bento block */}
              <div className="bg-[#4CCD99] border-3 border-black brutal-shadow-sm p-3.5 font-extrabold flex gap-3 items-center rounded-2xl">
                <Bell className="w-6 h-6 text-black shrink-0 animate-bounce" />
                <p className="text-[10px] sm:text-xs text-black leading-snug">
                  Ada kendala link error, tautan mati, atau terdeteksi password salah? Hubungi tim support kami segera dengan memberikan laporan kerusakan pada tombol 'Lapor Mati' di tiap mod!
                </p>
              </div>

              {/* MOD CARDS GRID SECTION */}
              <div className="space-y-6">
                {getVisibleMods().length === 0 ? (
                  /* Empty state view */
                  <div className="bg-white text-black border-3 border-black brutal-shadow p-8 text-center font-bold rounded-2xl flex flex-col items-center">
                    <Activity className="w-12 h-12 text-gray-400 mb-2 animate-pulse" />
                    <h4 className="font-syne font-extrabold text-sm uppercase">Mod Tidak Ditemukan!</h4>
                    <p className="text-[10px] text-gray-400 font-normal mt-1 leading-normal">
                      Cobalah mengetikkan kata kunci lain, bersihkan filter pencarian, atau sampaikan usulan request mod di bagian bawah halaman agar segera ditambahkan.
                    </p>
                  </div>
                ) : (
                  getVisibleMods().map((item, idx) => (
                    <div id={`mod-card-${idx}`} key={item.id || idx}>
                      <ModCard
                        mod={item}
                        cardIndex={idx}
                        onLike={handleLikeMod}
                        onAddComment={handleAddComment}
                        onRate={handleRateMod}
                        onReportBroken={handleReportBroken}
                        onSelectCategory={(tag) => {
                          setActiveCategoryFilter(tag);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        isFavorited={favorites.includes(idx)}
                        onToggleFavorite={handleToggleFavorite}
                        triggerSafelink={triggerSafelink}
                        soundPlay={soundPlay}
                      />
                    </div>
                  ))
                )}
              </div>

              {/* COMMUNITY SURVEYS & USER REQUESTS */}
              <FAQPolling
                faqs={faqs}
                polling={polling}
                onVotePolling={handleVotePolling}
                requests={requests}
                onRequestMod={handleRequestMod}
                onUpvoteRequest={handleUpvoteRequest}
              />
            </main>
          </>
        )}

        {/* FLOATING ACTION FLOATING BUTTONS (FAB) */}
        <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
          {/* Scroll progress and scroll to top button */}
          <button
            onClick={() => {
              playSynth('click');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-10 h-10 bg-[#4CCD99] border-3 border-black text-black font-extrabold flex items-center justify-center rounded-xl shadow-[2px_2px_0_0_#000000] hover:translate-y-[-2px] hover:shadow-[3px_3px_0_0_#000000] active:translate-y-1 transition-all"
            title="Kembali Ke Atas"
          >
            ▲
          </button>
        </div>

        {/* FOOTER & SOCIAL LINKS */}
        <footer className="mt-14 bg-white text-black border-3 border-black brutal-shadow p-6 text-center font-bold rounded-2xl">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
            {credits.map((c, index) => (
              <a
                key={index}
                href={c.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => playSynth('click')}
                style={{ backgroundColor: c.color }}
                className="px-3.5 py-1.5 border-2 border-black brutal-shadow-sm brutal-btn-sm flex items-center gap-1.5 text-[10px] uppercase text-black font-extrabold rounded-lg"
              >
                <Share2 className="w-3.5 h-3.5 text-black" />
                <span>{c.platform}:</span>
                <span className="font-black underline">{c.handle}</span>
              </a>
            ))}
          </div>

          <p className="font-syne font-extrabold uppercase tracking-wider text-xs">
            © 2026 {webTitle} ID - DEVELOPED BY AXELUF TEAM
          </p>
          <p className="text-[9px] text-gray-500 mt-2 font-mono uppercase tracking-wider">
            HYBRID SYNC CLUSTER STATE: ACTIVE SECURE • 10.000+ CACHED DATA
          </p>
        </footer>
      </div>
    </div>
  );
}
