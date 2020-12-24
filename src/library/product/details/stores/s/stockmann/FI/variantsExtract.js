async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(async () => {
    const numberOfSizeVariants = document.querySelectorAll('div[class="main-detail-column"] select[class*="select-size"]>option');
    let sizeElements = null;
    if (numberOfSizeVariants.length === 1) {
      sizeElements = document.evaluate('//div[@class="main-detail-column"]//select[contains(@class,"select-size")]/option[position()=1]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    }
    else {
      sizeElements = document.evaluate('//div[@class="main-detail-column"]//select[contains(@class,"select-size")]/option[position()>1]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    }
    const sizeApiArray = [];
    const sizeArray = [];

    for (let i = 0; i < sizeElements.snapshotLength; i++) {
      sizeApiArray.push(sizeElements.snapshotItem(i).getAttribute('value'));
      sizeArray.push(sizeElements.snapshotItem(i).getAttribute('data-attr-value'));
    }

    async function callingApi(api) {
      let data = await fetch(api);
      let responseData = data && await data.json();
      return responseData;;
    }

    async function getSkuValue(data) {
      let sku = data.gtm.productData.variantSKU;
      return sku
    }

    const variantIdArray = [];
    sizeApiArray.forEach(async (element, index) => {
      let data = await callingApi(sizeApiArray[index]);
      let sku = await getSkuValue(data);
      variantIdArray.push(sku);
    })
    await new Promise(resolve => setTimeout(resolve, 4000));
    const varianturlArray = [];
    variantIdArray.forEach((element) => { varianturlArray.push(`https://www.stockmann.com/${element}.html`) });

    varianturlArray.forEach((element) => {
      const variantDiv = document.createElement('div');
      variantDiv.id = 'varianturl';
      variantDiv.setAttribute('varianturl', element);
      document.body.append(variantDiv);
    })
  })
  return await context.extract(variants, { transform });
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'FI',
    store: 'stockmann',
    transform: null,
    domain: 'stockmann.com',
    zipcode: "''",
  },
  implementation,
};