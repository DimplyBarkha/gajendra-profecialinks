
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'chedraui',
    domain: 'chedraui.com.mx',
    url: 'https://www.chedraui.com.mx/search?text={searchTerms}',
    loadedSelector: 'div[class="product__list--wrapper"]',
    noResultsXPath: '//div[@class="not-found-text"]',
    zipcode: "''",
  },
};
