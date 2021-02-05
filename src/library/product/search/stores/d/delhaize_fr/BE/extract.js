const {transform}=require('../../../../shared');
async function implementation ({ inputString }, { country, domain, transform }, context, { productDetails }){
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let count = document.querySelectorAll('div.pageBody-content ul.ProductList>li').length;
      let currScroll = document.documentElement.scrollTop;
      while (count < 150) {
        const oldScroll = currScroll;
        window.scrollBy(0, 500);
        await new Promise((resolve, reject) => setTimeout(resolve, 3000));
        currScroll = document.documentElement.scrollTop;
        count = document.querySelectorAll('div.pageBody-content ul.ProductList>li').length;
        console.log('latest count:',count);
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
    country: 'BE',
    store: 'delhaize_fr',
    transform,
    domain: 'delhaize.be',
    zipcode: '',
  },
};
