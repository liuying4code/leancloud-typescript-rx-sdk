export interface IAVEncoder {
    encode(dictionary: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
