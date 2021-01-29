
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AU',
    store: 'kiehls_ebt_au',
    transform: null,
    domain: 'kiehls.com.au',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(async function () {
    const colorElements = document.evaluate('//div/ul[contains(@class,"swatches")]/li/a/@href', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const colorVariant = []
    for (let i = 0; i < colorElements.snapshotLength; i++) {
      colorVariant.push(colorElements.snapshotItem(i).textContent);
    }
    const colorVariantUrls = [];
    for (let i = 0; i < colorVariant.length; i++) {
      if (colorVariant[i].length > 0 && colorVariant[i].includes('?')) {
        colorVariantUrls.push(colorVariant[i].split('?')[1]);
      }
    }
    const urlRaw = document.evaluate('//link[@rel="canonical"]/@href', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const url = urlRaw.snapshotItem(0).textContent;
    const completeSizeVariantsUrl = [];
    colorVariantUrls.forEach((element, index) => {
      completeSizeVariantsUrl.push(`${url}?${colorVariantUrls[index]}`);
    })
    completeSizeVariantsUrl.push(`${url}`);
    completeSizeVariantsUrl.forEach((element, index) => {
      const variantElement = document.createElement('div');
      variantElement.id = "variant";
      variantElement.setAttribute('varianturl', completeSizeVariantsUrl[index]);
      document.body.append(variantElement);
    })
  });
  return await context.extract(variants, { transform });
}
