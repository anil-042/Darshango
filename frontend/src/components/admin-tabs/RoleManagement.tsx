import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { toast } from 'sonner';

const initialRoles = [
  {
    id: 1,
    name: 'Admin',
    description: 'Full system access and control',
    userCount: 5,
    color: 'bg-purple-100 text-purple-700',
  },
  {
    id: 2,
    name: 'State Coordinator',
    description: 'Manage state-level operations',
    userCount: 28,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 3,
    name: 'Project Manager',
    description: 'Manage individual projects',
    userCount: 156,
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 4,
    name: 'Inspector',
    description: 'Conduct site inspections',
    userCount: 89,
    color: 'bg-orange-100 text-orange-700',
  },
  {
    id: 5,
    name: 'Agency Manager',
    description: 'Manage agency operations',
    userCount: 234,
    color: 'bg-cyan-100 text-cyan-700',
  },
  {
    id: 6,
    name: 'Finance Officer',
    description: 'Manage financial operations',
    userCount: 45,
    color: 'bg-yellow-100 text-yellow-700',
  },
];

const permissions = [
  {
    module: 'Dashboard',
    permissions: ['View', 'Export'],
  },
  {
    module: 'Agency Mapping',
    permissions: ['View', 'Create', 'Edit', 'Delete'],
  },
  {
    module: 'Projects',
    permissions: ['View', 'Create', 'Edit', 'Delete', 'Approve'],
  },
  {
    module: 'Fund Flow',
    permissions: ['View', 'Create', 'Edit', 'Approve'],
  },
  {
    module: 'Monitoring',
    permissions: ['View', 'Create', 'Edit', 'Submit'],
  },
  {
    module: 'Documents',
    permissions: ['View', 'Upload', 'Download', 'Delete'],
  },
  {
    module: 'Alerts',
    permissions: ['View', 'Create', 'Resolve'],
  },
  {
    module: 'Reports',
    permissions: ['View', 'Generate', 'Export'],
  },
  {
    module: 'Admin',
    permissions: ['View', 'Manage Users', 'Manage Roles'],
  },
];

export function RoleManagement() {
  const [roles, setRoles] = useState(initialRoles);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    description: ''
  });

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    const role = {
      id: roles.length + 1,
      name: newRole.name,
      description: newRole.description,
      userCount: 0,
      color: 'bg-gray-100 text-gray-700'
    };
    setRoles([...roles, role]);
    setNewRole({ name: '', description: '' });
    setIsAddSheetOpen(false);
    toast.success('Role created successfully');
  };

  const handleDeleteRole = (id: number) => {
    setRoles(roles.filter(r => r.id !== id));
    toast.success('Role deleted successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">{roles.length} roles configured</p>
        <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Role
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create New Role</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleAddRole} className="space-y-4 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role Name</label>
                <Input
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="e.g. Regional Manager"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="Role description..."
                  required
                />
              </div>
              <Button type="submit" className="w-full">Create Role</Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Role List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <Card key={role.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Badge className={role.color}>{role.name}</Badge>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">{role.userCount} users</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:text-red-600" onClick={() => handleDeleteRole(role.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{role.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-gray-700">Module</th>
                  <th className="text-left p-3 text-gray-700">Permission</th>
                  <th className="text-center p-3 text-gray-700">Admin</th>
                  <th className="text-center p-3 text-gray-700">Project Manager</th>
                  <th className="text-center p-3 text-gray-700">Inspector</th>
                  <th className="text-center p-3 text-gray-700">View Only</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((module) => (
                  <>
                    {module.permissions.map((permission, idx) => (
                      <tr key={`${module.module}-${permission}`} className="border-b hover:bg-gray-50">
                        {idx === 0 && (
                          <td className="p-3 text-gray-900" rowSpan={module.permissions.length}>
                            {module.module}
                          </td>
                        )}
                        <td className="p-3 text-gray-600">{permission}</td>
                        <td className="p-3 text-center">
                          <Checkbox checked={true} disabled />
                        </td>
                        <td className="p-3 text-center">
                          <Checkbox defaultChecked={idx < 2} />
                        </td>
                        <td className="p-3 text-center">
                          <Checkbox defaultChecked={false} />
                        </td>
                        <td className="p-3 text-center">
                          <Checkbox defaultChecked={permission === 'View'} />
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
