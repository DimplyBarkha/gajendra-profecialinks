
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'cabelas',
    nextLinkSelector: 'a[class="right_arrow "]',
    loadedSelector: 'body',
    domain: 'cabelas.com',
    zipcode: '',
  },
};