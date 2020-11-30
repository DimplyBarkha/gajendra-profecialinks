
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'PT',
    store: 'worten',
    nextLinkSelector: 'li.pagination-next a',
    loadedSelector: 'div.w-product-list__row',
    domain: 'worten.pt',
    spinnerSelector: 'div.w-loading',
  },
};
