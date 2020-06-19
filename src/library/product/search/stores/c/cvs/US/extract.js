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
    const nodes = document.querySelectorAll('script');
    const nodesArr = Array.prototype.slice.call(nodes);
    console.log(nodesArr);

    for (let i = 0; i < nodesArr.length; i++) {
      if ((nodesArr[i].hasAttribute('src') && nodesArr[i].getAttribute('src').indexOf('foresee') !== -1)) {
        nodesArr[i].src = '/';
        break;
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'cvs',
    transform: transform,
    domain: 'cvs.com',
  },
  implementation,
};
