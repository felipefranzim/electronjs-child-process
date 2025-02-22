import Versions from './components/Versions'
import { useEffect, useState } from 'react';
import electronLogo from './assets/electron.svg'
import useWebSocket from 'react-use-websocket';
import { CameraRequest } from '../../biometric/requests/CameraRequest';
import { CameraCommandType } from '../../biometric/enums/CameraCommandType';
import { CameraResponse } from '../../biometric/responses/CameraResponse';
import { CameraStatus } from '../../biometric/enums/CameraStatus';

function App() {
  const [webSocketUrl, setWebSocketUrl] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);

  const delayMilleseconds = ms => new Promise(res => setTimeout(res, ms));


  const ipcHandle = () => window.electronProcess.executarExe('C:\\Users\\operador\\Documents\\Bitbucket\\Cameras\\valid-cameras-webcam\\src\\Valid.Cameras.Webcam.Server\\bin\\Debug\\net9.0\\Valid.Cameras.Webcam.Server.exe')
  const fechar = () => {
    window.electronProcess.fecharExe();
    setWebSocketUrl(null);
  }

  window.electronProcess?.websocketOpen((event, isOpen) => {
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
    retryOnError: true,
  });


  // Utilizando a versao antiga do biometric
  // useEffect(() => {
  //   if (lastMessage?.data) {
  //     const result = JSON.parse(lastMessage.data);

  //     if (result?.Photo?.JpgImage) {
  //       setCameraImage(result?.Photo?.JpgImage);
  //     }
  //   }
  // }, [lastMessage])

  // Utilizando a versão nova Valid Bio Integrator
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
        fechar();
      }
      else if (result.Status == CameraStatus.Stopped) {
        console.log('Camera parada')
      }
      else if (result.Status == CameraStatus.Error) {
        console.log(result.ErrorMessage);
        console.log(result.ErrorStackTrace);
        fechar();
      }
      else if (result.Status == CameraStatus.Disposed) {
        console.log('Dispose da camera realizado')
        fechar();
      }
    }
  }, [lastMessage])



  return (
    <>
      {
        cameraImage && <img alt="logo" width={500} src={`data:image/jpeg;base64,${cameraImage}`} />
      }
      <div className="text">
        Teste do Biometrics com <span className="react">Electron JS</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Iniciar câmera
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={stop}>
            Parar
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={shoot}>
            Capturar
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App

