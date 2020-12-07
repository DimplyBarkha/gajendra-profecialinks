module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'bebitus',
    domain: 'bebitus.com',
    loadedSelector: 'h1[itemprop="name"]',
    noResultsXPath: "//div[@class='cm-content headline-box']/h1[contains(.,'Lo sentimos')] | //div[contains(@class,'draggable')]//img[contains(@src,'error')]",
    zipcode: '',
  },
};
