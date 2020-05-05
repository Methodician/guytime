import { Component } from '@angular/core';
import { AngularFirestore }  from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'gtm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'guytime';
  items: Observable<any[]>;

  constructor(fs: AngularFirestore) {
    this.items = fs.collection('items').valueChanges();
  }
}
