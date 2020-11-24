
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NZ',
    store: 'chemistwarehouse',
    nextLinkSelector: 'div.pager-results a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#p_lt_ctl08_pageplaceholder_p_lt_ctl00_RowLayout_RowLayout_4_wSR_srchResults_pnlSearchResults',
    noResultsXPath: '//span[@id="p_lt_ctl08_pageplaceholder_p_lt_ctl00_RowLayout_RowLayout_4_wSR_srchResults_lblNoResults"]/div',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'chemistwarehouse.co.nz',
    zipcode: '',
  },
};
