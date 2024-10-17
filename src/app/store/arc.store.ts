import { Injectable, inject } from '@angular/core';
import { signalStore, withState, patchState, withMethods } from '@ngrx/signals';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, orderBy } from '@angular/fire/firestore';
import { Arc } from '../models/arc.model';
import { Post } from '../models/post.model';

interface ArcState {
  currentArc: Arc | null;
  loading: boolean;
  error: string | null;
}

const initialState: ArcState = {
  currentArc: null,
  loading: false,
  error: null
};

export const ArcStore = signalStore(
  withState(initialState),
  withMethods((store, firestore = inject(Firestore)) => ({
    createArc: async (arc: Omit<Arc, 'id'>) => {
      patchState(store, { loading: true, error: null });
      try {
        const docRef = await addDoc(collection(firestore, 'arcs'), arc);
        const newArc = { id: docRef.id, ...arc };
        patchState(store, { currentArc: newArc, loading: false });
        return newArc;
      } catch (error) {
        patchState(store, { error: 'Failed to create arc', loading: false });
        throw error;
      }
    },

    updateArc: async (id: string, partialArc: Partial<Arc>, arc: Arc) => {
      patchState(store, { loading: true, error: null });
      try {
        updateDoc(doc(firestore, 'arcs', id), partialArc);
        patchState(store, { currentArc: arc, loading: false });
      } catch (error) {
        patchState(store, { error: 'Failed to update arc', loading: false });
        throw error;
      }
    },

    deleteArc: async (id: string) => {
      patchState(store, { loading: true, error: null });
      try {
        await deleteDoc(doc(firestore, 'arcs', id));
        patchState(store, { currentArc: null, loading: false });
      } catch (error) {
        patchState(store, { error: 'Failed to delete arc', loading: false });
        throw error;
      }
    },

    getArcById: async (id: string) => {
      patchState(store, { loading: true, error: null });
      try {
        const docSnap = await getDoc(doc(firestore, 'arcs', id));
        if (docSnap.exists()) {
          const arc = { id: docSnap.id, ...docSnap.data() } as Arc;
          patchState(store, { currentArc: arc, loading: false });
          return arc;
        } else {
          patchState(store, { error: 'Arc not found', loading: false });
          return null;
        }
      } catch (error) {
        patchState(store, { error: 'Failed to get arc', loading: false });
        throw error;
      }
    },

    addPostToArc: async (arcId: string, post: Post) => {
      patchState(store, { loading: true, error: null });
      try {
        const arcDoc = doc(firestore, 'arcs', arcId);
        const arcSnap = await getDoc(arcDoc);
        if (arcSnap.exists()) {
          const arc = arcSnap.data() as Arc;
          arc.posts.push(post.id);
          arc.hierarchy[post.id] = { children: [] };
          await updateDoc(arcDoc, { posts: arc.posts, hierarchy: arc.hierarchy });
          patchState(store, { currentArc: arc, loading: false });
        } else {
          patchState(store, { error: 'Arc not found', loading: false });
        }
      } catch (error) {
        patchState(store, { error: 'Failed to add post to arc', loading: false });
        throw error;
      }
    },

    movePostOrArc: async (arcId: string, itemId: string, newParentId: string) => {
      patchState(store, { loading: true, error: null });
      try {
        const arcDoc = doc(firestore, 'arcs', arcId);
        const arcSnap = await getDoc(arcDoc);
        if (arcSnap.exists()) {
          const arc = arcSnap.data() as Arc;
          const itemHierarchy = arc.hierarchy[itemId];
          if (itemHierarchy) {
            const oldParentId = Object.keys(arc.hierarchy).find(key => arc.hierarchy[key].children.includes(itemId));
            if (oldParentId) {
              arc.hierarchy[oldParentId].children = arc.hierarchy[oldParentId].children.filter(id => id !== itemId);
            }
            arc.hierarchy[newParentId].children.push(itemId);
            await updateDoc(arcDoc, { hierarchy: arc.hierarchy });
            patchState(store, { currentArc: arc, loading: false });
          } else {
            patchState(store, { error: 'Item not found in hierarchy', loading: false });
          }
        } else {
          patchState(store, { error: 'Arc not found', loading: false });
        }
      } catch (error) {
        patchState(store, { error: 'Failed to move item in hierarchy', loading: false });
        throw error;
      }
    },

    setCurrentArc: (arc: Arc | null) => patchState(store, { currentArc: arc }),
  }))
);
