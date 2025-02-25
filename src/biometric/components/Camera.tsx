import React, { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import Fab from '@mui/material/Fab';
import CameraIcon from '@mui/icons-material/Camera';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CheckIcon from '@mui/icons-material/Check';
import { CameraRequest } from '../requests/CameraRequest';
import { CameraCommandType } from '../enums/CameraCommandType';
import { CameraResponse } from '../responses/CameraResponse';
import { CameraStatus } from '../enums/CameraStatus';
import PlayArrow from '@mui/icons-material/PlayArrow';
import { CircularProgress, styled } from '@mui/material';
import { theme } from '../../renderer/src/Themes';

interface CameraProps {
    cameraName: string,
    autoPlay: boolean,
    autoApprove: boolean,
    onErrorHandler: (errorMessage?: string) => Promise<any>,
    onImageAcquiredHandler: (imageAcquired: string | null) => Promise<any>
}

const CustomFab = styled(Fab)(() => ({
    color: theme.palette.successValid?.main,
}));

const Camera = ({ cameraName, autoPlay, autoApprove, onErrorHandler, onImageAcquiredHandler }: CameraProps) => {
    const delayMilleseconds = ms => new Promise(res => setTimeout(res, ms));

    const [webSocketUrl, setWebSocketUrl] = useState<string | null>(null);
    const [cameraImage, setCameraImage] = useState<string | null>(null);
    const [photoCaptured, setPhotoCaptured] = useState<string | null>(null);
    const [currentCameraStatus, setCurrentCameraStatus] = useState<CameraStatus>(CameraStatus.NotInitiated);
    const [isCameraInitiating, setIsCameraInitiating] = useState<boolean>(false);
    const [isTakingPicture, setIsTakingPicture] = useState<boolean>(false);

    const { sendMessage, lastMessage, readyState } = useWebSocket(webSocketUrl, {
        shouldReconnect: () => true,
        retryOnError: false,
        onOpen: () => {
            console.log('Camera server connected...');
            if (autoPlay) {
                initializeCamera();
            }
        },
        onClose: (event) => {
            var reason = '';

            if (event.code == 1001)
                reason = "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
            else if (event.code == 1002)
                reason = "An endpoint is terminating the connection due to a protocol error";
            else if (event.code == 1003)
                reason = "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
            else if (event.code == 1006)
                reason = "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
            else if (event.code == 1007)
                reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [https://www.rfc-editor.org/rfc/rfc3629] data within a text message).";
            else if (event.code == 1008)
                reason = "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
            else if (event.code == 1009)
                reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
            else if (event.code == 1010) // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
                reason = "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " + event.reason;
            else if (event.code == 1011)
                reason = "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
            else if (event.code == 1015)
                reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";

            if (reason != '')
                onErrorHandler(reason);
        }
    });

    const initializeCamera = () => {
        var request = new CameraRequest(CameraCommandType.InitializeCamera, "Webcam");

        if (webSocketUrl == null) {
            setWebSocketUrl(`http://localhost:9697/${cameraName}`);
        } else {
            sendMessage(JSON.stringify(request));
            setIsCameraInitiating(true);
            console.log('Iniciando a câmera...');
        }
    }

    const startLivestream = () => {
        var request = new CameraRequest(CameraCommandType.StartLiveStream, "Webcam");
        sendMessage(JSON.stringify(request));
        setPhotoCaptured(null);
    }

    const shoot = () => {
        var request = new CameraRequest(CameraCommandType.Shoot, "Webcam", 300, 480, 640);
        sendMessage(JSON.stringify(request));
        setIsTakingPicture(true);
    }

    const stop = () => {
        var request = new CameraRequest(CameraCommandType.StopLiveStream, "Webcam", 300, 480, 640);
        sendMessage(JSON.stringify(request));
    }

    useEffect(() => {
        if (autoPlay) {
            setWebSocketUrl(`http://localhost:9697/${cameraName}`);
        }
    }, [autoPlay])

    useEffect(() => {
        if (lastMessage?.data) {
            var result = CameraResponse.fromObject(JSON.parse(lastMessage.data));

            if (result.Status == CameraStatus.CameraInitialized) {
                startLivestream();
                setCurrentCameraStatus(CameraStatus.CameraInitialized);
            }
            else if (result.Status == CameraStatus.OnLivestream) {
                setCameraImage(result.Image);
                setCurrentCameraStatus(CameraStatus.OnLivestream);
            }
            else if (result.Status == CameraStatus.PhotoCaptured) {
                setCameraImage(result.Image);
                setPhotoCaptured(result.Image);
                setCurrentCameraStatus(CameraStatus.PhotoCaptured);
                setIsTakingPicture(false);

                if (autoApprove)
                    onImageAcquiredHandler(result.Image);
            }
            else if (result.Status == CameraStatus.Stopped) {
                console.log('Camera parada')
                setCurrentCameraStatus(CameraStatus.Stopped);
            }
            else if (result.Status == CameraStatus.Disposed) {
                console.log('Dispose da camera realizado')
                setCurrentCameraStatus(CameraStatus.Disposed);
            }
            else if (result.Status == CameraStatus.Error) {
                console.log(result.ErrorMessage);
                console.log(result.ErrorStackTrace);
                setCurrentCameraStatus(CameraStatus.Error);

                if (isTakingPicture)
                    setIsTakingPicture(false);

                onErrorHandler(result.ErrorMessage);
            }

            if (isCameraInitiating)
                setIsCameraInitiating(false);
        }
    }, [lastMessage])

    return (
        <>
            <div style={{ width: '100%', height: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
                {
                    isCameraInitiating || isTakingPicture ? (
                        <div style={{ width: '500px', height: 'auto', minHeight: '270px', background: '#eee', color: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '8px' }}>
                            <CircularProgress />
                            {isCameraInitiating && <p>Iniciando a câmera, aguarde...</p>}
                            {isTakingPicture && <p>Capturando imagem, aguarde...</p>}
                        </div>
                    ) : <img src={cameraImage ? `data:image/jpeg;base64,${cameraImage}` : ''} style={{ width: '500px', height: 'auto', minHeight: '270px', background: '#eee', borderRadius: '8px' }} />
                }

                <div style={{ display: 'inline-flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                    {/* Botões secundários */}

                    {
                        currentCameraStatus == CameraStatus.OnLivestream && (
                            <Fab onClick={stop} size='small' color='secondary' style={{ justifySelf: 'center' }} disabled={isCameraInitiating || isTakingPicture}>
                                <PauseIcon />
                            </Fab>
                        )
                    }
                    {
                        photoCaptured && (
                            <Fab onClick={initializeCamera} size='small' color='secondary' style={{ justifySelf: 'center' }} disabled={isCameraInitiating || isTakingPicture}>
                                <PlayArrow />
                            </Fab>
                        )
                    }

                    {/* Botões principais */}
                    {
                        ((currentCameraStatus == CameraStatus.NotInitiated ||
                            currentCameraStatus == CameraStatus.Stopped ||
                            (currentCameraStatus == CameraStatus.Disposed && photoCaptured == null))) && (
                            <Fab onClick={initializeCamera} color='primary' style={{ justifySelf: 'center', marginLeft: '20px', 'marginRight': '20px' }} disabled={isCameraInitiating || isTakingPicture}>
                                <PlayArrow />
                            </Fab>
                        )
                    }
                    {
                        currentCameraStatus == CameraStatus.OnLivestream && (
                            <Fab onClick={shoot} color='primary' style={{ justifySelf: 'center', marginLeft: '20px', 'marginRight': '20px' }} disabled={isCameraInitiating || isTakingPicture}>
                                <CameraIcon />
                            </Fab>
                        )
                    }
                    {
                        photoCaptured && (
                            <CustomFab onClick={() => onImageAcquiredHandler(cameraImage)}  style={{ justifySelf: 'center', marginLeft: '20px', 'marginRight': '20px' }} disabled={isCameraInitiating || isTakingPicture}>
                                <CheckIcon />
                            </CustomFab>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Camera;