import {create} from "zustand";
import { Subject } from "rxjs";


interface ICamera {
    camera: ICameraInfo
    sdp?: RTCSessionDescription
}

interface WebSocketStore {
    ws?: WebSocket,
    wsUri: string,
    uuid: string,
    userName: string,
    isRegister: boolean,
    role: string,
    subject: Subject<WSEvent>,
    isConnected: boolean,
    reconnectAttempts: number,
    maxReconnectAttempts: number,
    reconnectInterval: number,
    cameraQueue: ICameraInfo[],
    pingInterval: NodeJS.Timeout|undefined,
    connect: (url:string, uuid: string,userName: string, role: string)=> void,
    send: (message: any)=> void,
    register:()=> void,
    disconnect:()=> void,
    reconnect: () => void,

}

export interface WSEvent{
    event:string,
    data:any
}

export const useWebSocketStore = create<WebSocketStore>(
    (set, get) => ({
        ws: undefined,
        wsUri: "",
        uuid:"",
        isConnected: false,
        subject: new Subject<WSEvent>(),
        userName: "",
        role: "",
        isRegister:false,
        reconnectAttempts: 0,
        maxReconnectAttempts: 5,
        reconnectInterval: 2000,
        pingInterval: undefined,
        cameraQueue:[],
        connect:  (url:string, uuid: string, userName: string, role: string) => {
            document.cookie = "Authorization= "
            const websocket = new WebSocket(url,
                ["Authorization", "your_token_here"]
            );
            websocket.addEventListener("open",()=>{
                set(
                    {
                        ws: websocket,
                        isConnected:true, 
                        uuid:uuid, 
                        userName:userName, 
                        role: role, 
                        wsUri: url,
                        pingInterval: setInterval(()=>{
                            websocket.send(
                                JSON.stringify({
                                    event:"ping"
                                })
                            )
                        },10000)
                    })
                
            })

            websocket.addEventListener("close",()=>{
                set({isConnected:false})
                const {reconnectAttempts, maxReconnectAttempts, wsUri, uuid, userName, role} = get()
                if( wsUri!== "" &&  uuid!== "" && userName!== "" && role!== "" ) {
                    if(reconnectAttempts< maxReconnectAttempts){
                        set((state)=>({reconnectAttempts: state.reconnectAttempts+1}))
                        get().reconnect()
                        get().register()
                    }
                }
            })

            // todo need to impl

            //* Event handler
            websocket.addEventListener("message", (event: MessageEvent) => {
                const message:WSEvent= JSON.parse(event.data)
                switch(message.event){
                    case "camera-connect":
                        const camInfo: ICameraInfo={
                            uuid: message.data.uuid as string,
                            name: message.data.name as string,
                            location: message.data.location as string
                        }
                        
                        // const newCam: ICamera={
                        //     camera: camInfo,
                        // } 
                        console.log(camInfo)
                        set((state)=>{ 
                            return {cameraQueue: [...state.cameraQueue, camInfo]}})
                        break
                    case "camera-disconnect":
                        set((state)=>({...state, cameraQueue: state.cameraQueue.filter((item)=>item.uuid !== message.data.uuid)}))
                        break    

                    case "response-list-cameras":
                            if (Array.isArray(message.data)) {
                                const listCamera: Array<ICameraInfo> = message.data;
                                // console.log(typeof listCamera)
                                // const  newCamQueueState: ICamera[]= []
                                
                                // listCamera.forEach((camera) => {
                                //     const newCam: ICamera ={ camera: camera, sdp: undefined }
                                //     newCamQueueState.push(newCam);
                                // });
                                
                                set((state)=>({...state, cameraQueue: listCamera}))
                                // ... rest of your code using listCamera
                            }
                            break

                    case "pong":
                        // a keep-alive 
                        break
                    // case "answer-sd":
                    //     const  answerSd:RTCSessionDescription = new RTCSessionDescription(
                    //         {
                    //             type: message.data.type, 
                    //             sdp: message.data.sdp,
                    //         }
                    //     )
                    //     set((state) => ({
                    //         ...state,
                    //         cameraQueue: state.cameraQueue.map((camera) =>
                    //             camera.camera.uuid === message.data.from ? { camera: camera.camera, sdp: answerSd  } : camera
                    //         ),
                    //     }))
                    
                    default:
                        console.log(message)
                        set((state)=>{
                            state.subject.next(message)
                            return state
                        })
                }
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
        disconnect:()=>{
            set((prevState)=>{
                prevState.ws!.close()
                return {...prevState, ws: undefined }
            })
        },
        reconnect: ()=>{
            
            const { connect, reconnectInterval, wsUri, uuid, userName, role} = get()
            setTimeout(()=>{
                connect(wsUri, uuid, userName, role)
            }, reconnectInterval)
        },
        register:()=>{
            const {isConnected , send, uuid, role, userName} = get()
            if(isConnected){
                send({
                    event:"user-connect",
                    data:{
                        uuid: uuid,
                        username: userName,
                        role: role
                    }
                })
                set({isRegister:true})
            }
        }

    })
);


