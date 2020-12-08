const { transform } = require('../format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.waitForSelector('ol.ais-Hits-list li.ais-Hits-item');
  async function firstItemLink () {
    return await context.evaluate(function () {
      const firstItem = document.querySelector('ol.ais-Hits-list li.ais-Hits-item div.result-wrapper a').href;
      return firstItem;
    });
  }
  const url = await firstItemLink();
  if (url !== null) {
    await context.goto(url, { timeout: 200000, waitUntil: 'load', checkBlocked: true });
  }
  // await context.waitForSelector('button.more-button.more_infos_tab-button');
  async function moreInfo () {
    return await context.evaluate(function () {
      const fullContent = document.querySelector('button.more-button.more_infos_tab-button').click();
      return fullContent;
    });
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'linenchest',
    transform: transform,
    domain: 'linenchest.com',
    zipcode: '',
  },
  implementation,
};
