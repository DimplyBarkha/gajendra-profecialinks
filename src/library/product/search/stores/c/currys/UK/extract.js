
const { transform } = require('../transform');

const implementation = async (
  inputs,
  parameters,
  context,
  dependencies,
) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log('Executing on page level');
  await context.click('span[data-name="ListView"]');
  await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });

  await context.evaluate(() => {
    const article = document.querySelectorAll('div[data-component="sponsored-products"] article');

    article.forEach(el => {
      el.setAttribute('sponsored', 'true')
    });
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'currys',
    transform,
    domain: 'currys.co.uk',
    zipcode: 'SE19QY',
  },
  implementation,
};
