export interface ResponseGeneric<T> {
    data: T
    status: string,
    statusCode: number
}

export interface response<T> {
    iterableData: T[]
    message: string,
    status: string,
    statusCode: number
}
export interface responseTask<T> {
    iterableData: T[],
    count: number,
    message: string,
    status: string,
    statusCode: number
}

export interface responseG<T>{
    data: T
    status: string,
    statusCode: number,
    message: string,
    token: string
}


export interface getUserData <T> {
    data: T
    message: string,
    status: string,
    statusCode: number
}

export interface response3{
    status: string,
    message: string,
    statusCode: number
}

