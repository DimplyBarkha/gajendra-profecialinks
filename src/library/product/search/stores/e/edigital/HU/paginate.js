
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'HU',
    store: 'edigital',
    nextLinkSelector: "div[id='paginator'] button[class='prefixbox-active'] + button",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'edigital.hu',
    zipcode: '',
  },
};
