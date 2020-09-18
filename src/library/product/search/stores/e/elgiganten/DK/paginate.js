
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DK',
    store: 'elgiganten',
    nextLinkSelector: null,
    loadedSelector: 'div.product-list-container',
    noResultsXPath: '//div[contains(@class, "product-list-container")]',
    domain: 'elgiganten.dk',
    zipcode: '',
  },
};
