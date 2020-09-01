// const { transform } = require('../../../../shared');
const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'sephora',
    transform,
    domain: 'sephora.com',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { domain, transform } = parameters;
  const { productDetails } = dependencies;
  var jsonText = await context.evaluate(function () {
    return document.body.innerText;
  });
  const json = JSON.parse(jsonText);

  if (json && json.products && json.totalProducts) {
    await context.evaluate(function (domain, products, cnt) {
      function addHiddenDiv (id, content, parentDiv = null) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        if (!content) content = '';
        newDiv.textContent = content;
        // newDiv.style.display = 'none';
        if (parentDiv) {
          parentDiv.appendChild(newDiv);
        } else {
          document.body.appendChild(newDiv);
        }
        return newDiv;
      }
      document.body.innerText = '';
      addHiddenDiv('totalProducts', cnt);
      addHiddenDiv('ii_url', window.location.href);
      for (let i = 0; i < products.length; i++) {
        const newDiv = addHiddenDiv('ii_product', '');
        const product = products[i];
        if (product && product.currentSku) {
          addHiddenDiv('ii_brand', product.brandName, newDiv);
          addHiddenDiv('ii_id', product.currentSku.skuId, newDiv);
          addHiddenDiv('ii_title', `${product.brandName} - ${product.productName}`, newDiv);
          addHiddenDiv('ii_productUrl', `https://${domain}${product.targetUrl}?preferedSku=${product.currentSku.skuId}`, newDiv);
          var price = product.currentSku.salePrice ? product.currentSku.salePrice : (product.currentSku.listPrice ? product.currentSku.listPrice.split('-')[0].trim() : '');

          addHiddenDiv('ii_price', price, newDiv);
          addHiddenDiv('ii_image', product.heroImage, newDiv);
          addHiddenDiv('ii_reviews', product.reviews, newDiv);
          if (product.rating) {
            const rating = parseFloat(product.rating);
            const adjusted = rating.toPrecision(2);
            addHiddenDiv('ii_rating', adjusted, newDiv);
          }
        }
      }
    },domain , json.products, json.totalProducts);
  }
  return await context.extract(productDetails, { transform });
}