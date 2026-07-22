'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { MobileNav } from '@/components/mobile-nav';
import { RightSidebar } from '@/components/right-sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 w-full max-w-md px-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 mx-auto w-full max-w-7xl">
        <Sidebar />
        <main className="flex-1 min-w-0 border-x border-border lg:mx-0 pb-14 lg:pb-0">
          <div className="max-w-2xl mx-auto w-full">{children}</div>
        </main>
        <RightSidebar />
      </div>
      <MobileNav />
    </div>
  );
}
