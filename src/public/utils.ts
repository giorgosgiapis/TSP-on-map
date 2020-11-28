let curId: number = 0;

export function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

export function genId(): number {
  return ++curId;
}

export function resetId(): void {
  curId = 0;
}

export function createForm(id: number, label?: string) {
  return (`
    <label style='font-weight: 400;'> Set label: </label>
    <input type='text' id='rename-label' node_id='${id}' value='${!label ? '' : label}' style='margin-left: 1px;' />
    <button id='clickable-item'>Submit</button>
  `);
}