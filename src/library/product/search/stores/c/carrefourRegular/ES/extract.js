const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    async function infiniteScroll () {
      let prevScroll = document.querySelector('.ebx-empathy-x__main.ebx-scroll').scrollTop;
      let count = 1;
      while (true) {
        console.log('Srolling', count++);
        document.querySelector('.ebx-empathy-x__main.ebx-scroll').scrollTop += 50;
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentScroll = document.querySelector('.ebx-empathy-x__main.ebx-scroll').scrollTop;
        if (currentScroll === prevScroll) {
          console.log('Scroll finished', count++);
          break;
        }
        prevScroll = currentScroll;
      }
    }
    await infiniteScroll();
    const url = window.location.href;
    console.log('url', window.location.href);
    const searchUrlDiv = document.createElement('div');
    searchUrlDiv.classList.add('my-search-url');
    searchUrlDiv.style.display = 'none';
    searchUrlDiv.textContent = url;
    document.body.appendChild(searchUrlDiv);
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'carrefourRegular',
    transform,
    domain: 'carrefour.es',
    zipcode: '',
  },
  implementation,
};
