/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FAQItem, PollingTopic, RequestMod } from '../types';

interface FAQPollingProps {
  faqs: FAQItem[];
  polling: PollingTopic;
  onVotePolling: (optionId: string) => void;
  requests: RequestMod[];
  onRequestMod: (name: string, category: string) => void;
  onUpvoteRequest: (id: string) => void;
}

export default function FAQPolling({
  faqs,
  polling,
  onVotePolling,
  requests,
  onRequestMod,
  onUpvoteRequest
}: FAQPollingProps) {
  // FAQ accordion state
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  // Request Mod local state
  const [reqName, setReqName] = useState('');
  const [reqCat, setReqCat] = useState('');

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqName.trim()) return;
    onRequestMod(reqName, reqCat || 'LAINNYA');
    setReqName('');
    setReqCat('');
  };

  return (
    <div className="space-y-8">
      {/* 2 Column Layout for Polling and FAQ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Polling Widget */}
        <div className="bg-white text-black border-3 border-black p-4 rounded-xl shadow-[6px_6px_0px_0px_#000000] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-lg">📊</span>
              <h4 className="font-syne font-extrabold text-sm uppercase">Polling Komunitas</h4>
            </div>
            <p className="text-[11px] font-bold text-[#2E8B6E] bg-[#A3FFD6]/30 px-2 py-1 border-2 border-black inline-block rounded-md mb-4 uppercase">
              {polling.question}
            </p>

            <div className="space-y-2.5">
              {polling.options.map((opt) => {
                const pct = polling.totalVotes > 0 ? Math.round((opt.votes / polling.totalVotes) * 100) : 0;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onVotePolling(opt.id)}
                    className="w-full text-left p-2.5 border-2 border-black rounded-lg bg-zinc-50 hover:bg-[#A3FFD6]/20 transition-all text-[11px] font-bold relative overflow-hidden group active:translate-y-0.5"
                  >
                    {/* Progress Fill Background */}
                    <div
                      className="absolute inset-y-0 left-0 bg-[#4CCD99]/30 transition-all duration-500 ease-out z-0"
                      style={{ width: `${pct}%` }}
                    />
                    <div className="relative z-10 flex justify-between items-center">
                      <span className="truncate pr-4 uppercase">{opt.text}</span>
                      <span className="bg-black text-white px-1.5 py-0.5 text-[9px] font-extrabold brutal-border-sm shrink-0">
                        {opt.votes} Suara ({pct}%)
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="text-[9px] text-gray-500 font-bold mt-4 text-center">
            🔒 Total polling terdaftar: {polling.totalVotes} Suara • Klik pilihan untuk memilih!
          </div>
        </div>

        {/* FAQ Widget */}
        <div className="bg-white text-black border-3 border-black p-4 rounded-xl shadow-[6px_6px_0px_0px_#000000]">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-lg">❓</span>
            <h4 className="font-syne font-extrabold text-sm uppercase">FAQ (Tanya Jawab)</h4>
          </div>
          <p className="text-[10px] text-gray-500 font-bold mb-4">Informasi lengkap panduan instalasi game modifikasi.</p>

          <div className="space-y-2">
            {faqs.map((faq, index) => {
              const isOpen = openFAQIndex === index;
              return (
                <div key={index} className="border-2 border-black rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFAQIndex(isOpen ? null : index)}
                    className="w-full text-left p-2.5 bg-zinc-50 font-extrabold text-[10px] uppercase flex justify-between items-center transition-all hover:bg-gray-100"
                  >
                    <span className="pr-4 leading-tight">{faq.question}</span>
                    <span className="shrink-0 text-xs">{isOpen ? '➖' : '➕'}</span>
                  </button>
                  {isOpen && (
                    <div className="p-2.5 bg-white border-t-2 border-black text-[10px] text-gray-700 leading-relaxed font-semibold whitespace-pre-wrap">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Request Mod Widget */}
      <div className="bg-white text-black border-3 border-black p-4 rounded-xl shadow-[6px_6px_0px_0px_#000000]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Submit Request Form */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">📢</span>
              <h4 className="font-syne font-extrabold text-sm uppercase">Request Modifikasi</h4>
            </div>
            <p className="text-[10px] text-gray-500 font-bold leading-relaxed">
              Ingin mod game tertentu? Kirimkan usulanmu! Modifikasi yang mendapatkan upvote paling banyak akan rilis lebih cepat!
            </p>

            <form onSubmit={handleRequestSubmit} className="space-y-2.5 text-[10px]">
              <div>
                <label className="block font-bold mb-0.5 uppercase tracking-wider text-[8px]">Nama Game / Aplikasi</label>
                <input
                  type="text"
                  value={reqName}
                  onChange={(e) => setReqName(e.target.value)}
                  placeholder="Contoh: GTA San Andreas Lite"
                  className="w-full brutal-border-sm p-2 font-bold bg-white focus:outline-none focus:bg-[#A3FFD6]/20 text-black text-[10px] rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-0.5 uppercase tracking-wider text-[8px]">Kategori</label>
                <input
                  type="text"
                  value={reqCat}
                  onChange={(e) => setReqCat(e.target.value)}
                  placeholder="Contoh: GAME atau TOOLS"
                  className="w-full brutal-border-sm p-2 font-bold bg-white focus:outline-none focus:bg-[#A3FFD6]/20 text-black text-[10px] rounded-md"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#FF71CD] text-black font-extrabold uppercase py-2 brutal-border-sm brutal-shadow-sm brutal-btn-sm text-[10px] rounded-lg"
              >
                Kirim Permintaan ⚡
              </button>
            </form>
          </div>

          {/* Request Mod list */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <h5 className="font-syne font-extrabold text-xs uppercase mb-3 text-[#2E8B6E]">🔥 Permintaan Terpopuler</h5>
              <div className="max-h-48 overflow-y-auto space-y-2 border-2 border-black p-2 rounded-xl bg-zinc-50">
                {requests.length === 0 ? (
                  <p className="text-[10px] italic text-gray-400 text-center py-4">Belum ada usulan mod.</p>
                ) : (
                  requests
                    .sort((a, b) => b.votes - a.votes)
                    .map((req) => (
                      <div
                        key={req.id}
                        className="bg-white border-2 border-black p-2 rounded-lg flex justify-between items-center gap-3 text-[10px] shadow-sm"
                      >
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-extrabold uppercase text-black">{req.name}</span>
                            <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 text-[8px] border border-black rounded font-extrabold uppercase">
                              {req.category}
                            </span>
                            {req.status === 'approved' && (
                              <span className="bg-emerald-100 text-emerald-800 px-1 py-0.5 text-[8px] border border-emerald-400 rounded font-bold uppercase">
                                Rilis ✔️
                              </span>
                            )}
                          </div>
                          <span className="text-[8px] text-gray-400 font-bold block mt-0.5">{req.date}</span>
                        </div>
                        <button
                          onClick={() => onUpvoteRequest(req.id)}
                          className="bg-[#A3FFD6] hover:bg-[#4CCD99] text-black font-extrabold px-2 py-1 border-2 border-black brutal-shadow-sm brutal-btn-sm text-[9px] uppercase flex items-center gap-1 rounded-md shrink-0 active:translate-y-0.5"
                        >
                          👍 Upvote <span className="bg-black text-white px-1 brutal-border-sm text-[8px]">{req.votes}</span>
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
