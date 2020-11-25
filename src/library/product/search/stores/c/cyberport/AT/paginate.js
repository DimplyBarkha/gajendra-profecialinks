
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'cyberport',
    nextLinkSelector: 'a.nextLink',
    mutationSelector: null,
    spinnerSelector: null,
    // loadedSelector: 'body',
    loadedSelector: 'div.productsList',
    noResultsXPath: '//div[contains(@class,"empty-items")]//p//span/following-sibling::text()',
    openSearchDefinition: null,
    domain: 'cyberport.at',
    zipcode: '',
  },
};
