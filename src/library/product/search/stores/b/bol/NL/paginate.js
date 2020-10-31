
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    nextLinkSelector: 'span.sb.sb-chevron-next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.loader-control__content',
    noResultsXPath: '//div[@data-test="no-result-content"]',
    openSearchDefinition: null,
    domain: 'bol.com',
    zipcode: '',
  },
};
