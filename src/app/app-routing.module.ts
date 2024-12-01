import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home_screen/home/home.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { authGuard, authGuard2 } from './gurd/auth/auth.guard';
import { PostLoginComponent } from './components/post-login/post-login.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: 'login2',
    loadChildren: () =>
      import('./components/home_screen/home.module').then(
        (m) => m.HomeModule
      ),
  },
  {
    path: 'login',
    loadChildren: () => 
      import('./components/home_screen/home.module').then((m) => m.HomeModule)
  },
  {
    path: 'user',
    canActivate: [authGuard2],
    loadChildren: () =>
      import('./components/user_screen/user.module').then((m) => m.UserModule),
  },
  {
    path: 'home',
    canActivate: [authGuard2],
    component: PostLoginComponent
  },
  {
    path: 'admin',
    canActivate: [authGuard2],
    loadChildren: () =>
      import('./components/admin/admin.module').then((m) => m.AdminModule)
  },
  {
    path: 'owner',
    canActivate: [authGuard2],
    loadChildren: () => 
      import('./components/owner_view/owner.module').then((m) => m.OwnerModule)
  },
  {
    path: 'shared',
    canActivate: [authGuard2],
    loadChildren: () => 
      import('./components/shared/shared.module').then((m) => m.SharedModule)
  },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export const routingComponents = [HomeComponent];
