import { Injectable, inject } from '@angular/core';
import { signalStore, withState, patchState, withMethods } from '@ngrx/signals';
import { Auth, User as FirebaseUser, UserCredential, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, updateProfile } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, collection, addDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User, UserInfo } from '../models/user.model';
import { Post, PostTitleAndId } from '../models/post.model';

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


const getUserInfo = async (firestore: Firestore, userId: string) => {
  const userRef = doc(firestore, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data();
  }
  return null;
}

const createInitialUserPost = async (firestore: Firestore, userId: string) => {
  const postsCollection = collection(firestore, 'posts');
  const newPost = {
    title: 'Welcome to My Page',
    content: 'This is my personal page. I\'ll be sharing my thoughts and experiences here.',
    authorId: userId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const docRef = await addDoc(postsCollection, newPost);
  return { id: docRef.id, ...newPost };
}
const createUserInfo = async (firestore: Firestore, userCredential: UserCredential) => {
  const userRef = doc(firestore, 'users', userCredential.user.uid);
  const userData = {
    email: userCredential.user.email,
    displayName: userCredential.user.displayName,
    photoURL: userCredential.user.photoURL,
    phoneNumber: userCredential.user.phoneNumber,
    tags: [],
    mainPageId: '',
    posts: [] as PostTitleAndId[],
    headerHTML: '',
    footerHTML: '',
  };
  await setDoc(userRef, userData);
     // Create initial post for the user
     const initialPost = await createInitialUserPost(firestore, userCredential.user.uid) as Post;
      
     // Update user info with the new post
     userData.mainPageId = initialPost.id;
     userData.posts.push({id: initialPost.id, title: initialPost.title});
     await updateDoc(userRef, {
       mainPageId: initialPost.id,
       posts: [{id: initialPost.id, title: initialPost.title}]
     });
     
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

export const AuthStore = signalStore(
  withState(initialState),
  withMethods((store, auth = inject(Auth), firestore = inject(Firestore), router = inject(Router)) => ({


    checkAuth: async () => {
      if (auth.currentUser) {
        const userInfo = await getUserInfo(firestore, auth.currentUser.uid) as UserInfo;
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
        const userInfo = await getUserInfo(firestore, userCredential.user.uid) as UserInfo;
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
          let userInfo = await getUserInfo(firestore, userCredential.user.uid) as UserInfo;
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
    // updateProfile: async (profileData: { displayName?: string | null, photoURL?: string | null }) => {
    //   patchState(store, { loading: true, error: null });
    //   try {
    //     const currentUser = auth.currentUser;
    //     if (currentUser) {
    //       await updateProfile(currentUser, profileData);
    //       patchState(store, { user: currentUser, loading: false });
    //     } else {
    //       throw new Error('No user is currently signed in');
    //     }
    //   } catch (error) {
    //     patchState(store, { error: 'Failed to update profile', loading: false });
    //   }
    // },
  }))
)
