export interface System {
    name: string;
    status: boolean;
}

export interface SystemDocument extends System {
    _id: string;
}
