
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'decathlon',
    domain: 'decathlon.fr',
    loadedSelector: 'div.product-display',
    noResultsXPath: '//h1[contains(text(),"Erreur")] | //div[@id="search-result-top"]//div[@class="title"]',
    zipcode: '',
  },
};
