/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ModItem } from '../types';
import { Shield, Award, Flame, Star, Key, Download, Link, Eye, Heart, MessageSquare, History, QrCode, AlertTriangle, Send, Video } from 'lucide-react';

const isVideoUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  const lowercase = url.toLowerCase();
  return (
    lowercase.endsWith('.mp4') ||
    lowercase.endsWith('.webm') ||
    lowercase.endsWith('.ogg') ||
    lowercase.endsWith('.mov') ||
    lowercase.includes('.mp4?') ||
    lowercase.includes('.webm?') ||
    lowercase.includes('/video/') ||
    (lowercase.includes('imagekit.io') && lowercase.includes('.mp4'))
  );
};

interface ModCardProps {
  mod: ModItem;
  cardIndex: number;
  onLike: (index: number) => void;
  onAddComment: (index: number, name: string, text: string) => void;
  onRate: (index: number, score: number) => void;
  onReportBroken: (index: number) => void;
  onSelectCategory: (tag: string) => void;
  isFavorited: boolean;
  onToggleFavorite: (index: number) => void;
  triggerSafelink: (index: number, url: string, isDownload: boolean) => void;
  soundPlay: (type: 'click' | 'success' | 'delete') => void;
  isStandaloneView?: boolean;
}

export default function ModCard({
  mod,
  cardIndex,
  onLike,
  onAddComment,
  onRate,
  onReportBroken,
  onSelectCategory,
  isFavorited,
  onToggleFavorite,
  triggerSafelink,
  soundPlay,
  isStandaloneView = false
}: ModCardProps) {
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [selectedMirror, setSelectedMirror] = useState<string>('primary');

  // Decode helper
  const decodeSafe = (str: string | undefined): string => {
    if (!str) return 'Tanpa Password / Langsung Ekstrak';
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch {
      return str;
    }
  };

  const decryptedUrl = decodeSafe(mod.url);
  const decryptedPassword = decodeSafe(mod.password);

  // Copy helpers
  const [copiedPassword, setCopiedPassword] = useState(false);
  const handleCopyPassword = () => {
    soundPlay('success');
    navigator.clipboard.writeText(decryptedPassword);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  const [copiedLink, setCopiedLink] = useState(false);
  const handleCopyLink = () => {
    soundPlay('success');
    const fullLink = `${window.location.origin}/?modId=${cardIndex}`;
    navigator.clipboard.writeText(fullLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Submit Rating
  const handleRatingSubmit = (score: number) => {
    soundPlay('success');
    setUserRating(score);
    onRate(cardIndex, score);
  };

  // Comments submit
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;
    onAddComment(cardIndex, commentName, commentText);
    setCommentText('');
  };

  // Sharing Links
  const shareText = `Download ${mod.name} Mod Premium di AXELUF! Full Cleaner & Anti-Banned: `;
  const shareUrl = `${window.location.origin}/?modId=${cardIndex}`;
  const whatsappShare = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + shareUrl)}`;
  const telegramShare = `https://telegram.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  // Determine active mirror link
  const getActiveDownloadUrl = () => {
    if (selectedMirror === 'primary') return decryptedUrl;
    const mir = mod.mirrors?.find(m => m.name === selectedMirror);
    return mir ? mir.url : decryptedUrl;
  };

  // Helper to extract YouTube video ID for clean iframe embed
  const getYouTubeEmbedUrl = (urlStr: string): string | null => {
    try {
      if (!urlStr) return null;
      let videoId = '';
      if (urlStr.includes('youtu.be/')) {
        videoId = urlStr.split('youtu.be/')[1].split('?')[0].split('&')[0];
      } else if (urlStr.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(urlStr.split('?')[1]);
        videoId = urlParams.get('v') || '';
      } else if (urlStr.includes('youtube.com/embed/')) {
        videoId = urlStr.split('youtube.com/embed/')[1].split('?')[0].split('&')[0];
      }
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (e) {
      console.warn("Gagal mengekstrak ID YouTube:", e);
    }
    return null;
  };

  return (
    <div className="bg-white text-black border-3 border-black brutal-shadow overflow-hidden flex flex-col transition-all">
      {/* OS Toolbar Frame */}
      <div className="bg-black text-white px-3 py-2 flex items-center justify-between brutal-border-b font-mono text-[9px] select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B] border-2 border-black inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#A3FFD6] border-2 border-black inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#4CCD99] border-2 border-black inline-block"></span>
        </div>
        <div 
          onClick={() => {
            soundPlay('click');
            window.open(`${window.location.origin}/?modId=${mod.id || cardIndex}`, '_blank');
          }}
          className="bg-zinc-900 border border-zinc-700 hover:border-zinc-400 rounded-full px-3 py-0.5 text-[9px] text-[#A3FFD6] font-extrabold truncate max-w-[120px] sm:max-w-xs cursor-pointer transition-all"
          title="Buka Halaman Tunggal Mod Ini"
        >
          axeluf.co/mod-{mod.id || cardIndex} ↗
        </div>
        <button
          onClick={() => {
            soundPlay('click');
            onToggleFavorite(cardIndex);
          }}
          className={`font-extrabold text-xs transition-transform hover:scale-125 px-1 py-0.5 rounded ${
            isFavorited ? 'text-yellow-400' : 'text-zinc-500'
          }`}
          title={isFavorited ? 'Hapus Bookmark' : 'Simpan ke Bookmark'}
        >
          {isFavorited ? '★ FAVORITE' : '☆ SAVE'}
        </button>
      </div>

      <div className="p-4 flex flex-col md:flex-row gap-5 items-stretch">
        {/* Left Side: Thumbnail Panel */}
        <div className="w-full md:w-48 shrink-0 flex flex-col gap-2.5">
          <div className="brutal-border bg-zinc-100 overflow-hidden rounded-xl flex items-center justify-center relative aspect-video md:aspect-square">
            {isVideoUrl(mod.image) ? (
              <video
                src={mod.image}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover select-none"
              />
            ) : (
              <img
                src={mod.image || 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&q=80&w=800'}
                alt={mod.name}
                className={`w-full h-full object-cover transition-transform duration-200 hover:scale-[1.03]`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect width=%22400%22 height=%22400%22 fill=%22%23e5e7eb%22/%3E%3Ctext x=%22200%22 y=%22200%22 font-size=%2224%22 text-anchor=%22middle%22 fill=%22%236b7280%22%3EAPK%3C/text%3E%3C/svg%3E';
                }}
              />
            )}
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
              {mod.verified && (
                <span className="bg-emerald-500 text-black border-2 border-black font-extrabold text-[8px] uppercase px-1.5 py-0.5 rounded-full brutal-shadow-sm flex items-center gap-0.5">
                  <Shield className="w-2.5 h-2.5 text-black" />
                  <span>VERIFIED</span>
                </span>
              )}
              {mod.premium && (
                <span className="bg-[#FFF200] text-black border-2 border-black font-extrabold text-[8px] uppercase px-1.5 py-0.5 rounded-full brutal-shadow-sm flex items-center gap-0.5">
                  <Award className="w-2.5 h-2.5 text-black" />
                  <span>PREMIUM</span>
                </span>
              )}
              {mod.exclusive && (
                <span className="bg-[#FF71CD] text-black border-2 border-black font-extrabold text-[8px] uppercase px-1.5 py-0.5 rounded-full brutal-shadow-sm flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5 text-black" />
                  <span>EXCLUSIVE</span>
                </span>
              )}
            </div>

            {/* Mod Icon (Di depan banner nya) */}
            {mod.iconUrl && (
              <div className="absolute bottom-2 left-2 w-12 h-12 border-2 border-black bg-white rounded-xl shadow-[2px_2px_0px_0px_#000000] overflow-hidden z-20 flex items-center justify-center animate-fade-in">
                {isVideoUrl(mod.iconUrl) ? (
                  <video
                    src={mod.iconUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src={mod.iconUrl} 
                    alt={`${mod.name} Icon`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.style.display = 'none';
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Quick Rating Stars */}
          <div className="bg-zinc-50 border-2 border-black p-2 rounded-xl text-center">
            <span className="text-[9px] font-bold text-gray-500 uppercase block mb-1">Rating Modifikasi</span>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingSubmit(star)}
                  className={`text-sm transition-transform hover:scale-125 ${
                    star <= (userRating || mod.rating || 5) ? 'text-yellow-400 font-extrabold' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <span className="text-[8px] font-extrabold text-gray-400 flex items-center justify-center gap-0.5 mt-1">
              <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
              <span>{mod.rating?.toFixed(1) || '5.0'} / 5.0 ({mod.ratingsCount || 1} Rating)</span>
            </span>
          </div>
        </div>

        {/* Right Side: Content & Actions */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Category Tags */}
            <div className="flex flex-wrap gap-1 mb-2">
              {mod.tag &&
                mod.tag.split(',').map((t, idx) => {
                  const cleanTag = t.trim().toUpperCase();
                  if (!cleanTag) return null;
                  return (
                    <button
                      key={idx}
                      onClick={() => onSelectCategory(cleanTag)}
                      className="bg-[#A3FFD6] hover:bg-[#4CCD99] transition-colors border-2 border-black text-[9px] font-extrabold uppercase px-2 py-0.5 text-black rounded-lg"
                    >
                      #{cleanTag}
                    </button>
                  );
                })}
            </div>

            {/* Mod Title */}
            <h3 
              onClick={() => {
                if (!isStandaloneView) {
                  soundPlay('click');
                  window.open(`${window.location.origin}/?modId=${mod.id || cardIndex}`, '_blank');
                }
              }}
              className={`font-syne font-extrabold text-lg sm:text-xl uppercase leading-tight text-black mb-1 flex items-center gap-1.5 ${
                !isStandaloneView ? 'cursor-pointer hover:text-[#4CCD99] hover:underline' : ''
              }`}
              title={!isStandaloneView ? "Klik untuk membuka halaman tunggal mod ini" : undefined}
            >
              {mod.name}
              {mod.isDraft && <span className="bg-yellow-400 border border-black text-[8px] px-1 py-0.5 font-sans rounded">DRAFT</span>}
              {!isStandaloneView && <span className="text-[10px] text-gray-400 normal-case font-normal ml-1">(buka page ↗)</span>}
            </h3>

            {/* Description */}
            <p className="text-[11px] text-gray-600 mb-4 leading-relaxed font-semibold whitespace-pre-wrap">
              {mod.desc}
            </p>
          </div>

          {/* Download and Mirror Center */}
          <div className="space-y-3.5">
            {/* Mirror Switcher if any extra mirrors exist */}
            {mod.mirrors && mod.mirrors.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] font-extrabold text-gray-500 uppercase">PILIH SERVER:</span>
                <button
                  onClick={() => {
                    soundPlay('click');
                    setSelectedMirror('primary');
                  }}
                  className={`px-2 py-0.5 border-2 border-black rounded text-[9px] font-bold ${
                    selectedMirror === 'primary' ? 'bg-[#4CCD99]' : 'bg-white text-zinc-600'
                  }`}
                >
                  UTAMA (UNLIMITED)
                </button>
                {mod.mirrors.map((mir, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      soundPlay('click');
                      setSelectedMirror(mir.name);
                    }}
                    className={`px-2 py-0.5 border-2 border-black rounded text-[9px] font-bold ${
                      selectedMirror === mir.name ? 'bg-[#FF71CD]' : 'bg-white text-zinc-600'
                    }`}
                  >
                    MIRROR: {mir.name.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            {/* Password Indicator */}
            <div className="bg-zinc-50 border-2 border-black p-2 flex justify-between items-center text-[10px] font-bold rounded-lg relative overflow-hidden">
              <span className="truncate pr-2 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-[#2E8B6E]" />
                <span>PASSWORD: {decryptedPassword}</span>
              </span>
              <button
                onClick={handleCopyPassword}
                className="bg-[#FFF200] border-2 border-black px-2 py-1 text-[8px] font-extrabold uppercase hover:bg-yellow-300 rounded shrink-0 brutal-shadow-sm active:translate-y-0.5"
              >
                {copiedPassword ? 'Tersalin!' : 'Salin Password'}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => triggerSafelink(cardIndex, getActiveDownloadUrl(), true)}
                className="flex-1 text-center bg-[#4CCD99] text-black font-extrabold text-[10px] uppercase py-2.5 px-3 border-3 border-black brutal-shadow-sm brutal-btn flex items-center justify-center gap-2 rounded-xl"
              >
                <Download className="w-4 h-4 text-black animate-bounce" />
                <span>DOWNLOAD NOW ({selectedMirror === 'primary' ? 'SPEED' : selectedMirror.toUpperCase()})</span>
              </button>

              {mod.customButtons &&
                mod.customButtons.map((btn, idx) => (
                  <button
                    key={idx}
                    onClick={() => triggerSafelink(cardIndex, btn.url, false)}
                    className="bg-black text-white font-bold text-[10px] uppercase py-2 px-3.5 border-3 border-black brutal-shadow-sm brutal-btn flex items-center justify-center gap-1.5 rounded-xl"
                  >
                    <Link className="w-3.5 h-3.5 text-white" />
                    <span>{btn.label}</span>
                  </button>
                ))}
            </div>

            {/* Sub-Actions (Rating, Share, Broken Link, QR Code, Version History) */}
            <div className="border-t border-dashed border-black pt-2.5 flex flex-wrap justify-between items-center text-[9px] font-bold text-gray-500 gap-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 font-mono">
                  <Eye className="w-3.5 h-3.5 text-gray-400" />
                  <span>{mod.views || 0} VIEWS</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Download className="w-3.5 h-3.5 text-gray-400" />
                  <span>{mod.downloads || 0} DOWNLOADS</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => {
                    soundPlay('success');
                    onLike(cardIndex);
                  }}
                  className="bg-[#A3FFD6] px-2 py-1 border-2 border-black rounded text-black hover:bg-[#4CCD99] active:translate-y-0.5 flex items-center gap-1"
                >
                  <Heart className="w-3 h-3 text-black fill-black" />
                  <span>{mod.likes || 0} Like</span>
                </button>
                {mod.videoUrl && (
                  <button
                    onClick={() => {
                      soundPlay('click');
                      setShowVideoPreview(!showVideoPreview);
                    }}
                    className={`px-2 py-1 border-2 border-black rounded text-black flex items-center gap-1 transition-all active:translate-y-0.5 ${
                      showVideoPreview ? 'bg-[#FF71CD]' : 'bg-[#FFF200] hover:bg-yellow-300'
                    }`}
                  >
                    <Video className="w-3 h-3 text-black" />
                    <span>Video Preview</span>
                  </button>
                )}
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="bg-zinc-100 px-2 py-1 border-2 border-black rounded text-black hover:bg-zinc-200 flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3 text-black" />
                  <span>Diskusi ({mod.comments?.length || 0})</span>
                </button>
                <button
                  onClick={() => setShowChangelog(!showChangelog)}
                  className="bg-zinc-100 px-2 py-1 border-2 border-black rounded text-black hover:bg-zinc-200 flex items-center gap-1"
                >
                  <History className="w-3 h-3 text-black" />
                  <span>Riwayat Versi</span>
                </button>
                <button
                  onClick={() => setShowQRCode(!showQRCode)}
                  className="bg-zinc-100 px-2 py-1 border-2 border-black rounded text-black hover:bg-zinc-200 flex items-center gap-1"
                  title="Unduh dengan Kode QR"
                >
                  <QrCode className="w-3 h-3 text-black" />
                  <span>QR</span>
                </button>
                <button
                  onClick={() => {
                    soundPlay('success');
                    onReportBroken(cardIndex);
                  }}
                  className="bg-red-50 text-red-600 px-2 py-1 border-2 border-black rounded hover:bg-red-100 flex items-center gap-1"
                  title="Laporkan link rusak atau mati"
                >
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                  <span>Lapor Mati ({(mod.brokenReportCount || 0)})</span>
                </button>
              </div>
            </div>

            {/* QR Code Panel */}
            {showQRCode && (
              <div className="p-3 bg-zinc-50 border-2 border-black rounded-xl text-center flex flex-col items-center justify-center space-y-2">
                <h5 className="font-syne font-extrabold text-[10px] uppercase">Scan Kode QR untuk Unduh di Android</h5>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(getActiveDownloadUrl())}`}
                  alt="QR Download"
                  className="w-28 h-28 border-2 border-black p-1 bg-white rounded-lg shadow-sm"
                />
                <p className="text-[8px] text-gray-500 font-bold max-w-xs leading-normal">
                  Pindai menggunakan kamera handphone atau aplikasi scan QR untuk langsung membuka file unduhan tanpa kabel data!
                </p>
                <button
                  onClick={() => setShowQRCode(false)}
                  className="text-[9px] uppercase font-bold text-red-500 underline"
                >
                  Sembunyikan QR Code
                </button>
              </div>
            )}

            {/* Video Preview Panel */}
            {showVideoPreview && mod.videoUrl && (
              <div className="p-3 bg-zinc-50 border-2 border-black rounded-xl space-y-2">
                <h5 className="font-syne font-extrabold text-[10px] uppercase border-b-2 border-black pb-1 flex justify-between items-center">
                  <span>Video Preview / Gameplay</span>
                  <button onClick={() => setShowVideoPreview(false)} className="text-red-500 hover:underline text-[9px] lowercase bg-transparent border-none outline-none cursor-pointer">Tutup ✕</button>
                </h5>
                <div className="relative w-full border-2 border-black overflow-hidden rounded-xl bg-black aspect-video">
                  {(() => {
                    const embedUrl = getYouTubeEmbedUrl(mod.videoUrl);
                    if (embedUrl) {
                      return (
                        <iframe
                          src={embedUrl}
                          title={`${mod.name} YouTube Video`}
                          className="w-full h-full border-none"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      );
                    } else if (mod.videoUrl.endsWith('.mp4') || mod.videoUrl.includes('.mp4?') || mod.videoUrl.includes('drive.google.com') || mod.videoUrl.includes('/video/')) {
                      return (
                        <video 
                          src={mod.videoUrl} 
                          controls 
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        ></video>
                      );
                    } else {
                      return (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-zinc-900 text-white gap-2">
                          <Video className="w-8 h-8 text-yellow-400 animate-pulse" />
                          <span className="text-[10px] font-bold uppercase">Video Link Eksternal Tersedia</span>
                          <a 
                            href={mod.videoUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-[#FFF200] text-black border-2 border-black px-3 py-1 font-extrabold text-[9px] uppercase rounded-lg shadow-sm animate-bounce"
                          >
                            Buka Video Preview ↗
                          </a>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            )}

            {/* Version History / Changelog Panel */}
            {showChangelog && (
              <div className="p-3 bg-zinc-50 border-2 border-black rounded-xl space-y-2 text-xs">
                <h5 className="font-syne font-extrabold text-[10px] uppercase border-b-2 border-black pb-1">
                  Changelog & Riwayat Versi
                </h5>
                <div className="text-[10px] space-y-2 max-h-32 overflow-y-auto pr-1">
                  <div>
                    <span className="font-extrabold text-[#2E8B6E]">Versi Terakhir (Aktif):</span>
                    <p className="text-[9px] text-gray-600 bg-white p-1 border rounded mt-0.5 font-medium">
                      {mod.changelog || 'Mendukung versi update game terbaru di Play Store, perbaikan kestabilan performa, & optimalisasi anti-banned.'}
                    </p>
                  </div>

                  {mod.versionHistory && mod.versionHistory.length > 0 ? (
                    <div className="border-t border-gray-300 pt-1.5 space-y-1">
                      <span className="font-extrabold">Riwayat Versi Terdahulu:</span>
                      {mod.versionHistory.map((v, idx) => (
                        <div key={idx} className="bg-white p-1.5 border rounded border-black/40 text-[9px] text-gray-500">
                          <div className="flex justify-between items-center font-bold">
                            <span>Versi {v.version}</span>
                            <span>{v.date}</span>
                          </div>
                          <p className="font-medium mt-0.5">{v.changelog}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[8px] italic text-gray-400">Belum ada riwayat versi sebelumnya.</div>
                  )}
                </div>
                <button
                  onClick={() => setShowChangelog(false)}
                  className="text-[9px] uppercase font-bold text-red-500 underline"
                >
                  Tutup Riwayat
                </button>
              </div>
            )}

            {/* Sharing Panel */}
            <div className="flex items-center gap-1.5 bg-zinc-100 p-2 border-2 border-black rounded-lg">
              <span className="text-[8px] font-extrabold text-gray-500 uppercase">BAGIKAN MOD:</span>
              <div className="flex gap-1">
                <a
                  href={whatsappShare}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundPlay('click')}
                  className="bg-[#25D366] hover:bg-emerald-600 border border-black text-black px-1.5 py-0.5 text-[8px] rounded font-bold uppercase transition-transform hover:-translate-y-0.5"
                >
                  WhatsApp
                </a>
                <a
                  href={telegramShare}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundPlay('click')}
                  className="bg-[#0088cc] hover:bg-blue-600 border border-black text-white px-1.5 py-0.5 text-[8px] rounded font-bold uppercase transition-transform hover:-translate-y-0.5"
                >
                  Telegram
                </a>
                <a
                  href={facebookShare}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundPlay('click')}
                  className="bg-[#3b5998] hover:bg-indigo-700 border border-black text-white px-1.5 py-0.5 text-[8px] rounded font-bold uppercase transition-transform hover:-translate-y-0.5"
                >
                  Facebook
                </a>
                <a
                  href={twitterShare}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundPlay('click')}
                  className="bg-black hover:bg-zinc-800 border border-black text-white px-1.5 py-0.5 text-[8px] rounded font-bold uppercase transition-transform hover:-translate-y-0.5"
                >
                  X
                </a>
                <button
                  onClick={handleCopyLink}
                  className="bg-[#FFF200] hover:bg-yellow-400 border border-black text-black px-1.5 py-0.5 text-[8px] rounded font-extrabold uppercase transition-transform hover:-translate-y-0.5 ml-auto"
                >
                  {copiedLink ? 'Tersalin!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Discussion / Comment Section Panel */}
            {showComments && (
              <div className="bg-zinc-50 border-2 border-black p-3 text-black rounded-xl space-y-3">
                <h4 className="font-syne font-extrabold text-[9px] uppercase border-b-2 border-black pb-1">
                  Diskusi & Pertanyaan Member
                </h4>
                
                {/* Comments List */}
                <div className="max-h-36 overflow-y-auto space-y-1.5 bg-white p-2 border-2 border-black rounded-lg">
                  {!mod.comments || mod.comments.length === 0 ? (
                    <p className="text-[9px] italic text-gray-400 text-center py-4">Belum ada diskusi. Jadilah yang pertama berkomentar!</p>
                  ) : (
                    mod.comments.map((comment, idx) => (
                      <div key={idx} className="p-1.5 border-b border-black last:border-0 text-[10px] leading-relaxed">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-extrabold text-[#2E8B6E]">@{comment.name}</span>
                          <span className="text-[8px] text-gray-400 font-bold">{comment.timestamp}</span>
                        </div>
                        <p className="font-semibold text-gray-800">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment Input */}
                <form onSubmit={handleCommentSubmit} className="space-y-1.5 text-[10px]">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    <input
                      type="text"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      placeholder="Nama Anda..."
                      className="p-1.5 font-bold border-2 border-black rounded bg-white text-black text-[10px]"
                      required
                    />
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Tulis pesan..."
                      className="sm:col-span-2 p-1.5 font-bold border-2 border-black rounded bg-white text-black text-[10px]"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#2E8B6E] text-white text-[9px] font-extrabold px-3 py-1.5 border-2 border-black brutal-shadow-sm brutal-btn-sm rounded uppercase active:translate-y-0.5 flex items-center justify-center gap-1"
                  >
                    <Send className="w-3 h-3 text-white" />
                    <span>Kirim Komentar</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
