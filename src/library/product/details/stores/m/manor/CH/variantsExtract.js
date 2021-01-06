async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(() => {
    const colorElements = document.evaluate('//div[contains(@class,"productcolorselect")]/div/div/a/@href', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const colorVariantUrls = []
    for (let i = 0; i < colorElements.snapshotLength; i++) {
      colorVariantUrls.push(colorElements.snapshotItem(i).textContent);
    }
    const completeColorVariantsUrl = [];
    colorVariantUrls.forEach((element, index) => {
      completeColorVariantsUrl.push(`https://www.manor.ch${colorVariantUrls[index]}`);
    })
    const sizeElements = document.evaluate('//div[contains(@class,"productsizeselect")]/div/div/a/@href', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const sizeVariantUrls = []
    for (let i = 0; i < sizeElements.snapshotLength; i++) {
      sizeVariantUrls.push(sizeElements.snapshotItem(i).textContent);
    }
    const completeSizeVariantsUrl = [];
    sizeVariantUrls.forEach((element, index) => {
      completeSizeVariantsUrl.push(`https://www.manor.ch${sizeVariantUrls[index]}`);
    })
    const allVariantUrl = [...completeColorVariantsUrl, ...completeSizeVariantsUrl];
    if (allVariantUrl.length == 0) {
      allVariantUrl.push(window.location.href);
    }
    allVariantUrl.forEach((element, index) => {
      const variantElement = document.createElement('div');
      variantElement.id = "variant";
      variantElement.setAttribute('varianturl', allVariantUrl[index]);
      document.body.append(variantElement);
    })
  })

  return await context.extract(variants, { transform });
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    transform: null,
    domain: 'manor.ch',
    zipcode: "",
  },
  implementation,
};
