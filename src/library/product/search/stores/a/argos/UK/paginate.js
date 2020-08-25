
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'argos',
    nextLinkSelector: 'a[data-test="component-pagination-arrow-right"]',
    loadSelector: '#findability > div > div.search > div',
    domain: 'argos.co.uk',
  },
};
