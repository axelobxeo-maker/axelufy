/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ModItem, CreditItem, PresetLink, FAQItem, PollingTopic, RequestMod } from '../types';
import DashboardAnalytics from './DashboardAnalytics';

interface AdminPanelProps {
  mods: ModItem[];
  credits: CreditItem[];
  presets: PresetLink[];
  faqs: FAQItem[];
  polling: PollingTopic;
  requests: RequestMod[];
  onSaveMod: (mod: Partial<ModItem>, index?: number) => void;
  onDeleteMod: (index: number) => void;
  onSaveBranding: (title: string, subtitle: string, logo: string, alignment: string) => void;
  onSaveSafelink: (time: number, broadcast: string) => void;
  onSaveBackground: (url: string) => void;
  onResetBackground: () => void;
  onSaveBanner: (url: string) => void;
  onAddCredit: (platform: string, handle: string, url: string, color: string) => void;
  onDeleteCredit: (index: number) => void;
  onAddPreset: (label: string, url: string, iconType: string) => void;
  onDeletePreset: (index: number) => void;
  onBulkDelete: (indices: number[]) => void;
  onBulkAddTag: (indices: number[], tag: string) => void;
  onBulkDraft: (indices: number[], isDraft: boolean) => void;
  onRestoreAllData: (data: any) => void;
  onSaveFaqs: (faqs: FAQItem[]) => void;
  onSavePolling: (poll: PollingTopic) => void;
  onDeleteRequest: (id: string) => void;
  onSaveRequest: (req: RequestMod) => void;
  visitorData: Array<{ date: string; visitors: number; downloads: number; uploads: number }>;
  soundPlay: (type: 'click' | 'success' | 'delete') => void;
}

