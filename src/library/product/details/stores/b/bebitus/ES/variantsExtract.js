module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'ES',
    store: 'bebitus',
    transform: null,
    domain: 'bebitus.com',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { variants } = dependencies;
    await context.evaluate(() => {
      const variantUrls = [];
      [...document.querySelectorAll('div[class="product-variant-2"] div.product-info')].map((ele) => variantUrls.push(ele.getAttribute('data-product-ean')));
      const array = document.querySelectorAll('div[class="product-variant-2"] div.product-info');
      for (let i = 0; i < variantUrls.length; i++) {
        const currentUrl = document.querySelector('link[rel="canonical"]').getAttribute('href');
        array[i].setAttribute('variantUrl', `${currentUrl}?selectedean=${variantUrls[i]}`);
      }
    });
    return await context.extract(variants);
  },
};
