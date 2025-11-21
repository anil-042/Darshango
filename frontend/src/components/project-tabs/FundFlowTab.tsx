import { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { FileText, Plus } from 'lucide-react';
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

interface FundFlowTabProps {
  projectId: string;
}

export function FundFlowTab({ projectId }: FundFlowTabProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  const [formData, setFormData] = useState({
    type: 'Release',
    amount: '',
    utr: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    description: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, [projectId]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const allTxns = await api.transactions.getAll();
      const projectTxns = allTxns.filter(t => t.projectId === projectId);
      setTransactions(projectTxns);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTxn: Omit<Transaction, 'id'> = {
        projectId,
        type: formData.type as any,
        amount: parseFloat(formData.amount) || 0,
        utr: formData.utr,
        date: formData.date,
        status: formData.status as any,
        description: formData.description
      };

      await api.transactions.create(newTxn);
      setIsAddSheetOpen(false);
      fetchTransactions();
      setFormData({
        type: 'Release',
        amount: '',
        utr: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        description: ''
      });
    } catch (error) {
      console.error('Failed to create transaction', error);
    }
  };

  const canEdit = user?.role === 'Admin' || user?.role === 'StateNodalOfficer';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Calculate totals
  const totalReleased = transactions
    .filter(t => t.type === 'Release' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalUtilized = transactions
    .filter(t => t.type === 'Utilization' && t.status === 'Completed')
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
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Record New Transaction</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleCreate} className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Transaction Type</label>
                    <Select
                      value={formData.type}
                      onValueChange={(val: string) => setFormData({ ...formData, type: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Release">Release</SelectItem>
                        <SelectItem value="Utilization">Utilization</SelectItem>
                        <SelectItem value="Adjustment">Adjustment</SelectItem>
                        <SelectItem value="Refund">Refund</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount (₹)</label>
                    <Input
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="e.g. 5000000"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">UTR Number</label>
                    <Input
                      value={formData.utr}
                      onChange={(e) => setFormData({ ...formData, utr: e.target.value })}
                      placeholder="Bank UTR Number"
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
                      required
                    />
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
                <TableHead>Transaction ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>UTR Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Documents</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No transactions recorded for this project.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{txn.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{txn.type}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-900">₹{txn.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-gray-600">{txn.utr}</TableCell>
                    <TableCell className="text-gray-600">{txn.date}</TableCell>
                    <TableCell>{txn.description}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(txn.status)}>{txn.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <button className="text-blue-600 hover:text-blue-700">
                        <FileText className="w-4 h-4" />
                      </button>
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
