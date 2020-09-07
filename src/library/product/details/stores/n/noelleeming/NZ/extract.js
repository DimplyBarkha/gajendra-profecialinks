const { transform } = require('./transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const src = await context.evaluate(async function () {
    // document.write(document.querySelector('iframe').contentDocument.documentElement.innerHTML);
    const iframe = document.querySelector('#eky-dyson-iframe');
    const src = iframe ? iframe.src : '';
    return src;
  });
  await context.extract(productDetails, { transform });
  if (src) {
    try {
      await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
      // await context.waitForSelector('div.wrapper.preview');
      return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
    } catch (error) {
      try {
        await context.evaluate(async function (src) {
          window.location.assign(src);
        }, src);
        await context.waitForSelector('div#no-parallax');
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
    country: 'NZ',
    store: 'noelleeming',
    transform,
    domain: 'noelleeming.co.nz',
    zipcode: '',
  },
  implementation,
};
