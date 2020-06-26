
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'amazonMweb',
    domain: 'amazon.fr',
    loadedSelector: 'div[id="dp-container"]',
    noResultsXPath: null,
  },
};
