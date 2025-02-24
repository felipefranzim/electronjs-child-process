enum CameraStatus {
    NotInitiated = 0,
    CameraInitialized = 1,
    OnLivestream = 2,
    PhotoCaptured = 3,
    Stopped = 4,
    Disposed = 5,
    Error = 6
}

export { CameraStatus }