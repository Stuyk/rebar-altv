export type Message = {
    type: 'player' | 'system' | 'alert' | 'warning' | 'info';
    author?: string;
    content: string;
    timestamp?: number;
};
