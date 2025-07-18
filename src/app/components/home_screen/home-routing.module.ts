import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';
import { PricingComponent } from './pricing/pricing.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { Login2Component } from './login2/login2.component';
import { RefundCancellationPolicyComponent } from './refund-cancellation-policy/refund-cancellation-policy.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: Login2Component },
      { path: '2', component: LoginComponent},
      { path: 'about', component: AboutComponent },
      { path: 'pricing', component: PricingComponent },
      { path: 'contact', component: ContactUsComponent },
      { path: 'forgot-password', component: ForgotpasswordComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent},
      { path: 'terms-and-conditions', component: TermsAndConditionsComponent},
      { path: 'refund-cancellation-policy', component: RefundCancellationPolicyComponent},
      { path: '**', component: AboutComponent},

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
