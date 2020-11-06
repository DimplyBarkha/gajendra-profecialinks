
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'windeln',
    nextLinkSelector: 'div.pager-item.pagination a:last-child',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[@class="cm-content search-no-result-box"]',
    openSearchDefinition: null,
    domain: 'windeln.de',
    zipcode: '',
  },
};
