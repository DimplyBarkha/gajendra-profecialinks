const { transform } = require('./shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  async function infiniteScroll () {
    let prevScroll = document.documentElement.scrollTop;
    while (true) {
      window.scrollBy(0, document.documentElement.clientHeight);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const currentScroll = document.documentElement.scrollTop;
      if (currentScroll === prevScroll) {
        break;
      }
      prevScroll = currentScroll;
    }
  }
  async function addUrl () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const url = window.location.href;
    addHiddenDiv('added-searchurl', url);
  }
  await context.evaluate(infiniteScroll);
  await context.evaluate(addUrl);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'googleExpress',
    transform,
    domain: 'google.fr',
    zipcode: '',
  },
  implementation,
};
