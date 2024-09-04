import { CanActivateChildFn, Router, Routes, UrlTree } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { GroupsComponent } from './groups/groups.component';
import { RegisterComponent } from './register/register.component';
import { ChannelComponent } from './channel/channel.component';
import { AdminComponent } from './admin/admin.component';
import { AccountComponent } from './account/account.component';
import { inject } from '@angular/core';
import { CheckAuthService } from './service/check-auth.service';

const authGuardUser: CanActivateChildFn = (): boolean | UrlTree => {
  const authService = inject(CheckAuthService);
  const router = inject(Router);
  console.log(authService.checkIsValid());
  return authService.checkPermissions() || router.createUrlTree(['/login']);
};

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'auth',
    children: [
      { path: '', redirectTo: '/auth/home', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'home', component: GroupsComponent },
      { path: 'room/:id', component: ChannelComponent },
      { path: 'settings', component: AccountComponent },
      { path: 'admin', component: AdminComponent },
    ],
    canActivateChild: [authGuardUser],
  },
];
