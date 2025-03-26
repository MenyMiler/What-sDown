export interface Feature {
    name: string;
    status: boolean;
}

export interface FeatureDocument extends Feature {
    _id: string;
}
