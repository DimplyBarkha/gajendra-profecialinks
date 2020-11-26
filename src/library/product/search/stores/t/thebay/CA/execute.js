
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'thebay',
    domain: 'thebay.com',
    url: 'https://www.thebay.com/search?q={searchTerms}',
    loadedSelector: 'div.image-container a.thumb-link  img.tile-image',
    noResultsXPath: '//span[@class="search-keywords"]',
    zipcode: '',
  },
};
