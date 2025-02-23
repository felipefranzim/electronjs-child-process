import Versions from './components/Versions'
import { useEffect, useState } from 'react';
import electronLogo from './assets/electron.svg'
import useWebSocket from 'react-use-websocket';
import { CameraRequest } from '../../biometric/requests/CameraRequest';
import { CameraCommandType } from '../../biometric/enums/CameraCommandType';
import { CameraResponse } from '../../biometric/responses/CameraResponse';
import { CameraStatus } from '../../biometric/enums/CameraStatus';
import Camera from '../../biometric/components/Camera';

function App() {


  return (
    <>
      <Camera cameraName='webcam' />

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

