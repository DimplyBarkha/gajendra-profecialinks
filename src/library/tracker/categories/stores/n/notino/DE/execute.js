
module.exports = {
  implements: 'tracker/categories/execute',
  parameterValues: {
    country: 'DE',
    store: 'notino',
    domain: 'notino.de',
    loadedSelector: 'ul[class*="menu-level-1"] div[class="level-2"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
