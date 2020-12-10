
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'TR',
    store: 'e-bebek',
    domain: 'e-bebek.com',
    loadedSelector: 'div.glide-container img[role="presentation"]',
    noResultsXPath: '//*[contains(text(), "Sayfa Bulunamadı")]|//*[contains(text(), "ile ilgili sonuç bulunamamıştır")]',
    zipcode: '',
  },
};
