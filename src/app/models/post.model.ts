export interface Post {
  id: string;
  parentId: string | null;
  arcId: string;
  childArcs: string[];
  authorId: string;
  fileName: string;
  folderName: string;
  title: string;
  description: string;
  content: string; // HTML or markdown
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PostNavItem {
  id: string;
  title: string;
  children: PostNavItem[];
}

export interface Comment {
  id: string;
  postId: string;
  parentCommentId: string | null;
  content: string;
  authorId: string;
  createdAt: Date;
}

export interface Refutation {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  createdAt: Date;
}

export interface Response {
  id: string;
  refutationId: string;
  content: string;
  authorId: string;
  createdAt: Date;
}