import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './home/authorization/login/login.component';
import { SignupComponent } from './home/authorization/signup/signup.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AttachTokenInterceptor } from './Interceptors/attach-token.interceptor';

import { ToastrModule } from 'ngx-toastr';
import { CardsComponent } from './home/cards/cards.component';
import { OptionsComponent } from './home/options/options.component';
import { LoaderComponent } from './home/commonComponent/loader/loader.component';
import { ErrorComponent } from './home/commonComponent/error/error.component';
import { SharedModule } from './shared/shared.module';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './home/commonComponent/notifications/notifications.component';

const appRoutes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: SignupComponent },
  { path: 'login', component: LoginComponent },

  { path: 'portal', loadChildren: () => import('./portals/portals.module').then(m => m.PortalsModule) },
]
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    NotificationsComponent
  ],
  imports: [
    CardsComponent,
    BrowserModule,
    ErrorComponent,
    CommonModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 1000
    }), // ToastrModule added
    SharedModule,
    LoaderComponent,
    OptionsComponent
  ],

  exports: [
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AttachTokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
