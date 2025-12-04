import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import UserManagement from '../pages/admin/UserManagement';
import { RoleManagement } from './admin-tabs/RoleManagement';
import { AgencyRegistration } from './admin-tabs/AgencyRegistration';

export function Admin() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1">Admin Panel</h1>
        <p className="text-gray-500">Manage users, roles, and system configuration</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="roles">Role Management</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              <UserManagement />
            </TabsContent>

            <TabsContent value="roles" className="mt-6">
              <RoleManagement />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
