module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'auchan',
    nextLinkSelector: 'a.ui-pagination--next', timeout:50000,
    loadedSelector: '.product-list--container.grid',
    noResultsXPath: '//div[@id="no-result--container"]//h1',
     zipcode: '',
    domain: 'auchan.fr',
  },
};
