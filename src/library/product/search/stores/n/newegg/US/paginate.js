
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'newegg',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.list-wrap',
    noResultsXPath: '//span[@class="result-message-error"]',
    openSearchDefinition: null,
    domain: 'newegg.com',
    zipcode: "''",
  },
};
