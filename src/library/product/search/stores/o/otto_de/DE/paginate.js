
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'otto_de',
    //nextLinkSelector: '#san_pagingBottomNext > button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="content contentWithSidebar"]',
    noResultsXPath: null,
    openSearchDefinition: {
      offset: 20,
      template: 'https://www.otto.de/suche/{searchTerms}/?l=gq&o={offset}',
      },
    domain: 'otto.de',
    zipcode: '',
  },
};