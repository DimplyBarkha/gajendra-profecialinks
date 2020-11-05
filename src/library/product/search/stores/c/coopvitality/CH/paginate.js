
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'coopvitality',
    nextLinkSelector: '#maincontent > div.columns > div.column.main > div.search.results > div:nth-child(3) > div.pages > ul > li.item.pages-item-next > a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'coopvitality.ch',
    zipcode: '',
  },
};
