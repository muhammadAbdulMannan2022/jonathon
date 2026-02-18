'use client';

import { useState, useEffect } from 'react';
import { authApi } from '@/lib/auth-service';
import { Users, CheckCircle, Package, XCircle, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [statsData, setStatsData] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [quickStats, setQuickStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [stats, activity, quick] = await Promise.all([
          authApi.getDashboardStats(),
          authApi.getRecentActivity(),
          authApi.getQuickStats(),
        ]);
        setStatsData(stats);
        setRecentActivity(activity.results?.slice(0, 5) || []);
        setQuickStats(quick);
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      title: 'Total Users',
      value: statsData?.total_users?.count ?? '...',
      change: statsData?.total_users?.label ?? '...',
      color: 'text-blue-500',
      icon: <Users className="w-8 h-8" />,
    },
    {
      title: 'Pending Approvals',
      value: statsData?.pending_approvals?.count ?? '...',
      change: statsData?.pending_approvals?.label ?? '...',
      color: 'text-yellow-500',
      icon: <CheckCircle className="w-8 h-8" />,
    },
    {
      title: 'Active Products',
      value: statsData?.active_products?.count ?? '...',
      change: statsData?.active_products?.label ?? '...',
      color: 'text-primary',
      icon: <Package className="w-8 h-8" />,
    },
    {
      title: 'Rejected Items',
      value: statsData?.rejected_items?.count ?? '...',
      change: statsData?.rejected_items?.label ?? '...',
      color: 'text-destructive',
      icon: <XCircle className="w-8 h-8" />,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back to your admin panel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-widest">
                  {stat.title}
                </p>
                <div className="flex items-center gap-2">
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  ) : (
                    <p className="text-3xl font-black text-foreground">
                      {stat.value}
                    </p>
                  )}
                </div>
              </div>
              <div className={stat.color}>{stat.icon}</div>
            </div>
            <p className="text-xs text-primary mt-4 font-bold bg-primary/10 w-fit px-2 py-1 rounded-full">
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            Recent Activity
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Live Updates</span>
          </h2>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors px-2 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === 'success' ? 'bg-primary' : 
                      item.status === 'warning' ? 'bg-yellow-500' : 'bg-destructive'
                    }`} />
                    <div>
                      <p className="text-sm font-bold text-foreground leading-tight">
                        {item.details}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.user_email} • {item.action.replace('_', ' ')} • {item.ip_address}
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-muted-foreground text-sm">No recent activity found.</p>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-6">
            Quick Stats
          </h2>
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      Approval Rate
                    </span>
                    <span className="text-sm font-black text-primary">{quickStats?.approval_rate ?? 0}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-500" 
                      style={{ width: `${quickStats?.approval_rate ?? 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      User Growth
                    </span>
                    <span className="text-sm font-black text-accent">{quickStats?.user_growth ?? 0}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-accent h-full rounded-full transition-all duration-500" 
                      style={{ width: `${quickStats?.user_growth ?? 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      Product Quality
                    </span>
                    <span className="text-sm font-black text-primary">{quickStats?.product_quality ?? 0}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-500" 
                      style={{ width: `${quickStats?.product_quality ?? 0}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
