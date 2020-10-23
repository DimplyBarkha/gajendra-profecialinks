async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(async function () {
    var variantArr = [];
    function timeout (ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const getVariant = async function () {
      var imageRows = [...document.querySelectorAll('div.color-attribute')];
      for (let index = 0; index < imageRows.length; index++) {
        imageRows[index].click();
        await timeout(2000);
        var variantUrl = window.location.href;
        variantArr.push(variantUrl);
        const div = document.createElement('div');
        div.className = 'variant';
        const getInput = document.createElement('input');
        div.appendChild(getInput);
        document.body.appendChild(div);
        getInput.setAttribute('value', variantUrl);
        await timeout(5000);
      }
    };
    await getVariant();
  }, createUrl);
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'babyjogger',
    transform: null,
    domain: 'babyjogger.com',
    zipcode: '',
  },
  implementation,
};
