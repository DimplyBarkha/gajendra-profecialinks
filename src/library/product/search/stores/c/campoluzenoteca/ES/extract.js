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
    function addHiddenDiv (el, myClass, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', myClass);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      el.appendChild(newDiv);
    }
    const itemContainers = document.querySelectorAll('#center_column > ul > li');
    const arr = document.querySelectorAll('#center_column > ul > li');
    let rank = 1;
    let i = 0;
    for (const itemContainer of itemContainers) {
      console.log(itemContainer);
      const totalRank = itemContainer + rank;
      addHiddenDiv(itemContainer, 'rank', totalRank);
      rank++;
      const a = arr[i].getAttribute('data-id-product');
      console.log(a);
      addHiddenDiv(itemContainer, 'id', a);
      const a1 = a.concat('-');
      const b = arr[i].getAttribute('data-id-product-attribute');
      const mainDataObj = window.rcTagManagerLib.getInstance.productsListCache[a1.concat(b)].ean13;
      console.log(mainDataObj);
      if (mainDataObj) {
        addHiddenDiv(itemContainer, 'gtin', mainDataObj);
      }
      i++;
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'campoluzenoteca',
    transform: null,
    domain: 'campoluzenoteca.com',
    zipcode: '',
  },
  implementation,
};
