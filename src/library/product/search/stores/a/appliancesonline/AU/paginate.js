module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'appliancesonline',
    domain: 'appliancesonline.com.au',
    nextLinkSelector: 'div.pagination > pagination-template > ul > li.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.grid-container-flex',
  },
};
