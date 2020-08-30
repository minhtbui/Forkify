import { DOM } from './base';
import { limitTitleChar } from './searchView';

export const toggleLikeBtn = (isLiked) => {
   const likedString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
   // select like button -> set attritube at href -> replace href path
   document
      .querySelector('.recipe__love use')
      .setAttribute('href', `img/icons.svg#${likedString}`);
};

export const likeField = (numLikes) => {
   DOM.likeField.style.visibility = numLikes > 0 ? 'visible' : 'hidden'; // if num of likes > 0 -> visible (true) or hidden (false)
};

export const renderLike = (item) => {
   const markup = `
            <li>
                <a class="likes__link" href="#${item.id}">
                    <figure class="likes__fig">
                        <img src="${item.img}" alt="${item.title}">
                    </figure>
                    <div class="likes__data">
                        <h4 class="likes__name">${limitTitleChar(
                           item.title,
                        )}</h4>
                        <p class="likes__author">${item.author}</p>
                    </div>
                </a>
            </li>
    `;
   DOM.likeList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = (id) => {
   const item = document.querySelector(`.likes__link[href*='${id}']`)
      .parentElement;
   if (item) item.parentElement.removeChild(item);
};
