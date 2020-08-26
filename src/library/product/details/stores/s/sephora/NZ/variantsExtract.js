
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'NZ',
    store: 'sephora',
    transform: null,
    domain: 'sephora.nz',
    zipcode: '',
  },
  implementation
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
    let url = window.location.href
    let urlSplit = url.split("/v/")
    let variantNames = '//li[contains(@class, "product-variant-swatch")]//img/@title';
    var variantsCheck = document.evaluate( variantNames, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if(variantsCheck.snapshotLength > 0){
      for(let i = 0; i < variantsCheck.snapshotLength; i++){
        let checkName = variantsCheck.snapshotItem(i).textContent.toLowerCase()
        let nameSplit = checkName.split(" ").join("-")
        let variantUrl = `${urlSplit[0]}/v/${nameSplit}`
        addHiddenDiv('ii_variantUrl', variantUrl);
      }
    }
  });


  return await context.extract(variants, { transform });
}