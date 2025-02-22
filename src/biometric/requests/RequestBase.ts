abstract class RequestBase {
    RequestedAt: Date;

    constructor() {
        this.RequestedAt = new Date();
    }
}

export { RequestBase }