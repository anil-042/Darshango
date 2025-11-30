import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { FileText, Plus, Upload, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { api } from '../../services/api';
import { Transaction } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { locationData } from '../../data/locations';

interface FundFlowTabProps {
  projectId: string;
}

export function FundFlowTab({ projectId }: FundFlowTabProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    type: 'Utilization',
    fromLevel: 'Agency',
    toLevel: 'Ground',
    amount: '',
    utrNumber: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    description: '',
    state: '',
    district: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, [projectId]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const projectTxns = await api.transactions.getByProject(projectId);
      setTransactions(projectTxns);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const amount = parseFloat(formData.amount);
      if (!amount || amount <= 0) {
        toast.error('Please enter a valid positive amount');
        return;
      }

      let proofFileUrl = '';
      if (selectedFile) {
        const docFormData = new FormData();
        docFormData.append('file', selectedFile);
        docFormData.append('projectId', projectId);
        docFormData.append('title', `Proof for ${formData.utrNumber || 'Transaction'}`);
        docFormData.append('category', 'Fund Proof');
        docFormData.append('uploadedBy', user?.id || 'unknown');

        try {
          const doc = await api.documents.create(docFormData);
          proofFileUrl = doc.url;
        } catch (uploadError) {
          console.error('File upload failed', uploadError);
          toast.error('Failed to upload proof file, continuing without it.');
        }
      }

      const newTxn: Omit<Transaction, 'id'> = {
        projectId,
        type: formData.type as any,
        fromLevel: formData.fromLevel as any,
        toLevel: formData.toLevel as any,
        amount: amount,
        utrNumber: formData.utrNumber,
        date: formData.date,
        status: formData.status as any,
        description: formData.description,
        proofFile: proofFileUrl,
        createdBy: user?.id,
        state: formData.state,
        district: formData.district
      };

      await api.transactions.create(newTxn);
      setIsAddSheetOpen(false);
      fetchTransactions();
      setFormData({
        type: 'Utilization',
        fromLevel: 'Agency',
        toLevel: 'Ground',
        amount: '',
        utrNumber: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        description: '',
        state: '',
        district: ''
      });
      setSelectedFile(null);
      toast.success('Transaction recorded successfully');
    } catch (error) {
      console.error('Failed to create transaction', error);
      toast.error('Failed to create transaction');
    }
  };

  const canEdit = user?.role === 'Admin' || user?.role === 'StateNodalOfficer';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Approved': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Calculate totals
  const totalReleased = transactions
    .filter(t => t.type !== 'Utilization' && (t.status === 'Completed' || t.status === 'Approved'))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalUtilized = transactions
    .filter(t => t.type === 'Utilization' && (t.status === 'Completed' || t.status === 'Approved'))
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Sankey-style Flow Visualization */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h3 className="text-gray-900 mb-4">Fund Flow Overview</h3>
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4">
          <div className="flex-1 min-w-[120px] space-y-2">
            <div className="p-4 bg-white rounded-lg shadow-sm text-center">
              <p className="text-gray-600">Total Released</p>
              <p className="text-gray-900 font-bold">₹{(totalReleased / 10000000).toFixed(2)} Cr</p>
            </div>
          </div>

          <div className="w-16 h-1 bg-blue-400 shrink-0"></div>

          <div className="flex-1 min-w-[120px] space-y-2">
            <div className="p-4 bg-white rounded-lg shadow-sm text-center">
              <p className="text-gray-600">Total Utilized</p>
              <p className="text-gray-900 font-bold">₹{(totalUtilized / 10000000).toFixed(2)} Cr</p>
            </div>
          </div>

          <div className="w-16 h-1 bg-green-400 shrink-0"></div>

          <div className="flex-1 min-w-[120px] space-y-2">
            <div className="p-4 bg-white rounded-lg shadow-sm text-center">
              <p className="text-gray-600">Utilization %</p>
              <p className="text-gray-900 font-bold">
                {totalReleased > 0 ? ((totalUtilized / totalReleased) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fund Ledger Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-900">Fund Ledger (PFMS-style)</h3>
          {canEdit && (
            <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
              <SheetTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto max-h-screen">
                <SheetHeader>
                  <SheetTitle>Record New Transaction (Updated)</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleCreate} className="space-y-4 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">From Level</label>
                      <Input value="Agency" disabled className="bg-gray-100" />
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">State</label>
                      <Select
                        value={formData.state}
                        onValueChange={(val) => setFormData({ ...formData, state: val, district: '' })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
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
                    <div className="space-y-2">
                      <label className="text-sm font-medium">District</label>
                      <Select
                        value={formData.district}
                        onValueChange={(val) => setFormData({ ...formData, district: val })}
                        disabled={!formData.state}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select District" />
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount (₹)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="e.g. 5000000"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">UTR Number</label>
                    <Input
                      value={formData.utrNumber}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        setFormData({ ...formData, utrNumber: val });
                      }}
                      placeholder="Bank UTR Number (Alphanumeric)"
                      required
                    />
                  </div>

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
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={formData.status}
                      onValueChange={(val: string) => setFormData({ ...formData, status: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Proof Document</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                      <Upload className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">Record Transaction</Button>
                </form>
              </SheetContent>
            </Sheet>
          )}
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No transactions recorded for this project.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="text-gray-600">{txn.date?.split('T')[0]}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{txn.type}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {txn.fromLevel} → {txn.toLevel}
                    </TableCell>
                    <TableCell className="text-gray-900 font-medium">₹{txn.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-gray-600 font-mono text-xs">{txn.utrNumber || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(txn.status)}>{txn.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {txn.proofFile ? (
                        <a
                          href={txn.proofFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <FileText className="w-4 h-4" />
                          <span className="text-xs">View</span>
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
