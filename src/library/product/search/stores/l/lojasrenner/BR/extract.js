const { transform } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'lojasrenner',
    transform,
    domain: 'lojasrenner.com.br',
    zipcode: '',
  },
  implementation
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
    try {
      await new Promise((resolve) => setTimeout(resolve, 6000));
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
  })

  try {
    await new Promise((resolve) => setTimeout(resolve, 6000));
  } catch (error) {
    console.log('error: ', error);
    
  }
  return await context.extract(productDetails, { transform });
}