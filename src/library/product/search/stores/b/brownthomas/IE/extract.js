
const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const clickNextBtn = () => {
    const nextBtn = document.querySelector('div.js-product-load-more[data-grid-url*="https://www.brownthomas.com/search"]');
    try {
      if (nextBtn != null) {
        nextBtn.click();
      }
    } catch (e) {
      console.log(`Not clicked` + e);
    }

  };

  function stall (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  let counter = 1;
  while (true) {
    await stall(1000);
    await context.evaluate(async function () {
      function stall (ms) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          break;
        }
      }
      await stall(1000);

    });

    await stall(500);
    const hasNextBtn = await context.evaluate(function () {
      const nextBtn = document.querySelector('div.js-product-load-more[data-grid-url*="https://www.brownthomas.com/search"]');
      if (nextBtn) {
        return true;
      }
      return false;
    });
    if (!hasNextBtn) {
      break;
    }
    await stall(500);
    await context.evaluate(clickNextBtn);
    if (counter === 4) {
      break;
    }
    counter++;
    await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
  }

}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'target',
    transform,
    domain: 'target.com',
  },
  implementation,
};
