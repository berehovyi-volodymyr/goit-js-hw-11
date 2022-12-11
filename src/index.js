import PixabayApiService from './api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './reference';
import { scroll } from './scroll';

refs.form.addEventListener('submit', onClick);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const pixabayApiService = new PixabayApiService();

const lightbox = new SimpleLightbox('.gallery >.photo-card a', {
  captions: true,
  captionDelay: 250,
});

async function onClick(e) {
  e.preventDefault();
  let value = e.currentTarget.elements.searchQuery.value;
  if (value.trim() !== '') {
    pixabayApiService.query = value;
  } else {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  pixabayApiService.restPage();

  const data = await pixabayApiService.fetchPictures();
  clearRender();
  render(data.hits);
  refs.loadMoreBtn.classList.remove('visually-hidden');

  if (data.totalHits > 1) {
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }

  lightbox;
  lightbox.refresh();
}

async function onLoadMore() {
  try {
    const data = await pixabayApiService.fetchPictures();
    render(data.hits);
    scroll();
  } catch (error) {
    console.log(error.message);
  }
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

function error() {
  Notify.info("We're sorry, but you've reached the end of search results.");
  refs.loadMoreBtn.classList.add('visually-hidden');
}
