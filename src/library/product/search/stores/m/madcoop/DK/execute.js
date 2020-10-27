
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DK',
    store: 'madcoop',
    domain: 'butik.mad.coop.dk',
    url: 'https://butik.mad.coop.dk/api/search/search?pageSize=200&term={searchTerms}#[!opt!]{"type":"json"}[/!opt!]',
    loadedSelector: 'td.products',
    noResultsXPath: '//td[contains(@class,"products depth_1")]/table/tbody[count(*)=0]',
    zipcode: '',
  },
};