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
    await context.waitForSelector('div.dy-recommendations__slider', { timeout: 45000 });
  } catch (error) {
    console.log('Not loading recommended products');
  }

  async function scrollToRec () {
    await context.evaluate(async () => {
      var element = (document.querySelector('div.dy-recommendations__slider')) ? document.querySelector('div.dy-recommendations__slider') : null;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 5000);
        });
      }
    });
  }
  await scrollToRec();
  await context.evaluate(async function (inputs) {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const url = window.location.href.replace(/%20/g, ' ');
    addHiddenDiv('detail-url', url);
    // @ts-ignore
    const manufacturer= window && window._nRepData && window._nRepData["context"] ? window._nRepData["context"].manufacturer : '';
    addHiddenDiv('detail-manufacturer', manufacturer);
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'ao',
    transform: transform,
    domain: 'ao.com',
  },
  implementation,
};
