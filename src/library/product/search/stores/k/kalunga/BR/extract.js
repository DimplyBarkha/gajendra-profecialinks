const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'kalunga',
    transform: transform,
    domain: 'kalunga.com.br',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(() => {
      function addHiddenDiv (className, content, index) {
        console.log(`className: ${className}, content: ${content}, index: ${index}`);
        const newDiv = document.createElement('div');
        newDiv.classList.add(className);
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div.blocoproduto')[index];
        // originalDiv.parentNode.insertBefore(newDiv, originalDiv);
        if (!originalDiv.querySelector(`.${className}`)) {
          originalDiv.appendChild(newDiv);
        }
      }

      const products = document.querySelectorAll('div.blocoproduto');

      products.forEach((product, index) => {
        // Gets aggregate rating
        const aggregateRating = product.querySelector('span.reviews__star_text').innerHTML.match(/\d/g);
        addHiddenDiv('kalunga_aggregateRating', aggregateRating, index);

        //Gets product url
        const productUrl = product.querySelector('a.blocoproduto__link').href
        addHiddenDiv('kalunga_productUrl', productUrl, index);

        // Gets product sku
        const sku = productUrl.split('/').pop();
        addHiddenDiv('kalunga_sku', sku, index);

      });
    });

    return await context.extract(productDetails, { transform });
  },
};
