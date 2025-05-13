export interface Notification {
    id: string
    type: 'info' | 'warning' | 'error' | 'success'
    message: string
    timestamp: number
}

export type notifications = Notification[]