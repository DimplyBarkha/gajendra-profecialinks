
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'tmall',
    domain: 'tmall.ru',
    url: 'https://tmall.ru/wholesale?SearchText={searchTerms}',
    loadedSelector: 'div.main-wrap',
    noResultsXPath: '//div[@id="main-wrap" and contains(@class,"main-wrap")]/p',
    zipcode: "''",
  },
}
