
module.exports = {
  implements: 'tracker/categories/execute',
  parameterValues: {
    country: 'DE',
    store: 'hagel-shop',
    domain: 'hagel-shop.de',
    loadedSelector: 'ul[id][class="all-brands"]>li>a',
    noResultsXPath: null,
    zipcode: '',
  },
};
