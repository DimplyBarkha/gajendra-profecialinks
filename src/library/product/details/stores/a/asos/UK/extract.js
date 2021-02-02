async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // await context.evaluate(()=>{
  //   document.querySelector('#buyTheLook').scrollIntoView();
  // });
  // await context.waitForSelector('section[aria-labelledby="reviewTitle"]')
  try {
    await context.waitForSelector('button[aria-label*="video"]', { timeout: 20000 });
    await context.click('button[aria-label*="video"]');
    await context.waitForSelector('video[class*="amp-page amp-video-element"] > source[type*="mp4"]', { timeout: 30000 });
    console.log('video loaded successfully');
  } catch (e) {
    console.log('not able to load the video');
  }
  await context.evaluate(async () => {
    const urlElement = document.querySelector('meta[property="og:url"]');
    const url = urlElement && urlElement.getAttribute('content');
    const id = url.replace(/(.+)(\/prd\/)(\d+)/g, '$3');
    console.log('ID', id);
    const apiLink = `https://www.asos.com/api/product/catalogue/v3/stockprice?productIds=${id}&store=ROW&currency=GBP&keyStoreDataversion=j42uv2x-26`;
    const response = await fetch(apiLink);
    const responseData = await response.json();
    console.log('Variant-ID',responseData);
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
    variantIdarray.forEach((element, index) => {
      compareVariantArray.forEach((element1, index1) => {
        if (element === element1) {
          actualSizeArray.push(compareSizeArray[index1]);
        }
      });
    });
    const variantData = window && window.asos && window.asos.pdp && window.asos.pdp.config && window.asos.pdp.config.product;
    const brand = variantData && variantData.brandName;
    const variantColour = [];
    if (variantData && variantData.variants) {
      variantData.variants.forEach((element) => {
        variantColour.push(element.colour);
        sizeArray.push(element.size);
      });
    }
    const uniqueVariantColours = [...new Set(variantColour)];
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
      uniqueVariantColours.forEach((element, index) => {
        compareColourArray.forEach((element1, index1) => {
          if (element === element1) {
            actualImageArray.push(compareImageArray[index1]);
          }
        });
      });
    }
    const videoDiv = document.querySelector('video[class*="amp-page amp-video-element"] > source[type*="mp4"]');
    const videoUrl = videoDiv && videoDiv.getAttribute('src');
    const ratingData = window.asos.pdp.config.ratings;
    const rating = ratingData.averageOverallRating;
    console.log('rating ', rating);
    const review = ratingData.totalReviewCount;
    console.log('Review ', review);
    // const outOfStock = document.querySelector('h3[class*="out-of-stock"]');
    // if (outOfStock.innerText.toLowerCase() == 'out of stock') {
     
        const array = window.location.href.split('/');
        console.log('URL array',array);
        let variant = array[array.length-1];
        console.log('Variant',variant);
    variantIdarray.forEach((element, index) => {
      const variantDiv = document.createElement('div');
      variantDiv.className = 'variantinfo';
      variantDiv.style.display = 'none';
      console.log('Variant-ID', variantIdarray[index]);
      variantDiv.innerText = actualSizeArray[index];
      if (variantIdarray[index] == variant){
      console.log("iNSIDE");  
      variantDiv.setAttribute('upc', variantIdarray[index]);
      console.log("UPC",variantIdarray[index]);  
      variantDiv.setAttribute('sku', skuArray[index]);
      console.log("Sku",skuArray[index]);  
      variantDiv.setAttribute('rpc', rpc);
      console.log("RPC",rpc);  
      variantDiv.setAttribute('colour', variantColour[index]);
      console.log("colour",variantColour[index]);  
      variantDiv.setAttribute('brand', brand);
      console.log("Brand", brand);  
      variantDiv.setAttribute('rating', rating);
      console.log("rating", rating);  
      variantDiv.setAttribute('review', review);
      console.log("Review", review);  
      variantDiv.setAttribute('videourl', videoUrl);
      console.log("videourl", videoUrl);  
      variantDiv.setAttribute('availability', availabilityArray[index]);
      console.log("Availability", availabilityArray[index]);  
      variantDiv.setAttribute('image', actualImageArray[index]);
      console.log("image", actualImageArray[index]);  
      document.body.append(variantDiv);
      }
    });
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
  });
//   for(let i=0;i<5;i++){
//     let rating = await context.evaluate(()=>{
//       // @ts-ignore
//       return Boolean(document.querySelector('.star-rating'));
//     })
//     if(rating){
//       break;
//     }
//   try{
//   await context.waitForSelector('.star-rating',{timeout: 40000});
  
//   }catch(e){
//     await context.reload();
//     console.log('Rating not present');
//   }
// }
console.log("extracting data");
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
