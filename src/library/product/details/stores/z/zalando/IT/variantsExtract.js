async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(() => {
    function getVariantUrlArray() {
      const variantUrlArray = [];
      const variantUrlElements = document.querySelectorAll('div[class*="okmnKS"]>div>div>div>div>a');
      variantUrlElements && variantUrlElements.forEach((element) => {
        variantUrlArray.push(element && element.getAttribute('href'));
      })
      if (variantUrlArray.length == 0) {
        variantUrlArray.push(window.location.href);
      }
      return variantUrlArray;
    }
    const variantUrlArray = getVariantUrlArray();
    variantUrlArray.forEach((element, index) => {
      const variantElement = document.createElement('div');
      variantElement.className = 'varianturl';
      variantElement.style.display = 'none';
      variantElement.setAttribute('varianturl', variantUrlArray[index]);
      document.body.append(variantElement);

    })
  })
  return await context.extract(variants, { transform });
}
const { cleanUp } = require('./variantshared');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'IT',
    store: 'zalando',
    transform: cleanUp,
    domain: 'zalando.it',
    zipcode: "",
  },
  implementation,
};
