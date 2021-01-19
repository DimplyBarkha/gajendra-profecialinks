module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'medpex',
    nextLinkSelector: null,//'#searchresult > div.pagenav > table > tbody > tr > :last-child > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    openSearchDefinition: {
     template: 'https://www.medpex.de/search.do?method=similarity&q={searchTerms}&pn={page}',
    },
    domain: 'medpex.de',
  },
};
