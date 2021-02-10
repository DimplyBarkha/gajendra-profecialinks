
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'medpex',
    domain: 'medpex.de',
    url: 'https://www.medpex.de/search.do?method=similarity&q={searchTerms}',
    loadedSelector: 'div[id="product-list"] form',
  },
};
