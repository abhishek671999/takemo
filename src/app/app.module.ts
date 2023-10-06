import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home_screen/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/home_screen/header/header.component';
import { FooterComponent } from './components/home_screen/footer/footer.component';
import { SignupComponent } from './components/home_screen/signup/signup.component';
import { ForgotpasswordComponent } from './components/home_screen/forgotpassword/forgotpassword.component';
import { HttpClientModule } from '@angular/common/http';
import { ContactUsComponent } from './components/home_screen/contact-us/contact-us.component';
import { TestComponentComponent } from './components/user_screen/test-component/test-component.component';
import { PostLoginComponent } from './components/user_screen/post-login/post-login.component';
import { LoginComponent } from './components/home_screen/login/login.component';
import { UserComponent } from './components/user_screen/user/user.component';
import { DummyComponent } from './dummy/dummy.component';
import { NotfoundComponent } from './notfound/notfound.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    SignupComponent,
    ForgotpasswordComponent,
    routingComponents,
    ContactUsComponent,
    TestComponentComponent,
    PostLoginComponent,
    LoginComponent,
    DummyComponent,
    NotfoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
