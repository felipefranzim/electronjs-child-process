export interface IElectronAPI {
  executarExe: (caminho: String) => Promise<any>,
  fecharExe: () => Promise<any>,
  websocketOpen: (isOpen: any) => Promise<any>,
}

declare global {
  interface Window {
    electron: IElectronAPI,
    api: IElectronAPI,
    electronProcess: IElectronAPI
  }
}