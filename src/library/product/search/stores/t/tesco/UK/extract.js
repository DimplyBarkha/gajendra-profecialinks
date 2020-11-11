const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop <= 20000) {
      await stall(500);
      scrollTop += 100;
      window.scroll(0, scrollTop);
      if (scrollTop === 20000) {
        await stall(5000);
        break;
      }
    }
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    const optionalWait = async (sel) => {
      try {
        await context.waitForSelector(sel, { timeout: 20000 });
      } catch (err) {
        console.log(`Couldn't load selector => ${sel}`);
      }
    };
    optionalWait('li.product-list--list-item:nth-last-child(1) a img[src*="https"]');
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'tesco',
    transform,
    domain: 'tesco.com',
  },
  implementation,
};
