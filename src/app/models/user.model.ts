import { Post } from "./post.model";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  phoneNumber: string;
  isAnonymous: boolean;
  emailVerified: boolean;
  posts: Post[];
}