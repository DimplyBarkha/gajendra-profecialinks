async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const addOptionalWait = async (selector) => {
    try {
      await context.waitForSelector(selector, { timeout: 60000 });
      console.log(`${selector}------------ loaded successfully`)
    } catch (e) {
      console.log(`${selector} ------------ did not load at all`)
    }
  }
  const imageSelector = `div[class*="slick-track"]>div[style*='relative'][class*="active"] img`;
  addOptionalWait(imageSelector);
  // await new Promise(resolve => setTimeout(resolve, 20000));
  await context.evaluate(() => {
    const imageAlttextElement = document.querySelector('div[class*="slick-track"]>div[style*="relative"][class*="active"] img');
    const imageAlttext = imageAlttextElement && imageAlttextElement.getAttribute('alt');
    const productData = window && window.ProductDetail && window.ProductDetail.productObj;
    const brandName = productData && productData.BrandName;
    const price = productData && productData.ProductVarientViewModelList && productData.ProductVarientViewModelList.map(element => element && element.BasePrice);
    const sku = productData && productData.ProductVarientViewModelList && productData.ProductVarientViewModelList.map(element => element && element.SKU);
    const availabilityStatus = productData && productData.ProductVarientViewModelList && productData.ProductVarientViewModelList.map(element => element && element.StockText);
    const variantId = productData && productData.ProductVarientViewModelList && productData.ProductVarientViewModelList.map(element => element && element.VariantId);
    // const secondaryImages = productData && productData.ProductVarientViewModelList && productData.ProductVarientViewModelList[0].Images && productData.ProductVarientViewModelList[0].Images.map(element => element && element.ImagePath);
    // const secondaryImagesArray = secondaryImages && secondaryImages.slice(1);
    // const primaryImage = secondaryImages && secondaryImages.slice(0, 1);
    // const secondaryImagesTotal = secondaryImagesArray && secondaryImagesArray.length;
    // const secondaryImageData = secondaryImagesArray && secondaryImagesArray.map((element) => element.trim()).join('|');
    const sizeArray = productData && productData.ProductVarientViewModelList && productData.ProductVarientViewModelList.map(element => element && element.VariantAttributes[0] && element.VariantAttributes[0].Data);
    const actualSku = productData && productData.ProductId;
    const nameArray = productData && productData.ProductVarientViewModelList && productData.ProductVarientViewModelList.map(element => element && element.SkuVariantName);
    const ingredientInformationArray = productData && productData.ProductVarientViewModelList && productData.ProductVarientViewModelList.map(element => element && element.IngredientsComposition);

    function getSecondaryImageArray(index) {
      const productData = window && window.ProductDetail && window.ProductDetail.productObj;
      const secondaryImages = productData && productData.ProductVarientViewModelList && productData.ProductVarientViewModelList[`${index}`].Images && productData.ProductVarientViewModelList[`${index}`].Images.map(element => element && element.ImagePath);
      const secondaryImagesArray = secondaryImages && secondaryImages.slice(1);
      const secondaryImageData = secondaryImagesArray && secondaryImagesArray.map((element) => element.trim()).join('|');
      return secondaryImageData;
    }

    function getPrimaryImageData(index) {
      const productData = window && window.ProductDetail && window.ProductDetail.productObj;
      const secondaryImages = productData && productData.ProductVarientViewModelList && productData.ProductVarientViewModelList[`${index}`].Images && productData.ProductVarientViewModelList[`${index}`].Images.map(element => element && element.ImagePath);
      const primaryImage = secondaryImages && secondaryImages.slice(0, 1);
      return primaryImage[0];
    }

    function getSecondaryImageTotal(index) {
      const productData = window && window.ProductDetail && window.ProductDetail.productObj;
      const secondaryImages = productData && productData.ProductVarientViewModelList && productData.ProductVarientViewModelList[`${index}`].Images && productData.ProductVarientViewModelList[`${index}`].Images.map(element => element && element.ImagePath);
      const secondaryImagesArray = secondaryImages && secondaryImages.slice(1);
      const secondaryImageTotal = secondaryImagesArray && secondaryImagesArray.length;
      return secondaryImageTotal;
    }

    const finalSecondaryImageArray = [];
    const finalPrimaryImageArray = [];
    const secondaryImageTotal = [];
    variantId.forEach((element, index) => {
      let secondaryImages = getSecondaryImageArray(index);
      let primaryImage = getPrimaryImageData(index);
      let totalSecondaryImages = getSecondaryImageTotal(index);
      finalSecondaryImageArray.push(secondaryImages);
      finalPrimaryImageArray.push(primaryImage);
      secondaryImageTotal.push(totalSecondaryImages);
    })
    if (variantId.length) {
      variantId.forEach((element, index) => {
        const variantElement = document.createElement('div');
        variantElement.className = 'variantinfo';
        variantElement.setAttribute('variantid', variantId[index]);
        variantElement.setAttribute('brand', brandName);
        variantElement.setAttribute('price', price[index]);
        variantElement.setAttribute('upc', sku[index]);
        variantElement.setAttribute('availability', availabilityStatus[index]);
        variantElement.setAttribute('size', sizeArray[index]);
        variantElement.setAttribute('sku', actualSku);
        variantElement.setAttribute('name', nameArray[index]);
        variantElement.setAttribute('ingredientinfo', ingredientInformationArray[index]);
        variantElement.setAttribute('secondaryimages', finalSecondaryImageArray[index]);
        variantElement.setAttribute('secondaryimagetotal', secondaryImageTotal[index]);
        variantElement.setAttribute('primaryelement', finalPrimaryImageArray[index]);
        variantElement.setAttribute('imagealttext', imageAlttext);
        document.body.append(variantElement);
      })
    }
  })
  return await context.extract(productDetails, { transform });
}
const { cleanUp } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'petsuppliesplus',
    transform: cleanUp,
    domain: 'petsuppliesplus.com',
    zipcode: '',
  },
  implementation,
};
