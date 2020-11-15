
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DK',
    store: 'nicehair',
    nextLinkSelector: "nav[id='pagination'] ul[class='pagination'] li[class='active'] + li a",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'nicehair.dk',
    zipcode: '',
  },
};
