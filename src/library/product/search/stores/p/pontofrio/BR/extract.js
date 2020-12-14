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
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      async function scrollPage () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(500);
            break;
          }
        }
      }
      const moreButton = document.evaluate('//div[contains(@class,"Loader__Wrapper")]//button[contains(text(),"Ver mais produtos")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      if (moreButton && moreButton.singleNodeValue) {
        scrollPage();
        while (document.querySelector('button.inxtwK') != null) {
          moreButton.singleNodeValue.click();
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          scrollPage();
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
