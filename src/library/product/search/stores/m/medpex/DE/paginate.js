module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'medpex',
    nextLinkSelector: '#searchresult > div.pagenav > table > tbody > tr > td:nth-child(6) > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="product-list"]',
    //openSearchDefinition: {
     // template: 'https://www.medpex.de/search.do?q={searchTerms}&pn={page}',
    //},
    domain: 'medpex.de',
  },
};
