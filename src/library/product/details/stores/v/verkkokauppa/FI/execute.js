
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FI',
    store: 'verkkokauppa',
    domain: 'verkkokauppa.com',
    loadedSelector: '.product-list-detailed li, a#list-product-info__link,section.page__product',
    noResultsXPath: null,
    zipcode: '',
  },
};
