const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  try {
    await context.waitForSelector('a[class="cc_btn cc_btn_accept_all"]', { timeout: 10000 });
    await context.evaluate(function () {
      document.querySelector('a[class="cc_btn cc_btn_accept_all"]').click();
    });
  } catch (err) {
    console.log('Accepting cookies failed');
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'lyreco',
    transform,
    domain: 'lyreco.com',
    zipcode: '',
  },
  implementation,
};
