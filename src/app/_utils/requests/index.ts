"use server"
import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { cookies } from "next/headers"
import getConfig from 'next/config';
import { SessionExpired, TokenNotFound} from "../exceptions"
import { InfoResponse, ResponseError, ResponsePagination } from "@/app/_types/response.type";
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
                console.log("Get new token")
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

export async function loginRequest(account: string, password: string){
    // * Make a login request to server

    try{
        
        const res = await axios.post(`${serverRuntimeConfig.API_URI}/auth/login/`,{
            username: account,
            password: password
        })
        if(res.status === 200){
            const { refresh, access, user } = res.data
            const accessExpiryDate = new Date();
            accessExpiryDate.setMinutes(accessExpiryDate.getMinutes() + 15);

            const refreshExpiryDate = new Date();
            refreshExpiryDate.setDate(refreshExpiryDate.getDate() + 1);
            cookies().set({
                name:"access",
                value: access,
                httpOnly:true,
                expires:accessExpiryDate
            })
            cookies().set({
                name:"refresh",
                value: refresh,
                httpOnly:true,
                expires:refreshExpiryDate
            })

            cookies().set({
                name:"role",
                value: user.role,
                httpOnly: true
            })
            return {
                userName: user.username,
                email: user.email,
                role: user.role
            }
        }
    }catch(exception){
        if (axios.isAxiosError(exception)) {
            const message = exception.response?.data.detail
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
        const response = await axiosInstanceWithAccessToken.get("/auth/get-my-info/")
        if(response.status === 200){
            const {username, role, email, firstName, lastName} = response.data
            return {
                username,
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



async function getNewAccesToken(){
    // * Make a request to obtain new access token
    try{
        const cookiesStore =  cookies()
        const refreshToken = cookiesStore.get("refresh")?.value
        const response = await axios.post(`${serverRuntimeConfig.API_URI}/auth/refresh/`,{
            "refresh": refreshToken
        })       
        if(response.status === 200){
            const {access} = response.data
            // update new access Token
            const accessExpiryDate = new Date();
            accessExpiryDate.setMinutes(accessExpiryDate.getMinutes() + 15);
            cookiesStore.set({
                name:"access",
                value: access,
                httpOnly:true,
                expires:accessExpiryDate
            })
            return access
        }else{
            throw new SessionExpired()
        }

    }catch(exception){
        if (axios.isAxiosError(exception)){
            console.log(exception.code)
            console.log(exception.toJSON())
        }
        if(exception instanceof SessionExpired){
            console.log(exception.name)
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


export async function getListCameraMedia(){
    try{
        const response = await axiosInstanceWithAccessToken.get(`${serverRuntimeConfig.API_URI}/files/get-cameras/`)
        if (response.status === 200){
            return response.data
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

export async function getListImageNames(cameraUuid: string, pageNumber:number = 1, limit:number = 8 ){
    try{
        const response = await axiosInstanceWithAccessToken.get(`${serverRuntimeConfig.API_URI}/files/get-images?uuid=${cameraUuid}&page=${pageNumber}&limit=${limit}`)
        if (response.status === 200){
            const {page, nextPage, prevPage, totalPage, totalItem, files} = response.data
            const res: ResponsePagination<string> ={
                page: page,
                nextPage: nextPage,
                prevPage: prevPage,
                totalPage,
                totalItem,
                list: files,
            }
            return res
        } 
    }catch(e){
        if(axios.isAxiosError(e)){
            const message = e.response?.data.message
            const response: ResponseError={
                error:message
            }
            return response
        }
    }
}

export async function getListPreviewImages(uuid:string, imageNames: Array<string>) {
    try{
        const params = new URLSearchParams()
        params.append("uuid", uuid)
        for (const imageName of imageNames){
            params.append("image_names",imageName)
        }
        const response = await axiosInstanceWithAccessToken.get(`${serverRuntimeConfig.API_URI}/files/get-multiple-images?${params.toString()}`)
        if(response.status === 200){
            const result: Array<string> =response.data.preview_urls
            return result
        }
    }catch(exception){
        if (axios.isAxiosError(exception)){
            console.error(exception.message)
            const message = exception.response?.data.message
            const response: ResponseError={
                error:message
            }
            return response
        }
    }
}

export async function getListImageInfos(uuid:string, imageNames: Array<string>){
    try{
        const params = new URLSearchParams()
        params.append("uuid", uuid)
        for(const imageName of imageNames){
            params.append("image_names", imageName)
        }
        const response = await axiosInstanceWithAccessToken.get(`${serverRuntimeConfig.API_URI}/files/get-image-infos?${params.toString()}`)
        if(response.status === 200){
            const result: Array<InfoResponse> = response.data.image_infos
            return result
        }
    }catch(exception){
        if (axios.isAxiosError(exception)){
            console.error(exception.request.data)
            const message = exception.response?.data.message
            const response: ResponseError={
                error:message
            }
            return response
        }
    }
}

export async function getListVideoNames(uuid:string){
    try{
        const params = new URLSearchParams()
        params.append("uuid", uuid)
        const response = await axiosInstanceWithAccessToken.get(`${serverRuntimeConfig.API_URI}/files/get-videos?${params.toString()}`)
        if(response.status === 200){
            const {page, nextPage, prevPage, totalPage, totalItem, files} = response.data
            const result:ResponsePagination<string> = {
                page, nextPage, prevPage, totalPage, totalItem, list: files
            }
            return result
        }
    }catch(exception){
        if (axios.isAxiosError(exception)){
            console.error(exception.request.data)
            const message = exception.response?.data.message
            const response: ResponseError={
                error:message
            }
            return response
        }
    }
}

export async function getListThumbnails(uuid:string, videoNames:Array<string>){
    try{
        const params = new URLSearchParams()
        params.append("uuid", uuid)
        for (const videoName of videoNames){
            params.append("video_names",videoName)
        }
        const response = await axiosInstanceWithAccessToken.get(`${serverRuntimeConfig.API_URI}/files/get-list-thumbnails?${params.toString()}`)
        if(response.status === 200){
            const thumbnails: Array<string> =response.data.thumbnails
            return thumbnails
        }
    }catch(exception){
        if (axios.isAxiosError(exception)){
            console.error(exception.request.data)
            const message = exception.response?.data.message
            const response: ResponseError={
                error:message
            }
            return response
        }
    }
}

export async function getListVideoInfos(uuid:string, videoNames: Array<string>){
    try{
        const params = new URLSearchParams()
        params.append("uuid", uuid)
        for (const videoName of videoNames){
            params.append("video_names", videoName)
        }
        const response = await axiosInstanceWithAccessToken.get(`${serverRuntimeConfig.API_URI}/files/get-list-video-infos/?${params.toString()}`)
        if (response.status === 200){
            const infos: Array<InfoResponse> = response.data.video_infos
            return infos
        }

    }catch(exception){
        if (axios.isAxiosError(exception)){
            console.error(exception.request.data)
            const message = exception.response?.data.message
            const response: ResponseError={
                error:message
            }
            return response
        }
    }
}



// ! Removed soon
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



