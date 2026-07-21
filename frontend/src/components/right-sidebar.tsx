import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export function RightSidebar() {
  return (
    <aside className="hidden xl:block w-80 shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 p-4 space-y-4 overflow-y-auto">
      <Card className="border-border/50 shadow-none">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold">Trending</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-none">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold">Who to Follow</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          ))}
        </CardContent>
      </Card>

      <footer className="px-4 text-xs text-muted-foreground flex flex-wrap gap-2">
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/terms" className="hover:underline">Terms</Link>
        <Link href="/privacy" className="hover:underline">Privacy</Link>
        <span>&copy; {new Date().getFullYear()} OpenLobby</span>
      </footer>
    </aside>
  );
}
