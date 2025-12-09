import { Search, Bell, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { useState, useEffect } from 'react';
import { api } from '../services/api';

const breadcrumbMap: Record<string, string[]> = {
  '/': ['Home'],
  '/agency-mapping': ['Home', 'Agencies'],
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<{ projects: any[], agencies: any[] }>({ projects: [], agencies: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  const displayedNotifications = showAllNotifications ? notifications : notifications.slice(0, 4);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await api.notifications.getAll();

      setNotifications((prev) => {
        if (data.length > prev.length) {
          const diff = data.length - prev.length;
          setUnreadCount(c => c + diff);
        }
        return data;
      });
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        try {
          const [projects, agencies] = await Promise.all([
            api.projects.getAll({ search: searchQuery }),
            api.agencies.getAll({ search: searchQuery })
          ]);
          setResults({
            projects: projects.slice(0, 5),
            agencies: agencies.slice(0, 5)
          });
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults({ projects: [], agencies: [] });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const breadcrumbs = breadcrumbMap[location.pathname] || ['Home'];

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10">
      {/* ✅ ONLY CHANGE IS HERE: text-lg → text-4xl */}
      <div className="flex items-center gap-2 text-gray-500 text-4xl">
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
        {/* Global Search Bar */}
        <div className="relative hidden md:block w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search Projects/Agencies..."
            className="pl-10 bg-gray-50 border-gray-200 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />

          {isFocused && searchQuery.length > 1 && (
            <div className="absolute top-10 left-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
              {isSearching ? (
                <div className="p-4 text-sm text-gray-500 text-center">Searching...</div>
              ) : (results.projects.length === 0 && results.agencies.length === 0) ? (
                <div className="p-4 text-sm text-gray-500 text-center">No results found</div>
              ) : (
                <>
                  {results.projects.length > 0 && (
                    <div className="py-2">
                      <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Projects</div>
                      {results.projects.map(project => (
                        <div
                          key={project.id}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex justify-between items-start"
                          onClick={() => {
                            navigate(`/projects/${project.id}`);
                            setSearchQuery('');
                          }}
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate w-60" title={project.title}>{project.title}</p>
                            <p className="text-xs text-gray-500">{project.projectId}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {results.projects.length > 0 && results.agencies.length > 0 && <div className="border-t border-gray-100 my-1"></div>}

                  {results.agencies.length > 0 && (
                    <div className="py-2">
                      <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Agencies</div>
                      {results.agencies.map(agency => (
                        <div
                          key={agency.id}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            navigate(`/agency-mapping?search=${encodeURIComponent(agency.name)}`);
                            setSearchQuery('');
                          }}
                        >
                          <p className="text-sm font-medium text-gray-900">{agency.name}</p>
                          <p className="text-xs text-gray-500">{agency.code}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <Popover onOpenChange={(open) => {
          if (open) {
            setUnreadCount(0);
          }
        }}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-gray-500">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b border-gray-100">
              <h4 className="font-semibold text-sm">Notifications</h4>
            </div>
            <ScrollArea className="h-[300px]">
              {notifications.length === 0 ? (
                <div className="p-4 space-y-4 flex flex-col items-center justify-center h-full text-gray-500">
                  <p className="text-sm">No new notifications</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {displayedNotifications.map((notif: any) => (
                    <div
                      key={notif.id}
                      className="p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                      onClick={() => notif.link && navigate(notif.link)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="text-sm font-medium text-gray-900">{notif.title}</h5>
                        <span className="text-[10px] text-gray-400">{new Date(notif.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{notif.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="p-3 border-t border-gray-100 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-blue-600 hover:text-blue-700 w-full"
                onClick={() => setShowAllNotifications(!showAllNotifications)}
              >
                {showAllNotifications ? 'Show less' : 'View all notifications'}
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
