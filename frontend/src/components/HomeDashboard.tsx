import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  PlayCircle,
  DollarSign,
  TrendingUp,
  Percent,
  AlertCircle
} from 'lucide-react';
import { MapView } from './MapView';
import { RecentProjects } from './RecentProjects';
import { AlertsFeed } from './AlertsFeed';
import { useEffect, useState } from 'react';
import { dashboardService, DashboardStats } from '../services/dashboardService';

import { DashboardCarousel } from './DashboardCarousel';
import { MarqueeNotification } from './MarqueeNotification';
import { DashboardBanner } from './DashboardBanner';

export function HomeDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const kpiData = [
    {
      title: 'Total Projects',
      value: loading ? '...' : stats?.totalProjects.toLocaleString() || '0',
      icon: FolderKanban,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100',
      link: '/projects'
    },
    {
      title: 'Ongoing Projects',
      value: loading ? '...' : stats?.statusCounts.ongoing.toLocaleString() || '0',
      icon: PlayCircle,
      color: 'bg-[var(--color-india-green-50)] text-[var(--color-india-green-600)]',
      iconBg: 'bg-[var(--color-india-green-100)]',
      link: '/projects?status=In Progress'
    },
    {
      title: 'Funds Released',
      value: loading ? '...' : `₹${(stats?.funds.released || 0).toLocaleString()} Cr`,
      icon: DollarSign,
      color: 'bg-purple-50 text-purple-600',
      iconBg: 'bg-purple-100',
      link: '/fund-flow'
    },
    {
      title: 'Funds Utilized',
      value: loading ? '...' : `₹${(stats?.funds.utilized || 0).toLocaleString()} Cr`,
      icon: TrendingUp,
      color: 'bg-indigo-50 text-indigo-600',
      iconBg: 'bg-indigo-100',
      link: '/fund-flow'
    },
    {
      title: 'Avg Completion %',
      value: loading ? '...' : `${(stats?.funds.utilizationPercentage || 0).toFixed(1)}%`,
      icon: Percent,
      color: 'bg-cyan-50 text-cyan-600',
      iconBg: 'bg-cyan-100',
      link: '/projects'
    },
    {
      title: 'Delayed Projects',
      value: loading ? '...' : stats?.statusCounts.delayed.toLocaleString() || '0',
      icon: AlertCircle,
      color: 'bg-[var(--color-saffron-50)] text-[var(--color-saffron-600)]',
      iconBg: 'bg-[var(--color-saffron-100)]',
      link: '/projects?status=Delayed'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <p className="text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">WELCOME TO PM-AJAY DASHBOARD</p>
        <p className="text-xl text-gray-600 font-medium">Pradhan Mantri Anusuchit Jaati Abhyuday Yojna</p>
      </div>

      {/* Announcements & Banner */}
      <div className="space-y-6 pb-6">
        <DashboardBanner />
        <MarqueeNotification />
        <DashboardCarousel />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.title}
              className="card-hover cursor-pointer"
              onClick={() => navigate(kpi.link)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-gray-600">{kpi.title}</p>
                    <p className="text-gray-900">{kpi.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${kpi.iconBg}`}>
                    <Icon className={`w-5 h-5 ${kpi.color.split(' ')[1]}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Map Section */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <MapView />
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProjects />
        <AlertsFeed />
      </div>
    </div>
  );
}
