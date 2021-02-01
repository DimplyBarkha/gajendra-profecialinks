
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'otto_de',
    nextLinkSelector: '#san_pagingBottomNext > button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="content contentWithSidebar"]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'otto.de',
    zipcode: '',
  },
};