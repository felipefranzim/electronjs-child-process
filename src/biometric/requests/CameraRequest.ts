import { CameraCommandType } from '../enums/CameraCommandType';
import { RequestBase } from './RequestBase'

class CameraRequest extends RequestBase {
    Command: CameraCommandType;
    CameraName: string;
    CameraInstallationDirectory?: string; // Optional property
    MaxImageWidth: number = 1000;
    ImageDPI: number;
    FinalImageWidth: number;
    FinalImageHeight: number;

    constructor(
        command: CameraCommandType,
        cameraName: string,
        imageDPI: number,
        finalImageWidth: number,
        finalImageHeight: number,
        cameraInstallationDirectory?: string
    ) {
        super();
        this.Command = command;
        this.CameraName = cameraName;
        this.ImageDPI = imageDPI;
        this.FinalImageWidth = finalImageWidth;
        this.FinalImageHeight = finalImageHeight;
        this.CameraInstallationDirectory = cameraInstallationDirectory;
    }
}

export { CameraRequest };