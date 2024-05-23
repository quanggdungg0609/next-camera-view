"use server"
import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { cookies } from "next/headers"
import getConfig from 'next/config';
import { SessionExpired, TokenNotFound} from "../exceptions"
const { serverRuntimeConfig }= getConfig()



// axios configs
const axiosInstanceWithAccessToken = axios.create({
    baseURL: serverRuntimeConfig.API_URI
})

axiosInstanceWithAccessToken.interceptors.request.use(
    async (config)=>{
        const cookiesStore = cookies()
        const accessToken = cookiesStore.get("access")?.value
        if (accessToken){
            config.headers["Authorization"] = `Bearer ${accessToken}`
        }else{
            try{
                const accessToken = await getNewAccesToken()
                config.headers["Authorization"] = `Bearer ${accessToken}`
            }catch(exception){
                throw exception
            }
        }
        return config
    },
    
    async (error)=>{
        console.error(error)
        if(error instanceof TokenNotFound){
            console.error("token not found")
        }
        throw error
    }
)

const axiosInstanceWithRefreshToken = axios.create({
    baseURL: serverRuntimeConfig.API_URI
})


axiosInstanceWithRefreshToken.interceptors.request.use(
    (config)=>{
        const cookiesStore = cookies()
        const refreshToken = cookiesStore.get("refresh")?.value
        if(!refreshToken){
            throw new SessionExpired()
        }
        config.headers["Authorization"] = `Bearer ${refreshToken}`
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)


export async function loginRequest(account: string, password: string){
    // * Make a login request to server

    try{
        const res = await axios.post(`${serverRuntimeConfig.API_URI}/api/auth/login`,{
            username: account,
            password: password
        })
        if(res.status === 200){
            const {userName, email, role, access_token, refresh_token } = res.data
            const accessExpiryDate = new Date();
            accessExpiryDate.setMinutes(accessExpiryDate.getMinutes() + 15);

            const refreshExpiryDate = new Date();
            refreshExpiryDate.setDate(refreshExpiryDate.getDate() + 1);
            cookies().set({
                name:"access",
                value: access_token,
                httpOnly:true,
                expires:accessExpiryDate
            })
            cookies().set({
                name:"refresh",
                value: refresh_token,
                httpOnly:true,
                expires:refreshExpiryDate
            })

            cookies().set({
                name:"role",
                value: role,
                httpOnly: true
            })
            return {
                userName: userName,
                email: email,
                role: role
            }
        }
    }catch(exception){

        if (axios.isAxiosError(exception)) {
            const message = exception.response?.data
            return {
                error: message,
            };
        }else{
            console.error(exception)
        }
    }
}

export async function getMyInfo(){
    try{
        const response = await axiosInstanceWithAccessToken.get("/api/users/get-my-info")
        if(response.status === 200){
            const {userName, role, email, firstName, lastName} = response.data
            return {
                userName,
                role,
                email,
                firstName,
                lastName,
            }
        }
    }catch(exception){
        if (axios.isAxiosError(exception)) {
            const message = exception.response?.data
            return {
                error: message,
            };
        }else{
            console.error(exception)
        }
    }
}

export async function getRegisterRequests(pageNumber?: number , limit?: number){
    try{
        const params: any = {};
        
        if (pageNumber !== undefined) {
            params.pageNumber = pageNumber;
        }
        if (limit !== undefined) {
            params.limit = limit;
        }

        const response = await axiosInstanceWithAccessToken.get("api/admin/get-register-requests",{
            params: params,
        })

        const {totalPages, currentPage, totalItems, registerRequests, prevPage, nextPage} =  response.data
        return {
            totalPages,
            totalItems,
            currentPage,
            nextPage,
            prevPage,
            registerRequests
        }


    }catch(exception){
        if(exception instanceof SessionExpired){
            // redirect("/")
            return {error: "Session Expired"}
        }
        if(axios.isAxiosError(exception)){
            return {
                error: "An Error Occured"

            }
        }
    }
}

export async function getListUsers(pageNumber?: number, limit?: number){
    try{
        const params: any = {};
        
        if (pageNumber !== undefined) {
            params.pageNumber = pageNumber;
        }
        if (limit !== undefined) {
            params.limit = limit;
        }
        const response = await axiosInstanceWithAccessToken.get("/api/admin/get-list-users",{
            params: params,
        })

        const {totalPages, totalItems, currentPage, nextPage, prevPage, listUsers} = response.data

        return {totalPages, totalItems, currentPage, nextPage, prevPage, listUsers}

    }catch(exception){
        if(exception instanceof SessionExpired){
            // redirect("/")
            return {error: "Session Expired"}
        }
        if(axios.isAxiosError(exception)){
            return {
                error: "An Error Occured"

            }
        }
    }
}


export async function approveRegisterRequest(idRequest: string, isApprove:boolean){
    try{
        const response = await axiosInstanceWithAccessToken.post("/api/admin/approval-register-request",{
            requestId: idRequest,
            isApprove: isApprove
        })
        return {
            message: response.data.message
        }
    }catch(exception){
        if(axios.isAxiosError(exception)){
            return {error: exception.message}
        }else{
            return {error: "An Error Occured"}
        }
    }
}




async function getNewAccesToken(){
    // * Make a request to obtain new access token
    try{
        const cookiesStore =  cookies()
        const response = await axiosInstanceWithRefreshToken.post(`/api/auth/refresh`)       
        if(response.status === 200){
            const {access_token} = response.data
            // update new access Token
            const accessExpiryDate = new Date();
            accessExpiryDate.setMinutes(accessExpiryDate.getMinutes() + 15);
            cookiesStore.set({
                name:"access",
                value: access_token,
                httpOnly:true,
                expires:accessExpiryDate
            })
            return access_token
        }else{
            throw new SessionExpired()
        }

    }catch(exception){
        console.error(exception)
        if(exception instanceof SessionExpired){
            throw exception
        }
    }
}




export async function registerRequests(username: string, email: string, password:string){
    // * Make a register request to server
    try{
        const response = await axios.post(`${serverRuntimeConfig.API_URI}/api/auth/signup`,{
            username: username,
            email:email,
            password: password
        })

        if(response.status===201){
            return {
                message: response.data.message
            }
        }
    }catch(exception){
        if (axios.isAxiosError(exception)){
            const message = exception.response?.data.message
            return {
                error: message
            }
        }
    }
}

export async function deleteToken(){
    try{
        const cookieStore =cookies()
        cookieStore.delete("access")
        cookieStore.delete("refresh")
        cookieStore.delete("role")
    }catch(exception){
        console.error(exception)
    }
}



