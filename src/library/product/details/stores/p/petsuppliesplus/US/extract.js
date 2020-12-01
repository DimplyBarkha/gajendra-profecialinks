async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(() => {
    const productData = window.ProductDetail.productObj;
    const brandName = productData && productData.BrandName;
    const price3 = productData && productData.ProductVarientViewModelList && productData.ProductVarientViewModelList.map(element => element.BasePrice);
    const sku = productData && productData.ProductVarientViewModelList && productData.ProductVarientViewModelList.map(element => element.SKU);
    const availabilityStatus = productData && productData.ProductVarientViewModelList && productData.ProductVarientViewModelList.map(element => element.StockText);
    const variantId = productData && productData.ProductVarientViewModelList && productData.ProductVarientViewModelList.map(element => element.VariantId);
    const secondaryImages = productData && productData.ProductVarientViewModelList && productData.ProductVarientViewModelList[0].Images && productData.ProductVarientViewModelList[0].Images.map(element => element.ImagePath);
    const secondaryImagesArray = secondaryImages && secondaryImages.slice(1);
    const sizeArray = productData && productData.ProductVarientViewModelList && productData.ProductVarientViewModelList.map(element => element.VariantAttributes[0].Data);
    const actualSku = productData && productData.ProductId;
    const nameArray = productData && productData.ProductVarientViewModelList && productData.ProductVarientViewModelList.map(element => element.SkuVariantName);
    const ingredientInformationArray = productData && productData.ProductVarientViewModelList && productData.ProductVarientViewModelList.map(element => element.IngredientsComposition);
  })
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'petsuppliesplus',
    transform: null,
    domain: 'petsuppliesplus.com',
    zipcode: '',
  },
  implementation,
};
