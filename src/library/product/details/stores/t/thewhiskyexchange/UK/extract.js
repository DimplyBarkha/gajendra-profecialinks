const { transform } = require('../../../../shared');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    var prodImg = document.querySelector(
      'div[class="product-main__image-container"] img[class="product-slider__image lazyloaded"]'
    );
    
    if (prodImg !== null){
      var prodImgAttr = prodImg.getAttribute('src')
      var prodContainer = document.querySelector('div[class="product-main__image-container"]')
      prodContainer.setAttribute('img_url', prodImgAttr);
    }
    else{
      var prodImgAttr = document.querySelector(
        'div[class="product-main__image-container"] img'
      ).getAttribute('src');
      var prodContainer = document.querySelector('div[class="product-main__image-container"]')
      prodContainer.setAttribute('img_url', prodImgAttr);
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'thewhiskyexchange',
    transform: transform,
    domain: 'thewhiskyexchange.com',
    zipcode: '',
  },
  implementation,
};
