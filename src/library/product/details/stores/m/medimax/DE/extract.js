const { transform } = require('../format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.click('button.cookies-overlay-dialog__accept-all-btn');
  } catch (err) {

  }
  const src = await context.evaluate(async function () {
    const iframe = document.querySelector('#loadbeeTabContent');
    const src = iframe ? iframe.src : '';
    return src;
  });
  await context.extract(productDetails, { transform });
  if (src) {
    try {
      await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
      await context.waitForSelector('div.wrapper.preview');
      return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
    } catch (error) {
      try {
        await context.evaluate(async function (src) {
          window.location.assign(src);
        }, src);
        await context.waitForSelector('div.wrapper.preview');
        return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
      } catch (err) {
        console.log(err);
      }
    }
  }
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'medimax',
    transform,
    domain: 'medimax.de',
    zipcode: '',
  },
  implementation,
};
