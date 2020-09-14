
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AE',
    store: 'carrefouruae',
    domain: 'carrefouruae.com',
    loadedSelector: 'div[id="js-productHeader"], meta[property="og:url"] , div[class="css-1aj834x"]',
    noResultsXPath: '//div[@class="maf-container"]/div[@class="error-page"] | //h2[contains(text(), "looking for does not exist.")]',
    zipcode: '',
  },
};
