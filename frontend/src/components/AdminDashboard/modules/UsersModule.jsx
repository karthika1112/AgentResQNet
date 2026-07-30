import React, { useState, useEffect } from 'react';
import { Users, User as UserIcon, Shield, HeartHandshake } from 'lucide-react';
import api from '../../../api/axios';
import { DataTableModule } from './DataTableModule';

export const UsersModule = ({ roleFilter }) => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
         const endpoint = roleFilter === 'All' ? '/auth/users' : `/auth/users?role=${roleFilter}`;
         const res = await api.get(endpoint);
         if (res.data.success) {
           setData(res.data.data);
         }
      } catch (e) {
         console.error("Failed to fetch users", e);
      }
    };
    
    fetchUsers();
  }, [roleFilter]);

  const columns = [
    { header: 'ID / Name', render: (row) => (
      <div>
        <p className="text-white font-bold">{row.firstName} {row.lastName}</p>
        <p className="text-[10px] text-gray-500 font-mono">{row._id}</p>
      </div>
    )},
    { header: 'Email & Contact', render: (row) => (
      <div>
        <p className="text-gray-300 text-sm">{row.email}</p>
        <p className="text-xs text-gray-500">{row.phoneNumber || 'N/A'}</p>
      </div>
    )},
    { header: 'Role', render: (row) => {
      let roleStyle = 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      if (row.role === 'Admin') roleStyle = 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      if (row.role === 'Responder') roleStyle = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      if (row.role === 'Volunteer') roleStyle = 'bg-green-500/20 text-green-400 border-green-500/30';
      if (row.role === 'Victim') roleStyle = 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      return <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${roleStyle}`}>{row.role}</span>;
    }},
    { header: 'Status', render: (row) => (
      <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 text-green-500 rounded text-[10px] font-black uppercase tracking-widest">
        Active
      </span>
    )},
    { header: 'Joined', render: (row) => (
      <span className="text-xs text-gray-400">{new Date(row.createdAt).toLocaleDateString()}</span>
    )}
  ];

  let title = 'Global User Directory';
  let desc = 'System-wide user & role management';
  let Icon = Users;

  if (roleFilter === 'Volunteer') {
    title = 'Active Volunteers';
    desc = 'Registered volunteer personnel';
    Icon = HeartHandshake; // Wait, let's just use Users to avoid missing imports. Actually, we use Users everywhere here.
  } else if (roleFilter === 'Victim') {
    title = 'Registered Victims';
    desc = 'Platform civilian users';
    Icon = UserIcon;
  } else if (roleFilter === 'All') {
    Icon = Shield;
  }

  return <DataTableModule title={title} description={desc} icon={Icon} columns={columns} data={data} />;
};
