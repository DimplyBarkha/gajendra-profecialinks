
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'auchan',
    domain: 'auchan.fr',
    url: 'https://www.auchan.fr/recherche?text={searchTerms}',
    loadedSelector: 'div.list__container,div.product-list--container',
    noResultsXPath: "//section[@class='no-result']",
    zipcode: '',
  },
};
