const { transform } = require('./shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
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
    async function infiniteScroll () {
      let prevScroll = document.documentElement.scrollTop;
      while (true) {
        console.log('Scroll started');
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
      console.log('Scroll finished');
    }
    let count = 0;
    while (document.querySelector("div[class*='more-products'] a:not([style*='none'])") != null) {
      console.log('Inside load more', count++);
      await infiniteScroll();
      // @ts-ignore
      document.querySelector("div[class*='more-products'] a:not([style*='none'])") && document.querySelector("div[class*='more-products'] a:not([style*='none'])").click();
    }
    await infiniteScroll();
  }
  await context.evaluate(addUrl);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'qvc',
    transform,
    domain: 'qvc.it',
    zipcode: '',
  },
  implementation,
};
