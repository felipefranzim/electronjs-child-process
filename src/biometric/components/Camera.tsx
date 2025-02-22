import React, { useState } from 'react';
import useWebSocket from 'react-use-websocket';

interface CameraProps {
    cameraName: string,
    cameraDirectory: string
}

const Camera = ({ cameraName }: CameraProps) => {
    const delayMilleseconds = ms => new Promise(res => setTimeout(res, ms));

    const [webSocketUrl, setWebSocketUrl] = useState(null);
    const [cameraImage, setCameraImage] = useState(null);

    const { sendMessage, lastMessage, readyState } = useWebSocket(webSocketUrl, {
        shouldReconnect: () => true,
        retryOnError: false,
    });

    return (
        <></>
    )
}

export default Camera;