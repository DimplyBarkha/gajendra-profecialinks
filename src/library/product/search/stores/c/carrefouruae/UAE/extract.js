const { transform } = require('../shared')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UAE',
    store: 'carrefouruae',
    transform,
    domain: 'carrefouruae.com',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  
  await context.evaluate(async () => {
    // window.scrollTo(0,9999);
    try {
      await new Promise((resolve) => setTimeout(resolve, 6000));
      // await context.waitForSelector('div[data-test="product-thumb"] a div img');
    }catch(error){
      console.log(error)
    }
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
    await infiniteScroll();
    // let loadMore = document
  })
   
  // try {
  //   await new Promise((resolve) => setTimeout(resolve, 6000));
  //   // await context.waitForSelector('div[data-test="product-thumb"] a div img');
  // } catch (error) {
  //   console.log('error: ', error);
    
  // }
  return await context.extract(productDetails, { transform });
}