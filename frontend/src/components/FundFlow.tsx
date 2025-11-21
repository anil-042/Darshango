import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  FileText,
  Plus,
  Trash2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { api } from '../services/api';
import { Transaction } from '../types';
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

// Mock aggregated data for charts (could be calculated from backend in real app)
const stateData = [
  { state: 'Uttar Pradesh', allocated: 850, released: 680, utilized: 520 },
  { state: 'Maharashtra', allocated: 720, released: 650, utilized: 580 },
  { state: 'Rajasthan', allocated: 650, released: 580, utilized: 490 },
  { state: 'Gujarat', allocated: 580, released: 520, utilized: 450 },
  { state: 'Madhya Pradesh', allocated: 520, released: 480, utilized: 420 },
];

interface TransactionFormProps {
  formData: Partial<Transaction>;
  setFormData: (data: Partial<Transaction>) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
}

const TransactionForm = ({ formData, setFormData, onSubmit, submitLabel }: TransactionFormProps) => (
  <form onSubmit={onSubmit} className="space-y-4 mt-6">
    <div className="space-y-2">
      <label className="text-sm font-medium">Project ID</label>
      <Input
        value={formData.projectId}
        onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
        placeholder="e.g., AG-2024-001"
        required
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Amount (₹)</label>
        <Input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <Select
          value={formData.type}
          onValueChange={(val: any) => setFormData({ ...formData, type: val })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Release">Release</SelectItem>
            <SelectItem value="Utilization">Utilization</SelectItem>
            <SelectItem value="Adjustment">Adjustment</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
        <label className="text-sm font-medium">Status</label>
        <Select
          value={formData.status}
          onValueChange={(val: any) => setFormData({ ...formData, status: val })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium">UTR Number</label>
      <Input
        value={formData.utr}
        onChange={(e) => setFormData({ ...formData, utr: e.target.value })}
        placeholder="Optional"
      />
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium">Description</label>
      <Input
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Optional notes"
      />
    </div>

    <Button type="submit" className="w-full">{submitLabel}</Button>
  </form>
);

export function FundFlow() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // CRUD States
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [txnToDelete, setTxnToDelete] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Transaction>>({
    projectId: '',
    amount: 0,
    type: 'Release',
    status: 'Pending',
    utr: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await api.transactions.getAll();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.transactions.create(formData as any);
      setIsAddSheetOpen(false);
      fetchTransactions();
      setFormData({
        projectId: '',
        amount: 0,
        type: 'Release',
        status: 'Pending',
        utr: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Failed to create transaction', error);
    }
  };

  const handleDelete = async () => {
    if (!txnToDelete) return;
    try {
      await api.transactions.delete(txnToDelete);
      setTxnToDelete(null);
      fetchTransactions();
    } catch (error) {
      console.error('Failed to delete transaction', error);
    }
  };

  const canEdit = user?.role === 'Admin' || user?.role === 'StateNodalOfficer';

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (txn.utr && txn.utr.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === 'all' || txn.type === filterType;

    return matchesSearch && matchesType;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fund Flow Management</h1>
          <p className="text-gray-500">Track fund allocation, release, and utilization</p>
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
                <SheetTitle>Record New Transaction</SheetTitle>
              </SheetHeader>
              <TransactionForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleCreate}
                submitLabel="Save Transaction"
              />
            </SheetContent>
          </Sheet>
        )}
      </div>

      {/* Sankey Diagram Placeholder - Kept static for now as it's complex to make dynamic without real data flow logic */}
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
                  <p className="text-gray-900 font-bold">₹8,245 Cr</p>
                  <p className="text-xs text-gray-500 mt-1">Total Allocated</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 items-center">
                <div className="w-16 h-1 bg-blue-400 rounded"></div>
                <ArrowUpRight className="w-4 h-4 text-blue-400" />
              </div>

              <div className="flex-1 min-w-[120px] space-y-2">
                <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                  <p className="text-gray-600 mb-2 text-sm">State Level</p>
                  <p className="text-gray-900 font-bold">₹8,245 Cr</p>
                  <p className="text-xs text-gray-500 mt-1">Transferred</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 items-center">
                <div className="w-16 h-1 bg-purple-400 rounded"></div>
                <ArrowUpRight className="w-4 h-4 text-purple-400" />
              </div>

              <div className="flex-1 min-w-[120px] space-y-2">
                <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                  <p className="text-gray-600 mb-2 text-sm">District Level</p>
                  <p className="text-gray-900 font-bold">₹7,850 Cr</p>
                  <p className="text-xs text-gray-500 mt-1">Allocated</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 items-center">
                <div className="w-16 h-1 bg-green-400 rounded"></div>
                <ArrowUpRight className="w-4 h-4 text-green-400" />
              </div>

              <div className="flex-1 min-w-[120px] space-y-2">
                <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                  <p className="text-gray-600 mb-2 text-sm">Agency</p>
                  <p className="text-gray-900 font-bold">₹7,420 Cr</p>
                  <p className="text-xs text-gray-500 mt-1">Released</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 items-center">
                <div className="w-16 h-1 bg-cyan-400 rounded"></div>
                <ArrowDownLeft className="w-4 h-4 text-cyan-400" />
              </div>

              <div className="flex-1 min-w-[120px] space-y-2">
                <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                  <p className="text-gray-600 mb-2 text-sm">Utilized</p>
                  <p className="text-gray-900 font-bold">₹6,892 Cr</p>
                  <p className="text-xs text-gray-500 mt-1">Ground Level</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* State-wise Fund Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>State-wise Fund Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" />
              <YAxis label={{ value: 'Amount (₹ Cr)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="allocated" fill="#3b82f6" name="Allocated" />
              <Bar dataKey="released" fill="#8b5cf6" name="Released" />
              <Bar dataKey="utilized" fill="#10b981" name="Utilized" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Fund Ledger */}
      <Card>
        <CardHeader>
          <CardTitle>Fund Ledger (PFMS-style)</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by transaction ID, project, or UTR..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-gray-700 mb-2 block">Transaction Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Release">Release</SelectItem>
                    <SelectItem value="Utilization">Utilization</SelectItem>
                    <SelectItem value="Adjustment">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>UTR</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                      <TableCell className="text-gray-600">{txn.projectId}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{txn.type}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-900 font-medium">
                        {formatCurrency(txn.amount)}
                      </TableCell>
                      <TableCell className="text-gray-600 font-mono text-xs">{txn.utr || '-'}</TableCell>
                      <TableCell className="text-gray-600">{txn.date}</TableCell>
                      <TableCell>
                        <Badge className={
                          txn.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            txn.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                        }>
                          {txn.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <FileText className="w-4 h-4" />
                          </Button>
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setTxnToDelete(txn.id)}
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

      {/* Delete Alert */}
      <AlertDialog open={!!txnToDelete} onOpenChange={() => setTxnToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the transaction record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
