export function formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    if (bytes === 0) return '0 Byte';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const formattedValue = parseFloat((bytes / Math.pow(1024, i)).toFixed(2));

    return `${formattedValue} ${sizes[i]}`;
}

export function formatDate(isoTime: string): string{
    const dateObject = new Date(isoTime)
    return dateObject.toDateString()
}