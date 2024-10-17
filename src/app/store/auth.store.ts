import { Injectable, inject } from '@angular/core';
import { signalStore, withState, patchState, withMethods } from '@ngrx/signals';
import { Auth, User as FirebaseUser, UserCredential, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, collection, addDoc, updateDoc } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { User, UserInfo } from '../models/user.model';
import { Post, PostNavItem } from '../models/post.model';

interface AuthState {
  user: User | undefined;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: undefined,
  loading: false,
  error: null
};


async function getUserInfo(uid: string) {
  const functionUrl = 'https://us-central1-hiverarchy-firebase.cloudfunctions.net/getUserInfo';
  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: { uid } }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error.message);
  }

  const result = await response.json();
  return result.data;
}

const updateUserInfo = async (firestore: Firestore, userId: string, userInfo: UserInfo) => {
  const userRef = doc(firestore, 'users', userId);
  await updateDoc(userRef, { ...userInfo });
}

const updateUserFavoritePosts = async (firestore: Firestore, action: 'add' | 'delete' | 'update', userId: string, post: Post) => {
  const userRef = doc(firestore, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const userInfo = userSnap.data() as UserInfo;
    if (action === 'add') {
      userInfo.favorites.push({id: post.id, title: post.title, children: []});
    } else if (action === 'delete') {
      userInfo.favorites = userInfo.favorites.filter(p => p.id !== post.id);
    } else if (action === 'update') {
      userInfo.favorites = userInfo.favorites.map(p => p.id === post.id ? {id : p.id, title: post.title, children: p.children} : p);
    }
    await updateDoc(userRef, { ...userInfo });
  }
}

const updateUserBookmarkPosts = async (firestore: Firestore, action: 'add' | 'delete' | 'update', userId: string, post: Post) => {
  const userRef = doc(firestore, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const userInfo = userSnap.data() as UserInfo;
    if (action === 'add') {
      userInfo.bookmarks.push({id: post.id, title: post.title, children: []});
    } else if (action === 'delete') {
      userInfo.bookmarks = userInfo.bookmarks.filter(p => p.id !== post.id);
    } else if (action === 'update') {
      userInfo.bookmarks = userInfo.bookmarks.map(p => p.id === post.id ? {id : p.id, title: post.title, children: p.children} : p);
    }
    await updateDoc(userRef, { ...userInfo });
  }
}

const updateUserRecentsPosts = async (firestore: Firestore, action: 'add' | 'delete' | 'update', userId: string, post: Post) => {
  const userRef = doc(firestore, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const userInfo = userSnap.data() as UserInfo;
    if (action === 'add') {
      userInfo.recents.push({id: post.id, title: post.title, children: []});
    } else if (action === 'delete') {
      userInfo.recents = userInfo.recents.filter(p => p.id !== post.id);
    } else if (action === 'update') {
      userInfo.recents = userInfo.recents.map(p => p.id === post.id ? {id : p.id, title: post.title, children: p.children} : p);
    }
    await updateDoc(userRef, { ...userInfo });
  }
}

const createInitialUserPost = async (firestore: Firestore, userId: string) => {
  const postsCollection = collection(firestore, 'posts');
  const newPost = {
    title: 'Welcome to My Page',
    content: 'This is my personal page. I\'ll be sharing my thoughts and experiences here.',
    authorId: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    parentId: null,
  };
  const docRef = await addDoc(postsCollection, newPost);
  return { id: docRef.id, ...newPost };
}
const createUserInfo = async (firestore: Firestore, userCredential: UserCredential) => {
  const userRef = doc(firestore, 'users', userCredential.user.uid);
  const initialPost = await createInitialUserPost(firestore, userCredential.user.uid) as Post;
  const userData = {
    email: userCredential.user.email,
    displayName: userCredential.user.displayName,
    photoURL: userCredential.user.photoURL,
    phoneNumber: userCredential.user.phoneNumber,
    mainPageId: initialPost.id,
    tags: [],
    headerHTML: '',
    footerHTML: '',
    favorites:  [] as PostNavItem[],
    bookmarks: [] as PostNavItem[],
    recents: [] as PostNavItem[],
  };
  await setDoc(userRef, userData);     
  return userData;
 }


