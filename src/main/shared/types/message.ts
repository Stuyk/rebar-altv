export type Message = {
    type: 'player' | 'system' | 'alert' | 'warning' | 'info' | 'custom';
    author?: string;
    content: string;
    timestamp?: number;
};
