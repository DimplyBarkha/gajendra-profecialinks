
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'tmall',
    domain: 'tmall.ru',
    url: 'https://tmall.ru/wholesale?site=rus&SearchText={searchTerms}',
    // loadedSelector: 'ul.util-clearfix li',
    // noResultsXPath: '//div[@id="main-wrap" and contains(@class,"main-wrap")]/p',
    zipcode: "''",
  },
}
