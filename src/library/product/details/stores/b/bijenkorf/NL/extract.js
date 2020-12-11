const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'bijenkorf',
    transform,
    domain: 'debijenkorf.nl',
    zipcode: '',
  },

  implementation: async (inputs, { country, domain, transform: transformParam }, context, { productDetails }) => {
    // const productDetailsLink = await context.evaluate(async function (inputs) {
    //   const productList = document.querySelectorAll('ul.productlist__list > li a');
    //   for (let i = 0; i < productList.length; i++) {
    //     const productRpc = productList[i].getAttribute('name');
    //     if (productRpc.includes(inputs.id) || productList.length === 1) {
    //       return productList[i].getAttribute('href');
    //     } else {
    //       return null;
    //     }
    //   }
    // }, inputs);

    // if (productDetailsLink) {
    //   const url = productDetailsLink;
    //   await context.goto(url, {
    //     timeout: 30000,
    //     waitUntil: 'load',
    //     checkBlocked: true,
    //     js_enabled: true,
    //     css_enabled: false,
    //     random_move_mouse: true,
    //   });
    // } else {
    //   const noProductsFound = await context.evaluate(function (inputs) {
    //     const noResults = document.querySelector('div.dbk-search-empty');
    //     return noResults;
    //   });
    //   if (noProductsFound) {
    //     // throw new Error('Product not found for the given input');
    //   }
    // }

    await context.evaluate(async function (inputs) {
      const specSpan = document.querySelector("button[data-at='expansion-panel-header--Specificaties'");
      if (specSpan) {
        // @ts-ignore
        specSpan.click();
      }
      const variantsList = document.querySelectorAll('ul.dbk-product-carousel--list li');
      if (variantsList.length > 0) {
        for (let i = 0; i < variantsList.length; i++) {
          if (i === 0) {
            await new Promise((resolve, reject) => setTimeout(resolve, 3000));
          }
          // @ts-ignore
          const variantToClick = variantsList[i].querySelector('div input');
          if (variantToClick) {
            // @ts-ignore
            variantToClick.click();
            await new Promise((resolve, reject) => setTimeout(resolve, 3000));
            const variantInfoSpan = document.querySelector('p.dbk-product-indicator span.dbk-product-indicator--value, span.dbk-product-indicator--value');

            if (variantInfoSpan) {
              const variantInfoEle = document.createElement('div');
              variantInfoEle.setAttribute('id', 'variantInfo');
              variantInfoEle.textContent = variantInfoSpan.textContent;
              variantInfoEle.style.visibility = 'hidden';
              variantsList[i].appendChild(variantInfoEle);
            }

            const skuInfoSpan = document.querySelector('span[itemprop="sku"]');

            if (skuInfoSpan) {
              const skuInfoEle = document.createElement('div');
              skuInfoEle.setAttribute('id', 'skuInfo');
              skuInfoEle.textContent = skuInfoSpan.textContent;
              skuInfoEle.style.visibility = 'hidden';

              variantsList[i].appendChild(skuInfoEle);
            }

            const availabilityInfo = document.querySelector('link[itemprop="availability"]');
            if (availabilityInfo) {
              const availabilityEle = document.createElement('div');
              availabilityEle.setAttribute('id', 'availabilityText');
              availabilityEle.textContent = availabilityInfo.getAttribute('href');
              availabilityEle.style.visibility = 'hidden';

              variantsList[i].appendChild(availabilityEle);
            }

            const images = document.querySelectorAll('div.dbk-image-gallery--display ul.dbk-image-carousel--list > li  img');
            const secondaryImageCountDiv = document.createElement('div');
            secondaryImageCountDiv.setAttribute('id', 'secondaryImageCount');
            secondaryImageCountDiv.textContent = (images.length - 1).toString();
            secondaryImageCountDiv.style.visibility = 'hidden';
            variantsList[i].appendChild(secondaryImageCountDiv);

            for (let j = 0; j < images.length; j++) {
              const variantImageDiv = document.createElement('div');
              variantImageDiv.setAttribute('id', 'variantImages');
              variantImageDiv.setAttribute('href', images[j].getAttribute('src'));
              variantImageDiv.setAttribute('alt', images[j].getAttribute('alt'));
              variantImageDiv.setAttribute('position', j.toString());
              variantImageDiv.style.visibility = 'hidden';
              variantsList[i].appendChild(variantImageDiv);
            }
          }
        }
      } else {
        const dummyUl = document.createElement('ul');
        dummyUl.setAttribute('class', 'dbk-product-carousel--list');
        const li = document.createElement('li');
        dummyUl.appendChild(li);
        const body = document.querySelector('body');
        body.appendChild(dummyUl);
      }
    });

    return await context.extract(productDetails, { transform: transformParam });
  },
};
