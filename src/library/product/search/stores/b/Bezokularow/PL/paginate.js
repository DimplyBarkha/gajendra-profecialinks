
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'Bezokularow',
    nextLinkSelector: '.pagination > li > .next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.thumb > img',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'bezokularow.pl',
    zipcode: '',
  },
};
