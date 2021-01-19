
module.exports = {
  implements: 'product/offers/execute',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    domain: 'amazon.co.uk',
    loadedSelector: '.olpOffer',
    noResultsXPath: '//div[@id="olpOfferList"]/div/p | //*[@id="be"]//*[not(contains(text(), "OfferListing")) and contains(text(), "ue_pty")]',
    offerUrl: 'https://www.amazon.co.uk/gp/offer-listing/{id}/ref=olp_f_new?ie=UTF8&overridePriceSuppression=10&f_new=true',
    zipcode: '',
  },
};