export interface UsePollingOptions<T> {
    fn: () => T | Promise<T>;
    interval?: number;
    shouldStop?: (data: T) => boolean;
    onComplete?: (data: T) => void;
    enabled?: boolean;
}
