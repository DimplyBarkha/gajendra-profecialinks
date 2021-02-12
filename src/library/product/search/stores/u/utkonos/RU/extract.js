const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'utkonos',
    transform,
    domain: 'utkonos.ru',
    zipcode: "''",
  },
  implementation: async (inputs, { transform }, context, { productDetails: data }) => {
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
    await new Promise(resolve => setTimeout(resolve, 10000));
    await applyScroll(context);
    await context.evaluate(async function () {
      const addHiddenDiv = (id, content, container) => {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        container.appendChild(newDiv);
      };
      const products = document.querySelectorAll('.catalog-grid__item');
      const ratings = document.querySelectorAll('.ui-rating');
      const productRatings = [];
      for (let i = 0; i < ratings.length; i++) {
        let rating = 0;
        for (let j = 0; j < 5; j++) {
          const node = ratings[i].children[j].firstChild;
          if (node.classList.contains("on")) {
            rating++;
          }
        }
        productRatings.push(rating);
      }
      for (let i = 0; i < products.length; i++) {
        addHiddenDiv('import-product-rating', productRatings[i], products[i]);
        addHiddenDiv('import-search-url', location.href, products[i]);
      }
    });
    return await context.extract(data, { transform });
  },
};
