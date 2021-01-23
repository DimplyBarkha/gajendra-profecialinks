const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'interdiscount',
    transform,
    domain: 'interdiscount.ch',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    try{
      context.waitForXPath(`//h2/p[contains(text(),'Produktmerkmale')]/ancestor::h2/following-sibling::div`);
      console.log("we have enhanced content loaded");
    } catch(error){
      console.log("we got some error",error.message);
    }
    await context.evaluate(async function () {
      async function infiniteScroll () {
        let prevScroll = document.documentElement.scrollTop;
        while (true) {
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
        break;
        }
        prevScroll = currentScroll;
        }
        }
        await infiniteScroll();
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      let skuNumber = document.evaluate('//span[contains(text(),"Online-Artikel-Nr")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      // @ts-ignore
      skuNumber = skuNumber ? skuNumber.innerText.match(/\d+/)[0] : '';
      if (skuNumber) {
        // @ts-ignore
        const dataObj = window.__INITIAL_STATE__.products[skuNumber];
        console.log(dataObj);
        try {
          if (dataObj) {
            if (dataObj.productVariants) {
              dataObj.productVariants[0].options && addElementToDocument('pd_firstVariant', dataObj.productVariants[0].options[0].product.code);
            }
            dataObj.ean && addElementToDocument('pd_gtin', dataObj.ean);
            dataObj.code && addElementToDocument('pd_sku', dataObj.code);
            dataObj.ratings && addElementToDocument('pd_aggregateRating', dataObj.ratings.ratingAvg);
            const reviewArr = dataObj.reviewDistribution;
            let ratCount = 0;
            for (let i = 1; i <= 5; i++) { ratCount += reviewArr[i]; }
            // dataObj.ratings && addElementToDocument('pd_ratingCount', dataObj.ratings.ratingCount);
            // dataObj.ratings && addElementToDocument('pd_ratingCount', dataObj.ratings.ratingCount);
            if (ratCount !== 0) addElementToDocument('pd_ratingCount', ratCount);
            const image = dataObj.customImageData ? dataObj.customImageData[0].sizes.pop() : '';
            image && addElementToDocument('pd_image', `https://www.interdiscount.ch/${image.url}`);
            const alternateImages = dataObj.customImageData;
            alternateImages.shift();
            alternateImages && alternateImages.length && alternateImages.forEach(element => {
              const currrentImage = element.sizes.pop();
              image && addElementToDocument('pd_alternateImages', `https://www.interdiscount.ch/${currrentImage.url}`);
            });
            dataObj.productPriceData && dataObj.productPriceData.insteadPrice && addElementToDocument('pd_listPrice', dataObj.productPriceData.insteadPrice.value);
            dataObj.productPriceData && dataObj.productPriceData.finalPrice && addElementToDocument('pd_price', dataObj.productPriceData.finalPrice.value);
            dataObj.manufacturer && addElementToDocument('pd_manufacturer', dataObj.manufacturer);
            if (dataObj.productVariants) {
              addElementToDocument('pd_variantCount', dataObj.productVariants[0].options.length);
              dataObj.productVariants[0].options.forEach(item => {
                addElementToDocument('pd_variants', item.product.code);
              });
            }
          }
        } catch (error) {
          console.log('Adding element to Dom Failed!!');
        }
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
