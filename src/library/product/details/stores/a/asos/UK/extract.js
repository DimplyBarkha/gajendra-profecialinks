async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.waitForSelector('button[aria-label*="video"]', { timeout: 20000 });
    await context.click('button[aria-label*="video"]');
    await context.waitForSelector('video[class*="amp-page amp-video-element"] > source[type*="mp4"]', { timeout: 30000 });
    console.log('video loaded successfully')
  } catch (e) {
    console.log('not able to load the video')
  }
  await context.evaluate(async () => {
    const urlElement = document.querySelector('meta[property="og:url"]');
    const url = urlElement && urlElement.getAttribute('content');
    const id = url.replace(/(.+)(\/prd\/)(\d+)/g, '$3');
    const apiLink = `https://www.asos.com/api/product/catalogue/v3/stockprice?productIds=${id}&store=ROW&currency=GBP&keyStoreDataversion=j42uv2x-26`
    const response = await fetch(apiLink);
    const responseData = await response.json();
    const rpc = responseData[0].productCode;
    const variantIdarray = [];
    const sizeArray = [];
    const skuArray = [];
    const availabilityArray = [];
    if (responseData && responseData[0].variants) {
      responseData[0].variants.forEach((element) => {
        variantIdarray.push(element.variantId);
        skuArray.push(element.sku);
      })
    }
    if (responseData && responseData[0].variants) {
      responseData[0].variants.forEach((element) => {
        if (element.isInStock == true) {
          availabilityArray.push('In Stock');
        } else {
          availabilityArray.push('Out of Stock');
        }
      })
    }
    const data = window.asos.pdp.config.product;
    const compareVariantArray = [];
    const compareSizeArray = [];
    if (data && data.variants) {
      data.variants.forEach((element) => {
        compareSizeArray.push(element.size);
        compareVariantArray.push(element.variantId)
      })
    }
    const actualSizeArray = []
    variantIdarray.forEach((element, index) => {
      compareVariantArray.forEach((element1, index1) => {
        if (element === element1) {
          actualSizeArray.push(compareSizeArray[index1])
        }
      })
    })
    const variantData = window.asos.pdp.config.product;
    const brand = variantData && variantData.brandName;
    const variantColour = [];
    if (variantData && variantData.variants) {
      variantData.variants.forEach((element) => {
        variantColour.push(element.colour);
        sizeArray.push(element.size);
      });
    }
    const uniqueVariantColours = [...new Set(variantColour)]
    const imageData = window.asos.pdp.config.product;
    const compareImageArray = [];
    const compareColourArray = [];
    if (imageData && imageData.images) {
      imageData.images.forEach((element) => {
        compareImageArray.push(element.url);
        compareColourArray.push(element.colour);
      })
    }
    const actualImageArray = [];
    if (uniqueVariantColours.length && compareColourArray.length && compareImageArray) {
      uniqueVariantColours.forEach((element, index) => {
        compareColourArray.forEach((element1, index1) => {
          if (element === element1) {
            actualImageArray.push(compareImageArray[index1])
          }
        })
      })
    }
    const videoDiv = document.querySelector('video[class*="amp-page amp-video-element"] > source[type*="mp4"]');
    const videoUrl = videoDiv && videoDiv.getAttribute('src');
    const ratingData = window.asos.pdp.config.ratings;
    const rating = ratingData && ratingData.averageOverallRating;
    const review = ratingData && ratingData.totalReviewCount;
    // const outOfStock = document.querySelector('h3[class*="out-of-stock"]');
    // if (outOfStock.innerText.toLowerCase() == 'out of stock') {
    variantIdarray.forEach((element, index) => {
      const variantDiv = document.createElement('div');
      variantDiv.className = 'variantinfo';
      variantDiv.style.display = 'none';
      variantDiv.innerText = actualSizeArray[index];
      variantDiv.setAttribute('upc', variantIdarray[index]);
      variantDiv.setAttribute('sku', skuArray[index]);
      variantDiv.setAttribute('rpc', rpc);
      variantDiv.setAttribute('colour', variantColour[index]);
      variantDiv.setAttribute('brand', brand);
      variantDiv.setAttribute('rating', rating);
      variantDiv.setAttribute('review', review);
      variantDiv.setAttribute('videourl', videoUrl);
      variantDiv.setAttribute('availability', availabilityArray[index]);
      variantDiv.setAttribute('image', actualImageArray[index]);
      document.body.append(variantDiv);
    })
    // } else {
    //   const appendElements = document.querySelectorAll('select[data-id*="sizeSelect"] > option:not(:first-child)');
    //   appendElements.forEach((element, index) => {
    //     element.setAttribute('upc', variantIdarray[index]);
    //     element.setAttribute('sku', skuArray[index]);
    //     element.setAttribute('rpc', rpc);
    //     element.setAttribute('colour', variantColour[index]);
    //     element.setAttribute('brand', brand);
    //     element.setAttribute('rating', rating);
    //     element.setAttribute('review', review);
    //     element.setAttribute('videourl', videoUrl);
    //     element.setAttribute('availability', availabilityArray[index]);
    //   })
    // }
  })
  return await context.extract(productDetails, { transform });
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
