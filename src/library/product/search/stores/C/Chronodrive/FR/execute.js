
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'Chronodrive',
    domain: 'chronodrive.com',
    url: 'https://www.chronodrive.com/search/{searchTerms}',
    loadedSelector: '#productListZone > article',
    noResultsXPath: '//div[@id="productListZone"]/p[contains(@class,"msg-nopdt")]',
    zipcode: '91160',
  },
};
