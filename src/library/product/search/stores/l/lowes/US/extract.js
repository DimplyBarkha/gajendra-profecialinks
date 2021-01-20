const { transform } = require('../../../../shared');
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
      while (scrollTop !== 10000) {
        await stall(1200);
        scrollTop += 500;
        window.scroll(0, scrollTop);
        if (scrollTop === 10000) {
          await stall(2000);
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
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const row = document.querySelectorAll('div[class="items"] div[class="tile_group"]');
    for (let index = 0; index < row.length; index++) {
      const element = row[index];
      console.log(element);
      console.log(index);
      const array = element.children;
      for (let ind = 0; ind < array.length; ind++) {
        const innerElement = array[ind];
        const attValue = innerElement.getAttribute('data-tile');
        if (!document.getElementById(`pd_row${attValue}`)) {
          addHiddenDiv(`pd_row${attValue}`, '');
        }
        document.querySelector(`div[id="pd_row${attValue}"]`).appendChild(innerElement);
      }
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    transform: transform,
    domain: 'lowes.com',
    zipcode: '',
  },
  implementation,
};
