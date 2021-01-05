
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CH',
    store: 'brack',
    transform: null,
    domain: 'brack.ch',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { createUrl, variants } = dependencies;
    await context.evaluate(function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
        return newDiv;
      }
      const variantArr = [];
      const variantElements = document.querySelectorAll('div.productStage__productVariants li[class*="productStage__variantItem"] > a');
      variantElements.forEach(element => {
        const variantData = {
          sku: element.getAttribute('href') ? element.getAttribute('href').match(/-([0-9]+)$/g) : null,
          url: element.getAttribute('href') ? 'https://www.brack.ch' + element.getAttribute('href') : null,
        };
        variantArr.push(variantData);
      });
      if (variantArr.length !== 0) {
        for (let i = 0; i < variantArr.length; i++) {
          addHiddenDiv('variantId', variantArr[i].sku);
          addHiddenDiv('variantUrl', variantArr[i].url);
        }
      }
    }, createUrl);
    return await context.extract(variants);
  },
};
