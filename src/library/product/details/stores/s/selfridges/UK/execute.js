module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    domain: 'selfridges.com',
    loadedSelector: 'div[class*="c-listing-items__item"]',
    noResultsXPath: `//p[contains(text(), "We can't seem to find any results for")] | //body[contains(@class,"page-no-results")]`,
    zipcode: '',
  },
};
