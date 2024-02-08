import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MyTasksComponent } from './my-tasks.component';
import { PaginationComponent } from '../commonComponent/pagination/pagination.component';
import { ArrowDownComponent } from '../commonComponent/arrow-down/arrow-down.component';
import { ArrowUpComponent } from '../commonComponent/arrow-up/arrow-up.component';
import { LoaderComponent } from '../commonComponent/loader/loader.component';
import { OptionsComponent } from '../options/options.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateTaskComponent } from '../create-task/create-task.component';


const routes: Routes = [
  { path: '', component: MyTasksComponent },
  { path: ':id', component: CreateTaskComponent },
];

@NgModule({
  declarations: [
    MyTasksComponent,
  ],
  imports: [
    CommonModule,
    LoaderComponent,
    ArrowDownComponent,
    ArrowUpComponent,
    OptionsComponent,
    PaginationComponent,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    // SharedModule
  ]
})
export class MyTasksModule { }
