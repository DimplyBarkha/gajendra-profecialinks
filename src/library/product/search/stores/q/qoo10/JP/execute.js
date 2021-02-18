
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'JP',
    store: 'qoo10',
    domain: 'qoo10.jp',
    url: 'https://www.qoo10.jp/s/?keyword={searchTerms}',
    loadedSelector: 'div.bd_lst_item tbody#search_result_item_list',
    noResultsXPath: '//div[@class="bd_nolst"]',
    zipcode: '',
  },
};
