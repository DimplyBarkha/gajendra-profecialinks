const { transform } = require('./transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.click('ul.sku-slider-wrapper>li:first-child>img');
    await context.waitForXPath('//ul[@id="visionneuse-thumbnails"]//img');
    await context.evaluate(() => {
      const zoomFeature = Boolean(document.querySelector('.nanoModalContent'));
      const main = document.querySelector('main.container');
      if (zoomFeature) {
        main.setAttribute('zoom-feature', 'Yes');
      } else {
        main.setAttribute('zoom-feature', 'No');
      }
    });
  } catch (e) {
    console.log(e.message);
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'kalamazoo',
    transform,
    domain: 'kalamazoo.es',
    zipcode: '',
  },
  implementation,
};
