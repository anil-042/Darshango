import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Building2, MapPin, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { MilestonesTab } from './project-tabs/MilestonesTab';
import { FundFlowTab } from './project-tabs/FundFlowTab';
import { DocumentsTab } from './project-tabs/DocumentsTab';
import { InspectionsTab } from './project-tabs/InspectionsTab';
import { api } from '../services/api';
import { Project } from '../types';

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        // In a real app, we would have a getById method. 
        // For now, we filter from getAll since getById might not be implemented in the mock service yet
        // or we can implement getById in api.ts if not present.
        // Checking api.ts previously, it didn't have getById explicitly shown in the summary but likely has it or we can filter.
        // Let's assume we need to filter for now to be safe, or better, add getById to api.ts if missing.
        // Actually, let's try to find it from the list.
        const projects = await api.projects.getAll();
        const found = projects.find(p => p.id === id);
        setProject(found || null);
      } catch (error) {
        console.error('Failed to fetch project details', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (isLoading) {
    return <div className="p-6 text-center">Loading project details...</div>;
  }

  if (!project) {
    return (
      <div className="p-6">
        <p>Project not found</p>
        <Link to="/projects">
          <Button variant="link">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  const statusColor = project.status === 'Completed' ? 'bg-green-100 text-green-700' :
    project.status === 'Delayed' ? 'bg-red-100 text-red-700' :
      'bg-blue-100 text-blue-700';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>

      {/* Header Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-gray-900 text-xl font-bold">{project.title}</h1>
                    <Badge className={statusColor}>{project.status}</Badge>
                  </div>
                  <p className="text-gray-500 mb-2">{project.id}</p>
                  <Badge variant="outline">{project.component}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Implementing Agency</p>
                    <p className="text-gray-900 font-medium">{project.implementingAgencyId}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Executing Agency</p>
                    <p className="text-gray-900 font-medium">{project.executingAgencyId}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Location</p>
                    <p className="text-gray-900 font-medium">{project.district}, {project.state}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Timeline</p>
                    <p className="text-gray-900 font-medium">{project.startDate} to {project.endDate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-64">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <p className="text-gray-700 text-center mb-4 font-medium">Overall Progress</p>
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="10"
                      strokeDasharray={`${project.progress * 2.83} 283`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-blue-900 font-bold text-xl">{project.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500 mb-1 text-sm">Total Budget</p>
            <p className="text-gray-900 font-bold text-lg">₹{(project.estimatedCost / 10000000).toFixed(2)} Cr</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500 mb-1 text-sm">Funds Released</p>
            <p className="text-gray-900 font-bold text-lg">₹{((project.estimatedCost * 0.7) / 10000000).toFixed(2)} Cr</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500 mb-1 text-sm">Funds Utilized</p>
            <p className="text-gray-900 font-bold text-lg">₹{((project.estimatedCost * 0.5) / 10000000).toFixed(2)} Cr</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="fundflow">Fund Flow</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="inspections">Inspections</TabsTrigger>
              <TabsTrigger value="logs">Audit Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-900 mb-3 font-semibold">Project Description</h3>
                  <p className="text-gray-600">
                    Comprehensive development project aimed at transforming {project.district} into a model district
                    through infrastructure development, sanitation facilities, water supply systems, and community amenities.
                  </p>
                </div>

                <div>
                  <h3 className="text-gray-900 mb-3 font-semibold">Key Objectives</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-600">Improve village infrastructure and connectivity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-600">Provide clean drinking water and sanitation facilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-600">Establish community centers and recreational facilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <span className="text-gray-600">Implement renewable energy solutions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="milestones" className="mt-6">
              <MilestonesTab projectId={project.id} />
            </TabsContent>

            <TabsContent value="fundflow" className="mt-6">
              <FundFlowTab projectId={project.id} />
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <DocumentsTab projectId={project.id} />
            </TabsContent>

            <TabsContent value="inspections" className="mt-6">
              <InspectionsTab projectId={project.id} />
            </TabsContent>

            <TabsContent value="logs" className="mt-6">
              <div className="space-y-3">
                {[
                  { action: 'Project status updated to "In Progress"', user: 'Admin User', date: '2024-11-20 10:30' },
                  { action: 'Fund release approved - ₹50L', user: 'Finance Officer', date: '2024-11-19 14:15' },
                ].map((log, idx) => (
                  <div key={idx} className="flex justify-between items-start p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-gray-900">{log.action}</p>
                      <p className="text-gray-500">By {log.user}</p>
                    </div>
                    <p className="text-gray-400">{log.date}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
