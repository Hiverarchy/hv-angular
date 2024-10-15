import { PostNavItem } from "./post.model";

export interface UserInfo {
    email: string;
    displayName: string;
    photoURL: string;
    phoneNumber: string;
    tags: string[];
    mainPageId: string;
    favorites: PostNavItem[];
    bookmarks: PostNavItem[];
    recents: PostNavItem[];
    headerHTML: string;
    footerHTML: string;
}

export interface User {
    uid: string;
    userInfo: UserInfo;
}
