import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home_screen/home/home.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { authGuard } from './gurd/auth/auth.guard';
import { TestComponentNewComponent } from './test-component-new/test-component-new.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./components/home_screen/home.module').then(
        (m) => m.HomeModule
      ),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./components/user_screen/user.module').then((m) => m.UserModule),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./components/admin/admin.module').then((m) => m.AdminModule)
  },
  {
    path: 'owner',
    canActivate: [authGuard],
    loadChildren: () => 
      import('./components/owner_view/owner.module').then((m) => m.OwnerModule)
  },
  {
    path: 'test',
    component: TestComponentNewComponent
  },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export const routingComponents = [HomeComponent];
