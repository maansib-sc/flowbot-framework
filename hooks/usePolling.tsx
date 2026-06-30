import { useCallback, useEffect, useRef, useState } from 'react';
import { UsePollingOptions } from '@/types/polling';

export function usePolling<T>({ fn, interval = 400, shouldStop, onComplete, enabled = false }: UsePollingOptions<T>) {
    const [data, setData] = useState<T | null>(null);
    const [isPolling, setIsPolling] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const fnRef = useRef(fn);
    const shouldStopRef = useRef(shouldStop);
    const onCompleteRef = useRef(onComplete);

    fnRef.current = fn;
    shouldStopRef.current = shouldStop;
    onCompleteRef.current = onComplete;

    const stop = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setIsPolling(false);
    }, []);

    const start = useCallback(() => {
        if (timerRef.current) return;
        setIsPolling(true);

        // self-scheduling: wait for each poll to finish before queuing the next,
        const tick = async () => {
            const result = await fnRef.current();
            setData(result);

            if (shouldStopRef.current?.(result)) {
                stop();
                onCompleteRef.current?.(result);
                return;
            }
            timerRef.current = setTimeout(tick, interval);
        };
        timerRef.current = setTimeout(tick, interval);
    }, [interval, stop]);

    useEffect(() => {
        if (enabled) start();
        else stop();
    }, [enabled, start, stop]);

    useEffect(() => {
        return () => stop();
    }, [stop]);

    return { data, isPolling, start, stop };
}
