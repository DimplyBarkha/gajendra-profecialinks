
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IN',
    store: 'myntra',
    domain: 'myntra.com',
    url: "https://www.myntra.com/{searchTerms}",
    loadedSelector: "ul[class='results-base'] li[class='product-base'] div[class='product-imageSliderContainer'] picture img",
    noResultsXPath: "//img[@class='index-notFoundImage']",
    zipcode: '',
  },
};
