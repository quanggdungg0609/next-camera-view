import {create} from "zustand"
import {v4 as uuidv4} from "uuid"
interface AppInterface{
    uuid: string
    userName: string,
    email: string,
    role: string
    login: (userName: string, email: string, role:string)=>void,
    logout: ()=>void,
}


export const useAppStore = create<AppInterface>((set) => ({
    uuid:"",
    userName:"",
    email:"",
    role:"",
    login: (userName: string, email: string, role:string)=>{
        const newUuid = uuidv4()
        set((state)=>({uuid: newUuid, email: email, userName: userName, role: role}))
    },
    logout:()=>{
        set((state)=>({uuid:"", email:"", userName:"", role:""}))
    }
}))