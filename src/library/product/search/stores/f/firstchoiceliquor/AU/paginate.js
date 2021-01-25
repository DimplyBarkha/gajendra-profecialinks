
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'firstchoiceliquor',
    nextLinkSelector: 'button.btnNext.brand-icon.brand-icon-chevron-right',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.grid-x.grid-margin-x.grid-margin-y',
    noResultsXPath: '//div[@class="notfound"]',
    openSearchDefinition: null,
    domain: 'firstchoiceliquor.com.au',
    zipcode: "''",
  },
};