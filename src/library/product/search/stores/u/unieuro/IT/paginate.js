
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'unieuro',
    loadedSelector: '[class="item-container"] img.product-img',
    noResultsXPath: '/html[not(//section[@class="hits"]/section)]',
    openSearchDefinition: {
      template: 'https://www.unieuro.it/online/?q={searchTerms}&p={page}',
    },
    domain: 'unieuro.it',
    zipcode: '',
  },
};
