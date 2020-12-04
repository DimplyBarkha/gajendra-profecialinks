const {transform} = require('./format')


async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(900);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 10000);
  });
    await context.evaluate(async () => {
      //@ts-ignore
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.innerHTML = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('#prefixbox-search-engine li')[index];
        originalDiv.appendChild(newDiv);
      }
      const product = document.querySelectorAll('#prefixbox-search-engine li');
      // select query selector and loop and add div
      for (let i = 0; i < product.length; i++) {
        addHiddenDiv('page_url', window.location.href, i);
      }
    });
      
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'HU',
    store: 'edigital',
    transform,
    domain: 'edigital.hu',
    zipcode: '',
  },implementation
};
