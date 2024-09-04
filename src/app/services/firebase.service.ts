import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, getDoc } from '@angular/fire/firestore';
import { Post, Comment, Refutation, Response } from '../models/post.model';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  async createPost(post: Omit<Post, 'id' | 'authorId'>): Promise<string> {
    const user = await firstValueFrom(this.authService.user$.pipe(take(1)));
    if (!user) throw new Error('User not authenticated');

    const postWithAuthor = { ...post, authorId: user.uid };
    const docRef = await addDoc(collection(this.firestore, 'posts'), postWithAuthor);
    return docRef.id;
  }

  async updatePost(id: string, post: Partial<Post>): Promise<void> {
    await updateDoc(doc(this.firestore, 'posts', id), post);
  }

  async deletePost(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'posts', id));
  }

  async getPostsByParentId(parentId: string | null): Promise<Post[]> {
    const q = query(collection(this.firestore, 'posts'), where('parentId', '==', parentId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
  }

  async getRootPosts(): Promise<Post[]> {
    const q = query(collection(this.firestore, 'posts'), where('parentId', '==', null));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
  }

  async getPostById(id: string): Promise<Post | null> {
    const docRef = doc(this.firestore, 'posts', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Post;
    } else {
      return null;
    }
  }

  // Implement similar methods for comments, refutations, and responses
}