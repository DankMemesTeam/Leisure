/*eslint-disable*/

const getNumberValue = (str) => {
    return Number.parseInt(str.match(/\d+/)[0], 10);
};

const getIcon = (type) => {
    return '<i class="material-icons right">' + type + '</i>';
};
