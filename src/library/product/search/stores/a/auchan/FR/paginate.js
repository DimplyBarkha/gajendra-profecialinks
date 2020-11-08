
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'auchan',
    nextLinkSelector: 'span.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.list__container',
    noResultsXPath: "//section[@class='no-result']",
    openSearchDefinition: null,
    domain: 'auchan.fr',
    zipcode: '',
  },
};
