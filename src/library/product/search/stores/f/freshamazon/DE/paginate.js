
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'freshamazon',
    nextLinkSelector: 'li[class="a-last"]',
    loadedSelector: null,
    domain: 'freshamazon.de',
    zipcode: '',
  },
};
