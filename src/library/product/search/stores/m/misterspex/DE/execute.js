
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'misterspex',
    domain: 'misterspex.de',
    url: 'https://www.misterspex.de/INTERSHOP/web/WFS/MisterSpex-MisterSpexDE-Site/de_DE/-/EUR/ViewParametricSearch-Browse?SearchTerm={searchTerms}',
    loadedSelector: '.spex-productList__products, div.grid',
    noResultsXPath: '//div[contains(@data-qa,"no_results_search")] | //div[@class="spex-productImageWithTitle"]',
    zipcode: '',
  },
};
