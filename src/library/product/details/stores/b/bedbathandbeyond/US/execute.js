
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'bedbathandbeyond',
    domain: 'bedbathandbeyond.com',
    loadedSelector: "div[class^='ProductDetailsLayout'] h1",
    noResultsXPath: "//h1//span[text()='Results Not Found']|//main[@role='main']//div[@class='cmsContent']|//img[contains(@alt, 'Beyond Plus')]",
    zipcode: '',
  },
};
