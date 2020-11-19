const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'petlove',
    transform: cleanUp,
    domain: 'petlove.com.br',
    zipcode: '',
  },
  implementation: async ({ id }, parameters, context, { productDetails, transform }) => {
    const variantsTotal = await context.evaluate(async () => document.querySelectorAll('div.box-variants label.radio-button-item > div').length);
    const iterations = variantsTotal || 1;
    for (let i = 0; i < iterations; i++) {
      if (variantsTotal > 1) {
        await context.evaluate(
          async ({ i }) => {
            document.querySelectorAll('div.box-variants label.radio-button-item > div')[i].click();
            await new Promise((resolve) => setTimeout(resolve, 500));
          },
          { i },
        );
      }
      await context.evaluate(
        async ({ i, variantsTotal }) => {
          const variantElem = document.querySelectorAll('div.box-variants label.radio-button-item > div')[i];

          const allImages = document.querySelectorAll('div#product-carousel div > div > img');
          const alternateImagesList = document.createElement('ol');
          alternateImagesList.id = 'alternate_images';
          alternateImagesList.style.display = 'none';
          for (let j = 0; j < allImages.length; j++) {
            const listItem = document.createElement('li');
            const image = allImages[j];
            listItem.setAttribute('image', image.getAttribute('src'));
            listItem.setAttribute('image_alt', image.getAttribute('alt'));
            alternateImagesList.appendChild(listItem);
          }
          variantElem.appendChild(alternateImagesList);

          const allVideos = document.querySelectorAll('div#product-carousel div > div div.youtube iframe');
          const videosList = document.createElement('ol');
          videosList.id = 'videos';
          videosList.style.display = 'none';
          for (let j = 0; j < allVideos.length; j++) {
            const listItem = document.createElement('li');
            const video = allVideos[j];
            listItem.setAttribute('video', `https:${video.getAttribute('data-lazy')}`);
            videosList.appendChild(listItem);
          }
          variantElem.appendChild(videosList);

          const brand = document.querySelector('div.breadcrumb li.brand span') ? document.querySelector('div.breadcrumb li.brand span').textContent : '';
          const name = document.querySelector('h1[itemprop="name"]') ? document.querySelector('h1[itemprop="name"]').textContent : '';
          const listPrice = document.querySelector('div.product-info div:not([class]) div.variant-list-price')
            ? document.querySelector('div.product-info div:not([class]) div.variant-list-price').textContent
            : '';
          const price = document.querySelector('div.product-info div:not([class]) div.product-price') ? document.querySelector('div.product-info div:not([class]) div.product-price').textContent : '';
          const availabilityText = document.querySelector('div.box-variants div.label-stock') ? document.querySelector('div.box-variants div.label-stock').textContent : '';
          const couponText = document.querySelector('div.product-info div.flag') ? document.querySelector('div.product-info div.flag').textContent : '';

          variantElem.setAttribute('product_name', name);
          variantElem.setAttribute('brand', brand);
          variantElem.setAttribute('name_extended', [brand, name].join(' - '));
          variantElem.setAttribute('variant_count', variantsTotal);
          variantElem.setAttribute('list_price', listPrice);
          variantElem.setAttribute('price', price);
          variantElem.setAttribute('availability_text', availabilityText);
          variantElem.setAttribute('coupon_text', couponText);
        },
        { i, variantsTotal },
      );
    }
    await context.extract(productDetails, { transform });
  },
};
