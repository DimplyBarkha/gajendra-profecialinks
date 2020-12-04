const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await context.evaluate(async function () {
    const vueScript = document.evaluate("//script[contains(text(), 'VueStore')]", document, null, XPathResult.STRING_TYPE, null);
    const allProducts = document.querySelectorAll('div.product.responsive');
    if (vueScript.stringValue) {
      // Create ID from VueScript
      const regexID = /kodikos":"(\d+)/g;
      const foundUrl = vueScript.stringValue.match(regexID);
      const foundIDArray = [];
      foundUrl.forEach(element => {
        const foundID = element.match(/(\d+)/);
        foundIDArray.push(foundID[1]);
      });
      // Create AggregateRating
      const regexRating = /rating_score":([\d.]+)/g;
      const foundRating = vueScript.stringValue.match(regexRating);
      const foundRatingArray = [];
      foundRating.forEach(element => {
        const foundNumber = element.match(/([\d.]+)/);
        foundRatingArray.push(foundNumber[1]);
      });
      // Add ID to products and URL
      let x = 0;
      allProducts.forEach(element => {
        const div = element.querySelector('div');
        div.setAttribute('productid', foundIDArray[x]);
        div.setAttribute('producturl', `https://www.e-fresh.gr/el/product/${foundIDArray[x]}`);
        if (foundRatingArray[x] !== '0') {
          div.setAttribute('aggregaterating', foundRatingArray[x]);
        }
        x += 1;
      });
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'GR',
    store: 'e-fresh',
    transform,
    domain: 'e-fresh.gr',
    zipcode: '',
  },
  implementation,
};
