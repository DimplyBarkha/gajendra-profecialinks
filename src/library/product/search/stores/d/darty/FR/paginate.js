
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'darty',
    nextLinkSelector: 'div#main_pagination_bottom > div > a:last-child',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product_detail',
    noResultsXPath: '//h2[@class="title_bloc"]',
    openSearchDefinition: null,
    domain: 'darty.com',
    zipcode: '',
  },
};
