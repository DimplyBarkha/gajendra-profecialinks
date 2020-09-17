const { transform } = require('./../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { results } = inputs;
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function (results) {
    async function infiniteScroll (results) {
      console.log('Results expected::', results);
      let prevScroll = document.querySelector('.search-contain').scrollTop;
      let count = 1;
      let productsLength = document.querySelector("div[class*='span03 product-tile ng-scope']") ? document.querySelectorAll("div[class*='span03 product-tile ng-scope']").length : 0;
      while (true) {
        console.log('Srolling', count++);
        productsLength = document.querySelector("div[class*='span03 product-tile ng-scope']") ? document.querySelectorAll("div[class*='span03 product-tile ng-scope']").length : productsLength;
        document.querySelector('.search-contain').scrollTop += 1000;
        console.log('Previous Products count', productsLength);
        await new Promise(resolve => setTimeout(resolve, 6000));
        const currentProductLength = document.querySelector("div[class*='span03 product-tile ng-scope']") ? document.querySelectorAll("div[class*='span03 product-tile ng-scope']").length : 0;
        console.log('Current Products count', currentProductLength);
        const currentScroll = document.querySelector('.search-contain').scrollTop;
        if (currentScroll === prevScroll || currentProductLength >= results) {
          console.log('Scroll finished', count++);
          break;
        }
        prevScroll = currentScroll;
      }
    }
    await infiniteScroll(results);

    const url = window.location.href;
    console.log('url', window.location.href);
    const searchUrlDiv = document.createElement('div');
    searchUrlDiv.classList.add('my-search-url');
    searchUrlDiv.style.display = 'none';
    searchUrlDiv.textContent = url;
    document.body.appendChild(searchUrlDiv);
  }, results);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NZ',
    store: 'jbhifi',
    transform,
    domain: 'jbhifi.co.nz',
    zipcode: '',
  },
  implementation,
};
