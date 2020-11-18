async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(1500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        const totalProductOnPage = document.querySelectorAll('ul[id="navlist"]>li');
        console.log('total product on the page is this number ->', totalProductOnPage.length);
        if (scrollTop > 20000 || totalProductOnPage.length >= 150) {
          console.log('here the loop is going to break');
          await stall(1500);
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
    });
  };
  await applyScroll(context);
  await context.evaluate(() => {
    var searchUrl = window.location.href;
    var appendElements = document.querySelectorAll('ul[id="navlist"]>li');
    if (appendElements.length) {
      appendElements.forEach((element) => {
        element.setAttribute('searchurl', searchUrl);
      })
    }
  });
  await new Promise((res) => setTimeout(res, 30000))
  return await context.extract(productDetails, { transform });
}
const { transform } = require('../shared')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'sportsdirect',
    transform,
    zipcode: '',
    domain: 'sportsdirect.com',
  },
  implementation,
};
