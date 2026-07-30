import React, { useState, useEffect } from 'react';
import { HeartHandshake } from 'lucide-react';
import api from '../../../api/axios';
import { DataTableModule } from './DataTableModule';

export const VolunteerOffersModule = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchOffers = async () => {
      try {
         const res = await api.get('/volunteer/offer');
         if (res.data.success) {
           setData(res.data.data);
         }
      } catch (e) {
         console.error("Failed to fetch volunteer offers", e);
      }
    };
    
    fetchOffers();
    const interval = setInterval(fetchOffers, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const columns = [
    { header: 'Offer ID', render: (row) => <span className="font-mono text-gray-400">{row.offerId}</span> },
    { header: 'Volunteer / Contact', render: (row) => (
      <div>
        <p className="text-white font-bold">{row.volunteerName}</p>
        <p className="text-xs text-gray-500">{row.phoneNumber || 'N/A'}</p>
      </div>
    )},
    { header: 'Offering', render: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.offerType.map(offer => (
          <span key={offer} className="px-2 py-0.5 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded text-[10px] text-gray-300 font-bold uppercase tracking-wider">
            {offer}
          </span>
        ))}
      </div>
    )},
    { header: 'Target Area', render: (row) => (
      <div className="max-w-xs truncate">
        <p className="text-xs text-blue-400 truncate">{row.targetArea}</p>
        <p className="text-[10px] text-gray-500 truncate mt-0.5">{row.details}</p>
      </div>
    )},
    { header: 'Status', render: (row) => {
      let colors = 'bg-gray-500/20 text-gray-400';
      if (row.status === 'Pending') colors = 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30';
      if (row.status === 'Accepted') colors = 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      if (row.status === 'Allocated') colors = 'bg-orange-500/20 text-orange-500 border border-orange-500/30';
      if (row.status === 'Completed') colors = 'bg-green-500/20 text-green-500 border border-green-500/30';
      return <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${colors}`}>{row.status}</span>;
    }},
  ];

  return <DataTableModule title="Active Volunteer Offers" description="Live Help & Resource Donations from Volunteers" icon={HeartHandshake} columns={columns} data={data} />;
};
