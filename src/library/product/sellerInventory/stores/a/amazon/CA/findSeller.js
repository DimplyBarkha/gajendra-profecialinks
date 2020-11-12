async function findFunction ({ context, sellerId }) {
  return await context.evaluate((sellerId) => {
    const sellers = [];
    const offers = document.querySelectorAll('div.olpOffer h3 a');
    offers.forEach(seller => sellers.push(seller));
    if (sellerId) {
      let match;
      sellers.map(sellId => { if (sellId.getAttribute('href').includes(`${sellerId}`)) { match = sellId; } });
      if (match) {
        match.closest('div.olpOffer').getElementsByClassName('a-button-input')[0].click();
        return true;
      }
    }
    return false;
  }, sellerId);
}

module.exports = {
  implements: 'product/sellerInventory/findSeller',
  parameterValues: {
    country: 'CA',
    domain: 'amazon.ca',
    store: 'amazon',
    findFunction,
    // Need to fix logic to make use of addToCardButton.
    // addToCartButton: '//h3[contains(@class,"olpSellerName")]//a[contains(@href,"{sellerId}")]',
    rowXpath: '//h3[contains(@class,"olpSellerName")]',
    zipcode: '',
  },
};
