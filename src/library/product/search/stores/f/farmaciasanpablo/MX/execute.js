
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'farmaciasanpablo',
    domain: 'farmaciasanpablo.com.mx',
    url: 'https://www.farmaciasanpablo.com.mx/search/?text={searchTerms}',
    loadedSelector: 'div[id="product-facet"]',
    noResultsXPath: '//div[@class="yCmsContentSlot searchEmptyPageMiddle"]',
    zipcode: "''",
  },
};
