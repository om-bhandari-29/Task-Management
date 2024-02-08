import { FormControl } from "@angular/forms"

export interface createTaskModel{
    title: FormControl<string | null>;
    description: FormControl<string | null>;
    isCompleted: FormControl<boolean | null>;
    employeeId: FormControl<number | null>;
}

export interface createTaskData{
    title: string | null ,
    description: string | null ,
    isCompleted: boolean | null, 
}

export interface deletedTaskResponseData{
    message: string,
    status: string,
    statusCode: number
}

export interface taskListModel {
    id: number,
    departmentId: number,
    employeeName: string,
    departmentName: string,
    assignBy: number,
    title: string,
    description: string,
    isCompleted: boolean,
    employeeId: number,
    createdDate: string,
    updatedDate: string,
    deadLine: string,
}

export interface createNewtask{
    title: string | null ,
    description: string | null ,
    isCompleted: boolean | null ,
    employeeId: number | null 
}