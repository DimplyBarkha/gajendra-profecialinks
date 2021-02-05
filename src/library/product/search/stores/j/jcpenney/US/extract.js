const { transform } = require('../shared');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    const productPageSelector = document.querySelector('h1[data-automation-id="product-title"]');
    if (productPageSelector) {
      console.log('Not a search page');
    }
    const homePageSelector = document.querySelector('div[id="comp_imagebanner_2"] div[data-automation-id="imagebanner"] img[data-automation-id="banner-image"]');
    if (homePageSelector) {
      console.log('Not a search page');
    }
    try {
      await context.waitForSelector('div[class*="flex flex-0"]>span>div>input', { timeout: 60000 });
      console.log('selector for API exist');
    } catch (e) {
      console.log("selector for API doesn't exist");
    }

    const url = window.location.href;
    let apiLink ;
    if(url.includes('searchTerm')){
      const primarySearchTerm = url.replace(/(.+)(searchTerm=)(.+)(&page|)/g, '$3');
      const searchTerm = primarySearchTerm && primarySearchTerm.split('&') && primarySearchTerm.split('&')[0];
       apiLink = `https://search-api.jcpenney.com/v1/search-service/s?productGridView=medium&searchTerm=${searchTerm}&mktTiles=0&responseType=organic`;
    }else{
      let Link = document.evaluate('//div[contains(@class,"flex flex-0")]//span//div//input/@value',document).iterateNext() && document.evaluate('//div[contains(@class,"flex flex-0")]//span//div//input/@value',document).iterateNext().textContent;
      apiLink = `https://search-api.jcpenney.com${Link}`;
    }
    const response = await fetch(apiLink);
    const jsonData = await response.json()
    const skuArray = [];
    const nameArray = [];
    const reviewArray = [];
    const ratingArray = [];
    const priceArray = [];
    const productUrlArray = [];
    const imageArray = [];
    try {
      jsonData.organicZoneInfo.products.forEach((element) => {
        // skuArray.push(element.skuSwatch[0].skuId) 
        skuArray.push(element.skuId)
        nameArray.push(element.name)
        reviewArray.push(element.reviewCount)
        ratingArray.push(element.averageRating)
        priceArray.push(element.currentMax)
        productUrlArray.push(element.pdpUrl)
        imageArray.push(element.imagesInfo.thumbnailImageId)

      })
      console.log('there is no issue with skuswatch')
    } catch (e) {
      console.log('this error is coming due to skuSwatch ')
    }

    const appendElements = document.querySelectorAll('div[id="gallery-product-list"] div[data-automation-id="productCard"]')

    appendElements.forEach((element, index) => {
      element.setAttribute('skuvalue', skuArray[index])
      element.setAttribute('namevalue', nameArray[index])
      element.setAttribute('reviewvalue', reviewArray[index])
      element.setAttribute('ratingvalue', ratingArray[index])
      element.setAttribute('pricevalue', priceArray[index])
      element.setAttribute('productvalue', productUrlArray[index])
      element.setAttribute('imagevalue', imageArray[index])
    })
  });

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'jcpenney',
    transform,
    domain: 'jcpenney.com',
    zipcode: '',
  },
  implementation,
};
