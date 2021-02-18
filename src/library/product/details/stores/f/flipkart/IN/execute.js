
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IN',
    store: 'flipkart',
    domain: 'flipkart.com',
    //loadedSelector: '#container > div > div._2c7YLP.UtUXW0._6t1WkM._3HqJxg',
    //loadedSelector: '#container > div > div._6t1WkM._3HqJxg',
    //noResultsXPath: '//div[@style="font-size: 1.3em; padding-top: 10px; margin-bottom: 35px"]',
    loadedSelector: '#container > div',
    //noResultsXPath: '//div[@class="_3uTeW4"]' || '//div[@style="font-size: 1.3em; padding-top: 10px; margin-bottom: 35px"]',
    noResultsXPath: '//div[@style="font-size: 1.3em; padding-top: 10px; margin-bottom: 35px"]',
    zipcode: "''",
  },
};
