'use client';

import { useState, useRef } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useCreatePost } from '@/hooks/use-posts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getInitials } from '@/lib/utils';
import Image from 'next/image';

export function CreatePostForm() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPost = useCreatePost();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (files.length + newFiles.length > 4) {
        alert('You can only upload up to 4 images');
        return;
      }
      setFiles((prev) => [...prev, ...newFiles]);

      const newUrls = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      const url = prev[index];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && files.length === 0) return;

    const formData = new FormData();
    if (content.trim()) {
      formData.append('textContent', content.trim());
    }
    files.forEach((file) => {
      formData.append('images', file);
    });

    createPost.mutate(formData, {
      onSuccess: () => {
        setContent('');
        setFiles([]);
        setPreviewUrls([]);
      },
    });
  };

  if (!user) return null;

  return (
    <div className="p-4 border-b border-border bg-background">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 flex-shrink-0">
            {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.displayName} /> : null}
            <AvatarFallback>{getInitials(user.displayName || user.username || 'U')}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={5000}
              className="min-h-[80px] resize-none border-none focus-visible:ring-0 p-0 text-base placeholder:text-muted-foreground shadow-none bg-transparent"
            />

            {previewUrls.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-md overflow-hidden group">
                    <Image src={url} alt={`Preview ${i}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={files.length >= 4}
                >
                  <ImagePlus className="h-4 w-4" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
                <span className="text-xs">{content.length}/5000</span>
              </div>
              <Button
                type="submit"
                disabled={(!content.trim() && files.length === 0) || createPost.isPending}
                size="sm"
                className="rounded-full px-6 font-semibold"
              >
                {createPost.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
