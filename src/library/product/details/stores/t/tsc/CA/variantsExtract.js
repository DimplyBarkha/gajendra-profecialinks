async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
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

    const productURLSelector = document.querySelector('link[rel="canonical"]');
    const productURL = productURLSelector ? productURLSelector.href : '';
    const productDetails = window.analyticsData ? window.analyticsData.product ? window.analyticsData.product.Edps : [] : [];
    const variantArray = [];
    for (let i = 0; i < productDetails.length; i++) {
      const variantNumber = productDetails[i].EdpNo;
      let variantURL;
      if (productURL.includes('edp=')) {
        variantURL = productURL ? productURL.replace(/(.*edp=).*/gm, '$1') + variantNumber : '';
      } else { variantURL = productURL; }
      variantArray.push({ variantNumber: variantNumber, variantURL: variantURL });
    }
    console.log('variantArray -----------_> ', variantArray);
  }, createUrl);
  return await context.extract(variants);
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CA',
    store: 'tsc',
    transform: null,
    domain: 'tsc.ca',
    zipcode: '',
  },
  implementation,
};
