module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'NZ',
    store: 'sephora',
    transform: null,
    domain: 'sephora.nz',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;

  const variantNames = '//li[contains(@class, "product-variant-swatch")]//img/@title';
  try {
    await context.waitForXPath(variantNames, { timeout: 10000 });
  } catch (error) {
    console.log(`Variants does not loaded/ Not available => Xpath: ${variantNames}`);
  }

  await context.evaluate(function (variantNames) {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const url = window.location.href;
    const urlSplit = url.split('/v/');
    var variantsCheck = document.evaluate(variantNames, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (variantsCheck.snapshotLength > 0) {
      for (let i = 0; i < variantsCheck.snapshotLength; i++) {
        const checkName = variantsCheck.snapshotItem(i).textContent.toLowerCase();
        const nameSplit = checkName.split(' ').join('-');
        const variantUrl = `${urlSplit[0]}/v/${nameSplit}`;
        console.log(`ii_variantUrl: ${variantUrl}`);
        addHiddenDiv('ii_variantUrl', variantUrl);
      }
    } else {
      console.log(`No variant product found => Xpath used: ${variantNames}`);
    }
  }, variantNames);

  return await context.extract(variants, { transform });
}
