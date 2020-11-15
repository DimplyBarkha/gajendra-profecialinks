
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'tmall',
    domain: 'tmall.ru',
    url: 'https://tmall.ru/wholesale?SearchText={searchTerms}',
    loadedSelector: ' ul[id="hs-below-list-items"] li',
    noResultsXPath: '//div[@id="main-wrap" and contains(@class,"main-wrap")]/p',
    zipcode: "''",
  },
}
