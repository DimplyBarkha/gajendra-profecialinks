
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'pulsat',
    nextLinkSelector: '.pagination li a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="item product-list-col"] article',
    noResultsXPath: '//div[@class="alert alert-info"]//text()',
    openSearchDefinition: null,
    domain: 'pulsat.fr',
    zipcode: '',
  },
};
