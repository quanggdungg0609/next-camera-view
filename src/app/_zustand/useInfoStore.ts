import {create, StateCreator} from "zustand"
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware"
import {v4 as uuidv4} from "uuid"



interface InfoStoreInterface{
    uuid: string
    userName: string,
    email: string,
    role: string
    login: (userName: string, email: string, role:string)=>void,
    logout: ()=>void,
}

export const useInfoStore = create<InfoStoreInterface>(
    
    (set) => ({
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


// export const useInfoStore = create<InfoStoreInterface>(
//     (persist as unknown as (
//         config: StateCreator<InfoStoreInterface>,
//         options: PersistOptions<InfoStoreInterface>
//         ) => StateCreator<InfoStoreInterface>)(
//         (set) => ({
//             uuid: "",
//             userName: "",
//             email: "",
//             role: "",
//             login: (userName: string, email: string, role: string) => {
//             const newUuid = uuidv4();
//             set({ uuid: newUuid, email: email, userName: userName, role: role });
//             },
//             logout: () => {
//             set({ uuid: "", email: "", userName: "", role: "" });
//             }
//         }),
//         {
//             name: 'info-store', // Tên này sẽ được dùng làm key trong localStorage
//             storage: createJSONStorage(()=>localStorage) // Định rõ nơi lưu trữ, ở đây là localStorage
//         }
//     )
// );
