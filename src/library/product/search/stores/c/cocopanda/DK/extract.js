const {transform} = require('../format')
async function implementation ({ inputString }, { country, domain, transform }, context, { productDetails }){
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let count = document.querySelectorAll('div#product-list-container>div.product-list-item').length;
      console.log('count',count);
      let currScroll = document.documentElement.scrollTop;
      console.log('currScroll',currScroll);
      while (count < 150) {
        const oldScroll = currScroll;
        window.scrollBy(0, 1000);
        await new Promise((resolve, reject) => setTimeout(resolve, 5000));
        currScroll = document.documentElement.scrollTop;
        count = document.querySelectorAll('div#product-list-container>div.product-list-item').length;
        console.log('oldScroll',oldScroll);
        console.log('currScroll',currScroll);
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
    country: 'DK',
    store: 'cocopanda',
    transform,
    domain: 'cocopanda.dk',
    zipcode: '',
  },
  implementation
};
