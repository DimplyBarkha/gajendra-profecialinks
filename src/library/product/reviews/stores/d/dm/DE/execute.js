
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    domain: 'dm.de',
    loadedSelector: 'div[data-dmid="detail-image-slider-container"]',
    noResultsXPath: '//h1[contains(text(),"ergab leider keine Treffer")]',
    reviewUrl: 'https://www.dm.de/p{id}.html#review_root',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
