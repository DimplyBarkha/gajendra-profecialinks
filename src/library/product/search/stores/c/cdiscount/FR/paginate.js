
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'cdiscount',
    nextLinkSelector: 'a[class*=NxtPage]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[id="lpBloc"]',
    noResultsXPath: '//*[@class="lrTryAgain"]',
    openSearchDefinition: null,
    domain: 'cdiscount.fr',
    zipcode: "''",
  },
};
