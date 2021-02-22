
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NZ',
    store: 'chemistwarehouse',
    domain: 'chemistwarehouse.co.nz',
    url: 'https://www.chemistwarehouse.co.nz/search?searchtext={searchTerms}',
    loadedSelector: 'div#p_lt_ctl08_pageplaceholder_p_lt_ctl00_RowLayout_RowLayout_4_wSR_srchResults_pnlSearchResults',
    noResultsXPath: '//span[@id="p_lt_ctl08_pageplaceholder_p_lt_ctl00_RowLayout_RowLayout_4_wSR_srchResults_lblNoResults"]/div',
    zipcode: '',
  },
};
