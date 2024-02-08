import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PortalsComponent } from './portals.component';
import { DashboardComponent } from '../home/dashboard/dashboard.component';
import { UserDetailsComponent } from '../home/commonComponent/user-details/user-details.component';
import { LoaderComponent } from '../home/commonComponent/loader/loader.component';
import { OptionsComponent } from './../home/options/options.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartmentComponent } from '../home/department/department.component';
import { ErrorComponent } from '../home/commonComponent/error/error.component';
import { UserListComponent } from '../home/commonComponent/user-list/user-list.component';
import { CardsComponent } from '../home/cards/cards.component';
import { generalAuthGuard } from '../Guards/general-auth.guard';
import { profileSaveGuard } from '../Guards/profile-save.guard';
import { TasksComponent } from '../home/commonComponent/tasks/tasks.component';
import { ArrowUpComponent } from '../home/commonComponent/arrow-up/arrow-up.component';
import { ArrowDownComponent } from '../home/commonComponent/arrow-down/arrow-down.component';
import { PaginationComponent } from '../home/commonComponent/pagination/pagination.component';
import { CreateTaskComponent } from '../home/create-task/create-task.component';
import { superAdminAuthGuard } from '../Guards/super-admin-auth.guard';
import { adminAuthGuard } from '../Guards/admin-auth.guard';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'profile', component: UserDetailsComponent, canActivate: [generalAuthGuard], canDeactivate: [profileSaveGuard] },
  { path: 'departments', component: DepartmentComponent, canActivate: [generalAuthGuard, superAdminAuthGuard] },
  { path: 'departments/:id', component: UserListComponent, canActivate: [generalAuthGuard, superAdminAuthGuard] },
  { path: 'allEmployee', component: UserListComponent, canActivate: [generalAuthGuard, superAdminAuthGuard || adminAuthGuard] },
  { path: 'myTasks', component: TasksComponent, canActivate: [generalAuthGuard] },
  { path: 'myTasks/:id', component: CreateTaskComponent, canActivate: [generalAuthGuard] },
  { path: 'assignTask', component: CreateTaskComponent, canActivate: [generalAuthGuard, superAdminAuthGuard || adminAuthGuard] },
];

@NgModule({
  declarations: [
    PortalsComponent,
    UserDetailsComponent,
    DepartmentComponent,
    UserListComponent,
    DashboardComponent,
    TasksComponent,
    CreateTaskComponent
  ],
  imports: [
    CommonModule,
    // BrowserModule,
    RouterModule.forChild(routes),
    LoaderComponent,
    OptionsComponent,
    FormsModule,
    ReactiveFormsModule,
    ErrorComponent,
    CardsComponent,
    ArrowUpComponent,
    ArrowDownComponent,
    PaginationComponent
  ]
})
export class PortalsModule { }
