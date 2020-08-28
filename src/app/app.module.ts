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
import { environment } from '@env/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from '@components/login/login.component';
import { NgGuideComponent } from '@components/ng-guide/ng-guide.component';
import { ProfileListComponent } from '@components/profile/profile-list/profile-list.component';
import { ProfileDetailComponent } from '@components/profile/profile-detail/profile-detail.component';
import { ChatComponent } from '@components/chat/chat.component';
import { RegisterComponent } from '@components/register/register.component';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { ChatListComponent } from '@components/chat-list/chat-list.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HeaderComponent } from '@components/header/header.component';
import { ProfileEditComponent } from '@components/profile/profile-edit/profile-edit.component';
import { ToggleIconComponent } from '@components/ui/toggle-icon/toggle-icon.component';
import { ActivitiesSpanComponent } from '@components/shared/activities-span/activities-span.component';
import { ProfilePreviewCardComponent } from '@components/shares/profile-preview-card/profile-preview-card.component';
import { OtherDetailComponent } from '@components/profile/other-detail/other-detail.component';
import { MeDetailComponent } from '@components/profile/me-detail/me-detail.component';
import { MeConnectionsListComponent } from './components/profile/me-connections-list/me-connections-list.component';
import { BrowseGuysListComponent } from './components/profile/browse-guys-list/browse-guys-list.component';
import { OtherConnectionsListComponent } from './components/profile/other-connections-list/other-connections-list.component';
import { ChatDetailComponent } from './components/chat/chat-detail/chat-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NgGuideComponent,
    ProfileListComponent,
    ProfileDetailComponent,
    ChatComponent,
    RegisterComponent,
    NavbarComponent,
    ChatListComponent,
    HeaderComponent,
    ProfileEditComponent,
    ToggleIconComponent,
    ActivitiesSpanComponent,
    ProfilePreviewCardComponent,
    OtherDetailComponent,
    MeDetailComponent,
    MeConnectionsListComponent,
    BrowseGuysListComponent,
    OtherConnectionsListComponent,
    ChatDetailComponent,
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
