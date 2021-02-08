
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'Flipkart_Mweb',
    domain: 'flipkart.com',
    url: 'https://www.flipkart.com/search?q={searchTerms}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off',
    loadedSelector: 'div._13oc-S>div > div._4ddWXP > a._2rpwqI > div >div>div> img ,div.MIXNux > div._2QcLo- > div > div > img',
    noResultsXPath: '//div[@class="DUFPUZ"]',
    zipcode: '',
  },
};
