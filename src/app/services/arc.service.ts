import { Injectable, inject } from '@angular/core';
import { ArcStore } from '../store/arc.store';
import { Arc } from '../models/arc.model';
import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class ArcService {
  private arcStore = inject(ArcStore);

  createArc(arc: Omit<Arc, 'id'>) {
    return this.arcStore.createArc(arc);
  }

  updateArc(id: string, partialArc: Partial<Arc>, arc: Arc) {
    return this.arcStore.updateArc(id, partialArc, arc);
  }

  deleteArc(id: string) {
    return this.arcStore.deleteArc(id);
  }

  getArcById(id: string) {
    return this.arcStore.getArcById(id);
  }

  addPostToArc(arcId: string, post: Post) {
    return this.arcStore.addPostToArc(arcId, post);
  }

  movePostOrArc(arcId: string, itemId: string, newParentId: string) {
    return this.arcStore.movePostOrArc(arcId, itemId, newParentId);
  }

  setCurrentArc(arc: Arc | null) {
    this.arcStore.setCurrentArc(arc);
  }
}
