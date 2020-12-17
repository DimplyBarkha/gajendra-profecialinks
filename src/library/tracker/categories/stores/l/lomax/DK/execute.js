
module.exports = {
  implements: 'tracker/categories/execute',
  parameterValues: {
    country: 'DK',
    store: 'lomax',
    domain: 'lomax.dk',
    loadedSelector: 'ul#megamenuroot',
    noResultsXPath: '//body[not(.//ul[@id="megamenuroot"])]',
    zipcode: '',
  },
};
