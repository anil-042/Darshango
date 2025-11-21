import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertTriangle, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const alerts = [
  {
    id: 1,
    type: 'Delayed Milestone',
    project: 'AG-2024-045',
    description: 'Phase 2 completion delayed by 15 days',
    priority: 'High',
    priorityColor: 'bg-red-100 text-red-700',
    icon: AlertTriangle,
    iconColor: 'text-red-600',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'Pending UC',
    project: 'HST-2024-023',
    description: 'Utilization certificate pending for ₹45L',
    priority: 'Medium',
    priorityColor: 'bg-yellow-100 text-yellow-700',
    icon: Clock,
    iconColor: 'text-yellow-600',
    time: '5 hours ago',
  },
  {
    id: 3,
    type: 'Inspection Required',
    project: 'GIA-2024-156',
    description: 'Site inspection scheduled for tomorrow',
    priority: 'Medium',
    priorityColor: 'bg-yellow-100 text-yellow-700',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    time: '1 day ago',
  },
  {
    id: 4,
    type: 'Milestone Achieved',
    project: 'AG-2024-087',
    description: 'Infrastructure phase completed successfully',
    priority: 'Low',
    priorityColor: 'bg-green-100 text-green-700',
    icon: CheckCircle,
    iconColor: 'text-green-600',
    time: '1 day ago',
  },
  {
    id: 5,
    type: 'Fund Release',
    project: 'HST-2024-034',
    description: 'Second installment of ₹1.2Cr released',
    priority: 'Low',
    priorityColor: 'bg-green-100 text-green-700',
    icon: CheckCircle,
    iconColor: 'text-green-600',
    time: '2 days ago',
  },
];

export function AlertsFeed() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Alerts & Escalations</CardTitle>
        <Link to="/alerts" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.id}
                onClick={() => navigate('/alerts')}
                className="flex gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className={`p-2 rounded-lg bg-gray-50 h-fit`}>
                  <Icon className={`w-5 h-5 ${alert.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-900">{alert.type}</span>
                    <Badge className={alert.priorityColor}>{alert.priority}</Badge>
                  </div>
                  <p className="text-gray-600 mb-1">{alert.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">{alert.project}</span>
                    <span className="text-gray-400">{alert.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
