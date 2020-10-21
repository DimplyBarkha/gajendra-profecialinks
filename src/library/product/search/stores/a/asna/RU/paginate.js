
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'asna',
    nextLinkSelector: "div[id='page'] button span",
    mutationSelector: null,
    spinnerSelector: null, //spinner exist but it have dynamic class so not possible to capture using selector
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'asna.ru',
    zipcode: '',
  },
};
