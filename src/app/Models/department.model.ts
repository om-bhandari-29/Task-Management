export interface deleteDepartResponse {
    status: string;
    messsage: string;
    statusCode: number
}

export interface groupByDepartmentResponse {
    departmentName: string;
    employeesCount: number;
    id: number
}

export interface departmentIterable {
    id: number,
    departmentName: string
    employeesCount: number;
}