
module.exports = {
  implements: 'tracker/categories/execute',
  parameterValues: {
    country: 'DE',
    store: 'galeriakaufhof',
    domain: 'galeria.de',
    loadedSelector: 'ul[class^="g-navigation__menu"]>li[class^="g-navigation__item"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
