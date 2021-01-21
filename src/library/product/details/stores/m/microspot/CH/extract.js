const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'microspot',
    transform,
    domain: 'microspot.ch',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    try {
      await context.click('._3tGEA8 a');
    } catch (error) {
      console.log('no more description');
    }
    try {
      await context.click('._3BsNnh');
    } catch (error) {
      console.log('no more specification');
    }
    try {
      await context.click('._2EBsf2');
      await context.click('._3BsNnh');
    } catch (error) {
      console.log('details missing');
    }
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const productKey = window.location.href.replace(/(.*)--p(\d+)/gm, '$2');
      try {
        if (productKey) {
          // @ts-ignore
          const dataObj = JSON.parse(document.querySelector('script#INITIAL_STATE').innerText.trim()).products[productKey];
          if (dataObj) {
            dataObj.ean && addElementToDocument('gtin', dataObj.ean);
            dataObj.productPriceData && dataObj.productPriceData.insteadPrice && addElementToDocument('pd_listPrice', dataObj.productPriceData.insteadPrice.value);
            dataObj.productPriceData && dataObj.productPriceData.finalPrice && addElementToDocument('pd_price', dataObj.productPriceData.finalPrice.value);
            dataObj.manufacturer && addElementToDocument('pd_manufacturer', dataObj.manufacturer);
            if (dataObj.productVariants) {
              addElementToDocument('pd_variantCount', dataObj.productVariants[0].options.length);
              dataObj.productVariants[0].options && addElementToDocument('pd_firstVariant', dataObj.productVariants[0].options[0].product.code);
              dataObj.productVariants[0].options.forEach(item => {
                addElementToDocument('pd_variants', item.product.code);
              });
            }
            const image = dataObj.customImageData ? dataObj.customImageData[0].sizes.pop() : '';
            image && addElementToDocument('pd_image', `https://www.microspot.ch${image.url}`);
            const alternateImages = dataObj.customImageData;
            alternateImages.shift();
            alternateImages && alternateImages.length && alternateImages.forEach(element => {
              const currrentImage = element.sizes.pop();
              image && addElementToDocument('pd_alternateImages', `https://www.microspot.ch${currrentImage.url}`);
            });
          }
        }
      } catch (error) {
        console.log('add element to document failed!!');
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });

    await context.waitForXPath('//h3[@class="_3L3q2V _3ZjYJW _2zLas_"]/div');
  },
};
