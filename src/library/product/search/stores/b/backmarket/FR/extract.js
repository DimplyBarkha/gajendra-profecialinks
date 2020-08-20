const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'backmarket',
    transform,
    domain: 'backmarket.fr',
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
    // await context.waitForSelector('div[data-test="product-thumb"] a div img');
  } catch (error) {
    console.log('error: ', error);
    
  }

    await context.evaluate(async () => {
    function addHiddenDiv (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div[data-test="product-thumb"] a')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    const product = document.querySelectorAll('div[data-test="product-thumb"]');
    console.log('product: ', product.length);
    for (let i = 0; i < product.length; i++) {
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    // @ts-ignore
    console.log('product: ', product[i].querySelector('a div img'),i);
    // @ts-ignore
    // console.log('product: ', product[i].querySelector('a div img').src);
    product[i] = product[i].querySelector('a div')
      // @ts-ignore
      const src = product[i].querySelector('img') ? product[i].querySelector('img').src : '';
     
      if (src) {
        addHiddenDiv('thumbnail', src, i);
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
