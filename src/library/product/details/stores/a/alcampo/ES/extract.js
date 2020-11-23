
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

      const isNutritionalInfoPresent = document.querySelector('div#producto_pestana_informacion_nutricion');
      if (isNutritionalInfoPresent) {
        body.setAttribute('servingsize', '100');
        body.setAttribute('servingunit', 'ml/g');
      }
    });

    await context.extract(productDetails);
  },
};
