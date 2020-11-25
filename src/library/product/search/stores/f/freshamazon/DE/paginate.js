
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'freshamazon',
    nextLinkSelector: 'li[class="a-last"]',
    loadedSelector: 'body',
    domain: 'freshamazon.de',
    zipcode: '',
  },
};
