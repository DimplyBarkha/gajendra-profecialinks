const { transform } = require('./transform');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
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

  const getPageURL = async function (context) {
    await context.evaluate(async function () {
      let URL = window.location.href;
      function addHiddenDiv (id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div.product-wrapper')[index];
        originalDiv.appendChild(newDiv);
        console.log("child appended " + index);
      }
      const product = document.querySelectorAll('div.product-wrapper');
      // select query selector and loop and add div
      for (let i = 0; i < product.length; i++) {
        addHiddenDiv('page_url', URL, i);
      }
    });
  };

  
  await applyScroll(context);
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  await getPageURL(context);
  return await context.extract(productDetails, {transform});
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'HU',
    store: 'mediamarkt',
    transform,
    domain: 'mediamarkt.hu',
    zipcode: "''",
  },
  implementation
};
