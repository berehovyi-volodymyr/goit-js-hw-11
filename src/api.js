const axios = require('axios').default;
const KEY = '31788075-b7615e81e6dda1dedffa3dd10';
export default class PixabayApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchPictures() {
    // try {
    //   const { data } = await axios.get(
    //     `https://pixabay.com/api/?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
    //   );
    // } catch (error) {
    //   console.error(error);
    // }

    return fetch(
      `https://pixabay.com/api/?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
    )
      .then(resp => resp.json())
      .then(data => {
        this.page += 1;

        return data;
      });
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
}
