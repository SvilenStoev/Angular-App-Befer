const div = document.createElement('div');
const list = document.createElement('ul');
list.addEventListener('click', onClick);

div.id = 'notification';
div.appendChild(list);

document.body.prepend(div);

export function notifySuccess(message: string) {
    createEl('success', message);
}

export function notifyErr(message: string) {
    createEl('error', message);
}

function createEl(msgType: string, message: string) {
    const liItem = document.createElement('li');
    liItem.classList.add('notifications');
    liItem.classList.add(msgType);
    liItem.textContent = message;

    const divEl = document.createElement('div');
    divEl.textContent = '\u2716';
    liItem.appendChild(divEl);

    list.appendChild(liItem);

    setTimeout(() => liItem.remove(), 4000);
}

function onClick(event: any) {
    if (event.target.tagName == 'LI') {
        event.target.remove();
    } else if (event.target.tagName == 'DIV') {
        event.target.parentNode.remove();
    }
}