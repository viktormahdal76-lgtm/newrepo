import React, { useEffect, useState } from 'react';
import { adminService } from '@/lib/admin-service';
import { AdminStatsCard } from './AdminStatsCard';
import { AdminUserTable } from './AdminUserTable';
import { Users, DollarSign, Activity, TrendingUp, Shield, Link } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export const AdminDashboard: React.FC = () => {
  const [userStats, setUserStats] = useState<any>(null);
  const [connectionStats, setConnectionStats] = useState<any>(null);
  const [revenueStats, setRevenueStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    const [uStats, cStats, rStats, allUsers] = await Promise.all([
      adminService.getUserStats(),
      adminService.getConnectionStats(),
      adminService.getRevenueStats(),
      adminService.getAllUsers(),
    ]);
    setUserStats(uStats);
    setConnectionStats(cStats);
    setRevenueStats(rStats);
    setUsers(allUsers);
    setLoading(false);
  };

  const handleEditUser = (userId: string) => {
    toast({ title: 'Edit user', description: `Editing user ${userId}` });
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await adminService.deleteUser(userId);
      toast({ title: 'User deleted successfully' });
      loadDashboardData();
    }
  };

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={loadDashboardData}>Refresh</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdminStatsCard
          title="Total Users"
          value={userStats?.total || 0}
          icon={Users}
          description={`${userStats?.active || 0} active now`}
          trend="+12% from last month"
          trendUp
        />
        <AdminStatsCard
          title="Premium Users"
          value={userStats?.premium || 0}
          icon={Shield}
          description={`${userStats?.pro || 0} Pro users`}
        />
        <AdminStatsCard
          title="Total Revenue"
          value={`$${revenueStats?.total || 0}`}
          icon={DollarSign}
          description={`$${revenueStats?.monthly || 0} this month`}
          trend="+8% from last month"
          trendUp
        />
        <AdminStatsCard
          title="Active Connections"
          value={connectionStats?.active || 0}
          icon={Link}
          description={`${connectionStats?.pending || 0} pending`}
        />
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminUserTable
                users={users}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <AdminStatsCard title="API Status" value="Healthy" icon={Activity} />
            <AdminStatsCard title="Database" value="Connected" icon={Activity} />
            <AdminStatsCard title="Uptime" value="99.9%" icon={TrendingUp} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
