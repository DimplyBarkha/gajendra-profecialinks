
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'safeway',
    nextLinkSelector: 'button.primary-btn.btn.btn-default.btn-secondary.bloom-load-button',
    domain: 'safeway.com',
  },
};
