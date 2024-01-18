import { addPost } from '../api.js';
import { renderHeaderComponent } from './header-component.js';
import { renderUploadImageComponent } from './upload-image-component.js';
import { goToPage } from '../index.js';
import { POSTS_PAGE } from '../routes.js';

export function renderAddPostPageComponent({ appEl, token }) {
    let imageUrl = '';
    const render = () => {
        // TODO: Реализовать страницу добавления поста
        const appHtml = `
    <div class="page-container">
    <div class="header-container">
<div class="page-header">
    <h1 class="logo">instapro</h1>
    <button class="header-button add-or-login-button">
    <div title="Добавить пост" class="add-post-sign"></div>
    </button>
    <button title="Ярослав Сахно" class="header-button logout-button">Выйти</button>  
</div>
</div>
    <div class="form">
      <h3 class="form-title">Добавить пост</h3>
      <div class="form-inputs">
        <div class="upload-image-container">
<div class="upload=image">
    
          <label class="file-upload-label secondary-button">
              <input type="file" class="file-upload-input" style="display:none">
              Выберите фото
          </label>
</div>
</div>
        <label>      
          <textarea class="input textarea" rows="4" id="add-description"  placeholder="Опишите фотографию:"></textarea>
          </label>
          <button class="button" id="add-button">Добавить</button>
      </div>
      <div class="form-error"></div>
    </div>
  </div>
  `;
        appEl.innerHTML = appHtml;

        const uploadImageContainer = appEl.querySelector(
            '.upload-image-container',
        );

        const setError = (message) => {
            appEl.querySelector('.form-error').textContent = message;
        };

        if (uploadImageContainer) {
            renderUploadImageComponent({
                element: appEl.querySelector('.upload-image-container'),
                onImageUrlChange(newImageUrl) {
                    imageUrl = newImageUrl;
                },
            });
        }

        document.getElementById('add-button').addEventListener('click', () => {
            setError('');

            const descriptionElement =
                document.getElementById('add-description').value;
            addPost({
                description: descriptionElement,
                imageUrl: imageUrl,
                token,
            })
                .then(() => {
                    goToPage(POSTS_PAGE);
                })
                .catch((error) => {
                    console.warn(error);
                    setError(error.message);
                });
        });
    };

    render();

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
}
