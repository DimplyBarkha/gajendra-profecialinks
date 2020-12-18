
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
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

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
      document.querySelectorAll('table.producttbl tbody tr:not(:first-child) td:first-child').forEach((ele) => variants.push(ele.textContent.trim()));
      document.querySelector('#infoholder h1').setAttribute('variants', variants);
    }
    var pack = [];
    document.querySelectorAll('table.producttbl tbody tr td span[class="linedesc"]').forEach((ele) => pack.push(ele.textContent.trim()));
    for (let i = 0; i < pack.length; i++) {
      if (pack[i].includes('(Case of') || pack[i].includes('(Pack of')) {
        const ele = pack[i].split('(')[1].split(')')[0];
        document.querySelectorAll('table.producttbl tbody tr td span[class="linedesc"]')[i].setAttribute('pack', ele);
      }
    }
    await stall(10000);
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
