import { Injectable }                                       from '@angular/core';
import { IcebreakerAnswerI, IcebreakerI, } from '@models/icebreaker';
import { AngularFireStorage }                               from '@angular/fire/compat/storage';
import { AngularFirestore, }   from '@angular/fire/compat/firestore';
import { FirebaseService }    from './firebase.service';
import { Store }              from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class IcebreakerService {
  constructor(
    private afStorage: AngularFireStorage,
    private afs: AngularFirestore,
    private fbSvc: FirebaseService,
    private store: Store,
  ) {}

  createIcebreakerAnswer = async (icebreakerAnswer: IcebreakerAnswerI) => {
    return await this.icebreakerAnswersRef().add(icebreakerAnswer);
  }

  icebreakerAnswersRef = () => this.afs.collection<IcebreakerAnswerI>('icebreakerAnswers');

  icebreakersRef = () => this.afs.collection<IcebreakerI>('icebreakers');

  icebreakerAnswerForUserId = async (uid: string): Promise<IcebreakerAnswerI | null> => {
    const {docs: icebreakerAnswers} = await this.icebreakerAnswersRef().ref.where('userId', '==', uid).get();
    console.log(icebreakerAnswers);
    if (icebreakerAnswers.length === 0) {
      return null;
    }

    const icebreakerAnswerData = icebreakerAnswers[0].data()

    return {
      ...icebreakerAnswerData,
      id: icebreakerAnswers[0].id,
    };

  }

  updateIcebreakerAnswer = async (updatedAnswer: IcebreakerAnswerI) => {
    console.log('updatedAnswer:');
    console.log(updatedAnswer);
    return await this.afs.collection<IcebreakerAnswerI>('icebreakerAnswers')
      .doc(updatedAnswer.id)
      .update(updatedAnswer);
  }

}



