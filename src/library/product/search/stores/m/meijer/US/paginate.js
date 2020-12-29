
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'meijer',
    nextLinkSelector: null,//'div.product-grid.js-product-grid > div.page_count_pagination > div > div > a.arrows.js-right-last-arrow',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,//'body',
    noResultsXPath: null,
    openSearchDefinition: {
      pageStartNb: 0,
      template: 'https://www.meijer.com/shop/en/search/?q={searchTerms}&page={page}',
    },
    domain: 'meijer.com',
    zipcode: '',
  },
};
