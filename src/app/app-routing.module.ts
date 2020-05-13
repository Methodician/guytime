import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NgGuideComponent } from './components/ng-guide/ng-guide.component';
import { ProfileDetailComponent } from './components/profile-detail/profile-detail.component';
import { ProfileListComponent } from './components/profile-list/profile-list.component';
import { AuthGuard } from './guards/auth.guard';
import { MeComponent } from './components/me/me.component';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  // Should ultimately go to home (browse/filter profiles) which will redirect to login if you're not logged in
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'me', component: MeComponent, canActivate: [AuthGuard] },
  { path: 'guys', component: ProfileListComponent, canActivate: [AuthGuard] },
  {
    path: 'guys/:id',
    component: ProfileDetailComponent,
    canActivate: [AuthGuard],
  },
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
