import { Injectable, inject } from '@angular/core';
import { signalStore, withState, patchState, withMethods } from '@ngrx/signals';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, orderBy } from '@angular/fire/firestore';
import { Post } from '../models/post.model';

interface PostState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null
};

export const PostStore = signalStore(
  withState(initialState),
  withMethods((store, firestore = inject(Firestore)) => ({
    createPost: async (post: Omit<Post, 'id'>) => {
      patchState(store, { loading: true, error: null });
      try {
        const docRef = await addDoc(collection(firestore, 'posts'), post);
        const newPost = { id: docRef.id, ...post };
        patchState(store, { posts: [...store.posts(), newPost], loading: false });
        return newPost;
      } catch (error) {
        patchState(store, { error: 'Failed to create post', loading: false });
        throw error;
      }
    },

    updatePost: async (id: string, post: Partial<Post>) => {
      patchState(store, { loading: true, error: null });
      try {
        await updateDoc(doc(firestore, 'posts', id), post);
        const updatedPosts = store.posts().map(p => p.id === id ? { ...p, ...post } : p);
        patchState(store, { posts: updatedPosts, loading: false });
      } catch (error) {
        patchState(store, { error: 'Failed to update post', loading: false });
        throw error;
      }
    },

    deletePost: async (id: string) => {
      patchState(store, { loading: true, error: null });
      try {
        await deleteDoc(doc(firestore, 'posts', id));
        patchState(store, { posts: store.posts().filter(p => p.id !== id), loading: false });
      } catch (error) {
        patchState(store, { error: 'Failed to delete post', loading: false });
        throw error;
      }
    },

    getPostById: async (id: string) => {
      patchState(store, { loading: true, error: null });
      try {
        const docSnap = await getDoc(doc(firestore, 'posts', id));
        if (docSnap.exists()) {
          const post = { id: docSnap.id, ...docSnap.data() } as Post;
          patchState(store, { currentPost: post, loading: false });
          return post;
        } else {
          patchState(store, { error: 'Post not found', loading: false });
          return null;
        }
      } catch (error) {
        patchState(store, { error: 'Failed to get post', loading: false });
        throw error;
      }
    },

    getPostsByParentId: async (parentId: string | null) => {
      patchState(store, { loading: true, error: null });
      try {
        const q = query(
          collection(firestore, 'posts'),
          where('parentId', '==', parentId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Post);
        patchState(store, { posts, loading: false });
        return posts;
      } catch (error) {
        patchState(store, { error: 'Failed to get posts', loading: false });
        throw error;
      }
    },

    getPostsByUserId: async (userId: string) => {
      patchState(store, { loading: true, error: null });
      try {
        const q = query(
          collection(firestore, 'posts'),
          where('userId', '==', userId),
          where('parentId', '==', null),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Post);
        patchState(store, { posts, loading: false });
        return posts;
      } catch (error) {
        patchState(store, { error: 'Failed to get posts', loading: false });
        throw error;
      }
    },

    setCurrentPost: (post: Post | null) => patchState(store, { currentPost: post }),
  }))
);
