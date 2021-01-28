// const { transform } = require('./transform');
const { transform } = require('../../../../shared');

const implementation = async function (
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
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        await stall(3000);
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

  // var close = document.querySelector('aside.modal-popup.popupseteskin.modal-slide._show > div.modal-inner-wrap > header > button')
  // if(close!=null){
  //   close.click()
  // }

  // permanent code
  await context.evaluate(() => {
    function addHiddenDiv (el, id, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('id', id);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      el.appendChild(newDiv);
    }

    const itemContainers = document.querySelectorAll('li.item.product.product-item');
    // @ts-ignore
    for (const itemContainer of itemContainers) {
      console.log(itemContainer);
      const searchUrl = window.location.href;

      addHiddenDiv(itemContainer, 'url', searchUrl);
    }
  });

  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PT',
    store: 'skin',
    transform: transform,
    domain: 'skin.pt',
    zipcode: '',
  },
  implementation,
};
