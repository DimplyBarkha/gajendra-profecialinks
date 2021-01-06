
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'net-a-porter',
    domain: 'net-a-porter.com',
    url: 'https://www.net-a-porter.com/en-us/shop/search/{searchTerms}',
    // url: 'https://www.net-a-porter.com/{queryParams}',
    // url: 'https://www.net-a-porter.com/en-us/shop/clothing?cm_sp=topnav-_-clothing-_-allclothing',
    loadedSelector: 'div[itemprop="item"]',
    noResultsXPath: '//div[contains(@class,"EmptyList")]',
    zipcode: '',
  },
};
