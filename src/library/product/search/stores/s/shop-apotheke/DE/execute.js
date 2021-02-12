module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'shop-apotheke',
    domain: 'shop-apotheke.com',
    url: 'https://www.shop-apotheke.com/search.htm?&query={searchTerms}',
    loadedSelector: 'ul li[data-qa-id="result-list-entry"]',
    noResultsXPath: `//div[@id="algolia-instant-search"][contains(.,'Kein Suchergebnis gefunden')]`,
  },
};
