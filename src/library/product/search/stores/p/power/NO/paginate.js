
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NO',
    store: 'power',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#product-section',
    noResultsXPath: '//h2[@class="product-qty-header ng-star-inserted"]/span[@class="total-qty"][text()=" 0"]',
    openSearchDefinition: null,
    domain: 'power.no',
    zipcode: '',
  },
};
