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
  };
  await applyScroll(context);
  await context.evaluate(() => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    const a = document.querySelector('div form[id*="buy_block"] p input:nth-child(2)').getAttribute('value');
    console.log(a);
    const a1 = a.concat('-');
    const mainDataObj = window.rcTagManagerLib.getInstance.productsListCache[a1.concat('0')].ean13;
    console.log(mainDataObj);
    if (mainDataObj) {
      addElementToDocument('gtin', mainDataObj);
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'campoluzenoteca',
    transform: null,
    domain: 'campoluzenoteca.com',
    zipcode: '',
  },
<<<<<<< HEAD
  implementation,
=======
>>>>>>> fb6112b7a7d102156d8ceac379d24f75b33983c4
};
