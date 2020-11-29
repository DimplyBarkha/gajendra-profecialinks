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

    const itemContainers = document.querySelectorAll('#search-grid_0 > div.row.gutters-items-v2.grid-wrapper.product-grid-v2 > product-item-v2');
    let rank = 1;
    for (const itemContainer of itemContainers) {
      console.log(itemContainer);
      const totalRank = itemContainer + rank;
      addHiddenDiv(itemContainer, 'rank', totalRank);
      rank++;
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'tomthumb',
    transform: null,
    domain: 'tomthumb.com',
    zipcode: '75023',
  },
  implementation,
};
