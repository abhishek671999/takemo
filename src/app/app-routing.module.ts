import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { PricingComponent } from './pricing/pricing.component';
import { HomeComponent } from './home/home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { SignupComponent } from './signup/signup.component';
import { TestComponentComponent } from './test-component/test-component.component';

const routes: Routes = [
  { path: '', component: HomeComponent}, 
  { path: 'about', component: AboutComponent},
  { path: 'pricing', component: PricingComponent},
  { path: 'contact', component: ContactUsComponent},
  { path: 'forgot-password', component: ForgotpasswordComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'test', component: TestComponentComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [AboutComponent, PricingComponent, HomeComponent]
