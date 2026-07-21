'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Home,
  Search,
  MessageSquare,
  Bell,
  Bookmark,
  User as UserIcon,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 }
};

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
    { name: 'Profile', href: user ? `/profile/${user.username}` : '/login', icon: UserIcon },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-border h-[calc(100vh-3.5rem)] sticky top-14">
      <div className="p-4">
        <motion.nav 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-1"
        >
          {navItems.map((nav) => {
            const isActive = pathname === nav.href;
            return (
              <motion.div key={nav.name} variants={item}>
                <Link
                  href={nav.href}
                  className={cn(
                    "flex items-center gap-3 py-2 px-3 rounded-md transition-colors hover:bg-secondary/80 text-base",
                    isActive ? "bg-secondary font-medium" : "text-muted-foreground"
                  )}
                >
                  <nav.icon className="h-5 w-5" />
                  {nav.name}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>
      </div>

      {user && (
        <div className="p-4">
          <Button variant="ghost" className="w-full justify-between h-auto py-2 px-2 hover:bg-secondary/80">
            <div className="flex items-center gap-3 overflow-hidden">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                <AvatarFallback>{user.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start truncate">
                <span className="text-sm font-medium truncate w-full">{user.displayName}</span>
                <span className="text-xs text-muted-foreground truncate w-full">@{user.username}</span>
              </div>
            </div>
            <MoreHorizontal className="h-5 w-5 shrink-0 text-muted-foreground" />
          </Button>
        </div>
      )}
    </aside>
  );
}
