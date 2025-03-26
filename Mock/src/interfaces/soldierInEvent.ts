export interface SoldierInEvent {
    eventId: String;
    soldierId: String;
}

export interface SoldierInEventDocument extends SoldierInEvent {
    _id: string;
}
