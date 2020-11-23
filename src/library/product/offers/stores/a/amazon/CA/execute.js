
module.exports = {
  implements: 'product/offers/execute',
  parameterValues: {
    country: 'CA',
    store: 'amazon',
    domain: 'amazon.ca',
    loadedSelector: '.olpOffer',
    noResultsXPath: '//div[@id="olpOfferList"]/div/p | //*[@id="be"]//*[not(contains(text(), "OfferListing")) and contains(text(), "ue_pty")]',
    offerUrl: 'https://www.amazon.ca/gp/offer-listing/{id}/ref=olp_f_new?ie=UTF8&overridePriceSuppression=10',
    zipcode: '',
  },
};
