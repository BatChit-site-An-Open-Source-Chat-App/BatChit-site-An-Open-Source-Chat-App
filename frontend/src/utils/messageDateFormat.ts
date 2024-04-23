export function messageDateFormat(newDate: Date) {
    const date = new Date(newDate)
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const hour = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const formattedMinute = minute < 10 ? '0' + minute : minute;
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${formattedHour}:${formattedMinute} ${ampm} · ${month} ${day}, ${year}`;
}
export function formatDateForInitialChatCreationAlert(inputDateString?: Date) {
    if (inputDateString) {
        const date = new Date(inputDateString);

        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();

        return `${month} ${day}, ${year}`;
    }
    return null
}
