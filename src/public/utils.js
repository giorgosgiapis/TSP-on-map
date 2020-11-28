var curId = 0;
export function delay(ms) {
    return new Promise(function (res) { return setTimeout(res, ms); });
}
export function genId() {
    return ++curId;
}
export function resetId() {
    curId = 0;
}
export function createForm(id, label) {
    return ("\n    <label style='font-weight: 400;'> Set label: </label>\n    <input type='text' id='rename-label' node_id='" + id + "' value='" + (!label ? '' : label) + "' style='margin-left: 1px;' />\n    <button id='clickable-item'>Submit</button>\n  ");
}
