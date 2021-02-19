
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { variants } = dependencies;
  const prepareColorVariantUrl = async (url) => {
    return await context.evaluate(async (productUrl) => {
      const allElements = document.querySelectorAll('div.pdp-product-swatch-outer a');
      const colors = Array.from(allElements).map(elem => elem.getAttribute('data-skucolor'));
      const allColors = colors.map(color => encodeURIComponent(color));
      const colorVariantsUrl = allColors.map(color => `${productUrl}?color=${color}`);
      return colorVariantsUrl;
    }, url);
  };

  const appendVariants = async (variantsArray) => {
    await context.evaluate(({ array }) => {
      array.forEach(el => {
        const newDiv = document.createElement('div');
        newDiv.id = 'variant';
        newDiv.textContent = el;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      });
    }, { array: variantsArray });
  };

  const cleanUrl = await context.evaluate(() => {
    let url = window.location.href;
    if (url.includes('?')) {
      url = url.match(/(.+)\?/)[1];
    }
    return url;
  });

  const variantsArray = await prepareColorVariantUrl(cleanUrl);
  await appendVariants(variantsArray);
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'kohls',
    transform: null,
    domain: 'kohls.com',
    zipcode: '',
  },
  implementation,
};
