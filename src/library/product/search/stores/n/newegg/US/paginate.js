
module.exports = {
  // implements: 'product/search/paginate',
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'newegg',
    nextLinkSelector: 'div.btn-group-cell button.btn:not([disabled]) i.fas.fa-caret-right',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.items-grid-view > div > div > a img',
    noResultsXPath: '//span[@class="result-message-error"]',
    openSearchDefinition: null,
    domain: 'newegg.com',
    zipcode: "''",
  },
};
