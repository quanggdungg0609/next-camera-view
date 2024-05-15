"use server"
import axios, { AxiosRequestConfig } from "axios"
import { cookies } from "next/headers"
import getConfig from 'next/config';
import crypto from "crypto";


const { serverRuntimeConfig }= getConfig()

export async function loginAsyncServer(account: string, password: string){
    try{
        const res = await axios.post(`${serverRuntimeConfig.API_URI}/api/auth/login`,{
            username: account,
            password: password
        })
        if(res.status === 200){
            const {userName, email, role, access_token, refresh_token } = res.data
            cookies().set({
                name:"access",
                value: encryptToken(access_token),
                httpOnly:true,
            })
            cookies().set({
                name:"refresh",
                value: encryptToken(refresh_token),
                httpOnly:true,
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
        }
    }
}


export async function register(username: string, email: string, password:string){
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
            console.log(message)
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
    }catch(exception){
        console.error(exception)
    }
}

export async function obtainNewAccessToken(){
    try{
        const cookiesStore = cookies()
        const refreshTokenEncrypted = cookiesStore.get("refresh")?.value
        if(refreshTokenEncrypted){
            const refreshToken = decryptToken(refreshTokenEncrypted)
            const axiosConfig:AxiosRequestConfig = {headers:{
                    Authorization: `Bearer ${refreshToken}`
                }
            }
            const response = await axios.post(`${serverRuntimeConfig.API_URI}/api/auth/refresh`,null,axiosConfig)

            switch(response.status){
                case 200:
                    const accessToken = response.data.access_token
                    return accessToken
                case 400:
                    return { error: "Refresh Token Expired"}
                case 401:
                    return { error: "Unauthorized"}
                case 403:
                    return {error: "Refresh Token Not Found"}
                case 406:
                    return {error: "Token not acceptable"}
                case 500:
                    return {error: "Internal Server Error"}
            }
        }
    }catch(exception){
        console.error(exception)
    }
}


function encryptToken(token:string): string{
    const key = crypto.createHash('sha256').update(serverRuntimeConfig.SECRET_KEY).digest();
    const iv = crypto.randomBytes(16); // Tạo một IV ngẫu nhiên
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedToken = cipher.update(token, 'utf8', 'hex');
    encryptedToken += cipher.final('hex');
    return iv.toString('hex') + ':' + encryptedToken;
}

function decryptToken(encryptedToken:string): string{
    const key = crypto.createHash('sha256').update(serverRuntimeConfig.SECRET_KEY).digest();
    const parts = encryptedToken.split(':');
    const iv = Buffer.from(parts.shift()!, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decryptedToken = decipher.update(parts.join(':'), 'hex', 'utf8');
    decryptedToken += decipher.final('utf8');
    return decryptedToken;
}