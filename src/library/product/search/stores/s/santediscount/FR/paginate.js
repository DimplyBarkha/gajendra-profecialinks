
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'FR',
    store: 'santediscount',
    nextLinkSelector: 'a[class="next i-next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product-flag-wrapper',
    openSearchDefinition: null,
    domain: 'santediscount.fr',
  },
};
