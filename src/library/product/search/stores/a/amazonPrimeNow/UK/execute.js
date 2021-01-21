module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'amazonPrimeNow',
    domain: 'primenow.amazon.co.uk',
    url: 'https://primenow.amazon.co.uk/search?k={searchTerms}&p_95=&merchantId=&ref_=pn_sr_nav_sr_ALL&dc',
    loadedSelector: 'li[class^=product_grid__item]',
    noResultsXPath: '//div[contains(.,"did not match any products.")]',
    zipcode: 'EC1A1CB',
  },
};