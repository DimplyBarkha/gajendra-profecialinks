
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    domain: 'dm.de',
    loadedSelector: 'div[data-dmid="main-container"]',
    noResultsXPath: '//div[@data-dmid="content-errormessage-container"]',
    reviewUrl: 'https://www.dm.de/p{id}.html#review_root',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
