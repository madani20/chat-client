import { notifications } from "./notification"

export interface UiState {
    loading: boolean
    errorMessage: string | null
    notifications: notifications
}