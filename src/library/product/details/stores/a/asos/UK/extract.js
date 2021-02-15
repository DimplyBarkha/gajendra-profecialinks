async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const productPage = await context.evaluate(() => {
    return document.querySelector('section[class*="core-product"]');
  });
  if (productPage) {
    try {
      await context.waitForSelector('button[aria-label*="video"]', { timeout: 20000 });
      await context.click('button[aria-label*="video"]');
      await context.waitForSelector('video[class*="amp-page amp-video-element"] > source[type*="mp4"]', { timeout: 30000 });
      console.log('video loaded successfully');
    } catch (e) {
      console.log('not able to load the video');
    }
    await context.evaluate(async () => {
    // @ts-ignore
      const apiLink = 'https://www.asos.com' + window.asos.pdp.config.stockPriceApiUrl;
      const response = await fetch(apiLink);
      const responseData = await response.json();
      console.log('Variant-ID', responseData);
      const rpc = responseData && responseData[0].productCode;
      const variantIdarray = [];
      const sizeArray = [];
      const skuArray = [];
      const availabilityArray = [];
      if (responseData && responseData[0].variants) {
        responseData[0].variants.forEach((element) => {
          variantIdarray.push(element.variantId);
          skuArray.push(element.sku);
        });
      }
      if (responseData && responseData[0].variants) {
        responseData[0].variants.forEach((element) => {
          if (element.isInStock === true) {
            availabilityArray.push('In Stock');
          } else {
            availabilityArray.push('Out of Stock');
          }
        });
      }
      // @ts-ignore
      const data = window && window.asos && window.asos.pdp && window.asos.pdp.config && window.asos.pdp.config.product;
      const compareVariantArray = [];
      const compareSizeArray = [];
      if (data && data.variants) {
        data.variants.forEach((element) => {
          compareSizeArray.push(element.size);
          compareVariantArray.push(element.variantId);
        });
      }
      const actualSizeArray = [];
      // @ts-ignore
      variantIdarray.forEach((element, index) => {
        compareVariantArray.forEach((element1, index1) => {
          if (element === element1) {
            actualSizeArray.push(compareSizeArray[index1]);
          }
        });
      });
      // @ts-ignore
      const variantData = window && window.asos && window.asos.pdp && window.asos.pdp.config && window.asos.pdp.config.product;
      const brand = variantData && variantData.brandName;
      const variantColour = [];
      if (variantData && variantData.variants) {
        variantData.variants.forEach((element) => {
          variantColour.push(element.colour);
          sizeArray.push(element.size);
        });
      }
      // @ts-ignore
      const uniqueVariantColours = [...new Set(variantColour)];
      // @ts-ignore
      const imageData = window && window.asos && window.asos.pdp && window.asos.pdp.config && window.asos.pdp.config.product;
      const compareImageArray = [];
      const compareColourArray = [];
      if (imageData && imageData.images) {
        imageData.images.forEach((element) => {
          compareImageArray.push(element.url);
          compareColourArray.push(element.colour);
        });
      }
      const actualImageArray = [];
      if (uniqueVariantColours.length && compareColourArray.length && compareImageArray) {
      // @ts-ignore
        uniqueVariantColours.forEach((element, index) => {
          compareColourArray.forEach((element1, index1) => {
            if (element === element1) {
              actualImageArray.push(compareImageArray[index1]);
            }
          });
        });
      }
      const playButton = document.querySelector('.interactives button[aria-label*="video"]');
      if (playButton) {
      // @ts-ignore
        playButton.click();
      }

      const videoDiv = document.querySelector('video[class*="amp-page amp-video-element"] > source[type*="mp4"]');
      const videoUrl = videoDiv && videoDiv.getAttribute('src');
      // @ts-ignore
      const ratingData = window.asos.pdp.config.ratings;
      const rating = ratingData.averageOverallRating;
      const review = ratingData.totalReviewCount;
      const temp = variantIdarray;
      const allVariants = temp.join(' | ');
      // @ts-ignore
      variantIdarray.forEach((element, index) => {
        const variantDiv = document.createElement('div');
        variantDiv.className = 'variantinfo';
        variantDiv.style.display = 'none';
        variantDiv.innerText = actualSizeArray[index];
        variantDiv.setAttribute('sku', skuArray[index]);
        variantDiv.setAttribute('rpc', rpc);
        variantDiv.setAttribute('colour', variantColour[index]);
        variantDiv.setAttribute('brand', brand);
        if (rating !== 'undefined') {
          variantDiv.setAttribute('rating', rating);
        }
        if (review !== 'undefined') {
          variantDiv.setAttribute('review', review);
        }
        if (videoUrl !== null) {
          variantDiv.setAttribute('videourl', videoUrl);
        }
        variantDiv.setAttribute('availability', availabilityArray[index]);
        variantDiv.setAttribute('image', actualImageArray[index]);
        variantDiv.setAttribute('all-variants', allVariants);
        document.body.append(variantDiv);
      });
    });

    return await context.extract(productDetails, { transform });
  } else {
    console.log('Not a product page');
  }
}
const { cleanUp } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'asos',
    transform: cleanUp,
    domain: 'asos.com',
    zipcode: '',
  },
  implementation,
};
