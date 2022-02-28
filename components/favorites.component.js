import { Component } from '../core/component.js';
import { apiService } from '../services/api.service.js';
import { renderNote } from '../templates/note.template.js';

export class FavoritesComponent extends Component {
    constructor(id, { loader }) {
        super(id);
        this.loader = loader;
    }

    init() {
        this.$element.addEventListener('click', linkHandler.bind(this));
    }

    onShow() {
        const favorites = JSON.parse(localStorage.getItem('favorites'));
        const html = renderList(favorites);

        this.$element.insertAdjacentHTML('beforeend', html);
    }

    onHide() {
        const title = this.$element.firstElementChild;
        this.$element.innerHTML = '';
        this.$element.insertAdjacentElement('beforeend', title);
    }
}

async function linkHandler(event) {
    event.preventDefault();

    if (event.target.classList.contains('favorites__list--link')) {
        const noteId = event.target.textContent;

        event.target.innerHTML = '';

        this.loader.show();

        const note = await apiService.getNoteById(noteId);
        this.$element.insertAdjacentHTML('beforeend', renderNote(note, { withButton: false }));

        this.loader.hide();
    }
}

function renderList(list = []) {
    if (list.length) {
        return `
            <ul class="favorites__list">
            ${list
                .map(
                    (listItem) => `<li class="favorites__list--item">
                    <a href="#" class="favorites__list--link">${listItem}</a>
                </li>`
                )
                .join(' ')}
                
            </ul>
        `;
    } else {
        return `<p>Вы пока ничего не добавляли в избранное</p>`;
    }
}
