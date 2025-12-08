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
  const { user, hasPermission } = useAuth();

  const allMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', module: 'Dashboard' },
    { icon: Map, label: 'Agencies', path: '/agency-mapping', module: 'Agencies' },
    { icon: FolderKanban, label: 'Projects', path: '/projects', module: 'Projects' },
    { icon: IndianRupee, label: 'Fund Flow', path: '/fund-flow', module: 'Fund Flow' },
    { icon: ClipboardCheck, label: 'Monitoring', path: '/monitoring', module: 'Monitoring' },
    { icon: MessageSquare, label: 'Communication', path: '/communication', module: 'Communication' },
    { icon: AlertTriangle, label: 'Alerts', path: '/alerts', module: 'Alerts' },
    { icon: BarChart3, label: 'Reports', path: '/reports', module: 'Reports' },
    { icon: Settings, label: 'Admin Settings', path: '/admin', module: 'Admin' },
  ];

  const menuItems = allMenuItems.filter(item => {
    if (item.module === 'Communication') return true; // Default visible
    return hasPermission(item.module, 'View');
  });

  return (
    <div
      className={cn(
        "bg-gradient-to-b from-[var(--color-saffron-50)] via-white to-[var(--color-india-green-50)] border-r border-orange-100 flex flex-col transition-all duration-300 shadow-sm",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-orange-100/50">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold shadow-md">
              PM
            </div>
            <span className="font-bold text-xl text-primary tracking-tight">PM-AJAY</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-orange-100 text-gray-500 hover:text-orange-600 transition-colors"
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
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative overflow-hidden",
                isActive
                  ? "bg-orange-100 text-orange-700 shadow-sm font-medium"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-700 hover:pl-4",
                collapsed && "justify-center px-2 hover:pl-2"
              )}
            >
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r-full" />}
              <Icon size={20} className={cn("transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} />
              {!collapsed && <span className="">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-green-100/50">
        {!collapsed && (
          <div className="text-xs text-center text-gray-400">
            v1.0.0 • <span className="text-orange-400">Secure</span>
          </div>
        )}
      </div>
    </div>
  );
}
