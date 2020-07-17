import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '@components/login/login.component';
import { NgGuideComponent } from '@components/ng-guide/ng-guide.component';
import { ProfileListComponent } from '@components/profile/profile-list/profile-list.component';
import { AuthGuard } from '@guards/auth.guard';
import { ChatComponent } from '@components/chat/chat.component';
import { RegisterComponent } from '@components/register/register.component';
import { ChatListComponent } from '@components/chat-list/chat-list.component';
import { ProfileEditComponent } from '@components/profile/profile-edit/profile-edit.component';
import { HasValidProfileGuard } from '@guards/has-valid-profile.guard';
import { OtherDetailComponent } from '@components/profile/other-detail/other-detail.component';
import { MeDetailComponent } from '@components/profile/me-detail/me-detail.component';

const routes: Routes = [
  // Should ultimately go to home (browse/filter profiles) which will redirect to login if you're not logged in
  { path: '', redirectTo: 'guys', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'me',
    component: MeDetailComponent,
    canActivate: [AuthGuard, HasValidProfileGuard],
  },
  {
    path: 'me/edit',
    component: ProfileEditComponent,
    canActivate: [AuthGuard],
  },
  { path: 'guys', component: ProfileListComponent, canActivate: [AuthGuard] },
  {
    path: 'guys/:id',
    component: OtherDetailComponent,
    canActivate: [AuthGuard],
  },
  { path: 'chat', component: ChatListComponent, canActivate: [AuthGuard] },
  {
    path: 'chat/:id',
    component: ChatComponent,
    canActivate: [AuthGuard],
  },
  { path: 'guide', component: NgGuideComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
