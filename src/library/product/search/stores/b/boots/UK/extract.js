const { transform } = require('../format');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const applyScroll = async function (context) {

  };

  await context.evaluate(async function () {
    while (document.querySelector('button.results-btn-viewmore').disabled === false) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      document.querySelector('button.results-btn-viewmore').click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    }
  })
  const { transform } = parameters;
  const { productDetails } = dependencies;
  return await context.extract(productDetails, { transform });
  //return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'boots',
    transform,
    domain: 'boots.com',
    zipcode: '',
  },
  implementation,
};
