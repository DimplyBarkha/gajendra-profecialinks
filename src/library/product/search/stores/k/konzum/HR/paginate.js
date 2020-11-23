
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'HR',
    store: 'konzum',
    nextLinkSelector: '#content-start > section > div > div > div.col-12.col-md-12.col-lg-10 > div.product-pagination > div > div:nth-child(2) > ul > li:nth-child(7) > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'konzum.hr',
    zipcode: '',
  },
};
