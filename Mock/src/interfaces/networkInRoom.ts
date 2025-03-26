export interface NetworkInRoom {
    roomId: String;
    networkId: String;
    amount?: number;
}

export interface NetworkInRoomDocument extends NetworkInRoom {
    _id: String;
}
