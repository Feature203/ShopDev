import moment from "moment-timezone";

const timed = moment
    .tz(Date.now(), "Asia/Ho_Chi_Minh")
    .format("DD/MM/YYYY HH:mm:ss");

const createdDate = {
    type: String,
    default: timed,
};

const updatedDate = {
    type: String,
    default: timed,
};

export { createdDate, updatedDate };
