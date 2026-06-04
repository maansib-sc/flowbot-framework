const GRAPH_KEY = 'graphId';
const JOB_KEY = 'jobId';

export const setGraphId = (graphId: string) => {
    sessionStorage.setItem(GRAPH_KEY, graphId);
};

export const getGraphId = (): string | null => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(GRAPH_KEY);
};

export const setJobId = (jobId: string) => {
    sessionStorage.setItem(JOB_KEY, jobId);
};

export const getJobId = (): string | null => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(JOB_KEY);
};
