
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'boulanger',
    domain: 'boulanger.com',
    loadedSelector: 'body[itemtype], h1.product-title__main',
    noResultsXPath: "//div[@id='modal_fusion_mp']//h2[contains(text(), 'Attention')]|//h1[contains(text(), 'Oups')]|//p[contains(text(), \"ce produit n'existe plus.\")] | //div[contains(@class, 'blocListe')]//div[contains(@class, 'productListe')]",
    zipcode: "''",
  },
};
