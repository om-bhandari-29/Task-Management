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

const appRoutes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: SignupComponent },
  { path: 'login', component: LoginComponent },

  // { path: 'portal', component: DashboardComponent, canActivate: [generalAuthGuard] },
  { path: 'portal', loadChildren: () => import('./portals/portals.module').then(m => m.PortalsModule) },


  // { path: 'dashboard', component: DashboardComponent, canActivate: [generalAuthGuard] },


  // { path: 'profile', component: UserDetailsComponent, canActivate: [generalAuthGuard], canDeactivate: [profileSaveGuard] },
  // { path: 'allEmployee', component: UserListComponent, canActivate: [generalAuthGuard] },
  // { path: 'departments', component: DepartmentComponent, canActivate: [generalAuthGuard, superAdminAuthGuard] },
  // { path: 'departments/:id', component: UserListComponent, canActivate: [generalAuthGuard, superAdminAuthGuard] },
  // { path: 'assignTask', component: CreateTaskComponent, canActivate: [generalAuthGuard, superAdminAuthGuard || adminAuthGuard] },

  // {
  //   path: 'myTasks', canActivate: [generalAuthGuard],
  //   loadChildren: () => import('./home/my-tasks/my-tasks.module').then(m => m.MyTasksModule)
  // },



]
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
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
    ToastrModule.forRoot(), // ToastrModule added
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
