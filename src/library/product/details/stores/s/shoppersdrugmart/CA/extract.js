const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'shoppersdrugmart',
    transform,
    domain: 'shoppersdrugmart.ca',
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

    await new Promise(resolve => setTimeout(resolve, 2000));

    const variantCount = await context.evaluate(async function () {
      return document.querySelectorAll('div.swatches-group > ul > li').length;
    });

    await context.extract(productDetails, { transform: transform });
    for (let index = 1; index <= variantCount; index++) {
      try {
        await context.click(`div.swatches-group > ul > li:nth-child(${index}):not(.active)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (variantCount !== index) {
          await context.extract(productDetails, { type: 'APPEND', transform });
        } else {
          return await context.extract(productDetails, { type: 'APPEND', transform });
        }
      } catch (error) {
        console.log('Error While itrerating over the variants', error);
      }
    }

    if (!variantCount) {
      const dropDownCount = await context.evaluate(async function () {
        return document.querySelectorAll('select[name="productCode"] option').length;
      });
      console.log('=====================', dropDownCount);
      for (let index = 1; index <= dropDownCount; index++) {
        try {
          await context.evaluate(async function (i) {
            const productCode = document.querySelector(`select[name="productCode"] option:nth-child(${i})`).value;
            const response = await fetch(`https://shop.shoppersdrugmart.ca/p/variant?productCode=${productCode}&qty=1`, {
              headers: {
                'content-type': 'application/json',
              },
              method: 'GET',
            });
            const jsonData = await response.json();
            document.querySelector('div.product-detail-header div.item-product-price span').innerHTML = jsonData.regularPrice;
            document.querySelector('div.pr-snippet-rating-decimal').innerHTML = (jsonData.starRating / 20).toString();
            document.querySelector('div.product-detail-header div.pr-snippet-read-and-write a.pr-snippet-review-count').innerHTML = jsonData.reviewCount;
            document.querySelector('div#stock_status') && document.querySelector('div#stock_status').remove();
            const status = document.createElement('div');
            status.setAttribute('id', 'stock_status');
            if (jsonData.outOfStock) {
              status.setAttribute('class', 'disable');
            } else {
              status.setAttribute('class', 'active');
            }
            document.querySelector('body').append(status);
            document.querySelector('div#product-variant-id').setAttribute('data-product-id', productCode);

            document.querySelector('div#api_all_images') && document.querySelector('div#api_all_images').remove();
            const allImges = document.createElement('div');
            allImges.setAttribute('id', 'api_all_images');
            jsonData.productImages.images.forEach(element => {
              const img = document.createElement('img');
              img.setAttribute('class', 'img_from_api');
              img.setAttribute('src', element.medium2x);
              allImges.append(img);
            });
            document.querySelector('body').append(allImges);

            document.querySelector('div#product_url') && document.querySelector('div#product_url').remove();
            const div = document.createElement('div');
            div.setAttribute('id', 'product_url');
            div.setAttribute('url', jsonData.productUrl);
            document.querySelector('body').append(div);
          }, index);
          if (dropDownCount !== index) {
            await context.extract(productDetails, { type: 'APPEND', transform });
          } else {
            return await context.extract(productDetails, { type: 'APPEND', transform });
          }
        } catch (error) {
          console.log('Error While itrerating over the variants', error);
        }
      }
    }
  },
};
