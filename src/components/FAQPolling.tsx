/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FAQItem, PollingTopic, RequestMod } from '../types';
import { BarChart2, HelpCircle, Plus, Minus, Send, Flame, CheckCircle2, ThumbsUp, Lock } from 'lucide-react';

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
    <div className="space-y-6 sm:space-y-8">
      {/* 2 Column Layout for Polling and FAQ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Polling Widget */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 6, transformPerspective: 1000 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white text-black border-2 sm:border-3 border-black p-3.5 sm:p-4 rounded-xl brutal-shadow flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-[#2E8B6E]">
              <BarChart2 className="w-5 h-5 text-black" />
              <h4 className="font-syne font-extrabold text-xs sm:text-sm uppercase text-black">Polling Komunitas</h4>
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold text-[#2E8B6E] bg-[#A3FFD6]/30 px-2 py-1 border-1.5 sm:border-2 border-black inline-block rounded-md mb-3 sm:mb-4 uppercase">
              {polling.question}
            </p>
 
            <div className="space-y-2">
              {polling.options.map((opt) => {
                const pct = polling.totalVotes > 0 ? Math.round((opt.votes / polling.totalVotes) * 100) : 0;
                return (
                  <motion.button
                    key={opt.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onVotePolling(opt.id)}
                    className="w-full text-left p-2 sm:p-2.5 border-1.5 sm:border-2 border-black rounded-lg bg-zinc-50 hover:bg-[#A3FFD6]/20 transition-all text-[10px] sm:text-[11px] font-bold relative overflow-hidden group cursor-pointer block"
                  >
                    {/* Progress Fill Background */}
                    <div
                      className="absolute inset-y-0 left-0 bg-[#4CCD99]/30 transition-all duration-500 ease-out z-0"
                      style={{ width: `${pct}%` }}
                    />
                    <div className="relative z-10 flex justify-between items-center">
                      <span className="truncate pr-4 uppercase">{opt.text}</span>
                      <span className="bg-black text-white px-1.5 py-0.5 text-[8px] sm:text-[9px] font-extrabold brutal-border-sm shrink-0">
                        {opt.votes} Suara ({pct}%)
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
          <div className="text-[8px] sm:text-[9px] text-gray-500 font-bold mt-4 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-gray-400" />
            <span>Total polling terdaftar: {polling.totalVotes} Suara • Klik pilihan untuk memilih!</span>
          </div>
        </motion.div>
 
        {/* FAQ Widget */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 6, transformPerspective: 1000 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="bg-white text-black border-2 sm:border-3 border-black p-3.5 sm:p-4 rounded-xl brutal-shadow"
        >
          <div className="flex items-center gap-1.5 mb-2 sm:mb-3">
            <HelpCircle className="w-5 h-5 text-black" />
            <h4 className="font-syne font-extrabold text-xs sm:text-sm uppercase">FAQ (Tanya Jawab)</h4>
          </div>
          <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold mb-3 sm:mb-4">Informasi lengkap panduan instalasi game modifikasi.</p>
 
          <div className="space-y-1.5 sm:space-y-2">
            {faqs.map((faq, index) => {
              const isOpen = openFAQIndex === index;
              return (
                <div key={index} className="border-1.5 sm:border-2 border-black rounded-lg overflow-hidden">
                  <motion.button
                    whileHover={{ backgroundColor: "#f4f4f5" }}
                    onClick={() => setOpenFAQIndex(isOpen ? null : index)}
                    className="w-full text-left p-2 sm:p-2.5 bg-zinc-50 font-extrabold text-[9px] sm:text-[10px] uppercase flex justify-between items-center transition-all cursor-pointer"
                  >
                    <span className="pr-4 leading-tight">{faq.question}</span>
                    <span className="shrink-0 text-xs">
                      {isOpen ? <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black" /> : <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black" />}
                    </span>
                  </motion.button>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="p-2 sm:p-2.5 bg-white border-t-1.5 sm:border-t-2 border-black text-[9px] sm:text-[10px] text-gray-700 leading-relaxed font-semibold whitespace-pre-wrap"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
 
      {/* Request Mod Widget */}
      <motion.div
        initial={{ opacity: 0, y: 55, rotateX: 5, transformPerspective: 1000 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white text-black border-2 sm:border-3 border-black p-3.5 sm:p-4 rounded-xl brutal-shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Submit Request Form */}
          <div className="md:col-span-1 space-y-2 sm:space-y-3">
            <div className="flex items-center gap-1.5">
              <Send className="w-5 h-5 text-black" />
              <h4 className="font-syne font-extrabold text-xs sm:text-sm uppercase">Request Modifikasi</h4>
            </div>
            <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold leading-relaxed">
              Ingin mod game tertentu? Kirimkan usulanmu! Modifikasi yang mendapatkan upvote paling banyak akan rilis lebih cepat!
            </p>
 
            <form onSubmit={handleRequestSubmit} className="space-y-2 text-[9px] sm:text-[10px]">
              <div>
                <label className="block font-bold mb-0.5 uppercase tracking-wider text-[8px]">Nama Game / Aplikasi</label>
                <input
                  type="text"
                  value={reqName}
                  onChange={(e) => setReqName(e.target.value)}
                  placeholder="Contoh: GTA San Andreas Lite"
                  className="w-full brutal-border-sm p-2 font-bold bg-white focus:outline-none focus:bg-[#A3FFD6]/20 text-black text-[9px] sm:text-[10px] rounded-md"
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
                  className="w-full brutal-border-sm p-2 font-bold bg-white focus:outline-none focus:bg-[#A3FFD6]/20 text-black text-[9px] sm:text-[10px] rounded-md"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-[#FF71CD] text-black font-extrabold uppercase py-2 brutal-border-sm brutal-shadow-sm brutal-btn-sm text-[9px] sm:text-[10px] rounded-lg cursor-pointer"
              >
                Kirim Permintaan
              </motion.button>
            </form>
          </div>

          {/* Request Mod list */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <h5 className="font-syne font-extrabold text-xs uppercase mb-3 text-[#2E8B6E] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#2E8B6E]" />
                <span>Permintaan Terpopuler</span>
              </h5>
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
                              <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[8px] border border-emerald-400 rounded font-bold uppercase flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-800" />
                                <span>Rilis</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[8px] text-gray-400 font-bold block mt-0.5">{req.date}</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onUpvoteRequest(req.id)}
                          className="bg-[#A3FFD6] hover:bg-[#4CCD99] text-black font-extrabold px-2 py-1 border-2 border-black brutal-shadow-sm brutal-btn-sm text-[9px] uppercase flex items-center gap-1 rounded-md shrink-0 cursor-pointer"
                        >
                          <ThumbsUp className="w-3 h-3 text-black" />
                          <span>Upvote</span>
                          <span className="bg-black text-white px-1 brutal-border-sm text-[8px]">{req.votes}</span>
                        </motion.button>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
