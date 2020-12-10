
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    nextLinkSelector: 'button.paginator-btn.paginator-btn-next',
    // nextLinkSelector: '[class="paginator-list"] > li.active+li > button',
    spinnerSelector: 'div.sar-filter-result-loading',
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    pageCheckSelector: 'button.active',
    domain: 'walmart.com',
    zipcode: '',
  },
};
