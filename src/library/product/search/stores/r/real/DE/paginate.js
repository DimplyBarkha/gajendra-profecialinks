
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'real',
    nextLinkSelector: 'a[class="btn -default pagination"]',
    loadedSelector: 'div#page',
    domain: 'real.de',
    zipcode: '',
  },
};
