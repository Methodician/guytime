import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// ANGULAR
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule } from '@angular/common/http';

// ANGULAR FIRE
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/firestore';
// import { AngularFireAnalyticsModule } from '@angular/fire/analytics';

// ANGULAR MATERIAL
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

// LOCAL IMPORTS
import { environment } from '@env/environment';

import { LandingComponent } from './components/landing/landing.component';
import { NgGuideComponent } from '@components/ng-guide/ng-guide.component';
import { ProfileListComponent } from '@components/profile/profile-list/profile-list.component';
import { ProfileDetailComponent } from '@components/profile/profile-detail/profile-detail.component';
import { NavbarComponent } from '@components/shell/navbar/navbar.component';
import { ChatListComponent } from '@components/chat/chat-list/chat-list.component';
import { HeaderComponent } from '@components/shell/header/header.component';
import { ProfileEditComponent } from '@components/profile/profile-edit/profile-edit.component';
import { ToggleIconComponent } from '@components/ui/toggle-icon/toggle-icon.component';
import { ActivitiesSpanComponent } from '@components/shared/activities-span/activities-span.component';
import { ProfilePreviewCardComponent } from '@components/profile/profile-preview-card/profile-preview-card.component';
import { OtherDetailComponent } from '@components/profile/other-detail/other-detail.component';
import { MeDetailComponent } from '@components/profile/me-detail/me-detail.component';
import { MeConnectionsListComponent } from '@components/profile/me-connections-list/me-connections-list.component';
import { OtherConnectionsListComponent } from '@components/profile/other-connections-list/other-connections-list.component';
import { ChatDetailComponent } from '@components/chat/chat-detail/chat-detail.component';
import { ChatMessageComponent } from '@components/chat/chat-message/chat-message.component';
import { ChatGroupComponent } from '@components/chat/chat-group/chat-group.component';
import { ChatPeopleComponent } from './components/chat/chat-people/chat-people.component';
import { BottomGhostBannerComponent } from './components/ui/bottom-ghost-banner/bottom-ghost-banner.component';
import { AddPeopleComponent } from './components/chat/add-people/add-people.component';
import { AvatarComponent } from './components/shared/avatar/avatar.component';
import { BrowseFellasComponent } from './components/profile/browse-fellas/browse-fellas.component';

import { userReducer } from './store/user.reducer';

// pipes
import { TimeElapsedPipe } from './pipes/time-elapsed.pipe';

// Assorted automatic imports we have not yet organized (auto imports will usually end up here)
import { TestFellasFlowComponent } from './components/testing/test-fellas-flow/test-fellas-flow.component';
import { EffectsModule } from '@ngrx/effects';
import { FellaEffects } from './store/fella.effects';
import { fellaReducer } from './store/fella.reducer';

@NgModule({
  declarations: [
    AppComponent,
    NgGuideComponent,
    ProfileListComponent,
    ProfileDetailComponent,
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
    OtherConnectionsListComponent,
    ChatDetailComponent,
    ChatMessageComponent,
    TimeElapsedPipe,
    ChatGroupComponent,
    ChatPeopleComponent,
    AddPeopleComponent,
    BottomGhostBannerComponent,
    AvatarComponent,
    LandingComponent,
    BrowseFellasComponent,
    TestFellasFlowComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatMenuModule,
    MatListModule,
    MatSelectModule,
    MatCheckboxModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately',
    }),
    StoreModule.forRoot(
      { fellaState: fellaReducer, testFellasState: userReducer },
      {},
    ),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([FellaEffects]),
  ],
  providers: [
    {
      provide: SETTINGS,
      useValue: environment.shouldUseEmulator
        ? { host: 'localhost:8080', ssl: false }
        : undefined,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
