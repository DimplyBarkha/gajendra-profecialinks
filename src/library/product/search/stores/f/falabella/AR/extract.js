
const { transform } = require('./transform');

async function implementation(
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
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);
  await context.evaluate(async function () {

    let URL = window.location.href;
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.innerHTML = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div.grid-pod')[index];
      originalDiv.appendChild(newDiv);
      console.log("child appended " + index);
    }
    const result = [];
    const product = document.querySelectorAll('div.grid-pod');
    // select query selector and loop and add div
    for (let i = 0; i < product.length; i++) {
      addHiddenDiv('page_url', URL, i);
    }
    return result;
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AR',
    store: 'falabella',
    transform,
    domain: 'falabella.com.ar',
    zipcode: '',
  },
  implementation
};
