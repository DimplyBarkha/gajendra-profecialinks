
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'breuninger',
    nextLinkSelector: 'div[class*="footer"] div[class="shop-pager"]>a[title="weiter"]>svg',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '*[data-order]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'breuninger.de',
    zipcode: '',
  },
};
