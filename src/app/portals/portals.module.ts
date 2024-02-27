import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
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
import { adminASuperAdminGuard } from '../Guards/admin-asuper-admin.guard';
import { DepartmentUserComponent } from '../home/commonComponent/department-user/department-user.component';
import { NotificationsComponent } from '../home/commonComponent/notifications/notifications.component';
import { ChatsComponent } from '../home/commonComponent/chats/chats.component';
import { ChatPopUpComponent } from '../commomComponent/chat-pop-up/chat-pop-up.component';
import { DragDroptaskComponent } from '../src/app/home/drag-droptask/drag-droptask.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'profile', component: UserDetailsComponent, canActivate: [generalAuthGuard], canDeactivate: [profileSaveGuard] },
  { path: 'departments', component: DepartmentComponent, canActivate: [generalAuthGuard, superAdminAuthGuard] },
  { path: 'departments/:id', component: DepartmentUserComponent, canActivate: [generalAuthGuard, superAdminAuthGuard] },
  { path: 'allEmployee', component: UserListComponent, canActivate: [generalAuthGuard, adminASuperAdminGuard] },
  { path: 'myTasks', component: TasksComponent, canActivate: [generalAuthGuard] },
  { path: 'myTasks/:id', component: CreateTaskComponent, canActivate: [generalAuthGuard] },
  { path: 'assignTask', component: CreateTaskComponent, canActivate: [generalAuthGuard, adminASuperAdminGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [generalAuthGuard] },
  { path: 'chats', component: ChatsComponent, canActivate: [generalAuthGuard] },
  { path: 'drag-drop', component: DragDroptaskComponent, canActivate: [generalAuthGuard] },
];

@NgModule({
  declarations: [
    PortalsComponent,
    UserDetailsComponent,
    DepartmentComponent,
    UserListComponent,
    DashboardComponent,
    TasksComponent,
    CreateTaskComponent,
    DepartmentComponent,
    DepartmentUserComponent,
    ChatsComponent,
    ChatPopUpComponent,
    DragDroptaskComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LoaderComponent,
    OptionsComponent,
    FormsModule,
    ReactiveFormsModule,
    ErrorComponent,
    CardsComponent,
    ArrowUpComponent,
    ArrowDownComponent,
    PaginationComponent,
    DragDropModule
  ]
})
export class PortalsModule { }
