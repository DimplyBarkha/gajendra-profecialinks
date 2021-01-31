
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'KO',
    store: 'coupang',
    domain: 'coupang.com',
    url: 'https://www.coupang.com/np/search?q={searchTerms}&channel=user&component=&eventCategory=SRP&trcid=&traid=&sorter=scoreDesc&minPrice=&maxPrice=&priceRange=&filterType=&listSize=36&filter=&isPriceRange=false&brand=&offerCondition=&rating=0&page=1&rocketAll=false&searchIndexingToken=',
    loadedSelector: 'div.search-content.search-content-with-feedback  ul#productList',
    noResultsXPath: '//div[@class="search-content search-content-with-feedback search-empty-content"]//p//span[@class="message"]',
    zipcode: '',
  },
};
