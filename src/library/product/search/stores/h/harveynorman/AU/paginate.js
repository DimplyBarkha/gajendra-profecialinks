
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'harveynorman',
    nextLinkSelector: 'div#toolbar-btm a.icn-next-page',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product-item',
    noResultsXPath: '//h1[contains(text(), "0 items")]',
    openSearchDefinition: null,
    domain: 'harveynorman.com.au',
    zipcode: '',
  },
};
