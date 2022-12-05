import PixabayApiService from './api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  byttonSearch: document.querySelector('button'),
  form: document.querySelector('#search-form'),
  loadMoreBtn: document.querySelector('.buttonMore'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onClick);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const pixabayApiService = new PixabayApiService();

function onClick(e) {
  e.preventDefault();
  pixabayApiService.query = e.currentTarget.elements.searchQuery.value;
  pixabayApiService.restPage();
  pixabayApiService.fetchPictures().then(data => {
    if (data.hits.length === 0) {
      refs.loadMoreBtn.setAttribute('disabled', 'disabled');
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notify.info(`Hooray! We found ${data.totalHits} images.`);
      render(data.hits);
      refs.loadMoreBtn.removeAttribute('disabled');
    }
  });
  clearRender();
}

function onLoadMore() {
  pixabayApiService.fetchPictures().then(data => render(data.hits));
}

function render(hits) {
  const markup = hits
    .map(
      hit => `<div class="photo-card">
  <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" width=320 height= 200 />
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

// const lightbox = new SimpleLightbox('.gallery a', {
//   captions: true,
//   captionDelay: 250,
// });
