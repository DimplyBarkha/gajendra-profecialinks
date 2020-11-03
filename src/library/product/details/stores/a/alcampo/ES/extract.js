
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'alcampo',
    transform: null,
    domain: 'alcampo.es',
    zipcode: '',
  },
  implementation: async (
    { inputString },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await context.evaluate(async () => {
      const body = document.querySelector('body');
      const shippingOptions = document.querySelectorAll('div[class*="imageServiceProduct"] + div');
      let shippingInfo = '';
      shippingOptions.forEach(option => {
        shippingInfo += '-' + option.innerHTML;
      });
      body.setAttribute('shippinginfo', shippingInfo);

      const isNutritionalInfoPresent = document.querySelector('div.pictogramasFood');
      if (isNutritionalInfoPresent) {
        body.setAttribute('servingsize', 'por 100ml/g');
        body.setAttribute('servingunit', 'ml/g');
      }
    });

    await context.extract(productDetails);
  },
};