export default function AdminPanel({
  mods,
  credits,
  presets,
  faqs,
  polling,
  requests,
  onSaveMod,
  onDeleteMod,
  onSaveBranding,
  onSaveSafelink,
  onSaveBackground,
  onResetBackground,
  onSaveBanner,
  onAddCredit,
  onDeleteCredit,
  onAddPreset,
  onDeletePreset,
  onBulkDelete,
  onBulkAddTag,
  onBulkDraft,
  onRestoreAllData,
  onSaveFaqs,
  onSavePolling,
  onDeleteRequest,
  onSaveRequest,
  visitorData,
  soundPlay
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'mod' | 'branding' | 'social' | 'bulk' | 'sql' | 'analytics' | 'faqs' | 'polling' | 'requests'>('mod');

  // Mod Form States
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [modName, setModName] = useState('');
  const [modTag, setModTag] = useState('');
  const [modDesc, setModDesc] = useState('');
  const [modUrl, setModUrl] = useState('');
  const [modPassword, setModPassword] = useState('');
  const [modImageUrl, setModImageUrl] = useState('');
  const [modImageRatio, setModImageRatio] = useState('aspect-video object-cover');
  const [modViews, setModViews] = useState<number>(0);
  const [modLikes, setModLikes] = useState<number>(0);
  const [modDownloads, setModDownloads] = useState<number>(0);
  const [isDraft, setIsDraft] = useState(false);
  const [publishDate, setPublishDate] = useState('');
  const [verified, setVerified] = useState(true);
  const [premium, setPremium] = useState(false);
  const [exclusive, setExclusive] = useState(false);
  const [changelog, setChangelog] = useState('');

  // Form custom links state
  const [customLinks, setCustomLinks] = useState<Array<{ label: string; url: string; iconType: string }>>([]);

  // Branding States
  const [brandTitle, setBrandTitle] = useState('');
  const [brandSubtitle, setBrandSubtitle] = useState('');
  const [brandLogo, setBrandLogo] = useState('');
  const [brandAlignment, setBrandAlignment] = useState('items-start text-left');

  // Announcement and Safelink States
  const [broadcastText, setBroadcastText] = useState('');
  const [safelinkTime, setSafelinkTime] = useState<number>(5);
  const [bgUrl, setBgUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  // Credits States
  const [credPlatform, setCredPlatform] = useState('');
  const [credHandle, setCredHandle] = useState('');
  const [credUrl, setCredUrl] = useState('');
  const [credColor, setCredColor] = useState('#4CCD99');

  // Preset States
  const [presetLabel, setPresetLabel] = useState('');
  const [presetUrl, setPresetUrl] = useState('');
  const [presetIcon, setPresetIcon] = useState('video');

  // Bulk / Scan States
  const [selectedModIndices, setSelectedModIndices] = useState<number[]>([]);
  const [bulkTagInput, setBulkTagInput] = useState('');
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [showBroken, setShowBroken] = useState(false);

  // FAQ management states
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState('');
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null);

  // Polling management states
  const [pollQuestionInput, setPollQuestionInput] = useState(polling.question);
  const [pollOptionsList, setPollOptionsList] = useState(polling.options);

  // Request Mod editing states
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [reqEditName, setReqEditName] = useState('');
  const [reqEditCategory, setReqEditCategory] = useState('');
  const [reqEditStatus, setReqEditStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [reqEditVotes, setReqEditVotes] = useState(1);

  // Decoders / Encoders
  const encodeSafe = (str: string): string => btoa(unescape(encodeURIComponent(str)));
  const decodeSafe = (str: string): string => {
    try { return decodeURIComponent(escape(atob(str))); } catch { return str; }
  };

  // Preset Loaders
  const handleLoadPreset = (preset: PresetLink) => {
    setCustomLinks([...customLinks, { label: preset.label, url: preset.url, iconType: preset.iconType }]);
    soundPlay('success');
  };

  // Add custom link row
  const handleAddLinkRow = () => {
    if (customLinks.length >= 5) return;
    setCustomLinks([...customLinks, { label: '', url: '', iconType: 'video' }]);
    soundPlay('click');
  };

  // Remove custom link row
  const handleRemoveLinkRow = (idx: number) => {
    setCustomLinks(customLinks.filter((_, i) => i !== idx));
    soundPlay('delete');
  };

  // Update custom link row field
  const handleUpdateLinkRow = (idx: number, field: 'label' | 'url' | 'iconType', val: string) => {
    const updated = [...customLinks];
    updated[idx] = { ...updated[idx], [field]: val };
    setCustomLinks(updated);
  };

  // Trigger form editing
  const handleStartEdit = (idx: number) => {
    soundPlay('click');
    const item = mods[idx];
    setEditIndex(idx);
    setModName(item.name);
    setModTag(item.tag);
    setModDesc(item.desc);
    setModUrl(decodeSafe(item.url));
    setModPassword(item.password ? decodeSafe(item.password) : '');
    setModImageUrl(item.image || '');
    setModImageRatio(item.imageRatio || 'aspect-video object-cover');
    setModViews(item.views || 0);
    setModLikes(item.likes || 0);
    setModDownloads(item.downloads || 0);
    setIsDraft(!!item.isDraft);
    setPublishDate(item.publishDate || '');
    setVerified(!!item.verified);
    setPremium(!!item.premium);
    setExclusive(!!item.exclusive);
    setChangelog(item.changelog || '');
    setCustomLinks(item.customButtons || []);
  };

  // Submit Mod
  const handleSubmitMod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modName.trim() || !modTag.trim() || !modDesc.trim() || !modUrl.trim()) return;

    const partialMod: Partial<ModItem> = {
      name: modName,
      tag: modTag.toUpperCase(),
      desc: modDesc,
      url: encodeSafe(modUrl),
      password: encodeSafe(modPassword || "Tanpa Password / Langsung Ekstrak"),
      image: modImageUrl || 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&q=80&w=800',
      imageRatio: modImageRatio,
      views: modViews,
      likes: modLikes,
      downloads: modDownloads,
      isDraft: isDraft,
      publishDate: publishDate || undefined,
      verified: verified,
      premium: premium,
      exclusive: exclusive,
      changelog: changelog,
      customButtons: customLinks
    };

    onSaveMod(partialMod, editIndex !== null ? editIndex : undefined);
    handleResetForm();
  };

  const handleResetForm = () => {
    setEditIndex(null);
    setModName('');
    setModTag('');
    setModDesc('');
    setModUrl('');
    setModPassword('');
    setModImageUrl('');
    setModImageRatio('aspect-video object-cover');
    setModViews(0);
    setModLikes(0);
    setModDownloads(0);
    setIsDraft(false);
    setPublishDate('');
    setVerified(true);
    setPremium(false);
    setExclusive(false);
    setChangelog('');
    setCustomLinks([]);
  };

  // Brand Submission
  const handleBrandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBranding(brandTitle, brandSubtitle, brandLogo, brandAlignment);
  };

  // Safelink / Announce Submission
  const handleSafelinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSafelink(safelinkTime, broadcastText);
  };

  // Credit Submission
  const handleCreditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credPlatform.trim() || !credHandle.trim() || !credUrl.trim()) return;
    onAddCredit(credPlatform, credHandle, credUrl, credColor);
    setCredPlatform('');
    setCredHandle('');
    setCredUrl('');
  };

  // Custom Preset Link Submission
  const handlePresetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetLabel.trim() || !presetUrl.trim()) return;
    onAddPreset(presetLabel, presetUrl, presetIcon);
    setPresetLabel('');
    setPresetUrl('');
  };

  // JSON Backup / Restore
  const handleBackupJSON = () => {
    soundPlay('success');
    const fullBackup = {
      mods,
      credits,
      presets,
      branding: { title: brandTitle, subtitle: brandSubtitle, logo: brandLogo, alignment: brandAlignment },
      safelink: { time: safelinkTime, broadcast: broadcastText },
      bgUrl,
      bannerUrl
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "axeluf_db_backup.json");
    dlAnchorElem.click();
  };

  const handleRestoreJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && (parsed.mods || parsed.branding)) {
            onRestoreAllData(parsed);
            soundPlay('success');
          } else {
            alert("Format JSON backup tidak valid.");
          }
        } catch (err) {
          alert("Gagal mengurai file JSON.");
        }
      };
    }
  };

  // CSV Export / Import
  const handleExportCSV = () => {
    soundPlay('success');
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Name,Tags,Description,Url,Password,Views,Likes,Downloads,IsDraft\n";

    mods.forEach((m, idx) => {
      const row = [
        idx,
        `"${m.name.replace(/"/g, '""')}"`,
        `"${m.tag.replace(/"/g, '""')}"`,
        `"${m.desc.replace(/"/g, '""')}"`,
        `"${decodeSafe(m.url)}"`,
        `"${m.password ? decodeSafe(m.password) : ''}"`,
        m.views,
        m.likes,
        m.downloads,
        m.isDraft ? 1 : 0
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "axeluf_mods.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      reader.readAsText(e.target.files[0]);
      reader.onload = (event) => {
        try {
          const csvText = event.target?.result as string;
          const lines = csvText.split("\n");
          if (lines.length <= 1) return;

          const importedMods: Array<Partial<ModItem>> = [];
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            // Parse CSV fields carefully supporting simple quotes
            const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if (row.length < 5) continue;

            const name = row[1]?.replace(/^"|"$/g, '').trim();
            const tag = row[2]?.replace(/^"|"$/g, '').toUpperCase().trim();
            const desc = row[3]?.replace(/^"|"$/g, '').trim();
            const url = row[4]?.replace(/^"|"$/g, '').trim();
            const password = row[5]?.replace(/^"|"$/g, '').trim();

            if (name && tag && desc && url) {
              importedMods.push({
                name,
                tag,
                desc,
                url: encodeSafe(url),
                password: encodeSafe(password || "Tanpa Password / Langsung Ekstrak"),
                views: parseInt(row[6]) || 0,
                likes: parseInt(row[7]) || 0,
                downloads: parseInt(row[8]) || 0,
                isDraft: row[9]?.trim() === '1',
                image: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&q=80&w=800'
              });
            }
          }

          if (importedMods.length > 0) {
            importedMods.forEach(m => onSaveMod(m));
            soundPlay('success');
            alert(`Berhasil mengimpor ${importedMods.length} mod dari CSV!`);
          }
        } catch (err) {
          alert("Gagal mengurai file CSV.");
        }
      };
    }
  };

  // Duplicate Finder
  const getDuplicateMods = () => {
    const dups: Array<{ idx: number; name: string }> = [];
    const seen = new Set<string>();
    mods.forEach((m, idx) => {
      const lower = m.name.toLowerCase().trim();
      if (seen.has(lower)) {
        dups.push({ idx, name: m.name });
      } else {
        seen.add(lower);
      }
    });
    return dups;
  };

  // Broken Link Finder (Empty URLs or non-https/http)
  const getBrokenMods = () => {
    const broken: Array<{ idx: number; name: string; url: string }> = [];
    mods.forEach((m, idx) => {
      const decoded = decodeSafe(m.url);
      const invalid = !decoded || (!decoded.startsWith('http://') && !decoded.startsWith('https://'));
      if (invalid || (m.brokenReportCount && m.brokenReportCount > 0)) {
        broken.push({ idx, name: m.name, url: decoded });
      }
    });
    return broken;
  };

  // Bulk selectors
  const toggleSelectAllMods = () => {
    if (selectedModIndices.length === mods.length) {
      setSelectedModIndices([]);
    } else {
      setSelectedModIndices(mods.map((_, i) => i));
    }
  };

  const handleToggleSelectMod = (idx: number) => {
    if (selectedModIndices.includes(idx)) {
      setSelectedModIndices(selectedModIndices.filter(i => i !== idx));
    } else {
      setSelectedModIndices([...selectedModIndices, idx]);
    }
  };

  const handleBulkDeleteSubmit = () => {
    if (selectedModIndices.length === 0) return;
    if (confirm(`Hapus ${selectedModIndices.length} mod yang dipilih?`)) {
      onBulkDelete(selectedModIndices);
      setSelectedModIndices([]);
      soundPlay('delete');
    }
  };

  const handleBulkTagSubmit = () => {
    if (selectedModIndices.length === 0 || !bulkTagInput.trim()) return;
    onBulkAddTag(selectedModIndices, bulkTagInput.toUpperCase());
    setBulkTagInput('');
    setSelectedModIndices([]);
    soundPlay('success');
  };

  const handleBulkDraftToggle = (status: boolean) => {
    if (selectedModIndices.length === 0) return;
    onBulkDraft(selectedModIndices, status);
    setSelectedModIndices([]);
    soundPlay('success');
  };

  React.useEffect(() => {
    if (polling) {
      setPollQuestionInput(polling.question);
      setPollOptionsList(polling.options || []);
    }
  }, [polling]);

  return (
    <section className="bg-[#A3FFD6] text-black border-3 border-black brutal-shadow p-4 mb-6 text-xs">
      {/* Admin Header */}
      <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-4">
        <h2 className="font-syne font-extrabold text-base sm:text-lg uppercase">🛠️ PANEL ADMIN AXELUF</h2>
        <span className="bg-[#4CCD99] px-2.5 py-0.5 border-2 border-black text-[9px] font-extrabold uppercase text-black rounded-full shadow-sm">
          DB PRO ACTIVE
        </span>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <button
          onClick={() => { setActiveTab('mod'); soundPlay('click'); }}
          className={`${
            activeTab === 'mod' ? 'bg-black text-white' : 'bg-white text-black'
          } px-3 py-1.5 text-[10px] uppercase font-bold border-2 border-black brutal-shadow-sm rounded-lg`}
        >
          Modifikasi Link
        </button>
        <button
          onClick={() => { setActiveTab('branding'); soundPlay('click'); }}
          className={`${
            activeTab === 'branding' ? 'bg-black text-white' : 'bg-white text-black'
          } px-3 py-1.5 text-[10px] uppercase font-bold border-2 border-black brutal-shadow-sm rounded-lg`}
        >
          Branding & BG
        </button>
        <button
          onClick={() => { setActiveTab('social'); soundPlay('click'); }}
          className={`${
            activeTab === 'social' ? 'bg-black text-white' : 'bg-white text-black'
          } px-3 py-1.5 text-[10px] uppercase font-bold border-2 border-black brutal-shadow-sm rounded-lg`}
        >
          Sosmed & Preset
        </button>
        <button
          onClick={() => { setActiveTab('bulk'); soundPlay('click'); }}
          className={`${
            activeTab === 'bulk' ? 'bg-black text-white' : 'bg-white text-black'
          } px-3 py-1.5 text-[10px] uppercase font-bold border-2 border-black brutal-shadow-sm rounded-lg`}
        >
          Bulk Edit & Scan
        </button>
        <button
          onClick={() => { setActiveTab('faqs'); soundPlay('click'); }}
          className={`${
            activeTab === 'faqs' ? 'bg-black text-white' : 'bg-white text-black'
          } px-3 py-1.5 text-[10px] uppercase font-bold border-2 border-black brutal-shadow-sm rounded-lg`}
        >
          ❓ Kelola FAQ
        </button>
        <button
          onClick={() => { setActiveTab('polling'); soundPlay('click'); }}
          className={`${
            activeTab === 'polling' ? 'bg-black text-white' : 'bg-white text-black'
          } px-3 py-1.5 text-[10px] uppercase font-bold border-2 border-black brutal-shadow-sm rounded-lg`}
        >
          📊 Kelola Polling
        </button>
        <button
          onClick={() => { setActiveTab('requests'); soundPlay('click'); }}
          className={`${
            activeTab === 'requests' ? 'bg-black text-white' : 'bg-white text-black'
          } px-3 py-1.5 text-[10px] uppercase font-bold border-2 border-black brutal-shadow-sm rounded-lg`}
        >
          📢 Kelola Request
        </button>
        <button
          onClick={() => { setActiveTab('analytics'); soundPlay('click'); }}
          className={`${
            activeTab === 'analytics' ? 'bg-black text-white' : 'bg-white text-black'
          } px-3 py-1.5 text-[10px] uppercase font-bold border-2 border-black brutal-shadow-sm rounded-lg`}
        >
          📊 Analytics
        </button>
        <button
          onClick={() => { setActiveTab('sql'); soundPlay('click'); }}
          className={`${
            activeTab === 'sql' ? 'bg-black text-white' : 'bg-white text-black'
          } px-3 py-1.5 text-[10px] uppercase font-bold border-2 border-black brutal-shadow-sm rounded-lg text-blue-700`}
        >
          ⚙️ SQL Setup
        </button>
      </div>

      {/* TAB MOD CONTENT */}
      {activeTab === 'mod' && (
        <div className="space-y-4">
          <form onSubmit={handleSubmitMod} className="bg-white border-3 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000] text-black">
            <h3 className="font-syne font-extrabold text-sm uppercase mb-3 text-[#2E8B6E] flex justify-between items-center">
              <span>{editIndex !== null ? '📝 Edit Link Modifikasi' : '➕ Tambah Mod Baru'}</span>
              {editIndex !== null && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="bg-red-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded uppercase"
                >
                  Batal Edit
                </button>
              )}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div>
                <label className="block font-bold mb-0.5 uppercase text-gray-700 text-[8px]">Nama Aplikasi / Game Mod</label>
                <input
                  type="text"
                  value={modName}
                  onChange={(e) => setModName(e.target.value)}
                  placeholder="Contoh: Mobile Legends Mod Skin"
                  className="w-full border-2 border-black p-2 font-bold bg-white rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-0.5 uppercase text-gray-700 text-[8px]">Kategori (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={modTag}
                  onChange={(e) => setModTag(e.target.value)}
                  placeholder="Contoh: GAME, APK, MLBB"
                  className="w-full border-2 border-black p-2 font-bold bg-white rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label class="block font-bold mb-0.5 uppercase text-gray-700 text-[8px]">Deskripsi Mod</label>
                <textarea
                  value={modDesc}
                  onChange={(e) => setModDesc(e.target.value)}
                  rows={2}
                  placeholder="Sebutkan fitur unggulan mod..."
                  className="w-full border-2 border-black p-2 font-bold bg-white rounded-lg focus:outline-none"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block font-bold mb-0.5 uppercase text-gray-700 text-[8px]">Link Download Utama (MediaFire/Safelink)</label>
                <input
                  type="text"
                  value={modUrl}
                  onChange={(e) => setModUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full border-2 border-black p-2 font-bold bg-white rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-0.5 uppercase text-gray-700 text-[8px]">Info Password (Jika ada)</label>
                <input
                  type="text"
                  value={modPassword}
                  onChange={(e) => setModPassword(e.target.value)}
                  placeholder="Contoh: Password di Video Menit 04:20"
                  className="w-full border-2 border-black p-2 font-bold bg-white rounded-lg focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold mb-0.5 uppercase text-[#2E8B6E] text-[8px]">🖼️ Link URL Gambar Mod (Unggah ke Postimages/ImgBB)</label>
                <input
                  type="text"
                  value={modImageUrl}
                  onChange={(e) => setModImageUrl(e.target.value)}
                  placeholder="https://i.ibb.co/..."
                  className="w-full border-2 border-black p-2 font-bold bg-white rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold mb-0.5 uppercase text-gray-700 text-[8px]">Rasio Gambar</label>
                <select
                  value={modImageRatio}
                  onChange={(e) => setModImageRatio(e.target.value)}
                  className="w-full border-2 border-black p-2 font-bold bg-white rounded-lg focus:outline-none text-[10px]"
                >
                  <option value="aspect-video object-cover">Rasio Video (16:9)</option>
                  <option value="aspect-square object-cover">Rasio Kotak (1:1)</option>
                  <option value="aspect-[9/16] object-cover">Rasio Vertikal (9:16)</option>
                </select>
              </div>

              {/* Version & Changelog Config */}
              <div>
                <label className="block font-bold mb-0.5 uppercase text-gray-700 text-[8px]">Changelog Terakhir</label>
                <input
                  type="text"
                  value={changelog}
                  onChange={(e) => setChangelog(e.target.value)}
                  placeholder="Mendukung patch terbaru, anti lag, dll..."
                  className="w-full border-2 border-black p-2 font-bold bg-white rounded-lg focus:outline-none"
                />
              </div>

              {/* Stats Manual Modification */}
              <div className="p-2.5 bg-[#A3FFD6]/20 border-2 border-[#2E8B6E] col-span-1 md:col-span-2 rounded-lg text-black grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[8px] font-bold uppercase text-gray-600">Manual Views</label>
                  <input
                    type="number"
                    value={modViews}
                    onChange={(e) => setModViews(parseInt(e.target.value) || 0)}
                    className="w-full border border-black p-1 font-bold bg-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-bold uppercase text-gray-600">Manual Likes</label>
                  <input
                    type="number"
                    value={modLikes}
                    onChange={(e) => setModLikes(parseInt(e.target.value) || 0)}
                    className="w-full border border-black p-1 font-bold bg-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-bold uppercase text-gray-600">Manual Downloads</label>
                  <input
                    type="number"
                    value={modDownloads}
                    onChange={(e) => setModDownloads(parseInt(e.target.value) || 0)}
                    className="w-full border border-black p-1 font-bold bg-white rounded"
                  />
                </div>
              </div>

              {/* Badges Toggles */}
              <div className="col-span-1 md:col-span-2 flex flex-wrap gap-4 p-2 bg-zinc-50 border-2 border-black rounded-lg">
                <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                  <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} className="scale-110" />
                  <span>🛡️ Verified Badge</span>
                </label>
                <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                  <input type="checkbox" checked={premium} onChange={(e) => setPremium(e.target.checked)} className="scale-110" />
                  <span>👑 Premium Badge</span>
                </label>
                <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                  <input type="checkbox" checked={exclusive} onChange={(e) => setExclusive(e.target.checked)} className="scale-110" />
                  <span>🔥 Exclusive Badge</span>
                </label>
                <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                  <input type="checkbox" checked={isDraft} onChange={(e) => setIsDraft(e.target.checked)} className="scale-110 text-red-600" />
                  <span className="text-red-600">⚠️ Simpan sebagai Draft</span>
                </label>
              </div>

              {/* Scheduled Publish */}
              <div className="col-span-1 md:col-span-2">
                <label className="block font-bold mb-0.5 uppercase text-gray-700 text-[8px]">
                  📅 Jadwalkan Rilis Otomatis (Format ISO / Biarkan kosong jika langsung publik)
                </label>
                <input
                  type="datetime-local"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full border-2 border-black p-2 font-bold bg-white rounded-lg focus:outline-none"
                />
              </div>
            </div>

            {/* Form custom buttons */}
            <div className="mt-4 p-3 border-2 border-black bg-zinc-50 text-black rounded-xl">
              <h4 className="font-syne font-extrabold text-[10px] uppercase mb-2 text-black border-b-2 border-black pb-1.5 flex justify-between items-center">
                <span>🔗 Tombol Eksternal Custom (Maks 5)</span>
                <button
                  type="button"
                  onClick={handleAddLinkRow}
                  className="bg-[#4CCD99] border-2 border-black hover:bg-[#3ec08a] font-bold text-[9px] px-2 py-0.5 rounded-lg text-black"
                >
                  + Tambah Tombol
                </button>
              </h4>

              <div className="space-y-2 mb-3">
                {customLinks.map((btn, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 bg-white border-2 border-black rounded-lg text-[9px] relative">
                    <div>
                      <label className="block text-[8px] font-bold text-gray-500 uppercase">Teks Tombol</label>
                      <input
                        type="text"
                        value={btn.label}
                        onChange={(e) => handleUpdateLinkRow(idx, 'label', e.target.value)}
                        placeholder="Contoh: Cara Pasang"
                        className="w-full border border-black p-1 rounded font-bold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-gray-500 uppercase">URL Tujuan</label>
                      <input
                        type="text"
                        value={btn.url}
                        onChange={(e) => handleUpdateLinkRow(idx, 'url', e.target.value)}
                        placeholder="https://..."
                        className="w-full border border-black p-1 rounded font-bold bg-white"
                      />
                    </div>
                    <div className="flex items-end gap-1.5">
                      <div className="flex-1">
                        <label className="block text-[8px] font-bold text-gray-500 uppercase">Pilih Icon</label>
                        <select
                          value={btn.iconType}
                          onChange={(e) => handleUpdateLinkRow(idx, 'iconType', e.target.value)}
                          className="w-full border border-black p-1 rounded font-bold bg-white text-[9px]"
                        >
                          <option value="video">🎥 Video Tutorial</option>
                          <option value="download">📥 File Download</option>
                          <option value="chat">💬 Komunitas / Obrolan</option>
                          <option value="key">🔑 Token / Password</option>
                          <option value="globe">🌐 Web Luar</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLinkRow(idx)}
                        className="bg-red-500 text-white font-bold p-1 border border-black rounded uppercase hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Preset buttons */}
              {presets.length > 0 && (
                <div className="border-t border-dashed border-gray-400 pt-2">
                  <span className="block text-[8px] font-bold text-[#2E8B6E] uppercase mb-1">Presety Cepat Tersedia:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {presets.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleLoadPreset(p)}
                        className="bg-white border border-black text-[8px] px-1.5 py-0.5 rounded font-bold uppercase hover:bg-gray-100"
                      >
                        ⚡ {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="flex-1 bg-[#4CCD99] hover:bg-[#3ec08a] font-extrabold uppercase py-2.5 border-3 border-black brutal-shadow-sm brutal-btn-sm text-xs text-black rounded-lg"
              >
                {editIndex !== null ? 'Simpan Update Modifikasimu ⚡' : 'Rilis Modifikasi Baru Sekarang 🚀'}
              </button>
              <button
                type="button"
                onClick={handleResetForm}
                className="bg-gray-200 border-2 border-black font-bold uppercase py-2.5 px-4 text-xs text-black rounded-lg hover:bg-gray-300"
              >
                Reset Form
              </button>
            </div>
          </form>

          {/* Table List of mods */}
          <div>
            <h3 className="font-syne font-extrabold text-sm uppercase mb-2 text-black">📋 Daftar Link Aktif</h3>
            <div className="overflow-x-auto border-3 border-black rounded-xl">
              <table className="w-full bg-white text-left text-[11px] border-collapse">
                <thead>
                  <tr class="bg-black text-white uppercase font-bold text-[9px] border-b-2 border-black">
                    <th className="p-2 border-r border-gray-700">Preview</th>
                    <th className="p-2 border-r border-gray-700">Nama Mod</th>
                    <th className="p-2 border-r border-gray-700">Kategori</th>
                    <th className="p-2 border-r border-gray-700">Stats</th>
                    <th className="p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black font-bold text-black">
                  {mods.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100 transition-colors">
                      <td className="p-2 border-r border-black w-12 text-center">
                        <img
                          src={item.image}
                          className="w-8 h-8 object-cover border-2 border-black rounded-md"
                          alt="Thumbnail"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23e5e7eb%22/%3E%3Ctext x=%2250%22 y=%2255%22 font-size=%2220%22 text-anchor=%22middle%22 fill=%22%236b7280%22%3EN/A%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </td>
                      <td className="p-2 border-r border-black max-w-[150px] truncate leading-tight">
                        <span className="block font-extrabold text-black">{item.name}</span>
                        {item.isDraft && <span className="bg-red-100 text-red-800 border border-red-300 text-[8px] px-1 rounded inline-block mt-0.5">DRAFT</span>}
                      </td>
                      <td className="p-2 border-r border-black">
                        <div className="flex flex-wrap gap-0.5">
                          {item.tag.split(',').map((t, i) => (
                            <span key={i} className="bg-gray-200 border border-black text-[8px] px-1 py-0.5 rounded font-extrabold">
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-2 border-r border-black text-[9px] text-gray-500 leading-normal">
                        👁️ {item.views || 0} • ❤️ {item.likes || 0} • 📥 {item.downloads || 0}
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleStartEdit(index)}
                            className="bg-blue-500 border border-black text-white hover:bg-blue-600 font-bold py-1 px-2 text-[9px] rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus ${item.name}?`)) {
                                onDeleteMod(index);
                                soundPlay('delete');
                              }
                            }}
                            className="bg-red-500 border border-black text-white hover:bg-red-600 font-bold py-1 px-2 text-[9px] rounded"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB BRANDING CONTENT */}
      {activeTab === 'branding' && (
        <div className="space-y-4">
          <form onSubmit={handleBrandSubmit} className="bg-white border-3 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000]">
            <h3 className="font-syne font-extrabold text-sm uppercase mb-3 text-[#2E8B6E]">🎨 Ubah Branding Utama Web</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block font-bold mb-0.5 text-[8px] uppercase">Nama Web Utama</label>
                <input
                  type="text"
                  value={brandTitle}
                  onChange={(e) => setBrandTitle(e.target.value)}
                  className="w-full border-2 border-black p-1.5 font-bold bg-white text-black rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold mb-0.5 text-[8px] uppercase">Slogan / Subtitle</label>
                <input
                  type="text"
                  value={brandSubtitle}
                  onChange={(e) => setBrandSubtitle(e.target.value)}
                  className="w-full border-2 border-black p-1.5 font-bold bg-white text-black rounded-lg focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold mb-0.5 text-[8px] uppercase text-[#2E8B6E]">🖼️ Link URL Foto Profil</label>
                <input
                  type="text"
                  value={brandLogo}
                  onChange={(e) => setBrandLogo(e.target.value)}
                  className="w-full border-2 border-black p-1.5 font-bold bg-white text-[10px] text-black rounded-lg focus:outline-none"
                />
              </div>
              <div className="md:col-span-2 p-2 bg-[#A3FFD6]/20 border-2 border-black rounded-lg text-black">
                <label className="block font-bold mb-0.5 text-[8px] uppercase">Posisi Foto Profil Header</label>
                <select
                  value={brandAlignment}
                  onChange={(e) => setBrandAlignment(e.target.value)}
                  className="w-full border border-black p-1.5 font-bold bg-white text-black text-[10px] rounded"
                >
                  <option value="items-start text-left">Rata Kiri</option>
                  <option value="items-center text-center">Rata Tengah</option>
                  <option value="items-end text-right">Rata Kanan</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="bg-[#2E8B6E] text-white font-extrabold uppercase py-2 px-4 border-2 border-black brutal-shadow-sm brutal-btn-sm text-[10px] rounded-lg"
            >
              Terapkan Perubahan Branding
            </button>
          </form>

          {/* Announcement and Safelink configuration */}
          <form onSubmit={handleSafelinkSubmit} className="bg-white border-3 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000]">
            <h3 className="font-syne font-extrabold text-sm uppercase mb-3 text-[#4CCD99]">📢 Pengumuman & Safelink</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block font-bold mb-0.5 text-[8px] uppercase">Teks Pengumuman (Gunakan pembatas | untuk beberapa baris)</label>
                <input
                  type="text"
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  className="w-full border-2 border-black p-1.5 font-bold bg-white text-[11px] text-black rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold mb-0.5 text-[8px] uppercase">Waktu Safelink (Detik)</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={safelinkTime}
                  onChange={(e) => setSafelinkTime(parseInt(e.target.value) || 5)}
                  className="w-full border-2 border-black p-1.5 font-bold bg-white text-[11px] text-black rounded-lg focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-[#4CCD99] text-black font-extrabold py-2 px-4 border-2 border-black brutal-shadow-sm brutal-btn-sm text-[10px] uppercase rounded-lg"
            >
              Simpan Konfigurasi Safelink & Broadcast 💾
            </button>
          </form>

          {/* Banner & Background image customization */}
          <div className="bg-white border-3 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000] space-y-3.5">
            <h3 className="font-syne font-extrabold text-sm uppercase text-[#2E8B6E]">🎑 Pengaturan Gambar Banner & Background</h3>
            <div>
              <label className="block font-bold mb-0.5 text-[8px] uppercase text-[#2E8B6E]">URL Gambar Banner (16:9)</label>
              <input
                type="text"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://i.ibb.co/..."
                className="w-full border-2 border-black p-1.5 font-bold bg-white text-[10px] rounded-lg text-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold mb-0.5 text-[8px] uppercase text-[#2E8B6E]">URL Gambar Background Web</label>
              <input
                type="text"
                value={bgUrl}
                onChange={(e) => setBgUrl(e.target.value)}
                placeholder="https://i.ibb.co/..."
                className="w-full border-2 border-black p-1.5 font-bold bg-white text-[10px] rounded-lg text-black focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-1.5">
              <button
                onClick={() => {
                  onSaveBanner(bannerUrl);
                  soundPlay('success');
                }}
                className="bg-[#4CCD99] text-black font-bold uppercase py-1.5 px-3 border-2 border-black brutal-shadow-sm brutal-btn-sm text-[9px] rounded-lg"
              >
                Simpan Banner
              </button>
              <button
                onClick={() => {
                  onSaveBackground(bgUrl);
                  soundPlay('success');
                }}
                className="bg-[#2E8B6E] text-white font-bold uppercase py-1.5 px-3 border-2 border-black brutal-shadow-sm brutal-btn-sm text-[9px] rounded-lg"
              >
                Simpan Background
              </button>
              <button
                onClick={() => {
                  onResetBackground();
                  setBgUrl('');
                  soundPlay('delete');
                }}
                className="bg-gray-200 text-black font-bold uppercase py-1.5 px-3 border-2 border-black text-[9px] rounded-lg hover:bg-gray-300"
              >
                Reset Default Tema
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB SOCIAL CONTENT */}
      {activeTab === 'social' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Social credits manager */}
          <div className="bg-white border-3 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000]">
            <h3 className="font-syne font-extrabold text-sm uppercase mb-3 text-[#4CCD99]">🔗 Kelola Kredit Sosial Media Footer</h3>
            <form onSubmit={handleCreditSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-0.5 text-[8px] uppercase text-gray-500">Platform</label>
                  <input
                    type="text"
                    value={credPlatform}
                    onChange={(e) => setCredPlatform(e.target.value)}
                    placeholder="Contoh: TikTok"
                    className="w-full border-2 border-black p-1.5 font-bold bg-white text-black text-[10px] rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-0.5 text-[8px] uppercase text-gray-500">Handle / Username</label>
                  <input
                    type="text"
                    value={credHandle}
                    onChange={(e) => setCredHandle(e.target.value)}
                    placeholder="Contoh: @axeluf"
                    className="w-full border-2 border-black p-1.5 font-bold bg-white text-black text-[10px] rounded"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-0.5 text-[8px] uppercase text-gray-500">URL Link Sosmed</label>
                <input
                  type="text"
                  value={credUrl}
                  onChange={(e) => setCredUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full border-2 border-black p-1.5 font-bold bg-white text-black text-[10px] rounded focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-0.5 text-[8px] uppercase text-gray-500">Warna Tombol</label>
                <select
                  value={credColor}
                  onChange={(e) => setCredColor(e.target.value)}
                  className="w-full border border-black p-1.5 font-bold bg-white text-black text-[10px] rounded"
                >
                  <option value="#4CCD99">Hijau Brutalist (#4CCD99)</option>
                  <option value="#2E8B6E">Hijau Gelap (#2E8B6E)</option>
                  <option value="#A3FFD6">Hijau Muda (#A3FFD6)</option>
                  <option value="#FF71CD">Pink Cyberpunk (#FF71CD)</option>
                  <option value="#000000">Hitam Solid (#000000)</option>
                  <option value="#FFFFFF">Putih (#FFFFFF)</option>
                  <option value="#FFF200">Kuning Brutalist (#FFF200)</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-[#4CCD99] text-black font-extrabold uppercase py-2 px-4 border-2 border-black brutal-shadow-sm brutal-btn-sm text-[10px] rounded-lg"
              >
                Tambah Kredit Sosmed ➕
              </button>
            </form>

            <div className="mt-4 border-t-2 border-black pt-3">
              <h4 className="font-bold text-[10px] uppercase mb-2 text-gray-500">Daftar Kredit Aktif:</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {credits.map((c, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border-2 border-black bg-white rounded-lg text-[10px]">
                    <span className="font-bold uppercase text-black">
                      {c.platform} → <span className="text-[#2E8B6E] font-extrabold">{c.handle}</span>
                    </span>
                    <button
                      onClick={() => onDeleteCredit(index)}
                      className="bg-red-500 text-white font-bold text-[9px] px-2 py-0.5 border border-black rounded hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preset Buttons creator */}
          <div className="bg-white border-3 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000]">
            <h3 className="font-syne font-extrabold text-sm uppercase mb-3 text-[#2E8B6E]">📋 Setup Preset Tombol Cepat</h3>
            <form onSubmit={handlePresetSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-0.5 text-[8px] uppercase text-gray-500">Label Preset</label>
                  <input
                    type="text"
                    value={presetLabel}
                    onChange={(e) => setPresetLabel(e.target.value)}
                    placeholder="Contoh: Gabung Grup"
                    className="w-full border-2 border-black p-1.5 font-bold bg-white text-black text-[10px] rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-0.5 text-[8px] uppercase text-gray-500">Pilih Icon Preset</label>
                  <select
                    value={presetIcon}
                    onChange={(e) => setPresetIcon(e.target.value)}
                    className="w-full border-2 border-black p-1.5 font-bold bg-white text-black text-[10px] rounded"
                  >
                    <option value="video">🎥 Video Tutorial</option>
                    <option value="download">📥 File Download</option>
                    <option value="chat">💬 Komunitas / Obrolan</option>
                    <option value="key">🔑 Token / Password</option>
                    <option value="globe">🌐 Web Luar</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold mb-0.5 text-[8px] uppercase text-gray-500">URL Tujuan Default</label>
                <input
                  type="text"
                  value={presetUrl}
                  onChange={(e) => setPresetUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full border-2 border-black p-1.5 font-bold bg-white text-black text-[10px] rounded focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-[#2E8B6E] text-white font-extrabold uppercase py-2 px-4 border-2 border-black brutal-shadow-sm brutal-btn-sm text-[10px] rounded-lg"
              >
                Simpan Preset Cepat 💾
              </button>
            </form>

            <div className="mt-4 border-t-2 border-black pt-3">
              <h4 className="font-bold text-[10px] uppercase mb-2 text-gray-500">Preset Aktif Form:</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {presets.map((p, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border-2 border-black bg-white rounded-lg text-[10px]">
                    <span className="font-bold uppercase text-black flex items-center gap-1">
                      <span>{p.iconType === 'video' ? '🎥' : p.iconType === 'download' ? '📥' : '💬'}</span>
                      <span>{p.label}</span>
                    </span>
                    <button
                      onClick={() => onDeletePreset(index)}
                      className="bg-red-500 text-white font-bold text-[9px] px-2 py-0.5 border border-black rounded hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB BULK EDIT & SCAN */}
      {activeTab === 'bulk' && (
        <div className="space-y-6">
          {/* Data Backup/Restore file managers */}
          <div className="bg-white border-3 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000] text-black">
            <h3 className="font-syne font-extrabold text-sm uppercase mb-3 text-[#2E8B6E]">📦 Ekspor & Impor Database Portal (CSV & JSON)</h3>
            <p className="text-[10px] text-gray-500 mb-4 leading-normal">
              Lakukan pencadangan data modifikasi secara offline dalam format JSON atau CSV. Anda juga bisa mengunggah file untuk melakukan migrasi cepat!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Backup / Export block */}
              <div className="p-3 border-2 border-dashed border-black bg-[#A3FFD6]/10 rounded-xl space-y-2">
                <span className="font-extrabold block text-[#2E8B6E] text-[10px] uppercase">Backup Data (Ekspor)</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleBackupJSON}
                    className="flex-1 bg-black text-white font-bold py-2 px-3 border border-black rounded-lg hover:bg-zinc-800 text-[10px] uppercase"
                  >
                    Ekspor JSON 💾
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="flex-1 bg-white text-black font-extrabold py-2 px-3 border-2 border-black rounded-lg hover:bg-gray-100 text-[10px] uppercase"
                  >
                    Ekspor CSV 📊
                  </button>
                </div>
              </div>

              {/* Restore / Import block */}
              <div className="p-3 border-2 border-dashed border-black bg-zinc-50 rounded-xl space-y-2">
                <span className="font-extrabold block text-gray-700 text-[10px] uppercase">Restore Data (Impor)</span>
                <div className="grid grid-cols-2 gap-2 text-[9px]">
                  <div>
                    <label className="block font-bold text-gray-400 uppercase text-[7px] mb-1">Upload JSON</label>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleRestoreJSON}
                      className="w-full border border-black bg-white rounded p-0.5 text-[8px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-400 uppercase text-[7px] mb-1">Upload CSV</label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleImportCSV}
                      className="w-full border border-black bg-white rounded p-0.5 text-[8px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Automatic scanners */}
          <div className="bg-white border-3 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000] text-black">
            <h3 className="font-syne font-extrabold text-sm uppercase mb-3 text-red-600">🛡️ Pemindai Link Duplikat & Broken Link Detector</h3>
            <p className="text-[10px] text-gray-500 mb-4 leading-normal">
              Menjaga kualitas portal dengan mendeteksi entri ganda atau tautan download yang rusak/mati.
            </p>

            <div className="flex gap-2.5 mb-4">
              <button
                onClick={() => {
                  soundPlay('click');
                  setShowDuplicates(!showDuplicates);
                  setShowBroken(false);
                }}
                className={`flex-1 border-2 border-black py-2 px-3 rounded-lg text-[10px] font-extrabold uppercase ${
                  showDuplicates ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {showDuplicates ? 'Sembunyikan Hasil Scan' : 'Deteksi Duplikat 👥'}
              </button>
              <button
                onClick={() => {
                  soundPlay('click');
                  setShowBroken(!showBroken);
                  setShowDuplicates(false);
                }}
                className={`flex-1 border-2 border-black py-2 px-3 rounded-lg text-[10px] font-extrabold uppercase ${
                  showBroken ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {showBroken ? 'Sembunyikan Hasil Scan' : 'Broken Link Detector ⚠️'}
              </button>
            </div>

            {showDuplicates && (
              <div className="p-3 border-2 border-black bg-[#FFF200]/10 rounded-xl space-y-2">
                <span className="font-extrabold block text-sm border-b border-black pb-1 uppercase">Duplikat Terdeteksi</span>
                {getDuplicateMods().length === 0 ? (
                  <p className="italic text-[10px] text-gray-500">MANTAP! Tidak ditemukan data mod dengan nama yang sama.</p>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {getDuplicateMods().map((dup, i) => (
                      <div key={i} className="flex justify-between items-center p-1.5 bg-white border rounded text-[10px]">
                        <span>⚠️ Mod ID {dup.idx}: <strong>{dup.name}</strong></span>
                        <button
                          onClick={() => {
                            onDeleteMod(dup.idx);
                            soundPlay('delete');
                          }}
                          className="bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {showBroken && (
              <div className="p-3 border-2 border-black bg-red-50 rounded-xl space-y-2">
                <span className="font-extrabold block text-sm border-b border-black pb-1 uppercase text-red-600">Broken Link Scanner (Tautan Rusak / Terlapor)</span>
                {getBrokenMods().length === 0 ? (
                  <p className="italic text-[10px] text-gray-500">BERSIH! Semua link aktif dan tidak ada laporan kerusakan link.</p>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {getBrokenMods().map((br, i) => (
                      <div key={i} className="flex justify-between items-center p-1.5 bg-white border rounded text-[10px] gap-2">
                        <div className="truncate">
                          <span className="font-extrabold text-red-600">⚠️ ID {br.idx} • {br.name}</span>
                          <p className="text-[8px] text-gray-400 truncate">{br.url}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => handleStartEdit(br.idx)}
                            className="bg-blue-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              onDeleteMod(br.idx);
                              soundPlay('delete');
                            }}
                            className="bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bulk execution operations */}
          <div className="bg-white border-3 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000] text-black space-y-4">
            <h3 className="font-syne font-extrabold text-sm uppercase mb-3 text-black">⚙️ Bulk Actions & Seleksi Massal</h3>
            <p className="text-[10px] text-gray-500 leading-normal">
              Pilih beberapa modifikasi di bawah ini untuk menghapus, mengubah kategori, atau mengatur draf secara massal demi efisiensi kerja.
            </p>

            {/* Selection Options */}
            <div className="flex flex-wrap gap-2 p-2 bg-[#A3FFD6]/10 border-2 border-black rounded-xl justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={toggleSelectAllMods}
                  className="bg-white border border-black font-bold px-2 py-1 text-[9px] rounded uppercase hover:bg-gray-100"
                >
                  {selectedModIndices.length === mods.length ? 'Batal Semua' : 'Pilih Semua'}
                </button>
                <span className="font-extrabold text-[10px] block mt-1">{selectedModIndices.length} mod dipilih</span>
              </div>

              {selectedModIndices.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  <input
                    type="text"
                    value={bulkTagInput}
                    onChange={(e) => setBulkTagInput(e.target.value)}
                    placeholder="Tag Baru (e.g. GAME)"
                    className="p-1 text-[9px] border border-black font-bold rounded bg-white text-black"
                  />
                  <button
                    onClick={handleBulkTagSubmit}
                    className="bg-[#2E8B6E] text-white font-bold px-2 py-1 text-[9px] border border-black rounded"
                  >
                    Bulk Tambah Tag
                  </button>
                  <button
                    onClick={() => handleBulkDraftToggle(true)}
                    className="bg-[#FFF200] text-black font-bold px-2 py-1 text-[9px] border border-black rounded"
                  >
                    Bulk Set Draft
                  </button>
                  <button
                    onClick={() => handleBulkDraftToggle(false)}
                    className="bg-emerald-500 text-white font-bold px-2 py-1 text-[9px] border border-black rounded"
                  >
                    Bulk Set Publik
                  </button>
                  <button
                    onClick={handleBulkDeleteSubmit}
                    className="bg-red-500 text-white font-bold px-2 py-1 text-[9px] border border-black rounded"
                  >
                    Bulk Hapus 🗑️
                  </button>
                </div>
              )}
            </div>

            {/* Checkable Table List of mods */}
            <div className="max-h-60 overflow-y-auto border-2 border-black rounded-lg">
              <table className="w-full bg-white text-left text-[10px] border-collapse">
                <thead>
                  <tr class="bg-gray-200 uppercase font-bold text-[8px] border-b border-black">
                    <th className="p-1.5 border-r border-black w-10 text-center">Pilih</th>
                    <th className="p-1.5 border-r border-black">Nama Mod</th>
                    <th className="p-1.5 border-r border-black">Kategori</th>
                    <th className="p-1.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black text-black">
                  {mods.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="p-1.5 border-r border-black text-center">
                        <input
                          type="checkbox"
                          checked={selectedModIndices.includes(index)}
                          onChange={() => handleToggleSelectMod(index)}
                          className="scale-110"
                        />
                      </td>
                      <td className="p-1.5 border-r border-black font-bold leading-tight">{item.name}</td>
                      <td className="p-1.5 border-r border-black truncate max-w-[100px]">{item.tag}</td>
                      <td className="p-1.5 font-bold">
                        {item.isDraft ? (
                          <span className="text-red-500">Draft</span>
                        ) : (
                          <span className="text-[#2E8B6E]">Publik</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB ANALYTICS */}
      {activeTab === 'analytics' && (
        <DashboardAnalytics mods={mods} visitorData={visitorData} />
      )}

      {/* TAB SQL SETUP */}
      {activeTab === 'sql' && (
        <div className="space-y-4">
          <div className="bg-white border-3 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000] text-black">
            <h3 className="font-syne font-extrabold text-sm uppercase mb-1.5 text-blue-700">⚙️ SQL Setup Injector untuk Database Baru</h3>
            <p className="text-[10px] text-gray-500 mb-3 leading-normal">
              Salin seluruh query SQL di bawah ini, buka dasbor Supabase Anda, masuk ke menu <strong>SQL Editor</strong>, buat query baru, tempel, lalu klik <strong>Run</strong>.
            </p>

            <div className="relative bg-zinc-900 border-2 border-black p-3 rounded-lg text-white font-mono text-[9px] max-h-56 overflow-y-auto whitespace-pre-wrap select-all mb-3">
{`-- 1. Buat Tabel settings jika belum ada
CREATE TABLE IF NOT EXISTS public.settings (
    key text PRIMARY KEY,
    value jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 3. Izinkan semua orang membaca data settings (Public Read)
CREATE POLICY "Allow public read access" 
ON public.settings 
FOR SELECT 
USING (true);

-- 4. Izinkan semua orang melakukan insert/update/delete (Supabase API Key)
CREATE POLICY "Allow write access for anyone with API key" 
ON public.settings 
FOR ALL 
USING (true) 
WITH CHECK (true);`}
            </div>

            <button
              onClick={() => {
                soundPlay('success');
                navigator.clipboard.writeText(
`CREATE TABLE IF NOT EXISTS public.settings (
    key text PRIMARY KEY,
    value jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Allow write access for anyone with API key" ON public.settings FOR ALL USING (true) WITH CHECK (true);`
                );
                alert("Query SQL berhasil disalin ke clipboard!");
              }}
              className="bg-[#4CCD99] text-black font-extrabold uppercase py-2 px-4 border-2 border-black brutal-shadow-sm brutal-btn-sm text-[10px] rounded-lg"
            >
              Salin Skrip SQL 📋
            </button>
          </div>
        </div>
      )}

      {/* TAB FAQ MANAGEMENT */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="bg-white border-3 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000] text-black">
            <h3 className="font-syne font-extrabold text-sm uppercase mb-3 text-[#2E8B6E]">
              {editingFaqIndex !== null ? '📝 Edit Pertanyaan FAQ' : '➕ Tambah FAQ Baru'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block font-bold mb-1 text-[9px] uppercase text-gray-700">Pertanyaan (Question)</label>
                <input
                  type="text"
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="e.g. Bagaimana cara memasang Mod?"
                  className="w-full border-2 border-black p-2 font-bold bg-white rounded-lg focus:outline-none text-[11px]"
                />
              </div>
              <div>
                <label className="block font-bold mb-1 text-[9px] uppercase text-gray-700">Jawaban (Answer)</label>
                <textarea
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  placeholder="e.g. Unduh file apk, lalu pasang seperti biasa..."
                  rows={3}
                  className="w-full border-2 border-black p-2 font-bold bg-white rounded-lg focus:outline-none text-[11px]"
                />
              </div>
              <div>
                <label className="block font-bold mb-1 text-[9px] uppercase text-gray-700">Kategori / Topik</label>
                <input
                  type="text"
                  value={faqCategory}
                  onChange={(e) => setFaqCategory(e.target.value)}
                  placeholder="e.g. MASALAH, PASANG, UMUM"
                  className="w-full border-2 border-black p-2 font-bold bg-white rounded-lg focus:outline-none text-[11px]"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!faqQuestion.trim() || !faqAnswer.trim()) return;
                    const newFaqItem = {
                      question: faqQuestion,
                      answer: faqAnswer,
                      category: faqCategory || 'UMUM'
                    };
                    let updatedFaqs = [...faqs];
                    if (editingFaqIndex !== null) {
                      updatedFaqs[editingFaqIndex] = newFaqItem;
                      setEditingFaqIndex(null);
                    } else {
                      updatedFaqs.push(newFaqItem);
                    }
                    onSaveFaqs(updatedFaqs);
                    setFaqQuestion('');
                    setFaqAnswer('');
                    setFaqCategory('');
                    soundPlay('success');
                  }}
                  className="bg-[#2E8B6E] text-white font-extrabold py-2 px-4 border-2 border-black rounded-lg hover:bg-[#20634e] active:translate-y-0.5 shadow-sm text-[10px] uppercase"
                >
                  {editingFaqIndex !== null ? 'Simpan Perubahan' : 'Tambah FAQ'}
                </button>
                {editingFaqIndex !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingFaqIndex(null);
                      setFaqQuestion('');
                      setFaqAnswer('');
                      setFaqCategory('');
                      soundPlay('click');
                    }}
                    className="bg-gray-500 text-white font-extrabold py-2 px-4 border-2 border-black rounded-lg hover:bg-gray-600 active:translate-y-0.5 shadow-sm text-[10px] uppercase"
                  >
                    Batal
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border-3 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000] text-black">
            <h3 className="font-syne font-extrabold text-sm uppercase mb-3 text-black">📋 Daftar FAQ Saat Ini ({faqs.length})</h3>
            {faqs.length === 0 ? (
              <p className="text-[10px] text-gray-500">Belum ada FAQ.</p>
            ) : (
              <div className="space-y-3.5 divide-y divide-black max-h-96 overflow-y-auto pr-1">
                {faqs.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex flex-col justify-between gap-2">
                    <div>
                      <span className="bg-[#A3FFD6] text-black text-[8px] font-bold px-1.5 py-0.5 border border-black rounded uppercase">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-[11px] mt-1.5 text-black">Q: {item.question}</h4>
                      <p className="text-[10px] text-gray-600 mt-1">A: {item.answer}</p>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setEditingFaqIndex(idx);
                          setFaqQuestion(item.question);
                          setFaqAnswer(item.answer);
                          setFaqCategory(item.category);
                          soundPlay('click');
                        }}
                        className="bg-yellow-400 text-black border border-black font-extrabold px-2 py-1 text-[9px] rounded uppercase hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Hapus FAQ ini?')) {
                            const updated = faqs.filter((_, i) => i !== idx);
                            onSaveFaqs(updated);
                            soundPlay('delete');
                          }
                        }}
                        className="bg-red-500 text-white border border-black font-extrabold px-2 py-1 text-[9px] rounded uppercase hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB POLLING MANAGEMENT */}
      {activeTab === 'polling' && (
        <div className="space-y-4 text-black">
          <div className="bg-white border-3 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000]">
            <h3 className="font-syne font-extrabold text-sm uppercase mb-3 text-[#2E8B6E]">📊 EDIT POLLING KOMUNITAS</h3>
            
            <div className="space-y-3 text-[11px]">
              <div>
                <label className="block font-bold mb-1 text-[9px] uppercase text-gray-700">Pertanyaan Polling</label>
                <input
                  type="text"
                  value={pollQuestionInput}
                  onChange={(e) => setPollQuestionInput(e.target.value)}
                  className="w-full border-2 border-black p-2 font-bold bg-white rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-[9px] uppercase text-gray-700">Pilihan Polling (Options) & Suara (Votes)</label>
                <div className="space-y-2.5">
                  {pollOptionsList.map((opt, idx) => (
                    <div key={opt.id} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...pollOptionsList];
                          updated[idx] = { ...opt, text: e.target.value };
                          setPollOptionsList(updated);
                        }}
                        placeholder="Pilihan teks..."
                        className="flex-1 border-2 border-black p-2 font-bold bg-white rounded-lg focus:outline-none"
                      />
                      <input
                        type="number"
                        value={opt.votes}
                        onChange={(e) => {
                          const updated = [...pollOptionsList];
                          updated[idx] = { ...opt, votes: parseInt(e.target.value) || 0 };
                          setPollOptionsList(updated);
                        }}
                        className="w-24 border-2 border-black p-2 font-bold bg-white rounded-lg focus:outline-none"
                        placeholder="Votes"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = pollOptionsList.filter(o => o.id !== opt.id);
                          setPollOptionsList(updated);
                          soundPlay('delete');
                        }}
                        className="bg-red-500 text-white border-2 border-black w-9 h-9 flex items-center justify-center font-bold text-sm rounded-lg hover:bg-red-600 shrink-0"
                        title="Hapus opsi"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextId = `opt-${Date.now()}`;
                    setPollOptionsList([...pollOptionsList, { id: nextId, text: '', votes: 0 }]);
                    soundPlay('click');
                  }}
                  className="bg-white border-2 border-black font-bold px-3 py-1.5 text-[9px] rounded-lg uppercase hover:bg-gray-100 shadow-sm"
                >
                  ➕ Tambah Opsi Baru
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Atur ulang seluruh suara voting pilihan menjadi 0?')) {
                      const updated = pollOptionsList.map(o => ({ ...o, votes: 0 }));
                      setPollOptionsList(updated);
                      soundPlay('delete');
                    }
                  }}
                  className="bg-orange-500 text-white border-2 border-black font-bold px-3 py-1.5 text-[9px] rounded-lg uppercase hover:bg-orange-600 shadow-sm"
                >
                  🔄 Reset Semua Suara
                </button>
              </div>

              <div className="border-t-2 border-dashed border-black pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!pollQuestionInput.trim()) return;
                    const total = pollOptionsList.reduce((acc, curr) => acc + curr.votes, 0);
                    const updatedPoll: PollingTopic = {
                      id: polling.id || 'poll-v1',
                      question: pollQuestionInput,
                      options: pollOptionsList,
                      totalVotes: total
                    };
                    onSavePolling(updatedPoll);
                    soundPlay('success');
                  }}
                  className="w-full bg-[#4CCD99] text-black font-extrabold uppercase py-2.5 border-2 border-black rounded-xl text-xs shadow-sm active:translate-y-0.5"
                >
                  Simpan Perubahan Polling ⚡
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB REQUESTS MANAGEMENT */}
      {activeTab === 'requests' && (
        <div className="space-y-4 text-black">
          {editingRequestId && (
            <div className="bg-white border-3 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000]">
              <h3 className="font-syne font-extrabold text-sm uppercase mb-3 text-[#2E8B6E]">📝 EDIT PERMINTAAN MOD</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <label className="block font-bold mb-0.5 uppercase text-gray-700 text-[8px]">Nama Game / Aplikasi</label>
                  <input
                    type="text"
                    value={reqEditName}
                    onChange={(e) => setReqEditName(e.target.value)}
                    className="w-full border-2 border-black p-2 font-bold bg-white rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-0.5 uppercase text-gray-700 text-[8px]">Kategori</label>
                  <input
                    type="text"
                    value={reqEditCategory}
                    onChange={(e) => setReqEditCategory(e.target.value)}
                    className="w-full border-2 border-black p-2 font-bold bg-white rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-0.5 uppercase text-gray-700 text-[8px]">Status</label>
                  <select
                    value={reqEditStatus}
                    onChange={(e) => setReqEditStatus(e.target.value as any)}
                    className="w-full border-2 border-black p-2 font-bold bg-white rounded-lg focus:outline-none"
                  >
                    <option value="pending">PENDING (Menunggu)</option>
                    <option value="approved">APPROVED (Selesai/Dibuat)</option>
                    <option value="rejected">REJECTED (Ditolak)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-0.5 uppercase text-gray-700 text-[8px]">Suara / Votes</label>
                  <input
                    type="number"
                    value={reqEditVotes}
                    onChange={(e) => setReqEditVotes(parseInt(e.target.value) || 0)}
                    className="w-full border-2 border-black p-2 font-bold bg-white rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (!reqEditName.trim()) return;
                    const matched = requests.find(r => r.id === editingRequestId);
                    if (matched) {
                      onSaveRequest({
                        ...matched,
                        name: reqEditName,
                        category: reqEditCategory || 'UMUM',
                        status: reqEditStatus,
                        votes: reqEditVotes
                      });
                    }
                    setEditingRequestId(null);
                  }}
                  className="bg-[#2E8B6E] text-white font-bold py-2 px-4 border-2 border-black rounded-lg text-[10px] uppercase hover:bg-[#20634e]"
                >
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingRequestId(null); soundPlay('click'); }}
                  className="bg-gray-500 text-white font-bold py-2 px-4 border-2 border-black rounded-lg text-[10px] uppercase hover:bg-gray-600"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          <div className="bg-white border-3 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000]">
            <h3 className="font-syne font-extrabold text-sm uppercase mb-3 text-black">📋 Daftar Request Mod Komunitas ({requests.length})</h3>
            {requests.length === 0 ? (
              <p className="text-[10px] text-gray-500">Belum ada request mod.</p>
            ) : (
              <div className="max-h-96 overflow-y-auto border-2 border-black rounded-lg">
                <table className="w-full bg-white text-left text-[10px] border-collapse">
                  <thead>
                    <tr className="bg-gray-200 uppercase font-bold text-[8px] border-b border-black">
                      <th className="p-2 border-r border-black">Nama Aplikasi</th>
                      <th className="p-2 border-r border-black">Kategori</th>
                      <th className="p-2 border-r border-black">Status</th>
                      <th className="p-2 border-r border-black text-center">Votes</th>
                      <th className="p-2 text-center">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black">
                    {requests.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-2 border-r border-black font-bold">{item.name}</td>
                        <td className="p-2 border-r border-black uppercase text-[9px]">{item.category}</td>
                        <td className="p-2 border-r border-black">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border border-black ${
                            item.status === 'approved' ? 'bg-[#4CCD99] text-black' :
                            item.status === 'rejected' ? 'bg-red-400 text-white' : 'bg-yellow-200 text-black'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-2 border-r border-black text-center font-extrabold">{item.votes}</td>
                        <td className="p-2 text-center space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setEditingRequestId(item.id);
                              setReqEditName(item.name);
                              setReqEditCategory(item.category);
                              setReqEditStatus(item.status);
                              setReqEditVotes(item.votes);
                              soundPlay('click');
                            }}
                            className="bg-yellow-400 text-black border border-black px-1.5 py-0.5 text-[8px] font-bold rounded uppercase hover:bg-yellow-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus request mod "${item.name}"?`)) {
                                onDeleteRequest(item.id);
                              }
                            }}
                            className="bg-red-500 text-white border border-black px-1.5 py-0.5 text-[8px] font-bold rounded uppercase hover:bg-red-600"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
