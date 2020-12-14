const { transform } = require('../format.js');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'pontofrio',
    transform: transform,
    domain: 'pontofrio.com.br',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      async function scrollPage(scrollStartPos, limit) {
        while (scrollStartPos !== limit) {
          await stall(500);
          scrollStartPos += 1000;
          window.scroll(0, scrollStartPos);
          if (scrollStartPos === limit) {
            await stall(500);
            break;
          }
        }
      }
      //const moreButton = document.evaluate('//div[contains(@class,"Loader__Wrapper")]//button[contains(text(),"Ver mais produtos")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      if (document.querySelector('button.inxtwK')) {
        let scrollTop = 0;
        let limit = 3800;
        await scrollPage(scrollTop);
        while (document.querySelector('button.inxtwK') != null) {
          scrollTop += 3800;
          limit += 3800;
          document.querySelector('button.inxtwK').click();
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          await scrollPage(scrollTop, limit);
        }
      }
    });
    // await context.evaluate(async function () {
    //   const URL = window.location.href;
    //   function addHiddenDiv (id, content, index) {
    //     const newDiv = document.createElement('div');
    //     newDiv.id = id;
    //     newDiv.textContent = content;
    //     newDiv.style.display = 'none';
    //     const originalDiv = document.querySelectorAll('article.dkt-product')[index];
    //     originalDiv.appendChild(newDiv);
    //     console.log('child appended ' + index);
    //   }
    //   const product = document.querySelectorAll('article.dkt-product');
    //   // select query selector and loop and add div
    //   for (let i = 0; i < product.length; i++) {
    //     addHiddenDiv('page_url', URL, i);
    //   }
    // });
    return await context.extract(productDetails, { transform });
  },
};
