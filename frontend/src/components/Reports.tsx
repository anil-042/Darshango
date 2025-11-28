import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Download, FileText, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import { Project } from '../types';

const reportTemplates = [
  {
    id: 1,
    title: 'State-wise Performance Report',
    description: 'Comprehensive performance analysis across all states',
    icon: BarChart3,
    type: 'Performance',
  },
  {
    id: 2,
    title: 'Component-wise Utilization Report',
    description: 'Fund utilization breakdown by component (Adarsh Gram, GIA, Hostel)',
    icon: TrendingUp,
    type: 'Financial',
  },
  {
    id: 3,
    title: 'Delayed Projects Report',
    description: 'List of all delayed projects with reasons and remedial actions',
    icon: Calendar,
    type: 'Monitoring',
  },
  {
    id: 4,
    title: 'Monthly Snapshot Report',
    description: 'Month-wise project progress and fund utilization',
    icon: FileText,
    type: 'Progress',
  },
  {
    id: 5,
    title: 'Agency Performance Report',
    description: 'Performance metrics for all implementing and executing agencies',
    icon: BarChart3,
    type: 'Performance',
  },
  {
    id: 6,
    title: 'Inspection Summary Report',
    description: 'Summary of all inspections conducted with ratings and findings',
    icon: FileText,
    type: 'Monitoring',
  },
];

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('current-quarter');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // State for charts
  const [statePerformance, setStatePerformance] = useState<any[]>([]);
  const [componentUtilization, setComponentUtilization] = useState<any[]>([]);
  const [delayedStats, setDelayedStats] = useState({
    critical: 0,
    major: 0,
    minor: 0,
    onTrack: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await api.projects.getAll();
      setProjects(data);
      processData(data);
    } catch (error) {
      console.error('Failed to fetch projects for reports', error);
    } finally {
      setLoading(false);
    }
  };

  const processData = (data: Project[]) => {
    // 1. State-wise Performance
    const stateMap = new Map<string, { projects: number, completed: number, funds: number }>();

    data.forEach(p => {
      const state = p.state || 'Unknown';
      const current = stateMap.get(state) || { projects: 0, completed: 0, funds: 0 };

      current.projects += 1;
      if (p.status === 'Completed') current.completed += 1;
      current.funds += p.estimatedCost || 0;

      stateMap.set(state, current);
    });

    const stateChartData = Array.from(stateMap.entries()).map(([state, stats]) => ({
      state,
      projects: stats.projects,
      completion: Math.round((stats.completed / stats.projects) * 100) || 0,
      funds: stats.funds
    }));
    setStatePerformance(stateChartData);

    // 2. Component-wise Utilization
    const compMap = new Map<string, { value: number, allocated: number }>();

    data.forEach(p => {
      const comp = p.component || 'Other';
      const current = compMap.get(comp) || { value: 0, allocated: 0 };

      // Assuming 'value' is utilized amount (mock logic: 70% of cost) and 'allocated' is estimated cost
      current.allocated += p.estimatedCost || 0;
      current.value += (p.estimatedCost || 0) * (p.progress / 100); // Utilized proportional to progress

      compMap.set(comp, current);
    });

    const compChartData = Array.from(compMap.entries()).map(([name, stats]) => ({
      name,
      value: Math.round(stats.value),
      allocated: Math.round(stats.allocated)
    }));
    setComponentUtilization(compChartData);

    // 3. Delayed Stats
    let critical = 0, major = 0, minor = 0, onTrack = 0;
    const today = new Date();

    data.forEach(p => {
      if (p.status === 'Completed') {
        onTrack++;
        return;
      }

      if (p.status === 'Delayed') {
        // Mock logic for delay severity since we don't have exact delay days
        // In a real app, we'd compare today vs p.endDate
        const endDate = new Date(p.endDate);
        const diffTime = Math.abs(today.getTime() - endDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (today > endDate) {
          if (diffDays > 30) critical++;
          else if (diffDays > 15) major++;
          else minor++;
        } else {
          // Marked delayed but date hasn't passed? Treat as minor
          minor++;
        }
      } else {
        onTrack++;
      }
    });

    setDelayedStats({ critical, major, minor, onTrack });
  };

  // Mock monthly data since we don't have historical snapshots
  const monthlyProgress = [
    { month: 'May', projects: 42, completed: 8 },
    { month: 'Jun', projects: 48, completed: 12 },
    { month: 'Jul', projects: 55, completed: 15 },
    { month: 'Aug', projects: 61, completed: 18 },
    { month: 'Sep', projects: 68, completed: 22 },
    { month: 'Oct', projects: 72, completed: 25 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1">Reports & Analytics</h1>
        <p className="text-gray-500">Generate and export comprehensive reports</p>
      </div>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <div
                  key={template.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900 mb-1">{template.title}</h4>
                      <Badge variant="outline">{template.type}</Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{template.description}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Download className="w-3 h-3" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Download className="w-3 h-3" />
                      Excel
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Period Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Analytics Dashboard</CardTitle>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-month">Current Month</SelectItem>
                <SelectItem value="current-quarter">Current Quarter</SelectItem>
                <SelectItem value="current-year">Current Year</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* State-wise Performance Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>State-wise Performance</CardTitle>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="w-3 h-3" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statePerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="projects" fill="#3b82f6" name="Total Projects" />
              <Bar dataKey="completion" fill="#10b981" name="Avg Completion %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Component-wise Utilization */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Component-wise Fund Utilization</CardTitle>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="w-3 h-3" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={componentUtilization}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Amount (₹ Cr)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="allocated" fill="#94a3b8" name="Allocated" />
                <Bar dataKey="value" fill="#3b82f6" name="Utilized" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Progress Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Monthly Progress Trend</CardTitle>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="w-3 h-3" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="projects" stroke="#3b82f6" name="Active Projects" strokeWidth={2} />
                <Line type="monotone" dataKey="completed" stroke="#10b981" name="Completed" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Delayed Projects Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Delayed Projects Summary</CardTitle>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="w-3 h-3" />
              Export List
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-red-600 mb-1">Critical Delay</p>
              <p className="text-red-900">{delayedStats.critical} projects</p>
              <p className="text-red-700">&gt; 30 days delayed</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-orange-600 mb-1">Major Delay</p>
              <p className="text-orange-900">{delayedStats.major} projects</p>
              <p className="text-orange-700">15-30 days delayed</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-600 mb-1">Minor Delay</p>
              <p className="text-yellow-900">{delayedStats.minor} projects</p>
              <p className="text-yellow-700">1-15 days delayed</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-green-600 mb-1">On Track</p>
              <p className="text-green-900">{delayedStats.onTrack} projects</p>
              <p className="text-green-700">No delays</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}