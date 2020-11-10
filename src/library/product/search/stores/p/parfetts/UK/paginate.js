
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'parfetts',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'a[class*="image-wrapper"]>img',
    noResultsXPath: '//div[contains(@class,"product-container")]//div/h2',
    openSearchDefinition: null,
    domain: 'parfetts.co.uk',
    zipcode: '',
  },
};
