export interface ResponsePagination<T> {
    page: number;
    nextPage: number | null;
    prevPage: number | null;
    totalPage: number;
    totalItem: number;
    list: T[];
}

export interface ResponseError{
    error: string;
}

export type InfoResponse ={
    name: string,
    size: number,
    last_modified: string,
}

export function isResponsePagination<T>(value: any): value is ResponsePagination<T> {
    return typeof value.page === 'number' &&
            (typeof value.nextPage === 'number' || value.nextPage === null) &&
            (typeof value.prevPage === 'number' || value.prevPage === null) &&
            typeof value.totalPage === 'number' &&
            typeof value.totalItem === 'number' &&
            Array.isArray(value.list);
    }

export function isInfoResponse(obj: any): obj is InfoResponse{
    return typeof obj.name === 'string' &&
            typeof obj.size === 'number' &&
            typeof obj.last_modified === 'string';
}

export  function isResponseError(obj:any): obj is ResponseError {
    return typeof obj.error !== 'undefined';
}