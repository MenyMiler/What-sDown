export interface SoldierInRoomInEvent {
    roomOfEventId: String;
    soldierId: String;
}

export interface SoldierInRoomInEventDocument extends SoldierInRoomInEvent {
    _id: string;
}
