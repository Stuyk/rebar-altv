export function formatTimestamp(time: number) {
    const date = new Date(time);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return {
        hour: hour <= 9 ? `0${hour}` : `${hour}`,
        minute: minutes <= 9 ? `0${minutes}` : `${minutes}`,
        second: seconds <= 9 ? `0${seconds}` : `${seconds}`,
    };
}
