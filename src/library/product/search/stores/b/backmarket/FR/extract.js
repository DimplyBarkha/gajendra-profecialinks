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
  let pageNum=1;
  while(true){
  let breakLoop=await context.evaluate(async (pageNum) => {
    if(document.querySelector(`button[data-test*="pagination-loop-${pageNum}"]`)){
      document.querySelector(`button[data-test*="pagination-loop-${pageNum}"]`).click();
      function stall (ms)
        {
        return new Promise((resolve, reject) => {
        setTimeout(() => {
        resolve();
        }, ms);
        });
        }
        await stall(3000);
        return false;
      }
      return true;
  },pageNum);
  if(breakLoop===true) break;
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
      const originalDiv = document.querySelectorAll('a[data-test="product-thumb"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    const product = document.querySelectorAll('a[data-test="product-thumb"]');
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
 await context.extract(productDetails, { transform });
  pageNum++;
  }
}
