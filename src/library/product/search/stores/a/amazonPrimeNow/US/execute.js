module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimeNow',
    domain: 'primenow.amazon.com',
    url: 'https://primenow.amazon.com/search?k={searchTerms}&p_95=&merchantId=&ref_=pn_sr_nav_sr_ALL',
    loadedSelector: 'li[class^=product_grid__item]',
    noResultsXPath: '//div[contains(.,"did not match any products.")]',
  },
};
