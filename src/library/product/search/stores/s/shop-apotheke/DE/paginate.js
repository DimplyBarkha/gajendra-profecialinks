module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'shop-apotheke',
    nextLinkSelector: 'div[class="l-flex m-PaginationControl"] > button[data-qa-id="form-pagination-control-next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'li[data-qa-id="results-per-page-select"]',
    domain: 'shop-apotheke.com',
  },
};
