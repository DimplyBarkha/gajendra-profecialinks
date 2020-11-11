
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    domain: 'dm.de',
    loadedSelector: '[data-dmid="image-container"]',
    noResultsXPath: '//h1[contains(text(),"ergab leider keine Treffer")]',
    zipcode: '',
  },
};
