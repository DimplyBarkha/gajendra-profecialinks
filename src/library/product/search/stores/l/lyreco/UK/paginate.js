
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'lyreco',
    nextLinkSelector: 'li[class="next"]>a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'lyreco.com',
    zipcode: '',
  },
};
