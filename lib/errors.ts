const ERROR_MESSAGES: Record<string, string> = {
    UNAUTHORIZED: 'Your session has expired. Please sign in again.',
    VALIDATION_ERROR: 'Some of the entered data is invalid. Please check the fields and try again.',
    CARD_NOT_FOUND: 'This card no longer exists. It may have been deleted by someone else.',
    INVALID_TRANSITION:
        "That move isn't allowed: columns can't be skipped and cards can't leave Done.",
    INTERNAL_SERVER_ERROR: 'Something went wrong on the server. Please try again later.',
    NETWORK_ERROR: "Can't reach the server. Check your connection and try again.",
    GITHUB_AUTH_FAILED: 'Signing in with GitHub failed. Please try again.',
};

export function getErrorMessage(code: string): string {
    return ERROR_MESSAGES[code] ?? 'Something went wrong. Please try again.';
}
