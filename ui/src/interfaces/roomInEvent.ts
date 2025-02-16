export interface RoomInEvent {
    eventId: String;
    roomId: String;
    occupation: number;
    startDate: Date;
    endDate: Date;
}

export interface RoomInEventDocument extends RoomInEvent {
    _id: string;
}
