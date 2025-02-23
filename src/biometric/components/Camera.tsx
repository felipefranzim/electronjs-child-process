import React, { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import Fab from '@mui/material/Fab';
import CameraIcon from '@mui/icons-material/Camera';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { CameraRequest } from '../requests/CameraRequest';
import { CameraCommandType } from '../enums/CameraCommandType';
import { CameraResponse } from '../responses/CameraResponse';
import { CameraStatus } from '../enums/CameraStatus';

interface CameraProps {
    cameraName: string,
    cameraDirectory: string
}

const Camera = ({ cameraName }: CameraProps) => {
    const delayMilleseconds = ms => new Promise(res => setTimeout(res, ms));

    const [webSocketUrl, setWebSocketUrl]: any = useState(null);
    const [cameraImage, setCameraImage]: any = useState(null);

    const startCameraServer = () => {
        window.electronProcess.executarExe(`C:\\Users\\operador\\Documents\\Bitbucket\\Cameras\\valid-cameras-webcam\\src\\Valid.Cameras.Webcam.Server\\bin\\Debug\\net9.0\\Valid.Cameras.${cameraName}.Server.exe`)
    }

    const closeCamera = () => {
        window.electronProcess.fecharExe();
        setWebSocketUrl(null);
      }

    window.electronProcess?.websocketOpen((isOpen) => {
        console.log('Websocket conectado...');
        setWebSocketUrl('http://localhost:9697/webcam');

        delayMilleseconds(1000).then(() => {
            initializeCamera();
        });
    });

    const initializeCamera = () => {
        var request = new CameraRequest(CameraCommandType.InitializeCamera, "Webcam", 300, 480, 640);
        sendMessage(JSON.stringify(request));
    }

    const startLivestream = () => {
        var request = new CameraRequest(CameraCommandType.StartLiveStream, "Webcam", 300, 480, 640);
        sendMessage(JSON.stringify(request));
    }

    const shoot = () => {
        var request = new CameraRequest(CameraCommandType.Shoot, "Webcam", 300, 480, 640);
        sendMessage(JSON.stringify(request));
    }

    const stop = () => {
        var request = new CameraRequest(CameraCommandType.StopLiveStream, "Webcam", 300, 480, 640);
        sendMessage(JSON.stringify(request));
    }

    const { sendMessage, lastMessage, readyState } = useWebSocket(webSocketUrl, {
        shouldReconnect: () => true,
        retryOnError: false,
    });

    useEffect(() => {
        if (lastMessage?.data) {
          var result = CameraResponse.fromObject(JSON.parse(lastMessage.data));
    
          if(result.Status == CameraStatus.CameraInitialized){
            startLivestream();
          }
          else if (result.Status == CameraStatus.OnLivestream) {
            setCameraImage(result.Image);
          }
          else if (result.Status == CameraStatus.PhotoCaptured) {
            setCameraImage(result.Image);
            closeCamera();
          }
          else if (result.Status == CameraStatus.Stopped) {
            console.log('Camera parada')
          }
          else if (result.Status == CameraStatus.Error) {
            console.log(result.ErrorMessage);
            console.log(result.ErrorStackTrace);
            closeCamera();
          }
          else if (result.Status == CameraStatus.Disposed) {
            console.log('Dispose da camera realizado')
            closeCamera();
          }
        }
      }, [lastMessage])

    return (
        <>
            <div style={{ width: '100%', height: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
                <img src={cameraImage ? `data:image/jpeg;base64,${cameraImage}` : ''} style={{ width: '500px', height: 'auto', minHeight: '250px', background: '#eee' }} />
                <div style={{ display: 'inline-flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                    <Fab size="small" color='secondary' style={{ justifySelf: 'start' }}>
                        <PauseIcon />
                    </Fab>
                    <Fab onClick={startCameraServer} color='primary' style={{ justifySelf: 'center', marginLeft: '20px', 'marginRight': '20px' }}>
                        <CameraIcon />
                    </Fab>
                </div>
            </div>
        </>
    )
}

export default Camera;