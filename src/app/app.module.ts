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
import { MatSelectModule } from '@angular/material/select';

// LOCAL IMPORTS
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from 'src/app/components/login/login.component';
import { NgGuideComponent } from 'src/app/components/ng-guide/ng-guide.component';
import { ProfileListComponent } from 'src/app/components/profile/profile-list/profile-list.component';
import { ProfileDetailComponent } from 'src/app/components/profile/profile-detail/profile-detail.component';
import { MeComponent } from 'src/app/components/me/me.component';
import { ChatComponent } from 'src/app/components/chat/chat.component';
import { RegisterComponent } from 'src/app/components/register/register.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { ChatListComponent } from 'src/app/components/chat-list/chat-list.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ProfileEditComponent } from 'src/app/components/profile/profile-edit/profile-edit.component';
import { ToggleIconComponent } from 'src/app/components/ui/toggle-icon/toggle-icon.component';
import { ActivitiesSpanComponent } from 'src/app/components/shared/activities-span/activities-span.component';
import { ProfilePreviewCardComponent } from 'src/app/components/shares/profile-preview-card/profile-preview-card.component';

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
    ProfileEditComponent,
    ToggleIconComponent,
    ActivitiesSpanComponent,
    ProfilePreviewCardComponent,
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
    MatSelectModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
