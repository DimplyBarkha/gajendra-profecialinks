
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'TR',
    store: 'n11',
    nextLinkSelector: 'a.next.navigation',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'a.plink>img',
    noResultsXPath: '//div[@class="notFoundContainer"]',
    openSearchDefinition: null,
    domain: 'n11.com',
    zipcode: '',
  },
};
