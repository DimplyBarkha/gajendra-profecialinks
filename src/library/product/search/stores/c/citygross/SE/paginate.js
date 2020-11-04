
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'citygross',
    nextLinkSelector: null,
    // 'div[class="c-loadmore__button"] button[class="c-cmdbtn undefined primary"]',
    // mutationSelector: 'div[class="c-loadmore__button"] button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'citygross.se',
    zipcode: '',
  },
};
