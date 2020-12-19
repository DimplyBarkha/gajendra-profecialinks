
const { transform } = require('./transform');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(() => { Array.from(document.querySelectorAll('[class*="detailEntryText"] > ul > li')).map(elm => { elm.textContent = '|| ' + elm.textContent }) });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'bellaffair',
    transform,
    domain: 'bellaffair.at',
    zipcode: '',
  },
  implementation,
};
