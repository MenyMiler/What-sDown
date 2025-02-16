export interface NetworkConnection {
    networkId: String;
    courseId: String;
}

export interface NetworkConnectionDocument extends NetworkConnection {
    _id: string;
}
