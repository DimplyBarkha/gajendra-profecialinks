
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'firstchoiceliquor',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.grid-x.grid-margin-x.grid-margin-y',
    noResultsXPath: '//div[@class="notfound"]',
    openSearchDefinition: null,
    domain: 'firstchoiceliquor.com.au',
    zipcode: "''",
  },
};