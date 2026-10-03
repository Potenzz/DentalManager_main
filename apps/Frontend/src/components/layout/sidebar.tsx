import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, Calendar, UserCog, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Patients",
      path: "/patients",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Staff",
      path: "/staff",
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <div
        className={cn(
          "bg-white w-64 border-r border-gray-200 shadow-sm z-30 fixed h-full md:static flex flex-col transition-transform duration-200",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-5 border-b border-gray-200 flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M12 14c-1.65 0-3-1.35-3-3V5c0-1.65 1.35-3 3-3s3 1.35 3 3v6c0 1.65-1.35 3-3 3Z" />
              <path d="M19 14v-4a7 7 0 0 0-14 0v4" />
              <path d="M12 19c-5 0-8-2-9-5.5m18 0c-1 3.5-4 5.5-9 5.5Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">Dental Connect</h1>
            <p className="text-xs text-gray-500">Clinic Management</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
            >
              <div className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer",
                location === item.path
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}>
                {item.icon}
                <span>{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">Dental Connect v1.0</p>
        </div>
      </div>
    </>
  );
}
