
const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'tesco',
    transform,
    domain: 'tesco.com',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {

      const productInfo2 = Array.from(document.querySelectorAll('[class^="product-info-block product-info-block--"]')).map(elm => {
        if (elm.querySelector('h3')) {
          const key = elm.querySelector('h3').innerText;
          const value = elm.querySelector('ul,p').textContent.trim();
          return `${key}: ${value}`;
        }
      }).filter(elm => elm);
      document.body.setAttribute('additional_product_info2', productInfo2.join('|'));


      const productInfo = Array.from(document.querySelectorAll('#features > ul, #product-description > ul')).map(elm => elm.textContent).filter(elm => elm);
      document.body.setAttribute('additional_product_info', productInfo.join('|'));


      const ingredientList =
        (document.querySelector('#ingredients > p') &&
          document.querySelector('#ingredients > p').textContent.trim().replace(/INGREDIENTS:/i, '')
            .split(/[,\n]/)
            .filter((elm) => elm)
            .join('|')) ||
        '';
      document.body.setAttribute('ingredient_list', ingredientList);

    });

    //await context.waitForSelector('div.product-image__container');
    await new Promise(resolve => setTimeout(resolve, 8000));
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
