module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'otto',
    nextLinkSelector: '#san_pagingBottomNext > button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'boby',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'otto.de',
    zipcode: '',
  },
};
