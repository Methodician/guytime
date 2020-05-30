import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// ANGULAR
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ANGULAR FIRE
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { AngularFireAnalyticsModule } from '@angular/fire/analytics';

// ANGULAR MATERIAL
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';

// LOCAL IMPORTS
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { NgGuideComponent } from './components/ng-guide/ng-guide.component';
import { ProfileListComponent } from './components/profile-list/profile-list.component';
import { ProfileDetailComponent } from './components/profile-detail/profile-detail.component';
import { MeComponent } from './components/me/me.component';
import { ChatComponent } from './components/chat/chat.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NgGuideComponent,
    ProfileListComponent,
    ProfileDetailComponent,
    MeComponent,
    ChatComponent,
    RegisterComponent,
    NavbarComponent,
    ChatListComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatListModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}