
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'asos',
    transform: null,
    domain: 'asos.com',
    zipcode: "''",
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { variants } = dependencies;
    const productPage = await context.evaluate(() => {
      return document.querySelector('section[class*="core-product"]');
    });
    if (productPage) {
      await context.evaluate(async () => {
      // @ts-ignore
        const apiLink = 'https://www.asos.com' + window.asos.pdp.config.stockPriceApiUrl;
        const response = await fetch(apiLink);
        const responseData = await response.json();
        const obj = responseData[0];
        const variants = obj.variants;
        variants.forEach(variant => {
          const variantUrl = 'https://www.asos.com/prd/' + variant.id;
          const div = document.createElement('div');
          div.id = 'variant-url';
          div.innerText = variantUrl;
          document.body.appendChild(div);
        });
      });
      return await context.extract(variants, { transform });
    }
  },

};
