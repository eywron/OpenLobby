'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Camera, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  
  
  
  
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

// Schemas
const profileSchema = z.object({
  displayName: z.string().min(2).max(50),
  bio: z.string().max(160).optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function SettingsPage() {
  const { user } = useAuth();

  // Profile Form
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      bio: '', // Add bio to user type if available
    },
  });

  const onProfileSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      await api.patch('/users/me', data);
      // Show toast success
    } catch (error) {
      // Show toast error
    }
  };

  // Password Form
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onPasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    try {
      await api.post('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      passwordForm.reset();
      // Show toast success
    } catch (error) {
      // Show toast error
    }
  };

  // Avatar handling (simplified)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      // Upload logic would go here
    }
  };

  return (
    <div className="max-w-3xl mx-auto border-x border-border min-h-[calc(100vh-4rem)] bg-background pb-12">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm p-4 border-b border-border">
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
      </div>

      <div className="p-4 md:p-8 space-y-8">
        {/* Profile Section */}
        <section>
          <h2 className="text-lg font-medium text-foreground mb-4">Profile</h2>
          <Card className="bg-background border-border">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative group cursor-pointer">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={avatarPreview || undefined} />
                      <AvatarFallback className="text-2xl">{user?.displayName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">Change Avatar</span>
                </div>

                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="flex-1 w-full space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      {...profileForm.register('displayName')}
                      className="bg-secondary/20"
                    />
                    {profileForm.formState.errors.displayName && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.displayName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="bio">Bio</Label>
                      <span className="text-xs text-muted-foreground">
                        {profileForm.watch('bio')?.length || 0}/160
                      </span>
                    </div>
                    <Textarea
                      id="bio"
                      {...profileForm.register('bio')}
                      className="bg-secondary/20 resize-none h-24"
                      maxLength={160}
                    />
                  </div>

                  <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                    {profileForm.formState.isSubmitting ? 'Saving...' : 'Save Profile'}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="bg-border" />

        {/* Account Section */}
        <section>
          <h2 className="text-lg font-medium text-foreground mb-4">Account</h2>
          <Card className="bg-background border-border">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  value={user?.email || ''}
                  disabled
                  className="bg-secondary/10 text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed in this version.
                </p>
              </div>

              <Separator className="bg-border my-4" />

              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <h3 className="font-medium">Change Password</h3>

                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...passwordForm.register('currentPassword')}
                    className="bg-secondary/20"
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...passwordForm.register('newPassword')}
                      className="bg-secondary/20"
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...passwordForm.register('confirmPassword')}
                      className="bg-secondary/20"
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="secondary"
                  disabled={passwordForm.formState.isSubmitting}
                >
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <Separator className="bg-border" />

        {/* Preferences Section */}
        <section>
          <h2 className="text-lg font-medium text-foreground mb-4">Preferences</h2>
          <Card className="bg-background border-border">
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Notifications</h3>
              <div className="space-y-4">
                {['Likes', 'Comments', 'Follows', 'Mentions'].map((pref) => (
                  <div key={pref} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{pref}</div>
                      <div className="text-xs text-muted-foreground">
                        Receive notifications for {pref.toLowerCase()}
                      </div>
                    </div>
                    {/* In a real app, this would use a Switch component and react-hook-form */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Danger Zone */}
        <section>
          <h2 className="text-lg font-medium text-destructive mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h2>
          <Card className="bg-background border-destructive/50 border-2">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all of your content. This action cannot be
                    undone.
                  </p>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account and
                        remove your data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="deletePassword">Confirm Password</Label>
                        <Input
                          id="deletePassword"
                          type="password"
                          placeholder="Enter your password to confirm"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive">Confirm Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
