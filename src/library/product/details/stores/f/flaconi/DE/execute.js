module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    domain: 'flaconi.de',
    loadedSelector: 'div.product-name',
    noResultsXPath: '//div[contains(@class, "error")]//h1[contains(text(), "Sorry!")]|//div[contains(@class, "search-noresult")]//h2[contains(text(), "Ihre Suche ergab leider keine")]',
  }
};
