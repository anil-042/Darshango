import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Map,
  FolderKanban,
  IndianRupee,
  ClipboardCheck,
  FileText,
  AlertTriangle,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Users,
  MessageSquare
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Map, label: 'Agency Mapping', path: '/agency-mapping' },
    { icon: FolderKanban, label: 'Projects', path: '/projects' },
    { icon: IndianRupee, label: 'Fund Flow', path: '/fund-flow' },
    { icon: ClipboardCheck, label: 'Monitoring', path: '/monitoring' },
    { icon: FileText, label: 'Documents', path: '/documents' },
    { icon: MessageSquare, label: 'Communication', path: '/communication' },
    { icon: AlertTriangle, label: 'Alerts', path: '/alerts' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
  ];

  // Only show Admin link if user is Admin
  if (user?.role === 'Admin') {
    menuItems.push({ icon: Users, label: 'User Management', path: '/admin/users' });
    menuItems.push({ icon: Settings, label: 'Admin Settings', path: '/admin' });
  }

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              PM
            </div>
            <span className="font-bold text-xl text-gray-800">PM-AJAY</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon size={20} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        {/* Need Help button removed */}
      </div>
    </div>
  );
}
