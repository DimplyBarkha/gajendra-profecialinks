
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'real',
    nextLinkSelector: 'ul[class="pagination list -inline item-pagination"]>:last-child>a',
    loadedSelector: 'body',
    domain: 'real.de',
    zipcode: '',
  },
};
