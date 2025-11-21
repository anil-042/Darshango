import { Search, Bell, LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { useAuth } from '../context/AuthContext';

const breadcrumbMap: Record<string, string[]> = {
  '/': ['Home'],
  '/agency-mapping': ['Home', 'Agency Mapping'],
  '/projects': ['Home', 'Projects'],
  '/adarsh-gram': ['Home', 'Adarsh Gram'],
  '/gia': ['Home', 'GIA'],
  '/hostel': ['Home', 'Hostel'],
  '/fund-flow': ['Home', 'Fund Flow'],
  '/monitoring': ['Home', 'Monitoring & Inspections'],
  '/documents': ['Home', 'Documents'],
  '/alerts': ['Home', 'Alerts & Escalations'],
  '/reports': ['Home', 'Reports'],
  '/admin': ['Home', 'Admin'],
};

export function TopBar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const breadcrumbs = breadcrumbMap[location.pathname] || ['Home'];

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && <span>/</span>}
            <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''}>
              {crumb}
            </span>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-gray-50 border-gray-200 h-9"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-gray-500">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b border-gray-100">
              <h4 className="font-semibold text-sm">Notifications</h4>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="p-4 space-y-4 flex flex-col items-center justify-center h-full text-gray-500">
                <p className="text-sm">No new notifications</p>
              </div>
            </ScrollArea>
            <div className="p-3 border-t border-gray-100 text-center">
              <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 w-full">
                View all notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 hover:bg-gray-50 p-1 pr-3 rounded-full md:rounded-lg h-auto">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900 leading-none">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 mt-1">{user?.role || 'Viewer'}</p>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0D8ABC&color=fff`} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 cursor-pointer" onSelect={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
