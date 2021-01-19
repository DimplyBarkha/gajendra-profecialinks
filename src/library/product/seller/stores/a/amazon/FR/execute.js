
module.exports = {
  implements: 'product/seller/execute',
  parameterValues: {
    country: 'FR',
    store: 'amazon',
    domain: 'amazon.fr',
    loadedSelector: '#seller-profile-container',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "SellerProfilePage"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //img[contains(@alt,"Dogs of Amazon")]',
    zipcode: '',
  },
};
