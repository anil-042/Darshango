import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, MapPin, Calendar, User, Image as ImageIcon, Download } from 'lucide-react';
import { api } from '../services/api';
import { Inspection } from '../types';

export function InspectionDetails() {
  const { id } = useParams<{ id: string }>();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInspection = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const allInspections = await api.inspections.getAll();
        const found = allInspections.find(i => i.id === id);
        setInspection(found || null);
      } catch (error) {
        console.error('Failed to fetch inspection details', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInspection();
  }, [id]);

  if (isLoading) {
    return <div className="p-6">Loading inspection details...</div>;
  }

  if (!inspection) {
    return (
      <div className="p-6">
        <p>Inspection not found</p>
        <Link to="/monitoring">
          <Button variant="link">Back to Inspections</Button>
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Scheduled': return 'bg-blue-100 text-blue-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Good': return 'bg-green-100 text-green-700';
      case 'Satisfactory': return 'bg-blue-100 text-blue-700';
      case 'Needs Attention': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/monitoring">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inspections
          </Button>
        </Link>
      </div>

      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-gray-900">{inspection.id}</h1>
                <Badge className={getStatusColor(inspection.status)}>{inspection.status}</Badge>
                <Badge className={getRatingColor(inspection.rating)}>{inspection.rating}</Badge>
              </div>
              <p className="text-gray-600 mb-4">Project ID: {inspection.projectId}</p>
            </div>
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF Report
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-gray-400 mt-1" />
              <div>
                <p className="text-gray-500">Inspector</p>
                <p className="text-gray-900">{inspection.inspectorName || inspection.inspectorId || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-gray-400 mt-1" />
              <div>
                <p className="text-gray-500">Inspection Date</p>
                <p className="text-gray-900">{inspection.date}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-1" />
              <div>
                <p className="text-gray-500">Location</p>
                <p className="text-gray-900">{inspection.location || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geo-location */}
      {inspection.geoLocation && (
        <Card>
          <CardHeader>
            <CardTitle>Geo-location Tag</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-blue-900">GPS Coordinates</p>
                <p className="text-blue-700">{inspection.geoLocation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Observations */}
      <Card>
        <CardHeader>
          <CardTitle>Observations & Findings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 leading-relaxed">{inspection.findings || inspection.comments || 'No observations recorded.'}</p>
        </CardContent>
      </Card>

      {/* Detailed Review */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Review</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
            {inspection.detailedReview || 'No detailed review available. This section contains in-depth analysis and recommendations based on the site visit.'}
          </p>
        </CardContent>
      </Card>

      {/* Site Images */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Site Images</CardTitle>
            <Button variant="outline" size="sm">
              <ImageIcon className="w-4 h-4 mr-2" />
              Upload Photos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {inspection.images && inspection.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {inspection.images.map((img, index) => (
                <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative group">
                  <img src={img} alt={`Site photo ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No images uploaded yet</p>
              <Button variant="link" className="mt-1">Click to upload site photos</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
