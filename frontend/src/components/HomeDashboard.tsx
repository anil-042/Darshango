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

const kpiData = [
  {
    title: 'Total Projects',
    value: '2,847',
    icon: FolderKanban,
    color: 'bg-blue-50 text-blue-600',
    iconBg: 'bg-blue-100',
    link: '/projects'
  },
  {
    title: 'Ongoing Projects',
    value: '1,523',
    icon: PlayCircle,
    color: 'bg-green-50 text-green-600',
    iconBg: 'bg-green-100',
    link: '/projects?status=In Progress'
  },
  {
    title: 'Funds Released',
    value: '₹8,245 Cr',
    icon: DollarSign,
    color: 'bg-purple-50 text-purple-600',
    iconBg: 'bg-purple-100',
    link: '/fund-flow'
  },
  {
    title: 'Funds Utilized',
    value: '₹6,892 Cr',
    icon: TrendingUp,
    color: 'bg-indigo-50 text-indigo-600',
    iconBg: 'bg-indigo-100',
    link: '/fund-flow'
  },
  {
    title: 'Avg Completion %',
    value: '68.5%',
    icon: Percent,
    color: 'bg-cyan-50 text-cyan-600',
    iconBg: 'bg-cyan-100',
    link: '/projects'
  },
  {
    title: 'Delayed Projects',
    value: '324',
    icon: AlertCircle,
    color: 'bg-orange-50 text-orange-600',
    iconBg: 'bg-orange-100',
    link: '/projects?status=Delayed'
  },
];

export function HomeDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1">Dashboard Overview</h1>
        <p className="text-gray-500">PM-AJAY Central Monitoring System</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.title}
              className="hover:shadow-md transition-shadow cursor-pointer"
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
