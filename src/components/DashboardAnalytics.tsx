/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { ModItem } from '../types';

interface DashboardAnalyticsProps {
  mods: ModItem[];
  visitorData: Array<{ date: string; visitors: number; downloads: number; uploads: number }>;
}

export default function DashboardAnalytics({ mods, visitorData }: DashboardAnalyticsProps) {
  // Compute some high-level metrics
  const totalModsCount = mods.length;
  const totalViews = mods.reduce((sum, item) => sum + (item.views || 0), 0);
  const totalLikes = mods.reduce((sum, item) => sum + (item.likes || 0), 0);
  const totalDownloads = mods.reduce((sum, item) => sum + (item.downloads || 0), 0);
  const brokenLinksCount = mods.filter(m => (m.brokenReportCount || 0) > 0).length;
  const draftModsCount = mods.filter(m => m.isDraft).length;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white text-black border-3 border-black p-3 rounded-xl shadow-[4px_4px_0px_0px_#000000]">
          <div className="text-[10px] uppercase font-bold text-gray-500">Total Mod Rilis</div>
          <div className="font-syne font-extrabold text-2xl mt-0.5">{totalModsCount}</div>
          <div className="text-[9px] text-[#2E8B6E] font-bold mt-1">Publik: {mods.filter(m => !m.isDraft).length} • Draft: {draftModsCount}</div>
        </div>

        <div className="bg-white text-black border-3 border-black p-3 rounded-xl shadow-[4px_4px_0px_0px_#000000]">
          <div className="text-[10px] uppercase font-bold text-gray-500">Total Views</div>
          <div className="font-syne font-extrabold text-2xl mt-0.5">{totalViews.toLocaleString()}</div>
          <div className="text-[9px] text-[#2E8B6E] font-bold mt-1">Avg: {totalModsCount ? Math.round(totalViews / totalModsCount) : 0} / mod</div>
        </div>

        <div className="bg-white text-black border-3 border-black p-3 rounded-xl shadow-[4px_4px_0px_0px_#000000]">
          <div className="text-[10px] uppercase font-bold text-gray-500">Total Downloads</div>
          <div className="font-syne font-extrabold text-2xl mt-0.5">{totalDownloads.toLocaleString()}</div>
          <div className="text-[9px] text-blue-600 font-bold mt-1">Mirror & Direct Link</div>
        </div>

        <div className="bg-white text-black border-3 border-black p-3 rounded-xl shadow-[4px_4px_0px_0px_#000000]">
          <div className="text-[10px] uppercase font-bold text-gray-500">Broken Reports</div>
          <div className="font-syne font-extrabold text-2xl mt-0.5 text-red-600">{brokenLinksCount}</div>
          <div className="text-[9px] text-red-500 font-bold mt-1">Wajib Segera Diperbaiki</div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visitors & Downloads Trend */}
        <div className="bg-white text-black border-3 border-black p-4 rounded-xl shadow-[6px_6px_0px_0px_#000000] flex flex-col">
          <h4 className="font-syne font-extrabold text-xs uppercase mb-3 border-b-2 border-black pb-1.5">Tren Pengunjung & Download (7 Hari Terakhir)</h4>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CCD99" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#4CCD99" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF71CD" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#FF71CD" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#000" strokeWidth={1} />
                <XAxis dataKey="date" stroke="#000" fontSize={9} fontWeight="bold" />
                <YAxis stroke="#000" fontSize={9} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '3px solid #000', 
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '10px'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="visitors" name="Pengunjung" stroke="#2E8B6E" strokeWidth={2} fillOpacity={1} fill="url(#colorVis)" />
                <Area type="monotone" dataKey="downloads" name="Unduhan" stroke="#FF71CD" strokeWidth={2} fillOpacity={1} fill="url(#colorDl)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upload Activity Chart */}
        <div className="bg-white text-black border-3 border-black p-4 rounded-xl shadow-[6px_6px_0px_0px_#000000] flex flex-col">
          <h4 className="font-syne font-extrabold text-xs uppercase mb-3 border-b-2 border-black pb-1.5">Frekuensi Upload Modifikasi</h4>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitorData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000" />
                <XAxis dataKey="date" stroke="#000" fontSize={9} fontWeight="bold" />
                <YAxis stroke="#000" fontSize={9} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '3px solid #000', 
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '10px'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Bar dataKey="uploads" name="Mod Dirilis" fill="#FFF200" stroke="#000" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
