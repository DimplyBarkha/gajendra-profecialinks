
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'coursesu',
    domain: 'coursesu.com',
    url: 'https://www.coursesu.com/recherche?q={searchTerms}&lang=fr_FR',
    loadedSelector: 'div.product-image img',
    noResultsXPath: '//h2/@data-su-analytics-search-error',
    zipcode: '76120',
  },
};
