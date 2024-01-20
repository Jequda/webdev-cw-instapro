import { POSTS_PAGE, USER_POSTS_PAGE } from '../routes.js';
import { renderHeaderComponent } from './header-component.js';
import { posts, goToPage, page, renderApp } from '../index.js';
import { likePost, dislikePost, loginUser } from '../api.js';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { sanitizerHtml, getUserFromLocalStorage } from '../helpers.js';

export function renderPostsPageComponent({
    appEl,
    posts,
    user,
    token,
    singleUserView,
}) {
    const locales = { ru };
    const postsHTML = posts
        .map((post, index) => {
            let likesText = '';
            if (post.likes.length > 1) {
                likesText = ` и еще ${post.likes.length - 1}`;
            }
            return `
      <li class="post">
      ${
          singleUserView
              ? ''
              : `<div class="post-header" data-user-id="${post.user.id}">
        <img src="${post.user.imageUrl}" class="post-header__user-image">
        <p class="post-header__user-name">${sanitizerHtml(post.user.name)}</p>
    </div>`
      }
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}">
      </div>
      <div class="post-likes">
        <button data-post-id="${post.id}" class="like-button" data-index="${index}">
          <img src=${post.isLiked ? './assets/images/like-active.svg' : './assets/images/like-not-active.svg'} >
        </button>
        <p class="post-likes-text">
          Нравится: <strong>${post.likes.length === 0 ? post.likes.length : sanitizerHtml(post.likes[0].name)}${likesText}</strong >
        </p >
      </div >
      <p class="post-text">
        <span class="user-name">${sanitizerHtml(post.user.name)}</span>
        ${post.description}
      </p>
      <p class="post-date">
      ${formatDistanceToNow(post.createdAt, { locale: ru })} назад
      </p>
      </li >
    `;
        })
        .join('');

    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      ${
          singleUserView && posts[0]
              ? `<div class="posts-user-header">
      <img src="${posts[0].user.imageUrl}" class="posts-user-header__user-image">
      <p class="posts-user-header__user-name">${sanitizerHtml(posts[0].user.name)}</p></div>`
              : ''
      }
      <ul class="posts">${postsHTML}
      </ul>
    </div> `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
        element: document.querySelector('.header-container'),
    });

    for (let userEl of document.querySelectorAll('.post-header')) {
        userEl.addEventListener('click', () => {
            goToPage(USER_POSTS_PAGE, {
                userId: userEl.dataset.userId,
            });
        });
    }

    const likeButtons = document.querySelectorAll('.like-button');
    for (const likeButton of likeButtons) {
        likeButton.addEventListener('click', () => {
            const index = likeButton.dataset.index;
            posts[index].isLiked = !posts[index].isLiked;

            if (!getUserFromLocalStorage()) {
                alert('Ставить лайки могут только авторизованные пользователи');
            } else {
                if (posts[index].isLiked === true) {
                    likePost({
                        token,
                        name: user.name,
                        id: posts[index].id,
                    }).then((updatedPost) => {
                        posts[index].likes = updatedPost.likes;
                        renderApp();
                    });
                } else if (posts[index].isLiked === false) {
                    dislikePost({
                        token,
                        name: user.name,
                        id: posts[index].id,
                    }).then((updatedPost) => {
                        posts[index].likes = updatedPost.likes;
                        renderApp();
                    });
                }
            }
        });
    }
}
