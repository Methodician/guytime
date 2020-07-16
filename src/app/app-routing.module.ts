import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/components/login/login.component';
import { NgGuideComponent } from 'src/app/components/ng-guide/ng-guide.component';
import { ProfileDetailComponent } from 'src/app/components/profile/profile-detail/profile-detail.component';
import { ProfileListComponent } from 'src/app/components/profile/profile-list/profile-list.component';
import { AuthGuard } from './guards/auth.guard';
import { MeComponent } from 'src/app/components/me/me.component';
import { ChatComponent } from 'src/app/components/chat/chat.component';
import { RegisterComponent } from 'src/app/components/register/register.component';
import { ChatListComponent } from 'src/app/components/chat-list/chat-list.component';
import { ProfileEditComponent } from 'src/app/components/profile/profile-edit/profile-edit.component';
import { HasValidProfileGuard } from './guards/has-valid-profile.guard';

const routes: Routes = [
  // Should ultimately go to home (browse/filter profiles) which will redirect to login if you're not logged in
  { path: '', redirectTo: 'guys', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'me',
    component: MeComponent,
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
    component: ProfileDetailComponent,
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
