const { transform } = require('../../../../shared')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    transform,
    domain: 'pokupki.market.yandex.ru',
    zipcode: '',
  },
  implementation
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll("div.b_sEc13pK37d")[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
  // @ts-ignore
  let rc = document.querySelectorAll('div.b_sEc13pK37d')
  console.log(rc , 'op');
  rc.forEach((element , i) => {
    console.log(element.style.cssText.replace('width:', '').replace('%;', '')/20  , 'dio'
      );
      let name;
      name = element.style.cssText.replace('width:', '').replace('%;', '')/20
      addHiddenDiv('ii_name', name, i);

  });
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
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });
  return await context.extract(productDetails, { transform });
}
