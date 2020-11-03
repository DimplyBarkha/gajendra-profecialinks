const { transform } = require('./transform');

async function implementation (inputs, parameters, context, dependencies) {
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
    await context.waitForSelector(selectors.isVariants);
    await context.evaluate((selectors) => {
      let firstVariant = '';
      const div = document.querySelector(selectors.targetDiv);
      const isColors = document.querySelector(selectors.isColors);
      const isSizes = document.querySelector(selectors.isSizes);
      if (isColors) {
        firstVariant = isColors.getAttribute('data-action-id').replace(/(.+-)(\d+)(.html)/, '$2');
        div.setAttribute('first-variant', firstVariant);
      }
      if (!isColors && isSizes) {
        firstVariant = isSizes.querySelector('option').getAttribute('data-action-id').replace(/(.+-)(\d+)(.html)/, '$2');
        div.setAttribute('first-variant', firstVariant);
      }
    }, selectors);
  } catch (e) {
    console.log('No variants present for this product');
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'mediamarkt',
    transform,
    domain: 'mediamarkt.com.tr',
    zipcode: '',
  },
  implementation,
};
