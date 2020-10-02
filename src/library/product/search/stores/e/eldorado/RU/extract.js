const { transform } = require('../format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'eldorado',
    transform: transform,
    domain: 'eldorado.ru',
    zipcode: '',
  },

  implementation: async (
    { url },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    await context.evaluate(async function () {
      const addHiddenDiv = (id, position, content) => {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        position.appendChild(newDiv);
      };
      const finalRatings = [];
      const node = document.evaluate(
        '//li[@data-dy="product"]//span[contains(@class, "tevqf5-0")]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
      );
      for (let i = 0; i < node.snapshotLength; i++) {
        const data = node.snapshotItem(i);
        let counter = 0;
        for (let j = 0; j < data.children.length; j++) {
          if (data.children[j].className.includes('bVtxqd')) {
            counter++;
          }
        }
        finalRatings.push(counter);
      }
      const newDiv = document.querySelectorAll('li[data-dy="product"]');
      finalRatings.forEach((rating, index) => {
        addHiddenDiv('average_rating', newDiv[index], rating);
      });
    });

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
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await new Promise((resolve, reject) => setTimeout(resolve, 15000));
    await applyScroll(context);
    return await context.extract(productDetails, { transform });
  },
};
