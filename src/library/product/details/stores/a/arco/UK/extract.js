const { transform } = require('./shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    const optionalWait = async (sel) => {
      try {
        await context.waitForSelector(sel, { timeout: 10000 });
      } catch (err) {
        console.log(`Couldn't load selector => ${sel}`);
      }
    };
    optionalWait('div#imageholder img[id="lpic"]');
    const selector = document.querySelector('#infoholder > h1');
    if (selector) {
      const variants = [];
      document.querySelectorAll('table.producttbl tbody tr td:first-child').forEach((ele) => variants.push(ele.textContent.trim()));
      document.querySelector('#infoholder h1').setAttribute('variants', variants);
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'arco',
    transform,
    domain: 'arco.co.uk',
    zipcode: '',
  },
  implementation,
};
