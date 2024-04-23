import moment from "moment";

export function customTimeFormat(createdAt?: Date) {
    if (createdAt) {
        const currentTime = moment();
        const tweetTime = moment(createdAt);

        const diff = currentTime.diff(tweetTime, "seconds");

        const duration = moment.duration(diff, "seconds");

        if (duration.years() > 0) {
            return `${duration.years()}y ago`;
        } else if (duration.months() > 0) {
            return `${duration.months()}mo ago`;
        } else if (duration.weeks() > 0) {
            return `${duration.weeks()}w ago`;
        } else if (duration.days() > 0) {
            return `${duration.days()}d ago`;
        } else if (duration.hours() > 0) {
            return `${duration.hours()}h ago`;
        } else if (duration.minutes() > 0) {
            return `${duration.minutes()}m ago`;
        } else {
            return `${duration.seconds()}s ago`;
        }
    }
}
