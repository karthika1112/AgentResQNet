import React, { useState } from 'react';
import { Search, Filter, Download, MoreVertical, Activity } from 'lucide-react';

export const DataTableModule = ({ title, description, icon: Icon, columns, data }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col h-[85vh] bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl shadow-xl overflow-hidden relative z-10">
      
      {/* Header */}
      <div className="p-6 border-b border-[rgba(255,255,255,0.05)] bg-[#0B0F19] flex justify-between items-end">
        <div>
          <div className="flex items-center mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg mr-4 border border-blue-500/20">
              <Icon className="text-blue-500" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-widest">{title}</h2>
              <p className="text-gray-400 text-xs tracking-wider">{description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search database..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#1A2235] border border-[rgba(255,255,255,0.1)] text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 w-64 transition-colors"
            />
          </div>
          <button className="bg-[#1A2235] hover:bg-[#232D45] border border-[rgba(255,255,255,0.1)] text-gray-300 p-2 rounded-lg transition-colors">
            <Filter size={18} />
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold tracking-widest uppercase transition-colors flex items-center">
            <Download size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0B0F19] sticky top-0 z-10 border-b border-[rgba(255,255,255,0.05)]">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                  {col.header}
                </th>
              ))}
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.02)]">
            {filteredData.map((row, idx) => (
              <tr key={idx} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className="p-4 text-sm text-gray-300 whitespace-nowrap">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
                <td className="p-4 text-right">
                  <button className="text-gray-500 hover:text-blue-400 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Activity size={40} className="mb-4 opacity-50" />
            <p className="tracking-widest uppercase text-sm font-bold">No records found matching criteria</p>
          </div>
        )}
      </div>
      
      {/* Footer Pagination */}
      <div className="p-4 border-t border-[rgba(255,255,255,0.05)] bg-[#0B0F19] flex justify-between items-center text-xs text-gray-500">
        <div>Showing {filteredData.length} of {data.length} records</div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-[rgba(255,255,255,0.1)] rounded hover:bg-[rgba(255,255,255,0.05)]">Prev</button>
          <button className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">1</button>
          <button className="px-3 py-1 border border-[rgba(255,255,255,0.1)] rounded hover:bg-[rgba(255,255,255,0.05)]">Next</button>
        </div>
      </div>
    </div>
  );
};
