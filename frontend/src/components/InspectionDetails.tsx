import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { ArrowLeft, MapPin, Calendar, User, Image as ImageIcon, Download, Edit2, Save, X } from 'lucide-react';
import { api } from '../services/api';
import { Inspection } from '../types';

export function InspectionDetails() {
  const { id } = useParams<{ id: string }>();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    const fetchInspection = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await api.inspections.getById(id);
        setInspection(data);
        setReviewText(data.detailedReview || '');
      } catch (error) {
        console.error('Failed to fetch inspection details', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInspection();
  }, [id]);

  const handleSaveReview = async () => {
    if (!inspection) return;
    try {
      await api.inspections.update(inspection.id, {
        detailedReview: reviewText,
        projectId: inspection.projectId
      });
      setInspection({ ...inspection, detailedReview: reviewText });
      setIsEditingReview(false);
    } catch (error) {
      console.error('Failed to update review', error);
      alert('Failed to update review');
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !inspection) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Optimistic Preview
    const reader = new FileReader();
    reader.onload = async (event) => {
      const previewUrl = event.target?.result as string;
      const previousImages = inspection.images || [];

      // Show preview immediately
      setInspection({ ...inspection, images: [...previousImages, previewUrl] });

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', `Site Photo - ${file.name}`);
        formData.append('type', 'Site Photo');
        formData.append('projectId', inspection.projectId);
        formData.append('category', 'Inspection');

        // Upload document
        const doc = await api.documents.create(formData);

        // Update inspection images with real URL
        const newImages = [...previousImages, doc.url];
        await api.inspections.update(inspection.id, {
          images: newImages,
          projectId: inspection.projectId
        });

        setInspection({ ...inspection, images: newImages });
        alert('Photo uploaded successfully');
      } catch (error) {
        console.error('Failed to upload photo', error);
        alert('Failed to upload photo');
        setInspection({ ...inspection, images: previousImages }); // Revert on failure
      }
    };
    reader.readAsDataURL(file);
  };

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
                <h1 className="text-gray-900">
                  {inspection.customId || (inspection.comments?.match(/^\[ID: (.+?)\]/)?.[1]) || inspection.id}
                </h1>
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
                <p className="text-gray-900">{inspection.date?.split('T')[0]}</p>
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
                <p className="text-blue-700">
                  {typeof inspection.geoLocation === 'object' && inspection.geoLocation
                    ? `${(inspection.geoLocation as any).lat}, ${(inspection.geoLocation as any).lng}`
                    : inspection.geoLocation as string}
                </p>
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Detailed Review</CardTitle>
          {!isEditingReview ? (
            <Button variant="ghost" size="sm" onClick={() => setIsEditingReview(true)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEditingReview(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveReview}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isEditingReview ? (
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="min-h-[150px]"
              placeholder="Enter detailed review..."
            />
          ) : (
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {inspection.detailedReview || 'No detailed review available. This section contains in-depth analysis and recommendations based on the site visit.'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Site Images */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Site Images</CardTitle>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
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
                    <Button variant="secondary" size="sm" onClick={() => window.open(img, '_blank')}>View</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No images uploaded yet</p>
              <Button variant="link" className="mt-1" onClick={() => fileInputRef.current?.click()}>Click to upload site photos</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
