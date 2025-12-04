import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { toast } from 'sonner';
import { api } from '../../services/api';
import { UserRole } from '../../types';

const roleDefinitions: Record<string, { label: string, description: string, color: string }> = {
  Admin: { label: 'Admin', description: 'Full system access and control', color: 'bg-purple-100 text-purple-700' },
  StateNodalOfficer: { label: 'State Nodal Officer', description: 'Manage state-level operations', color: 'bg-blue-100 text-blue-700' },
  DistrictOfficer: { label: 'District Officer', description: 'Manage district operations', color: 'bg-green-100 text-green-700' },
  AgencyAdmin: { label: 'Agency Manager', description: 'Manage agency operations', color: 'bg-cyan-100 text-cyan-700' },
  Inspector: { label: 'Inspector', description: 'Conduct site inspections', color: 'bg-orange-100 text-orange-700' },
  Viewer: { label: 'Viewer', description: 'View-only access', color: 'bg-gray-100 text-gray-700' }
};

const initialPermissions = [
  {
    module: 'Dashboard',
    permissions: ['View', 'Export'],
  },
  {
    module: 'Agencies',
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
    module: 'Communication',
    permissions: ['View', 'Create'],
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
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    description: ''
  });

  // Permissions state: { [roleName]: { [module]: { [permission]: boolean } } }
  const [rolePermissions, setRolePermissions] = useState<any>({});

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const [users, permissionsData] = await Promise.all([
        api.users.getAll(),
        api.permissions.get()
      ]);

      const counts = Array.isArray(users) ? users.reduce((acc: any, user: any) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {}) : {};

      const roleData = Object.keys(roleDefinitions).map((key) => ({
        id: key,
        name: roleDefinitions[key]?.label || key,
        originalRole: key,
        description: roleDefinitions[key]?.description || 'Custom Role',
        userCount: counts[key] || 0,
        color: roleDefinitions[key]?.color || 'bg-gray-100 text-gray-700'
      }));

      setRoles(roleData);

      // Use fetched permissions or initialize if empty
      if (permissionsData && Object.keys(permissionsData).length > 0) {
        setRolePermissions(permissionsData);
      } else {
        // Initialize permissions (mock logic for now)
        const initialRolePerms: any = {};
        roleData.forEach(role => {
          initialRolePerms[role.originalRole] = {}; // Use originalRole (key) for mapping
          initialPermissions.forEach(mod => {
            initialRolePerms[role.originalRole][mod.module] = {};
            mod.permissions.forEach(perm => {
              if (role.originalRole === 'Admin') {
                initialRolePerms[role.originalRole][mod.module][perm] = true;
              } else if (perm === 'View') {
                initialRolePerms[role.originalRole][mod.module][perm] = true;
              } else {
                initialRolePerms[role.originalRole][mod.module][perm] = false;
              }
            });
          });
        });
        setRolePermissions(initialRolePerms);
      }

    } catch (error) {
      console.error('Failed to fetch roles or permissions', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await api.permissions.update(rolePermissions);
      toast.success('Permissions updated successfully');
    } catch (error) {
      console.error('Failed to update permissions', error);
      toast.error('Failed to update permissions');
    }
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call API to create role
    // For now, we just add to local state if it's not in definitions
    const role = {
      id: newRole.name,
      name: newRole.name,
      originalRole: newRole.name,
      description: newRole.description,
      userCount: 0,
      color: 'bg-gray-100 text-gray-700'
    };
    setRoles([...roles, role]);

    // Init permissions for new role
    const newPerms = { ...rolePermissions };
    newPerms[role.originalRole] = {};
    initialPermissions.forEach(mod => {
      newPerms[role.originalRole][mod.module] = {};
      mod.permissions.forEach(perm => {
        newPerms[role.originalRole][mod.module][perm] = perm === 'View';
      });
    });
    setRolePermissions(newPerms);

    setNewRole({ name: '', description: '' });
    setIsAddSheetOpen(false);
    toast.success('Role created successfully (Local only)');
  };

  const handleDeleteRole = (id: string) => {
    if (roleDefinitions[id]) {
      toast.error('Cannot delete system roles');
      return;
    }
    setRoles(roles.filter(r => r.id !== id));
    toast.success('Role deleted successfully');
  };

  const togglePermission = (roleKey: string, module: string, permission: string) => {
    if (roleKey === 'Admin') return; // Admin always has full access

    setRolePermissions((prev: any) => ({
      ...prev,
      [roleKey]: {
        ...prev[roleKey] || {},
        [module]: {
          ...prev[roleKey]?.[module] || {},
          [permission]: !prev[roleKey]?.[module]?.[permission]
        }
      }
    }));
  };

  if (loading) return <div>Loading roles...</div>;

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
                  {!roleDefinitions[role.originalRole] && (
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:text-red-600" onClick={() => handleDeleteRole(role.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-sm">{role.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Permissions Matrix</CardTitle>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-gray-700">Module</th>
                  <th className="text-left p-3 text-gray-700">Permission</th>
                  {roles.map(role => (
                    <th key={role.id} className="text-center p-3 text-gray-700 whitespace-nowrap">
                      {role.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {initialPermissions.map((module) => (
                  <>
                    {module.permissions.map((permission, idx) => (
                      <tr key={`${module.module}-${permission}`} className="border-b hover:bg-gray-50">
                        {idx === 0 && (
                          <td className="p-3 text-gray-900 font-medium" rowSpan={module.permissions.length}>
                            {module.module}
                          </td>
                        )}
                        <td className="p-3 text-gray-600">{permission}</td>
                        {roles.map(role => (
                          <td key={role.id} className="p-3 text-center">
                            <Checkbox
                              checked={rolePermissions[role.originalRole]?.[module.module]?.[permission] || false}
                              onCheckedChange={() => togglePermission(role.originalRole, module.module, permission)}
                              disabled={role.originalRole === 'Admin'} // Admin always has access
                            />
                          </td>
                        ))}
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
