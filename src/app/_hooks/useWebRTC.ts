import {useEffect, useState} from "react"

const iceServerConfig ={
    sdpSemantics: 'unified-plan',
    iceServers: [
		{ urls: 'stun:stun.services.mozilla.com' },
		{ urls: 'stun:stun.l.google.com:19302' }
	]
}




export function useWebRTC(){
	const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>()
	const [remoteSD,setRemoteSD] = useState<RTCSessionDescription>()
	const [error, setError] = useState<unknown>()
	
	const [signalingState, setSignalingState] = useState<string|null>()
	const [connectionState, setConnectionState] = useState<string|null>()
	const [iceConnectionState, setIceConnectionState] = useState<string|null>()
	
	const [localSD, setLocalSD] = useState<RTCSessionDescription|null>()
	const [remoteStream, setRemoteStream] = useState<MediaStream>()

	useEffect(()=>{
		return ()=>{
			if(peerConnection){
				closeConnection()
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])

	useEffect(()=>{
		async function setSDP(){
            if (peerConnection && remoteSD){
                try{
                    await peerConnection.setRemoteDescription(remoteSD)
                }catch(err){
                    setError(err)
                }
            }
        }
		setSDP()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[remoteSD])

	useEffect(()=>{
		if(peerConnection ){
			if(iceConnectionState === "disconnected" || iceConnectionState ==="failed"){
				reset()
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[iceConnectionState])

	useEffect(()=>{
		if(peerConnection && connectionState ==="failed"){
			reset()
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[connectionState])

	useEffect(()=>{
		if(peerConnection && signalingState ==="closed"){
			reset()
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[signalingState])

	async function createPeerConnection(){
		if(!peerConnection){
			const peer = new RTCPeerConnection(iceServerConfig)

			// observer state handlers
			peer.onsignalingstatechange= ():void=>{
				setSignalingState(peer.signalingState)
			}

			peer.onconnectionstatechange = ():void =>{
				setConnectionState(peer.connectionState)
			}

			peer.oniceconnectionstatechange = (): void =>{
				setIceConnectionState(peer.iceConnectionState)
			}

			peer.ontrack= (e:RTCTrackEvent): void =>{
				setRemoteStream(e.streams[0])
			}
			try{
				peer.addTransceiver("video", {
					direction: "recvonly"
				})
				let offer = await peer.createOffer()
				await peer.setLocalDescription(offer)
				await new Promise<void>( resolve => {
					if( peer.iceGatheringState === "complete"){
						resolve()
					}else{
						const checkState = () =>{
							if (peer.iceGatheringState === "complete"){
								peer.removeEventListener("icegatheringstatechange", checkState)
								resolve()
							}
						}

						peer.addEventListener("icegatheringstatechange", checkState)
					}
				})
			}catch(error){
				setError(error)
			}
			setPeerConnection(peer)
			setLocalSD(peer.localDescription)
		}
	}

	function addRemoteSD(sd: RTCSessionDescription){
		setRemoteSD(sd)
	}

	function closeConnection(){
			reset()
	}
	
	function reset(){
		if(peerConnection){
			peerConnection.onsignalingstatechange = null
			peerConnection.oniceconnectionstatechange = null
			peerConnection.onconnectionstatechange= null
			peerConnection.ontrack = null
			peerConnection.close()
			setPeerConnection(undefined)
			setError(undefined)
			setRemoteStream(undefined)
		}
	}

	return{
		peer: peerConnection,
		stream: remoteStream,
		localSD:localSD,
		error: error,
		createPeerConnection: createPeerConnection,
		addRemoteSD: addRemoteSD,
		closeConnection: closeConnection
	}
}
