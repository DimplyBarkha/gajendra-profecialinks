
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'otto_de',
    //nextLinkSelector: 'li[id="san_pagingBottomNext"] button',
    //nextLinkXpath: '//li[@id="san_pagingBottomNext"]//i[text()=">"]',
    //li[@id="san_pagingBottomNext"]//i[text()=">"]
    mutationSelector: null,
    spinnerSelector: null,
    //loadedSelector: 'div[class="content contentWithSidebar"]',
    loadedSelector: 'div[id="san_searchResult"]',
    noResultsXPath: null,
    openSearchDefinition: {
      //offset: 20,
      template: 'https://www.otto.de/suche/{searchTerms}/?l=gq&o={offset}',
    },
    domain: 'otto.de',
    zipcode: '',
  },
};