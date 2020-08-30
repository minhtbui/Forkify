import { DOM } from './base';

export const clearItems = () => {
   DOM.shoppingList.innerHTML = '';
};

export const renderClearItemsBtn = (items) => {
   DOM.delAllBtn.style.visibility = items.length > 0 ? 'visible' : 'hidden';
};

export const renderItem = (item) => {
   const markup = `
            <li class="shopping__item" data-id=${item.id}> 
                <div class="shopping__count">
                    <input type="number" value="${item.number}" step="${item.number}" class="shopping__number-value">
                    <p>${item.unit}</p>
                </div>
                <p class="shopping__description">${item.ingredient}</p>
                <button class="shopping__delete btn-tiny">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-cross"></use>
                    </svg>
                </button>
            </li>
    `;
   DOM.shoppingList.insertAdjacentHTML('beforeend', markup);
};

export const deleteItem = (id) => {
   const item = document.querySelector(`[data-id='${id}']`);
   if (item) item.parentElement.removeChild(item);
};
