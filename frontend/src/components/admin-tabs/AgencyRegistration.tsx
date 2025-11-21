import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { api } from '../../services/api';
import { toast } from 'sonner';
import { locationData } from '../../data/locations';

export function AgencyRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Implementing',
    role: 'Implementing Agency',
    state: '',
    district: '',
    address: '',
    contactPerson: '',
    designation: '',
    phone: '',
    email: '',
    altPhone: '',
    altEmail: '',
    bankName: '',
    branchName: '',
    accountNumber: '',
    ifsc: '',
    registrationNumber: '',
    gstNumber: '',
    notes: '',
    components: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (key: string, value: string) => {
    if (key === 'state') {
      setFormData(prev => ({ ...prev, [key]: value, district: '' }));
    } else {
      setFormData(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData(prev => {
      const components = checked
        ? [...prev.components, id]
        : prev.components.filter(c => c !== id);
      return { ...prev, components };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Map form data to Agency type structure
      const agencyData: any = {
        name: formData.name,
        code: formData.code,
        type: formData.type,
        role: formData.role,
        state: formData.state,
        district: formData.district,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        components: formData.components,
        activeProjects: 0,
        performance: 100,
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      await api.agencies.create(agencyData);
      toast.success('Agency registered successfully');
      // Reset form
      setFormData({
        name: '',
        code: '',
        type: 'Implementing',
        role: 'Implementing Agency',
        state: '',
        district: '',
        address: '',
        contactPerson: '',
        designation: '',
        phone: '',
        email: '',
        altPhone: '',
        altEmail: '',
        bankName: '',
        branchName: '',
        accountNumber: '',
        ifsc: '',
        registrationNumber: '',
        gstNumber: '',
        notes: '',
        components: []
      });
    } catch (error) {
      console.error('Failed to register agency', error);
      toast.error('Failed to register agency');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Register New Agency</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details */}
            <div className="space-y-4">
              <h3 className="text-gray-900">Basic Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Agency Code</Label>
                  <Input id="code" value={formData.code} onChange={handleInputChange} placeholder="e.g., PWD-RJ-001" required />
                </div>
                <div>
                  <Label htmlFor="name">Agency Name</Label>
                  <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="Enter agency name" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Agency Type</Label>
                  <Select value={formData.type} onValueChange={(val) => handleSelectChange('type', val)}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PWD">PWD (Public Works Department)</SelectItem>
                      <SelectItem value="NGO">NGO</SelectItem>
                      <SelectItem value="PRI">PRI (Panchayati Raj Institution)</SelectItem>
                      <SelectItem value="State Department">State Department</SelectItem>
                      <SelectItem value="Central Agency">Central Agency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="role">Implementation Role</Label>
                  <Select value={formData.role} onValueChange={(val) => handleSelectChange('role', val)}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Implementing">Implementing Agency</SelectItem>
                      <SelectItem value="Executing">Executing Agency</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select value={formData.state} onValueChange={(val) => handleSelectChange('state', val)}>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(locationData).map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Select
                    value={formData.district}
                    onValueChange={(val) => handleSelectChange('district', val)}
                    disabled={!formData.state}
                  >
                    <SelectTrigger id="district">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.state && locationData[formData.state]?.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={formData.address} onChange={handleInputChange} placeholder="Enter complete address" required />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-gray-900">Contact Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPerson">Contact Person Name</Label>
                  <Input id="contactPerson" value={formData.contactPerson} onChange={handleInputChange} placeholder="Enter name" required />
                </div>
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input id="designation" value={formData.designation} onChange={handleInputChange} placeholder="Enter designation" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" required />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="contact@agency.gov.in" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="altPhone">Alternate Phone</Label>
                  <Input id="altPhone" value={formData.altPhone} onChange={handleInputChange} placeholder="+91 98765 43210" />
                </div>
                <div>
                  <Label htmlFor="altEmail">Alternate Email</Label>
                  <Input id="altEmail" type="email" value={formData.altEmail} onChange={handleInputChange} placeholder="alternate@agency.gov.in" />
                </div>
              </div>
            </div>

            {/* Component Assignment */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-gray-900">Component Assignment</h3>
              <p className="text-gray-600">Select the components this agency will handle</p>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Checkbox id="Adarsh Gram" checked={formData.components.includes('Adarsh Gram')} onCheckedChange={(checked) => handleCheckboxChange('Adarsh Gram', checked as boolean)} />
                  <label htmlFor="Adarsh Gram" className="text-gray-900 cursor-pointer">
                    Adarsh Gram (Model Village Development)
                  </label>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Checkbox id="GIA" checked={formData.components.includes('GIA')} onCheckedChange={(checked) => handleCheckboxChange('GIA', checked as boolean)} />
                  <label htmlFor="GIA" className="text-gray-900 cursor-pointer">
                    GIA (Grant-in-Aid Infrastructure)
                  </label>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Checkbox id="Hostel" checked={formData.components.includes('Hostel')} onCheckedChange={(checked) => handleCheckboxChange('Hostel', checked as boolean)} />
                  <label htmlFor="Hostel" className="text-gray-900 cursor-pointer">
                    Hostel (Student Accommodation)
                  </label>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-gray-900">Bank Account Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" value={formData.bankName} onChange={handleInputChange} placeholder="Enter bank name" />
                </div>
                <div>
                  <Label htmlFor="branchName">Branch Name</Label>
                  <Input id="branchName" value={formData.branchName} onChange={handleInputChange} placeholder="Enter branch name" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input id="accountNumber" value={formData.accountNumber} onChange={handleInputChange} placeholder="Enter account number" />
                </div>
                <div>
                  <Label htmlFor="ifsc">IFSC Code</Label>
                  <Input id="ifsc" value={formData.ifsc} onChange={handleInputChange} placeholder="Enter IFSC code" />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-gray-900">Additional Information</h3>

              <div>
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input id="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} placeholder="Enter registration number" />
              </div>

              <div>
                <Label htmlFor="gstNumber">GST Number (if applicable)</Label>
                <Input id="gstNumber" value={formData.gstNumber} onChange={handleInputChange} placeholder="Enter GST number" />
              </div>

              <div>
                <Label htmlFor="notes">Notes / Remarks</Label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Enter any additional information..."
                ></textarea>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register Agency'}
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => window.history.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
