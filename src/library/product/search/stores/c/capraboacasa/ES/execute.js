
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'capraboacasa',
    domain: 'capraboacasa.com',
    url: 'https://capraboacasa.com/portal/es/super/buscar/{searchTerms}',
    loadedSelector: 'div[class="product col s6 m3 l3 small-product "]',
    noResultsXPath: '//span[@cantidad="0"]',
    zipcode: "''",
  },
};
