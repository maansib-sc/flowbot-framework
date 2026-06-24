// Human-readable byte size, e.g. 1536 -> "1.5 KB". Returns '' for 0/undefined.
export const formatBytes = (bytes: number): string => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round((bytes / Math.pow(1024, i)) * 10) / 10} ${sizes[i]}`;
};
