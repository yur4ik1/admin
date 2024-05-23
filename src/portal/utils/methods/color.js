export const getColor = (level) => {
    let color;
    switch (level?.id) {
        case 1:
            color = "#ececec";
            break;
        case 2:
            color = "#eac185";
            break;
        case 3:
            color = "#5a938a";
            break;
        case 4:
            color = "#be7570";
            break;
        case 5:
            color = "#8183b8";
            break;
        case 6:
            color = "#242c3e";
            break;
        default:
            color = "#ececec";
    }
    return color;
}