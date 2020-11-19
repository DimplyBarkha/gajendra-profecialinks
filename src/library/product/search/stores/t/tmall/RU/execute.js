
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'tmall',
    domain: 'tmall.ru',
    url: 'https://tmall.ru/wholesale?SearchText={searchTerms}',
    loadedSelector: 'ul#hs-below-list-items',
    noResultsXPath: '//div[@id="main-wrap" and contains(@class,"main-wrap")]/p',
    zipcode: "''",
  },
}
