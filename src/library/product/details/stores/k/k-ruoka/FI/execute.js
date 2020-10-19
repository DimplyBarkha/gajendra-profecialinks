
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FI',
    store: 'k-ruoka',
    domain: 'k-ruoka.fi',
    loadedSelector: 'section.shopping-list',
    noResultsXPath: "//div[contains(@class,'empty-shopping-list-content__description')]",
    zipcode: '',
  },
};
