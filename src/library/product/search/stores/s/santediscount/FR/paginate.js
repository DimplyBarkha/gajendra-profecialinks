
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'santediscount',
    nextLinkSelector: 'a[class="next i-next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    openSearchDefinition: null,
    domain: 'santediscount.com',
  },
};
