
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'otto',
    nextLinkSelector: 'li[id="san_pagingTopNext"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "section[id='san_resultSection'] article[class*='product']",
    openSearchDefinition: null,
    domain: 'otto.de',
  },
};
