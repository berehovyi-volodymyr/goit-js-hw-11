import PixabayApiService from './api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  byttonSearch: document.querySelector('button'),
  form: document.querySelector('#search-form'),
  input: document.querySelector('.input'),
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
  pixabayApiService.fetchPictures().then(render);
  clearRender();
}

function onLoadMore() {
  pixabayApiService.fetchPictures().then(render);
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