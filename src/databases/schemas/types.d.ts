export type TImageSchema = {
    _id?: string;
    uid: string;
    file: {
        name: string;
        originalName: string;
        mimeType: string;
        size: number;
    };
    uploadDate: string;
};
