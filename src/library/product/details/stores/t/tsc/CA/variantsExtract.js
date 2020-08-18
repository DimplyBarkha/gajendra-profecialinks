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

    // Fetching variant id from DOM and forming the necessary variant details object
    const productURLSelector = document.querySelector('link[rel="canonical"]');
    const productURL = productURLSelector ? productURLSelector.href : '';
    const variantCountSelector = document.querySelectorAll('div[id="radStyle"] > label');
    const variantCount = variantCountSelector ? variantCountSelector.length : '';
    const productDetails = window.analyticsData ? window.analyticsData.product ? window.analyticsData.product.Edps : [] : [];
    const variantArray = [];
    // If the product details fetched from JSON are blank then add the URL directly
    if (productDetails.length === 0) {
      variantArray.push({ variantNumber: '', variantURL: productURL });
    }
    for (let i = 0; i < productDetails.length; i++) {
      const variantNumber = productDetails[i].EdpNo;
      let variantURL;
      if (variantCount) {
        variantURL = productURL ? productURL + '&edp=' + variantNumber : '';
      } else { variantURL = productURL; }
      variantArray.push({ variantNumber: variantNumber, variantURL: variantURL });
    }
    // Adding variant details to the DOM
    for (let i = 0; i < variantArray.length; i++) {
      addHiddenDiv('added_variant_id' + i, variantArray[i].variantNumber);
      addHiddenDiv('added_variant_url' + i, variantArray[i].variantURL);
    }
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
