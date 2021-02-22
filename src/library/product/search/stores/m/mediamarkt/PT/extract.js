const { transform } = require('./transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    console.log('calling applyScroll-----------');
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(1000);
        scrollTop += 1000;
        console.log('calling applyScroll evaluate-----------', window);
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

  // await context.evaluate(async function () {
  //   const URL = window.location.href;
  //   function addHiddenDiv(id, content, index) {
  //     console.log('nilesh', id, content);
  //     const newDiv = document.createElement('div');
  //     newDiv.id = id;
  //     newDiv.innerHTML = content;
  //     newDiv.style.display = 'none';
  //     const originalDiv = document.querySelectorAll('div.snize-item')[index];
  //     originalDiv.appendChild(newDiv);
  //     console.log('child appended ' + index);
  //   }
  //   const result = [];
  //   const product = document.querySelectorAll('div.snize-item');
  //   // select query selector and loop and add div
  //   for (let i = 0; i < product.length; i++) {
  //     addHiddenDiv('page_url', URL, i);
  //   }
  //   return result;
  // });
  await applyScroll(context);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PT',
    store: 'mediamarkt',
    transform,
    domain: 'mediamarkt.pt',
    zipcode: '',
  },
  implementation,
};
