
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AU',
    store: 'sephora',
    transform: null,
    domain: 'sephora.com.au',
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

  const variantArray = await context.evaluate(function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const url = window.location.href;
    const urlSplit = url.split('/v/');
    const variantNames = '//li[contains(@class, "product-variant-swatch")]//img/@title';
    var variantsCheck = document.evaluate(variantNames, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (variantsCheck.snapshotLength > 0) {
      for (let i = 0; i < variantsCheck.snapshotLength; i++) {
        const checkName = variantsCheck.snapshotItem(i).textContent.toLowerCase();
        const nameSplit = checkName.split(' ').join('-');
        const variantUrl = `${urlSplit[0]}/v/${nameSplit}`;
        addHiddenDiv('ii_variantUrl', variantUrl);
      }
    }
  });

  return await context.extract(variants, { transform });
}
