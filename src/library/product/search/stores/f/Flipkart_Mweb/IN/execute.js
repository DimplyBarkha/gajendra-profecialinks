
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'Flipkart_Mweb',
    domain: 'flipkart.com',
    url: 'https://www.flipkart.com/search?q={searchTerms}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off',
    loadedSelector: 'html body',
    noResultsXPath: '//div[@class="DUFPUZ"]',
    zipcode: '',
  },
};
