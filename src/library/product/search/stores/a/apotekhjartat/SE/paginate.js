
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'apotekhjartat',
    nextLinkSelector: 'div[class="row showMore text-center"]>a',
    mutationSelector: null,
    spinnerSelector: 'div[class="row showMore text-center"]>a',
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'apotekhjartat.se',
    zipcode: '',
  },
};
