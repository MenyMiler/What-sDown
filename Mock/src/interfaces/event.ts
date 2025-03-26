export interface Event {
    baseId: String;
    courseId?: String;
    name: string;
    description: string;
    amount: number;
    startDate: Date;
    endDate: Date;
}

export interface EventDocument extends Event {
    _id: string;
}
