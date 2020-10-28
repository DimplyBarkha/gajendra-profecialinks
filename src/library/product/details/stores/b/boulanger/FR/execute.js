
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'boulanger',
    domain: 'boulanger.com',
    loadedSelector: 'body[itemtype]',
    noResultsXPath: "//div[@id='modal_fusion_mp']//h2[contains(text(), 'Attention')]",
    zipcode: "''",
  },
};
