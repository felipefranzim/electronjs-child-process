import Versions from './components/Versions'
import { useEffect, useState } from 'react';
import electronLogo from './assets/electron.svg'
import useWebSocket from 'react-use-websocket';

function App() {
  const [webSocketUrl, setWebSocketUrl] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);

  const delayMilleseconds = ms => new Promise(res => setTimeout(res, ms));

  const livestreamPack = `{"ErrorDescription":null,"AssemblyTitle":"Valid.Biometric.Photo.WebCamPro","AssemblyName":"Valid.Biometric.Photo.WebCamPro","AssemblyVersion":null,"PackageMode":1,"CaptureType":2,"Fingerprint":null,"Photo":{"ErrorDescription":null,"StreamType":1,"JpgImage":null,"JpgFrameRounded":false,"ValidarLiveViewICAO":false,"JpgImageBlackWhite":null,"JpgImageBlackWhiteDPI":0,"ImagemICAOBlackWhite":null,"ImagemICAO":null,"ImagemICAOHeight":0,"ImagemICAOWidth":0,"ImagemICAODPI":0,"ImagemICAOSemFundo":null,"ImagemICAOSemFundoHeight":0,"ImagemICAOSemFundoWidth":0,"ImagemICAOSemFundoDPI":0,"ImagemICAOTodasCaracteristicas":null,"PhotoHeight":0,"PhotoWidth":0,"PhotoDPI":500,"PropertyId":0,"PropertyValue":0,"CommandId":0,"CommandValue":0,"isICAORequired":false,"DeviceINFO":null,"IcaoType":0,"FornecedorICAO":0,"TamanhoFoto":0,"TipoCapturaFoto":0},"Signature":null,"ABIS":null,"InfoICAO":null}`;
  const ipcHandle = () => window.electronProcess.executarExe('C:\\Users\\operador\\AppData\\Local\\Valid Capture Hub\\ValidCapture.Hub.Hardware.Integrator.exe')
  const fechar = () => {
    window.electronProcess.fecharExe();
    setWebSocketUrl(null);
  }

  window.electronProcess?.websocketOpen((event, isOpen) => {
    console.log('Websocket conectado...');
    setWebSocketUrl('http://localhost:9697/integrator86');

    delayMilleseconds(2000).then(() => {
      sendMessage(livestreamPack);
    });
  });

  const { sendMessage, lastMessage, readyState } = useWebSocket(webSocketUrl, {
    shouldReconnect: () => true,
    retryOnError: true,
  });

  useEffect(() => {
    if (lastMessage?.data) {
      const result = JSON.parse(lastMessage.data);

      if (result?.Photo?.JpgImage) {
        setCameraImage(result?.Photo?.JpgImage);
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
            Abrir camera
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={fechar}>
            Fechar
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App

