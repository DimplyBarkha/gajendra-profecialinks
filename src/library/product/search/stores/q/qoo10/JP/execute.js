
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'JP',
    store: 'qoo10',
    domain: 'qoo10.jp',
    url: 'https://www.qoo10.jp/s/IQOS?keyword={searchTerms}&keyword_auto_change=&furusato_gdlc_cd=',
    loadedSelector: 'div.bd_lst_item tbody#search_result_item_list',
    noResultsXPath: null,
    zipcode: '',
  },
};
