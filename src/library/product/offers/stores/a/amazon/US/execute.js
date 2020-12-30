
module.exports = {
  implements: 'product/offers/execute',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    domain: 'amazon.com',
    loadedSelector: '.olpOffer',
    noResultsXPath: '//div[@id="olpOfferList"]/div/p | //*[@id="be"]//*[not(contains(text(), "OfferListing")) and contains(text(), "ue_pty")]',
    offerUrl: 'https://www.amazon.com/gp/offer-listing/{id}/ref=olp_f_new?ie=UTF8&overridePriceSuppression=10&f_new=true',
    zipcode: '',
  },
};
