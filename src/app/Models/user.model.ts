export interface user{
    address: string,
    city: string,
    country: string,
    departmentID: number,
    departmentName: string | null,
    email: string,
    employeeType: number,
    id: number,
    name: string,
    phone: string
}

export interface getAllEmployeeI{
    isPagination: boolean,
    index: number,
    take: number,
    search: null | string,
    orders: null | number,
    orderBy: null | string
}
export interface getAllTaskI{
    isPagination: boolean,
    index: number,
    take: number,
    search: null | string,
    orders: null | number,
    orderBy: null | string,
    isCompleted: boolean | null
}