const navigateToUserMainPage = (userInfo: any, router: Router) => {
  if (userInfo && userInfo.mainPageId) {
    router.navigateByUrl(`/posts/${userInfo.mainPageId}`);
  } else {
    console.error('User main page not found');
    router.navigate(['/login']);
  }
}

const getUserInfoFromFunction = async (functions: Functions, uid: string): Promise<UserInfo> => {
  const getUserInfo = httpsCallable(functions, 'getUserInfo');
  const result = await getUserInfo({ uid });
  return result.data as UserInfo;
}

export const AuthStore = signalStore(
  withState(initialState),
  withMethods((store, auth = inject(Auth), firestore = inject(Firestore), functions = inject(Functions), router = inject(Router)) => ({
    checkAuth: async () => {
      if (auth.currentUser) {
        const userInfo = await getUserInfo(auth.currentUser.uid) as UserInfo;
        if (userInfo) {
          const user: User = {
            uid: auth.currentUser.uid,
            userInfo
          };
          patchState(store, { user, loading: false });
        } else {
          patchState(store, { user: undefined, loading: false });
        }
      }
    },
    login: async (email: string, password: string) => {
      patchState(store, { loading: true, error: null });
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userInfo = await getUserInfoFromFunction(functions, userCredential.user.uid);
        if (userInfo) {
          const user: User = {
            uid: userCredential.user.uid,
            userInfo: userInfo
          };
          patchState(store, { user, loading: false });
          navigateToUserMainPage(userInfo, router);
        }
      } catch (error) {
        patchState(store, { error: 'Failed to sign in', loading: false });
      }
    },
    signUp: async (email: string, password: string) => {
      patchState(store, { loading: true, error: null });
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userInfo = await createUserInfo(firestore, userCredential) as UserInfo;
        if (userInfo) {
          const user: User = { uid: userCredential.user.uid, userInfo };
          patchState(store, { user, loading: false });
          navigateToUserMainPage(userInfo, router);
        }
      } catch (error) {
        patchState(store, { error: 'Failed to sign up', loading: false });
      }
    },
    signInWithGoogle: async () => {
      patchState(store, { loading: true, error: null });
      try {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        let userInfo = await getUserInfoFromFunction(functions, userCredential.user.uid);
        if (!userInfo) {
          userInfo = await createUserInfo(firestore, userCredential) as UserInfo;
        } 
        const user: User = { uid: userCredential.user.uid, userInfo };
        patchState(store, { user, loading: false });
        navigateToUserMainPage(userInfo, router);
      } catch (error) {
        patchState(store, { error: 'Failed to sign in with Google', loading: false });
      }
    },
    signOut: async () => {
      patchState(store, { loading: true, error: null });
      try {
        await signOut(auth);
        patchState(store, { user: undefined, loading: false });
        router.navigate(['/login']);
      } catch (error) {
        patchState(store, { error: 'Failed to sign out', loading: false });
      }
    },
    setUser: (user: User | undefined) => patchState(store, { user }),
    updateUserInfo: async (userInfo: UserInfo) => {
      patchState(store, { loading: true, error: null });
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await updateUserInfo(firestore, currentUser.uid, userInfo);
          const user: User = { uid: currentUser.uid, userInfo };
          patchState(store, { user, loading: false });
        } else {
          throw new Error('No user is currently signed in');
        }
      } catch (error) {
        patchState(store, { error: 'Failed to update user info', loading: false });
      }
    },
    updateUserFavoritePosts,
    updateUserBookmarkPosts,
    updateUserRecentsPosts,
  })))
