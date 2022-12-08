const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './reference';

const KEY = '31788075-b7615e81e6dda1dedffa3dd10';

export default class PixabayApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchPictures() {
    try {
      const { data } = await axios.get(
        `https://pixabay.com/api/?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
      );

      if (data.totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else if (Math.ceil(data.totalHits / 40) < this.page) {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        refs.loadMoreBtn.classList.add('visually-hidden');
      }

      this.page += 1;

      return data;
    } catch (error) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtn.classList.add('visually-hidden');
    }
  }

  restPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get amountOfPage() {
    return this.page;
  }
}
