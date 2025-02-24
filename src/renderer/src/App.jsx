import Versions from './components/Versions'
import { useEffect, useRef, useState } from 'react';
import electronLogo from './assets/electron.svg'
import useWebSocket from 'react-use-websocket';
import { CameraRequest } from '../../biometric/requests/CameraRequest';
import { CameraCommandType } from '../../biometric/enums/CameraCommandType';
import { CameraResponse } from '../../biometric/responses/CameraResponse';
import { CameraStatus } from '../../biometric/enums/CameraStatus';
import Camera from '../../biometric/components/Camera';

function App() {
  const ref = useRef();
  const [isServerUp, setIsServerUp] = useState(false);

  const startCameraServer = () => {
    window.electronProcess.executarExe(`C:\\Users\\operador\\Documents\\Bitbucket\\Cameras\\valid-cameras-webcam\\src\\Valid.Cameras.Webcam.Server\\bin\\Debug\\net9.0\\Valid.Cameras.${'webcam'}.Server.exe`)
    setIsServerUp(true);
  }

  const closeCamera = () => {
    window.electronProcess.fecharExe();
    setWebSocketUrl(null);
  }

  const onImageAcquired = (image) => {
    console.log('Imagem capturada:')
    console.log(image);
  }

  useEffect(() => {
    if (!ref.current) {
      startCameraServer();
      ref.current = true;
    }
  }, [ref.current]);

  return (
    <>
      {
        isServerUp && (
          <Camera cameraName='webcam' autoPlay={true} onImageAcquiredHandler={onImageAcquired} onErrorHandler={closeCamera} />
        )
      }

      <div className="text">
        Teste do Biometrics com <span className="react">Electron JS</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <Versions></Versions>
    </>
  )
}

export default App

