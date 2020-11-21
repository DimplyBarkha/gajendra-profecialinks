module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'chedraui',
    domain: 'chedraui.com.mx',
    url: 'https://www.chedraui.com.mx/search?q={searchTerms}',
    // loadedSelector: 'div[class="product__list--wrapper"]',
    loadedSelector: 'ul[class="product__listing product__grid"]',
    noResultsXPath: '//div[@class="not-found-text"]',
    zipcode: "''",
  },
};
