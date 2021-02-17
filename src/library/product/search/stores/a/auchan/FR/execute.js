
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'auchan',
    domain: 'auchan.fr',
    url: 'https://www.auchan.fr/recherche?text={searchTerms}',
    loadedSelector: 'div[class="product-list--container grid"],div[class="list__container"]',
    noResultsXPath: "//section[@class='no-result']",
    zipcode: '',
  },
};
