export function useBuffer() {
    function toBuffer(data: string, size: number = 512) {
        const stringMatch = new RegExp(`.{1,${size}}`, 'g');
        return data.match(stringMatch);
    }

    function fromBuffer(data: Array<string>): string {
        return data.join('');
    }

    return {
        toBuffer,
        fromBuffer,
    };
}
