
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'crateandbarrel',
    domain: 'crateandbarrel.com',
    loadedSelector: null,
    noResultsXPath: '//h1[contains(text(), "Oops")] | //ul[@class="card-deck-container"]',
    zipcode: '',
  },
};
