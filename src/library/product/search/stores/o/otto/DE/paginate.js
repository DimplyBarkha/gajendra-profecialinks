
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'otto',
    // nextLinkSelector: 'li[id="san_pagingBottomNext"] > *',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "section[id='san_resultSection'] article[class*='product']",
    openSearchDefinition: {
      template: 'https://www.otto.de/suche/{searchTerms}/?l=gq&o={offset}',
    },
    domain: 'otto.de',
  },
};
