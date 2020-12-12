
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    domain: 'dm.de',
    loadedSelector: 'div[data-dmid="detail-image-slider-container"]',
    noResultsXPath: '//h1[contains(text(),"ergab leider keine Treffer")]',
    zipcode: '',
  },
};
