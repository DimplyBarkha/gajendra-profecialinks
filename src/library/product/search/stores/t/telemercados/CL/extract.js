const { transform } = require('../CL/format');
async function implementation ({ inputString }, { country, domain, transform }, context, { productDetails }){
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let count = document.querySelectorAll('div[id*="ResultItems_"] ul li div.product-info').length;
      let currScroll = document.documentElement.scrollTop;
      while (count < 150) {
        const oldScroll = currScroll;
        window.scrollBy(0, 500);
        await new Promise((resolve, reject) => setTimeout(resolve, 3000));
        window.scrollBy(0, 500);
        await new Promise((resolve, reject) => setTimeout(resolve, 3000));
        currScroll = document.documentElement.scrollTop;
        count = document.querySelectorAll('div[id*="ResultItems_"] ul li div.product-info').length;
        if (oldScroll === currScroll) {
          break;
        }
      }
    });
  };
  await applyScroll(context);

  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CL',
    store: 'telemercados',
    transform,
    domain: 'telemercados.cl',
    zipcode: '',
  },
  implementation
};
