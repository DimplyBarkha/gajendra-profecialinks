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
    await context.evaluate(async function () {
      const addHiddenDiv = (id, content, container) => {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        container.appendChild(newDiv);
      };
      const products = document.querySelectorAll('.catalog-grid_item');
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
      for (let i = 0; i < productRatings.length; i++) {
        addHiddenDiv('import-product-rating', productRatings[i], products[i]);
      }
    });
    return await context.extract(data, { transform });
  },
};
