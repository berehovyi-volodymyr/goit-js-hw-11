import PixabayApiService from './api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './reference';

refs.form.addEventListener('submit', onClick);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const pixabayApiService = new PixabayApiService();

const lightbox = new SimpleLightbox('.gallery >.photo-card a', {
  captions: true,
  captionDelay: 250,
});

function onClick(e) {
  e.preventDefault();
  pixabayApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  pixabayApiService.restPage();
  pixabayApiService
    .fetchPictures()
    .then(data => {
      clearRender();
      render(data.hits);
      refs.loadMoreBtn.classList.remove('visually-hidden');
      return data;
    })
    .then(data => {
      if (data.totalHits > 1) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    })
    .then(() => {
      lightbox;
      lightbox.refresh();
    });
}

function onLoadMore() {
  pixabayApiService.fetchPictures().then(data => render(data.hits));
}

function render(hits) {
  const markup = hits
    .map(
      hit => `<div class="photo-card"><a class="gallery__item" href="${hit.largeImageURL}">
  <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" width=320 height= 200 /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span class="qty">${hit.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
       <span class="qty">${hit.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span class="qty">${hit.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span class="qty">${hit.downloads}</span>
    </p>
  </div>
   </div>`
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearRender() {
  refs.gallery.innerHTML = '';
}
