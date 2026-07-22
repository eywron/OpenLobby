export interface User {
  id: string;
  firebaseUid: string;
  username: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  provider: string;
  avatarUrl?: string;
  bannerUrl?: string;
  bio?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  accountStatus: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface PostImage {
  id: string;
  storageUrl: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  displayOrder: number;
}

export interface Post {
  id: string;
  authorId: string;
  textContent?: string;
  visibility: 'PUBLIC' | 'FOLLOWERS_ONLY' | 'PRIVATE';
  editedAt?: string;
  createdAt: string;
  author: User;
  images: PostImage[];
  _count: {
    likes: number;
    comments: number;
    bookmarks: number;
  };
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  parentId?: string;
  textContent: string;
  editedAt?: string;
  createdAt: string;
  author: User;
  _count: {
    likes: number;
    replies: number;
  };
}

export interface Notification {
  id: string;
  recipientId: string;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION' | 'SYSTEM';
  actorUserId?: string;
  postId?: string;
  commentId?: string;
  readAt?: string;
  createdAt: string;
  actor?: User;
}

export interface Conversation {
  id: string;
  kind: 'DIRECT' | 'GROUP';
  createdAt: string;
  updatedAt: string;
  participants: User[];
  lastMessage?: Message;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  textContent?: string;
  attachmentType?: 'IMAGE' | 'FILE';
  attachmentUrl?: string;
  isEdited: boolean;
  readAt?: string;
  createdAt: string;
  sender: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  hasMore: boolean;
}
