import { CameraStatus } from '../enums/CameraStatus';
import { ResponseBase } from './ResponseBase'

class CameraResponse extends ResponseBase {
    Status: CameraStatus;
    Image: string;
    ImageWidth: number;
    ImageHeight: number;
    ImageDPI: number;

    constructor(
        status: CameraStatus,
        image: string,
        imageWidth: number,
        imageHeight: number,
        imageDPI: number,
        errorMessage?: string,
        errorStackTrace?: string
    ) {
        super();
        this.Status = status;
        this.Image = image;
        this.ImageWidth = imageWidth;
        this.ImageHeight = imageHeight;
        this.ImageDPI = imageDPI;
        this.ErrorMessage = errorMessage;
        this.ErrorStackTrace = errorStackTrace;
    }

    static fromObject(obj: any): CameraResponse {
        return new CameraResponse(
            obj.Status,
            obj.Image,
            obj.ImageWidth,
            obj.ImageHeight,
            obj.ImageDPI,
            obj.ErrorMessage,
            obj.ErrorStackTrace
        );
    }
}

export { CameraResponse }