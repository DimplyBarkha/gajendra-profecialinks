// @ts-nocheck
const { transform } = require('../../../../shared');

const implementation = async (inputs, parameters, context, dependencies) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    const addDiv = (className, content, productDiv) => {
      const newDiv = document.createElement('div');
      // @ts-ignore
      newDiv.classList.add(className);
      newDiv.innerHTML = content;
      // @ts-ignore
      productDiv.appendChild(newDiv);
    };

    const allProducts = document.querySelectorAll('div.product-container');
    allProducts.forEach((product) => {
      let rating;
      const aggregateRating = product.querySelector('div.ratings > div.rating-box');
      if (aggregateRating.children.length > 0) {
        const ratingChild = aggregateRating.children[0];
        // @ts-ignore
        const width = ratingChild.style.width;
        // @ts-ignore
        const numberFromWidth = width.match(/\d+/);
        const ratingWithPoint = numberFromWidth / 20;
        const ratingAsString = ratingWithPoint.toString();
        rating = ratingAsString.replace('.', ',');
      } else {
        rating = '';
      }
      addDiv('aggregateRating', rating, product);

      const ratingCountNum = product.querySelector('div.ratings > span').innerHTML;
      const ratingCount = ratingCountNum.match(/\d+/);
      addDiv('ratingCount', ratingCount, product);
    });
  });
  const addSearchUrl = async function (context) {
    await context.evaluate(async () => {
      const productList = document.querySelectorAll('.products-list div[class="products small-product"]');
      const url = window.location.href;
      productList.forEach((product) => product.setAttribute('searchurl', url));
    });
  };
  await addSearchUrl(context);
  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'easyparapharmacie',
    transform,
    domain: 'easyparapharmacie.com',
    zipcode: '',
  },
  implementation,
};
