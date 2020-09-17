
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'donaghybros',
    loadedSelector: 'ul#kuLandingProductsListUl',
    nextLinkSelector: 'div.kuPagination>a:nth-last-child(2)',
    domain: 'donaghybros.ie',
  },
};
