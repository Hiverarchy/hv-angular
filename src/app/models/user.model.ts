import { PostNavItem } from "./post.model";

export interface UserInfo {
    email: string;
    displayName: string;
    photoURL: string;
    phoneNumber: string;
    tags: string[];
    mainPageId: string;
    posts: PostNavItem[];
    headerHTML: string;
    footerHTML: string;
}

export interface User {
    uid: string;
    userInfo: UserInfo;
}