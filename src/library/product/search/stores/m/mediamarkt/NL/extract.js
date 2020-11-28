const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.nl',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addHiddenDiv (className, content, index) {
        const newDiv = document.createElement('div');
        newDiv.classList.add(className);
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div.product-wrapper')[index];
        // originalDiv.parentNode.insertBefore(newDiv, originalDiv);
        if (!originalDiv.querySelector(`.${className}`)) {
          originalDiv.appendChild(newDiv);
        }
      }
      const product = document.querySelectorAll('div.product-wrapper');
      for (let i = 0; i < product.length; i++) {
        // Gets aggregate rating
        const aggregateRating = product[i].querySelector('a.rating').classList[1].match(/\d/g);
        let rating = +aggregateRating[0];
        rating += aggregateRating[1] ? 0.5 : 0;
        addHiddenDiv('mm_aggregateRating', product[i].querySelector('a.rating>div').classList.value.replace('value-', ''), i);

        // Gets rating count
        const reviewCount = product[i].querySelector('a.rating + a');
        addHiddenDiv('mm_reviewCount', reviewCount.textContent.trim().match(/\d*/g)[1], i);

        // Gets thumbnail
        const thumbnail = `https:${product[i].querySelector('a.photo img').attributes.src.value}`;
        addHiddenDiv('mm_thumbnail', thumbnail, i);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
