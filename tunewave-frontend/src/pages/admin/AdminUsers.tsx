import { useState, useEffect } from 'react';
import api from '../../api/axios';

type User = {
  _id: string;
  username: string;
  email: string;
  isArtist: boolean;
  status: 'active' | 'suspended';
};

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => api.get<{ data: User[] }>('/admin/users').then(res => setUsers(res.data.data));

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    await api.put(`/admin/users/${id}/status`, { status: newStatus });
    fetchUsers();
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      <h1 className="text-2xl font-black">User Management</h1>
      {users.map(u => (
        <div key={u._id} className="bg-bg-surface p-4 rounded-xl flex justify-between items-center">
            <div>
                <p className="font-semibold">{u.username}</p>
                <p className="text-xs text-text-secondary">{u.email}</p>
                <p className={`text-[10px] ${u.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>{u.status}</p>
            </div>
            <button onClick={() => toggleStatus(u._id, u.status)} className={`px-4 py-2 rounded-full text-xs font-bold ${u.status === 'active' ? 'bg-red-900' : 'bg-emerald-900'}`}>
                {u.status === 'active' ? 'Suspend' : 'Activate'}
            </button>
        </div>
      ))}
    </div>
  );
};

export default AdminUsers;
