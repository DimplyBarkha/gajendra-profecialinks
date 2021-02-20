const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'samsclub',
    transform,
    domain: 'sams.com.mx',
    zipcode: '',
  },
  implementation
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    const popUps = document.querySelector('td.viewmore-cell span i.icoBlackbird-Icons_circle-arrow-down');
    if (popUps) popUps.click();

    // const popUps = document.querySelector('td.viewmore-cell span i.icoBlackbird-Icons_circle-arrow-down');
    // if (popUps) popUps.click();
  });
  return await context.extract(productDetails, { transform });
}

