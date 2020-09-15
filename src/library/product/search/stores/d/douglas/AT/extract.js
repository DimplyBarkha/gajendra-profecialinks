const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    const searchTerm = window.location.href.split('q=')[1];
    console.log('searchTerm = ' + searchTerm);
    const response = await fetch(`https://www.douglas.at/jsapi/v2/products/search?pageSize=48&query=${searchTerm}&fields=FULL&crealyticsSpaEnabled=false`);
    console.log(response);
    const getProductDetails = await response.json();
    const productDetails = getProductDetails.products;
    productDetails.forEach(item => {
      if (item.baseProductName) {
        document.querySelectorAll('a.product-tile__main-link').forEach(val => {
          const link = val.getAttribute('href');
          console.log('link = ' + link);
          console.log('url = ' + item.baseProductUrl);
          if (link === item.baseProductUrl) {
            val.setAttribute('averagerating', item.averageRating);
            val.setAttribute('numberofreviews', item.numberOfReviews);
            val.setAttribute('ratingstars', item.ratingStars);
            val.setAttribute('baseproductname', item.baseProductName);
            val.setAttribute('images', item.images[0].url);
            val.setAttribute('price', item.price.formattedValue);
            val.setAttribute('gtin', item.code);
          };
        });
      };
    });
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'douglas',
    transform,
    domain: 'douglas.at',
    zipcode: '',
  },
  implementation,
};
