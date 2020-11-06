import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '@components/auth/login/login.component';
import { NgGuideComponent } from '@components/ng-guide/ng-guide.component';
import { AuthGuard } from '@guards/auth.guard';
import { RegisterComponent } from '@components/auth/register/register.component';
import { ChatListComponent } from '@components/chat/chat-list/chat-list.component';
import { ChatDetailComponent } from '@components/chat/chat-detail/chat-detail.component';
import { ProfileEditComponent } from '@components/profile/profile-edit/profile-edit.component';
import { HasValidProfileGuard } from '@guards/has-valid-profile.guard';
import { OtherDetailComponent } from '@components/profile/other-detail/other-detail.component';
import { MeDetailComponent } from '@components/profile/me-detail/me-detail.component';
import { BrowseGuysListComponent } from './components/profile/browse-guys-list/browse-guys-list.component';
import { MeConnectionsListComponent } from './components/profile/me-connections-list/me-connections-list.component';
import { OtherConnectionsListComponent } from './components/profile/other-connections-list/other-connections-list.component';
import { ChatPeopleComponent } from './components/chat/chat-people/chat-people.component';
import { AddPeopleComponent } from './components/chat/add-people/add-people.component';

const routes: Routes = [
  // Should ultimately go to home (browse/filter profiles) which will redirect to login if you're not logged in
  { path: '', redirectTo: 'guys', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'me',
    component: MeDetailComponent,
    canActivate: [AuthGuard, HasValidProfileGuard],
    data: { shouldShowBack: false },
  },
  {
    path: 'me/edit',
    component: ProfileEditComponent,
    canActivate: [AuthGuard],
    data: { shouldShowBack: true },
  },
  {
    path: 'me/connections',
    component: MeConnectionsListComponent,
    canActivate: [AuthGuard, HasValidProfileGuard],
    data: { shouldShowBack: true },
  },
  {
    path: 'guys',
    component: BrowseGuysListComponent,
    canActivate: [AuthGuard],
    data: { shouldShowBack: false },
  },
  {
    path: 'guys/:id',
    component: OtherDetailComponent,
    canActivate: [AuthGuard],
    data: { shouldShowBack: true },
  },
  {
    path: 'guys/:id/connections',
    component: OtherConnectionsListComponent,
    canActivate: [AuthGuard, HasValidProfileGuard],
    data: { shouldShowBack: true },
  },

  {
    path: 'chat',
    component: ChatListComponent,
    canActivate: [AuthGuard, HasValidProfileGuard],
    data: { shouldShowBack: false },
  },
  {
    path: 'chat/:id',
    component: ChatDetailComponent,
    canActivate: [AuthGuard, HasValidProfileGuard],
    data: { shouldShowBack: true },
  },
  {
    path: 'chat/:id/people',
    component: ChatPeopleComponent,
    canActivate: [AuthGuard, HasValidProfileGuard],
    data: { shouldShowBack: true },
  },
  {
    path: 'chat/:id/people/add',
    component: AddPeopleComponent,
    canActivate: [AuthGuard, HasValidProfileGuard],
    data: { shouldShowBack: true },
  },
  {
    path: 'guide',
    component: NgGuideComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
