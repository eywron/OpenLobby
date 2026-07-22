'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';
import { Home, Search, MessageSquare, Bell, User as UserIcon } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Profile', href: user ? `/profile/${user.username}` : '/login', icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 z-50 w-full h-14 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
      <div className="flex h-full items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex h-full w-full flex-col items-center justify-center space-y-1 transition-colors',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="sr-only">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
