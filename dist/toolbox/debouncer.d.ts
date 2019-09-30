export interface Debouncer {
    queue(): void;
    setAction(action: () => void): void;
}
export declare function makeDebouncer({ delay, action }: {
    delay: number;
    action: () => void;
}): Debouncer;
