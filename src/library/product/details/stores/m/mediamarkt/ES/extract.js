const { transform } = require('../TR/transform');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const selectors = {
    isTooltip: '#features .tooltip_value',
    isVariants: 'div[class*="product-attributes"]',
    isColors: '.product-attributes__color-item',
    isSizes: '.product-attributes__item-select',
    targetDiv: 'body > #product-wrapper',
  };
  await context.evaluate((selectors) => {
    const isTooltip = document.querySelector(selectors.isTooltip);
    if (isTooltip) {
      // @ts-ignore
      [...document.querySelectorAll(selectors.isTooltip)].forEach((item) => {
        item.remove();
      });
    }
    const result = document.evaluate(
      '//div[@id="features"]',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue;
    const specs = result.textContent;
    const div = document.querySelector(selectors.targetDiv);
    div.setAttribute('specs', specs);
  }, selectors);
  try {
    await context.evaluate(() => {
      document.querySelector('#especificaciones').scrollIntoView({ behavior: 'smooth' });
    });
    await context.waitForSelector('#more_flixmedia', { timeout: 50000 });
    await context.click('#more_flixmedia');
    await context.waitForSelector('.inpage_selector_feature img', { timeout: 50000 });
  } catch (e) {
    console.log(e.message);
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'mediamarkt',
    transform,
    domain: 'mediamarkt.es',
    zipcode: '',
  },
  implementation,
};
