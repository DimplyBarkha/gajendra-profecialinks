
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'lyreco',
    nextLinkSelector: 'li.next a[href*="search"]',
    loadedSelector: 'div#listProductSearch div.product-container:nth-last-child(1) div.product2comp:nth-last-child(1)',
    domain: 'lyreco.com',
    zipcode: '',
  },
};
