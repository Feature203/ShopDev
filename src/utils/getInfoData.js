import _ from "lodash";

const getInfoData = (object, arrayFind) => {
    return _.pick(object, arrayFind);
};

export { getInfoData };
