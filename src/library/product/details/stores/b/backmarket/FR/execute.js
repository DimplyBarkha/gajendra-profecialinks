
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'backmarket',
    domain: 'backmarket.fr',
    loadedSelector: 'div[id="main_container"]',
    noResultsXPath: '//h3[contains(text(), "pas été trouvée. ")] | //h3[contains(text(), "- Ce lien n’a pas encore été reconditionné")]',
    zipcode: '',
  },
};
