import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronProcess', {
      executarExe: (caminho) => ipcRenderer.invoke('executar-exe', caminho),
      fecharExe: () => ipcRenderer.invoke('fechar-exe'),
      websocketOpen: (isOpen) => ipcRenderer.on('websocketOpen', isOpen)
    });

  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
