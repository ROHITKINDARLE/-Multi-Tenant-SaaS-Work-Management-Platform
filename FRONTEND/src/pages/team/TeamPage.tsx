// team/TeamPage.tsx
import React, { useState, useEffect } from 'react';
import { Users, Mail, Crown, UserCog, Trash2, Shield } from 'lucide-react';
import { Card } from '@components/ui/BaseComponents';
import { getUsers, updateUserRole, deleteUser, type User } from '@/services/userService';

export const TeamPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load team members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      await loadUsers(); // Reload to get updated data
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to remove ${userName} from the team?`)) {
      return;
    }

    try {
      const success = await deleteUser(userId);
      if (success) {
        await loadUsers();
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'manager':
        return <Shield className="w-4 h-4 text-purple-400" />;
      default:
        return <UserCog className="w-4 h-4 text-blue-400" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'manager':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Team</h1>
          <p className="text-slate-400">Loading team members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Team</h1>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Team</h1>
          <p className="text-slate-400">
            Manage your team members and their roles
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
          <Users className="w-5 h-5 text-indigo-400" />
          <span className="text-white font-semibold">{users.length}</span>
          <span className="text-slate-400">members</span>
        </div>
      </div>

      {users.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No team members yet</h3>
            <p className="text-slate-400">Invite users to join your organization</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      {user.email}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                    {user.created_at && (
                      <p className="text-xs text-slate-500 mt-1">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getRoleBadgeColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    <span className="text-sm font-medium capitalize">{user.role}</span>
                  </div>

                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="bg-slate-800 text-white px-3 py-1.5 rounded border border-slate-700 text-sm hover:border-indigo-500 transition-colors"
                  >
                    <option value="member">Member</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>

                  <button
                    onClick={() => handleDeleteUser(user.id, user.email)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    title="Remove user"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
