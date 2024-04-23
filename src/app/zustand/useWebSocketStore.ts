import {create} from "zustand";
import { Subject } from "rxjs";

interface WebSocketStore {
    ws?: WebSocket,
    subject: Subject<WSEvent>,
    isConnected: boolean,
    connect: (url:string)=> void
    send: (message: any)=> void
}

export interface WSEvent{
    event:string,
    data:any
}

export const useWebSocketStore = create<WebSocketStore>(
    (set) => ({
        ws: undefined,
        isConnected: false,
        subject: new Subject<WSEvent>(),
        connect: (url:string) => {
            const ws = new WebSocket(url);
            
            ws.addEventListener("open",()=>{
                set({ws, isConnected:true})
            })

            ws.addEventListener("close",()=>{
                set({isConnected:false})
            })

            //* Event handler
            ws.addEventListener("message", (event: MessageEvent) => {
                set((state)=>{
                    const message:WSEvent= JSON.parse(event.data)

                    state.subject.next(message)
                    return state
                })
                
            });
            
        },
        send: (message) => {
            set((state)=> {
                if (state.ws!= null && state.isConnected){
                    state.ws.send(JSON.stringify(message))
                }
                return state
            })
        },
    })
);


