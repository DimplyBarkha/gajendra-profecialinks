
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'tesco',
    transform: null,
    domain: 'tesco.com',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      // Get additional product info
      const productInfo = Array.from(document.querySelectorAll('[class^="product-info-block product-info-block--"]')).map(elm => {
        if (elm.querySelector('h3')) {
          const key = elm.querySelector('h3').innerText;
          const value = elm.querySelector('ul,p').textContent.trim();
          return `${key}: ${value}`;
        }
      }).filter(elm => elm);
      document.body.setAttribute('additional_product_info', productInfo.join('|'));

      // Get Ingredients
      const ingredientList =
        (document.querySelector('#ingredients > p') &&
          document.querySelector('#ingredients > p').textContent.trim().replace(/INGREDIENTS:/i, '')
            .split(/[,\n]/)
            .filter((elm) => elm)
            .join('|')) ||
        '';
      document.body.setAttribute('ingredient_list', ingredientList);
    });
    await context.extract(productDetails);
  },
};
