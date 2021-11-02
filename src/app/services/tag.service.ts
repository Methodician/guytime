import { Injectable }         from '@angular/core';
import { UserI }              from '@models/user';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore, }   from '@angular/fire/compat/firestore';
import { FirebaseService }    from './firebase.service';
import { Store }              from '@ngrx/store';
import { TagI, UserTagI } from '@models/tag';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  constructor(
    private afStorage: AngularFireStorage,
    private afs: AngularFirestore,
    private fbSvc: FirebaseService,
    private store: Store,
  ) {}

  getOrCreateTag = async ( tag: TagI) => {
    tag.name = tag.name.toLowerCase();
    const existingTag = await this.getTagByName(tag.name, tag.type);
    if (existingTag) {
      return existingTag;
    }
    return await this.tagsRef().add({
      ...tag,
      createdAt: this.fbSvc.fsTimestamp(),
    });
  }

  createUserTag = async ( tagId, userId: string ) => {
    return await this.userTagsRef().add({
      userId,
      tagId,
      createdAt: this.fbSvc.fsTimestamp(),
    });
  }

  deleteUserTag = async ( tagId, userId: string ) => {
    const {docs: userTagsToDelete} = await this.userTagsRef().ref
      .where('tagId', '==', tagId)
      .where('userId', '==', userId).get();

    return await Promise.all(userTagsToDelete.map(async (userTagToDelete) => {
      await userTagToDelete.ref.delete();
    }));
  }

  tagsRef     = () => this.afs.collection<TagI>('tags');
  userTagsRef = () => this.afs.collection<UserTagI>('userTags');

  userTagsByUserIdRef = ( uid: string ) => this.afs.collection<UserTagI>('userTags').ref
    .where('userId', '==', uid)
    .get()

  userTagsByUserIdDocs = async (uid: string) => {
    const userTagsRef = await this.userTagsByUserIdRef(uid);

    return  userTagsRef.docs.map(( doc ) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
  }

  tagsForUserIdDocs = async ( uid: string ) => {
    const userTags = await this.userTagsByUserIdDocs(uid);

    return this.userTagsAsTags(userTags);
  }

  userTagsAsTags = async (userTags: UserTagI[]): Promise<TagI[]> => {
    return await Promise.all(userTags.map(async (userTag) => {
      const doc = await this.afs.doc<TagI>(`tags/${userTag.tagId}`).ref.get();
      return doc.data();
    }));
  }

  userTagsByUserIdWithJoinedTags = async (uid: string) => {
    const userTags = await this.userTagsByUserIdDocs(uid);

    return await Promise.all(userTags.map(async ( userTag ) => {
      const doc = await this.afs.doc<TagI>(`tags/${userTag.tagId}`).ref.get();
      return {
        ...userTag,
        tag: {
          ...doc.data(),
        }
      };
    }));
  }

  getTagByName = async (name: string, type?: string | null): Promise<TagI | null> => {
    const query = this.afs.collection<TagI>('tags',).ref.where('name', '==', name);
    if (type) {
      query.where('type', '==', type);
    }
    const { docs: existingTags } = await query.get();

    console.log(`name: ${name} existingTags.length: ${existingTags.length}`);

    if ( existingTags.length > 1 ) {
      const [, ...duplicates] = existingTags;
      await Promise.all(duplicates.map(async (duplicateTag) => {
        const { docs: existingUserTags } = await this.afs.collection<UserTagI>('userTags',).ref
          .where('tagId', '==', duplicateTag.id)
          .get();
        if (existingUserTags.length > 0) {
          await Promise.all(existingUserTags.map(async (userTag) => {
            console.log(`Would delete userTag with id: ${userTag.ref.id}`);
            await userTag.ref.delete();
          }));
        }
        console.log(`Would delete tag with id: ${duplicateTag.ref.id}`);
        await duplicateTag.ref.delete();
      }));
    }

    if ( existingTags.length >= 1 ) {
      return {
        ...existingTags[0].data(),
        id: existingTags[0].id,
      };
    }

    return null;
  }

  userTagExists = async (tag: TagI, userId: string): Promise<boolean> => {
    const existingTag = await this.getTagByName(tag.name);

    if (!existingTag) {
      return false;
    }

    const {docs: existingUserTags} = await this.afs.collection<UserTagI>('userTags',).ref
      .where('userId', '==', userId)
      .where('tagId', '==', existingTag.id)
      .get();

    if ( existingUserTags.length > 1) {
      const [ , ...duplicates ] = existingUserTags;
      console.log(duplicates);
      await Promise.all(duplicates.map(async ( duplicateTag ) => {
        console.log(`Would delete tag with id: ${duplicateTag.ref.id}`);
        await duplicateTag.ref.delete();
      }));
    }

    if ( existingUserTags.length >= 1) {
      return true;
    }

    return false;
  }

}



