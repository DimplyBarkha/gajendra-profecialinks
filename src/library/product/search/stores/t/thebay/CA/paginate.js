
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'thebay',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.image-container a.thumb-link  img.tile-image',
    noResultsXPath: '//span[@class="search-keywords"]',
    openSearchDefinition: null,
    domain: 'thebay.com',
    zipcode: '',
  },
};
