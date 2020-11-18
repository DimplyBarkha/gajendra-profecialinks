
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'apodiscounter',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: "//div[@id='advanced_search_no_result_wrapper']",
    openSearchDefinition: null,
    domain: 'apodiscounter.de',
    zipcode: '',
  },
};
