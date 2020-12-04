const {transform} = require('./variantsFormat')

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
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
      function addHiddenDiv(id, content, j) {
        const newDiv = document.createElement('div');
        newDiv.className = id;
        newDiv.innerHTML = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div.hidden-xs div.model-variations__item-container a.model-variations__item');
        originalDiv[j].appendChild(newDiv);
      }
      const product = document.querySelectorAll('div.hidden-xs div.model-variations__item-container a.model-variations__item');
      // select query selector and loop and add div
      for (let i = 0; i < product.length; i++) {
        addHiddenDiv('page_url', (product[i].href).replace("#",""),i);
      }
    });
      
    return await context.extract(variants);
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'HU',
    store: 'edigital',
    transform,
    domain: 'edigital.hu',
    zipcode: '',
  },implementation
};
