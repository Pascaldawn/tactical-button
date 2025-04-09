
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  BarChart3, 
  Video, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const DashboardSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };
  
  const menuItems = [
    {
      title: 'Profile',
      icon: User,
      path: '/dashboard',
    },
    {
      title: 'Analyze',
      icon: BarChart3,
      path: '/analyze',
    },
    {
      title: 'Record',
      icon: Video,
      path: '/record',
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/settings',
    },
  ];
  
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center gap-3 py-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src="https://github.com/shadcn.png" alt={user?.name || 'User'} />
          <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h3 className="font-medium text-sm">{user?.name || 'User'}</h3>
          <p className="text-xs text-muted-foreground">{user?.role || 'Coach'}</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton 
                isActive={isActive(item.path)}
                onClick={() => navigate(item.path)}
              >
                <item.icon size={20} />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarSeparator />
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut size={20} />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
