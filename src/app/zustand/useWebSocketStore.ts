import {create} from "zustand";



interface WebSocketStore {
    ws?: WebSocket,
    isConnected: boolean,
    cameraQueue: ICameraInfo[],
    connect: (url:string)=> void
    send: (message: any)=> void
    disconnect:()=> void
}

export interface WSEvent{
    event:string,
    data:any
}

export const useWebSocketStore = create<WebSocketStore>(
    (set) => ({
        ws: undefined,
        isConnected: false,
        cameraQueue:[],
        connect: (url:string) => {
            document.cookie = "Authorization= "
            const ws = new WebSocket(url,
                ["Authorization", "your_token_here"]
            );
            
            ws.addEventListener("open",()=>{
                set({ws, isConnected:true})
            })

            ws.addEventListener("close",()=>{
                set({isConnected:false})
            })

            //* Event handler
            ws.addEventListener("message", (event: MessageEvent) => {
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
                        set((state)=>{
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
                return {...prevState, ws: undefined, }
            })
        }
    })
);


