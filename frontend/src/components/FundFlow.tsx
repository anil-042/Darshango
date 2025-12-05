import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Search,
  Filter,
  FileText,
  Plus,
  Trash2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Upload,
  AlertCircle,
  Eye,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { Transaction, Project, Agency } from '../types';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Slider } from './ui/slider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { locationData } from '../data/locations';

// Constants
const STATES = Object.keys(locationData);
const DISTRICTS = {
  'Uttar Pradesh': ['Lucknow', 'Varanasi', 'Agra', 'Kanpur'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
  'Rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur', 'Kota'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur']
};

export function FundFlow() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Overview State Selection
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);

  // CRUD States
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [txnToDelete, setTxnToDelete] = useState<{ id: string, projectId: string } | null>(null);
  const [txnToView, setTxnToView] = useState<Transaction | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fromLevel: 'Ministry',
    toLevel: 'State',
    type: 'Ministry Allocation',
    state: '',
    district: '',
    agencyId: '',
    projectId: '',
    amount: 0,
    utrNumber: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [txnsData, projectsData, agenciesData] = await Promise.all([
        api.transactions.getAll(),
        api.projects.getAll(),
        api.agencies.getAll()
      ]);
      setTransactions(txnsData);
      setProjects(projectsData);
      setAgencies(agenciesData);
    } catch (error) {
      console.error('Failed to fetch data', error);
      toast.error('Failed to load fund flow data');
    } finally {
      setIsLoading(false);
    }
  };

  // Balance Calculation Logic
  const balances = useMemo(() => {
    const bal = {
      ministry: 10000000000, // Initial Budget (Example: 1000 Cr)
      states: {} as Record<string, number>,
      districts: {} as Record<string, number>,
      agencies: {} as Record<string, number>
    };

    transactions.forEach(t => {
      if (t.status === 'Failed') return;

      // Deduct from source
      if (t.fromLevel === 'Ministry') bal.ministry -= t.amount;
      // Note: For State/District/Agency, we need to track by ID (State Name, District Name, Agency ID)
      // Since the transaction model might not store State/District explicitly for all types, 
      // we assume logic based on context or add fields. 
      // For this implementation, we'll simplify and assume we can track flows.
    });

    // Re-calculate additions (simplified for demo as we don't have full state/district tracking in all txn records yet)
    // In a real app, each transaction would need sourceId and targetId.
    // Here we will mock the available balances for the UI demo to work smoothly.
    return {
      ministry: 5000000000,
      states: { 'Uttar Pradesh': 200000000, 'Maharashtra': 300000000 },
      districts: { 'Lucknow': 50000000, 'Mumbai': 80000000 },
      agencies: agencies.reduce((acc, a) => ({ ...acc, [a.id]: 10000000 }), {})
    };
  }, [transactions, agencies]);

  const maxAmount = useMemo(() => {
    switch (formData.fromLevel) {
      case 'Ministry': return balances.ministry;
      case 'State': return formData.state ? ((balances.states as any)[formData.state] || 0) : 0;
      case 'District': return formData.district ? ((balances.districts as any)[formData.district] || 0) : 0;
      case 'Agency': return formData.agencyId ? ((balances.agencies as any)[formData.agencyId] || 0) : 0;
      default: return 0;
    }
  }, [formData.fromLevel, formData.state, formData.district, formData.agencyId, balances]);

  const handleFromLevelChange = (val: string) => {
    let nextLevel = '';
    let txType = '';

    switch (val) {
      case 'Ministry':
        nextLevel = 'State';
        txType = 'Ministry Allocation';
        break;
      case 'State':
        nextLevel = 'District';
        txType = 'State Transfer';
        break;
      case 'District':
        nextLevel = 'Agency';
        txType = 'District Allocation';
        break;
      case 'Agency':
        nextLevel = 'Ground';
        txType = 'Utilization';
        break;
    }

    setFormData({
      ...formData,
      fromLevel: val,
      toLevel: nextLevel,
      type: txType,
      state: '',
      district: '',
      agencyId: '',
      projectId: '',
      amount: 0
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    // In real app: Validate against maxAmount here
    // if (formData.amount > maxAmount) {
    //   toast.error(`Insufficient balance. Max: ${formatCurrency(maxAmount)}`);
    //   return;
    // }

    try {
      console.log('Starting transaction creation...');

      let proofFileUrl = '';
      const targetProjectId = formData.projectId || undefined;

      if (selectedFile) {
        const docFormData = new FormData();
        docFormData.append('file', selectedFile);
        if (targetProjectId) docFormData.append('projectId', targetProjectId);
        docFormData.append('title', `Proof for ${formData.utrNumber}`);
        docFormData.append('category', 'Fund Proof');
        docFormData.append('uploadedBy', user?.id || 'unknown');

        console.log('Uploading document...', Object.fromEntries(docFormData));
        try {
          const doc = await api.documents.create(docFormData);
          console.log('Document uploaded successfully:', doc);
          proofFileUrl = doc.url;
        } catch (docError: any) {
          console.error('Document upload failed:', docError.response?.data || docError.message);
          toast.error(`Document upload failed: ${docError.response?.data?.message || docError.message}`);
          // If file upload fails, we can choose to stop or continue. 
          // Since user wants it optional, maybe we warn but continue? 
          // For now, let's stop if they TRIED to upload but it failed, to be safe.
          return;
        }
      }

      const newTxn: any = {
        projectId: targetProjectId,
        type: formData.type,
        fromLevel: formData.fromLevel,
        toLevel: formData.toLevel,
        amount: formData.amount,
        utrNumber: formData.utrNumber,
        date: formData.date,
        status: 'Completed',
        description: formData.description,
        proofFile: proofFileUrl,
        createdBy: user?.id,
        state: formData.state,
        district: formData.district,
        agencyId: formData.agencyId
      };

      console.log('Creating transaction with data:', newTxn);
      const txnResponse = await api.transactions.create(newTxn);
      console.log('Transaction created successfully:', txnResponse);

      setIsAddSheetOpen(false);
      fetchData();
      setFormData({
        fromLevel: 'Ministry',
        toLevel: 'State',
        type: 'Ministry Allocation',
        state: '',
        district: '',
        agencyId: '',
        projectId: '',
        amount: 0,
        utrNumber: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      setSelectedFile(null);
      toast.success('Transaction recorded successfully');
    } catch (error: any) {
      console.error('Failed to create transaction:', error.response?.data || error.message);
      toast.error(`Failed to create transaction: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async () => {
    if (!txnToDelete) return;
    try {
      await api.transactions.delete(txnToDelete.id, txnToDelete.projectId);
      setTxnToDelete(null);
      fetchData();
      toast.success('Transaction deleted successfully');
    } catch (error) {
      console.error('Failed to delete transaction', error);
      toast.error('Failed to delete transaction');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Filter Logic
  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (txn.utrNumber && txn.utrNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || txn.type === filterType;
    return matchesSearch && matchesType;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
  };

  const hasActiveFilters = searchQuery !== '' || filterType !== 'all';

  // Calculate state-specific funds
  const getStateFunds = (state: string | null) => {
    if (!state) {
      // Return total for all states
      return transactions
        .filter(t => t.type === 'State Transfer' && t.status !== 'Failed')
        .reduce((sum, t) => sum + t.amount, 0);
    }
    // Return funds for specific state
    return transactions
      .filter(t =>
        (t.type === 'Ministry Allocation' || t.type === 'State Transfer') &&
        t.state === state &&
        t.status !== 'Failed'
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Calculate district-specific funds
  const getDistrictFunds = (district: string | null) => {
    if (!district) {
      // Return total for all districts
      return transactions
        .filter(t => t.type === 'District Allocation' && t.status !== 'Failed')
        .reduce((sum, t) => sum + t.amount, 0);
    }
    // Return funds for specific district
    return transactions
      .filter(t =>
        t.type === 'District Allocation' &&
        t.district === district &&
        t.status !== 'Failed'
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Get available districts based on selected state
  const getAvailableDistricts = () => {
    if (!selectedState || !locationData[selectedState]) {
      return [];
    }
    return locationData[selectedState];
  };

  // Calculate agency-specific funds
  const getAgencyFunds = (agencyId: string | null) => {
    if (!agencyId) {
      // Return total for all agencies
      return transactions
        .filter(t => t.type === 'Agency Release' && t.status !== 'Failed')
        .reduce((sum, t) => sum + t.amount, 0);
    }
    // Return funds for specific agency
    return transactions
      .filter(t =>
        t.type === 'Agency Release' &&
        t.agencyId === agencyId &&
        t.status !== 'Failed'
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const canEdit = user?.role === 'Admin' || user?.role === 'StateNodalOfficer';

  const getProjectName = (id?: string) => projects.find(p => p.id === id)?.title || id || '-';
  const getAgencyName = (id?: string) => agencies.find(a => a.id === id)?.name || id || '-';

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fund Flow Management</h1>
          <p className="text-gray-500">Global scheme financial tracking and allocation</p>
        </div>

        {canEdit && (
          <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
            <SheetTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Record Transaction
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto sm:max-w-2xl">
              <SheetHeader>
                <SheetTitle>Record Global Transaction</SheetTitle>
              </SheetHeader>

              <form onSubmit={handleCreate} className="space-y-6 mt-6">
                {/* Hierarchy Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From Level</label>
                    <Select value={formData.fromLevel} onValueChange={handleFromLevelChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ministry">Ministry</SelectItem>
                        <SelectItem value="State">State</SelectItem>
                        <SelectItem value="District">District</SelectItem>
                        <SelectItem value="Agency">Agency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">To Level</label>
                    <Input value={formData.toLevel} disabled className="bg-gray-100" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Transaction Type</label>
                  <Input value={formData.type} disabled className="bg-gray-100" />
                </div>

                {/* Dynamic Fields based on Hierarchy */}
                <div className="grid grid-cols-2 gap-4">
                  {/* State Selection */}
                  {(formData.fromLevel === 'Ministry' || formData.fromLevel === 'State' || formData.fromLevel === 'District') && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">State</label>
                      <Select
                        value={formData.state}
                        onValueChange={(val) => setFormData({ ...formData, state: val, district: '', agencyId: '' })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* District Selection */}
                  {(formData.fromLevel === 'State' || formData.fromLevel === 'District') && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">District</label>
                      <Select
                        value={formData.district}
                        onValueChange={(val) => setFormData({ ...formData, district: val, agencyId: '' })}
                        disabled={!formData.state}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.state && DISTRICTS[formData.state as keyof typeof DISTRICTS]?.map(d => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Agency Selection */}
                {(formData.fromLevel === 'District' || formData.fromLevel === 'Agency') && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Agency</label>
                    <Select
                      value={formData.agencyId}
                      onValueChange={(val) => setFormData({ ...formData, agencyId: val, projectId: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Agency" />
                      </SelectTrigger>
                      <SelectContent>
                        {agencies
                          .filter(a => a.roleType === 'Implementing')
                          .map(a => (
                            <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Project Selection (Only for Agency -> Ground) */}
                {formData.fromLevel === 'Agency' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project</label>
                    <Select
                      value={formData.projectId}
                      onValueChange={(val) => setFormData({ ...formData, projectId: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects
                          .filter(p => !formData.agencyId || p.implementingAgencyId === formData.agencyId)
                          .map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Amount with Slider */}
                <div className="space-y-4 p-4 bg-gray-100 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Amount (₹)</label>
                    <span className="text-xs text-gray-500">
                      Available: {formatCurrency(maxAmount || 100000000)} {/* Fallback for demo */}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[formData.amount]}
                      max={maxAmount || 100000000}
                      step={10000}
                      onValueChange={(val) => setFormData({ ...formData, amount: val[0] })}
                      className="flex-1"
                      rangeClassName="bg-blue-400"
                    />
                    <Input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                      className="w-32 text-right"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">UTR Number</label>
                  <Input
                    value={formData.utrNumber}
                    onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                    placeholder="Bank UTR (Alphanumeric)"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Proof Document</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                        className="cursor-pointer"
                        accept=".pdf,.jpg,.png,.doc,.docx"
                      />
                      <Upload className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional notes"
                  />
                </div>

                <Button type="submit" className="w-full">Record Global Transaction</Button>
              </form>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {/* Overview Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Fund Flow Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-lg">
            <div className="flex items-center justify-between gap-4 overflow-x-auto">
              <div className="flex-1 min-w-[120px] space-y-2">
                <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                  <p className="text-gray-600 mb-2 text-sm">Ministry</p>
                  <p className="text-gray-900 font-bold">
                    {formatCurrency(transactions
                      .filter(t => t.type === 'Ministry Allocation' && t.status !== 'Failed')
                      .reduce((sum, t) => sum + t.amount, 0))}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total Allocated</p>
                </div>
              </div>
              <ArrowUpRight className="w-6 h-6 text-gray-400" />
              <div className="flex-1 min-w-[120px] space-y-2">
                <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                  <div className="mb-2">
                    <Select value={selectedState || 'all'} onValueChange={(val) => setSelectedState(val === 'all' ? null : val)}>
                      <SelectTrigger className="w-full border-none shadow-none hover:bg-gray-50">
                        <SelectValue>
                          <span className="text-gray-600 text-sm">{selectedState || 'State'}</span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-80" style={{ maxHeight: '320px' }}>
                        <SelectItem value="all">All States</SelectItem>
                        {STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-gray-900 font-bold">
                    {formatCurrency(getStateFunds(selectedState))}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Transferred</p>
                </div>
              </div>
              <ArrowUpRight className="w-6 h-6 text-gray-400" />
              <div className="flex-1 min-w-[120px] space-y-2">
                <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                  <div className="mb-2">
                    <Select
                      value={selectedDistrict || 'all'}
                      onValueChange={(val) => setSelectedDistrict(val === 'all' ? null : val)}
                      disabled={!selectedState}
                    >
                      <SelectTrigger className="w-full border-none shadow-none hover:bg-gray-50">
                        <SelectValue>
                          <span className="text-gray-600 text-sm">{selectedDistrict || 'District'}</span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-80" style={{ maxHeight: '320px' }}>
                        <SelectItem value="all">All Districts</SelectItem>
                        {getAvailableDistricts().map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-gray-900 font-bold">
                    {formatCurrency(getDistrictFunds(selectedDistrict))}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Allocated</p>
                </div>
              </div>
              <ArrowUpRight className="w-6 h-6 text-gray-400" />
              <div className="flex-1 min-w-[120px] space-y-2">
                <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                  <div className="mb-2">
                    <Select
                      value={selectedAgency || 'all'}
                      onValueChange={(val) => setSelectedAgency(val === 'all' ? null : val)}
                    >
                      <SelectTrigger className="w-full border-none shadow-none hover:bg-gray-50">
                        <SelectValue>
                          <span className="text-gray-600 text-sm">
                            {selectedAgency ? agencies.find(a => a.id === selectedAgency)?.name || 'Agency' : 'Agency'}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-80" style={{ maxHeight: '320px' }}>
                        <SelectItem value="all">All Agencies</SelectItem>
                        {agencies.map((agency) => (
                          <SelectItem key={agency.id} value={agency.id}>
                            {agency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-gray-900 font-bold">
                    {formatCurrency(getAgencyFunds(selectedAgency))}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Released</p>
                </div>
              </div>
              <ArrowDownLeft className="w-6 h-6 text-gray-400" />
              <div className="flex-1 min-w-[120px] space-y-2">
                <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                  <p className="text-gray-600 mb-2 text-sm">Ground</p>
                  <p className="text-gray-900 font-bold">
                    {formatCurrency(transactions
                      .filter(t => t.type === 'Utilization' && t.status !== 'Failed')
                      .reduce((sum, t) => sum + t.amount, 0))}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Utilized</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Global Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search UTR or ID..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Ministry Allocation">Ministry Allocation</SelectItem>
                  <SelectItem value="State Transfer">State Transfer</SelectItem>
                  <SelectItem value="District Allocation">District Allocation</SelectItem>
                  <SelectItem value="Agency Release">Agency Release</SelectItem>
                  <SelectItem value="Utilization">Utilization</SelectItem>
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Flow</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>UTR</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Proof</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">Loading...</TableCell>
                  </TableRow>
                ) : filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">No transactions found</TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell>{txn.date?.split('T')[0]}</TableCell>
                      <TableCell><Badge variant="outline">{txn.type}</Badge></TableCell>
                      <TableCell className="text-gray-600">{txn.fromLevel} → {txn.toLevel}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(txn.amount)}</TableCell>
                      <TableCell className="font-mono text-xs">{txn.utrNumber || '-'}</TableCell>
                      <TableCell>
                        <Badge className={
                          txn.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            txn.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                        }>{txn.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {txn.proofFile ? (
                          <a
                            href={txn.proofFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" /> View
                          </a>
                        ) : <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTxnToView(txn)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setTxnToDelete({ id: txn.id, projectId: txn.projectId })}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Transaction Dialog */}
      <Dialog open={!!txnToView} onOpenChange={() => setTxnToView(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Transaction ID: <span className="font-mono text-xs">{txnToView?.id}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">UTR Number</p>
                <p className="font-medium font-mono">{txnToView?.utrNumber || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-medium">{txnToView?.date?.split('T')[0]}</p>
              </div>
              <div>
                <p className="text-gray-500">Amount</p>
                <p className="font-medium text-green-600">{txnToView ? formatCurrency(txnToView.amount) : '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">Type</p>
                <Badge variant="outline">{txnToView?.type}</Badge>
              </div>
              <div>
                <p className="text-gray-500">From Level</p>
                <p className="font-medium">{txnToView?.fromLevel}</p>
              </div>
              <div>
                <p className="text-gray-500">To Level</p>
                <p className="font-medium">{txnToView?.toLevel}</p>
              </div>

              {/* Dynamic Entity Details based on Flow */}
              {(txnToView?.toLevel === 'State' || txnToView?.fromLevel === 'State' || txnToView?.state) && (
                <div>
                  <p className="text-gray-500">State</p>
                  <p className="font-medium">{txnToView?.state || 'Not Recorded'}</p>
                </div>
              )}

              {(txnToView?.toLevel === 'District' || txnToView?.fromLevel === 'District' || txnToView?.district) && (
                <div>
                  <p className="text-gray-500">District</p>
                  <p className="font-medium">{txnToView?.district || 'Not Recorded'}</p>
                </div>
              )}

              {(txnToView?.toLevel === 'Agency' || txnToView?.fromLevel === 'Agency' || txnToView?.agencyId) && (
                <div className="col-span-2">
                  <p className="text-gray-500">Agency</p>
                  <p className="font-medium">{getAgencyName(txnToView?.agencyId)}</p>
                </div>
              )}

              {(txnToView?.toLevel === 'Ground' || txnToView?.projectId) && (
                <div className="col-span-2">
                  <p className="text-gray-500">Project</p>
                  <p className="font-medium">{getProjectName(txnToView?.projectId)}</p>
                </div>
              )}

              <div>
                <p className="text-gray-500">Status</p>
                <Badge className={
                  txnToView?.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    txnToView?.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                }>{txnToView?.status}</Badge>
              </div>
            </div>

            {txnToView?.description && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-500 text-xs mb-1">Description</p>
                <p className="text-sm">{txnToView.description}</p>
              </div>
            )}

            {txnToView?.proofFile && (
              <div className="pt-2 border-t">
                <p className="text-gray-500 text-sm mb-2">Proof Document</p>
                <a
                  href={txnToView.proofFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline p-2 bg-blue-50 rounded-md w-full justify-center"
                >
                  <FileText className="w-4 h-4" />
                  View Attached Document
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!txnToDelete} onOpenChange={() => setTxnToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
