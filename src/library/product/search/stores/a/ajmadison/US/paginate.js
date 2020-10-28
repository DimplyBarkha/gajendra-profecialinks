module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
  country: 'US',
  store: 'ajmadison',
  nextLinkSelector: 'a[class*="search-page__pagination-next"]',
  loadedSelector: '.container.container--fluid',
  domain: 'ajmadison.com',
  zipcode: '',
  },
  };