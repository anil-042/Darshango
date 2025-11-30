import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertTriangle, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Alert, Project } from '../types';

export function AlertsFeed() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertsData, projectsData] = await Promise.all([
          api.alerts.getAll(),
          api.projects.getAll()
        ]);
        // Get only the 5 most recent alerts
        setAlerts(alertsData.slice(0, 5));
        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProjectId = (projectDbId: string) => {
    const project = projects.find(p => p.id === projectDbId);
    return project?.projectId || 'N/A';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return { Icon: AlertTriangle, color: 'text-red-600' };
      case 'medium':
        return { Icon: Clock, color: 'text-yellow-600' };
      case 'low':
        return { Icon: CheckCircle, color: 'text-green-600' };
      default:
        return { Icon: AlertTriangle, color: 'text-gray-600' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Alerts & Escalations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Loading alerts...</div>
        </CardContent>
      </Card>
    );
  }

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
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No alerts at this time</div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const { Icon, color: iconColor } = getIcon(alert.priority);
              return (
                <div
                  key={alert.id}
                  onClick={() => navigate('/alerts')}
                  className="flex gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className={`p-2 rounded-lg bg-gray-50 h-fit`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-900">{alert.type}</span>
                      <Badge className={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
                    </div>
                    <p className="text-gray-600 mb-1">{alert.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Project ID: {getProjectId(alert.projectId)}</span>
                      <span className="text-gray-400">{formatDate(alert.date)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
