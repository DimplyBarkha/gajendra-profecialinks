
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'pistor',
    domain: 'pistorone.ch',
    url: 'https://www.pistorone.ch/index.php/locale:de_CH/ctx:L2NhdGFsb2cy/search?add_article={searchTerms}',
    loadedSelector: 'table.productlist.list',
    noResultsXPath: '//div[@id="search_content"]//div[@class="infobox"]',
    zipcode: '',
  },
};
