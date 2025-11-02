import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit } from 'lucide-react';

interface User {
  id: string;
  fullName?: string;
  email?: string;
  subscriptionTier?: string;
  isOnline?: boolean;
  onboardingCompleted?: boolean;
}

interface AdminUserTableProps {
  users: User[];
  onEditUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export const AdminUserTable: React.FC<AdminUserTableProps> = ({ users, onEditUser, onDeleteUser }) => {
  const getTierBadge = (tier?: string) => {
    const t = tier || 'free';
    const colors = {
      premium: 'bg-purple-500',
      pro: 'bg-blue-500',
      free: 'bg-gray-500',
    };
    return <Badge className={colors[t as keyof typeof colors]}>{t.toUpperCase()}</Badge>;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.fullName || 'N/A'}</TableCell>
              <TableCell>{user.email || 'N/A'}</TableCell>
              <TableCell>{getTierBadge(user.subscriptionTier)}</TableCell>
              <TableCell>
                <Badge variant={user.isOnline ? 'default' : 'secondary'}>
                  {user.isOnline ? 'Online' : 'Offline'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEditUser(user.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onDeleteUser(user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
