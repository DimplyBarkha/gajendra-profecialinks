async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { variants } = dependencies;
  await context.evaluate(function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }

    // Looping variant details array and adding them to the DOM
    function addVariantDetailsDOM (variantURLArray, variantIdArray) {
      for (let i = 0; i < variantIdArray.length && i < variantURLArray.length; i++) {
        addHiddenDiv('added_variant_id_' + i, variantIdArray[i]);
        addHiddenDiv('added_variant_url_' + i, variantURLArray[i]);
      }
    }

    function fetchVariantInfoFromURL (getVariantIdRegex) {
      const productURL = window.location.href;
      const currentVariant = productURL.replace(getVariantIdRegex, '$1');
      return { productURL, currentVariant };
    }

    /**
     * Function to fetch variants and count and add to DOM
     * The id for the selected variant is not present in the variant block on the DOM hence
     * fetching it from product URL if variants are present on the website
     */
    function getVariants () {
      const variantSelector = document.querySelectorAll('div[class="color-block"] div[class="owl-item"] a');
      const variantIdArray = [];
      const variantURLArray = [];
      const getVariantIdRegex = /.*ref\/(\d+)/gm;
      const variantDetailsURL = fetchVariantInfoFromURL(getVariantIdRegex);

      if (variantSelector.length) {
        variantURLArray.push(variantDetailsURL.productURL);
        variantIdArray.push(variantDetailsURL.currentVariant);
        for (let i = 0; i < variantSelector.length; i++) {
          const variantURL = variantSelector[i].href;
          const variantId = variantURL.replace(getVariantIdRegex, '$1');
          variantURLArray.push(variantURL);
          variantIdArray.push(variantId);
        }
      } else {
        variantURLArray.push(variantDetailsURL.productURL);
        variantIdArray.push(variantDetailsURL.currentVariant);
      }
      addVariantDetailsDOM(variantURLArray, variantIdArray);
    }

    getVariants();
  });
  return await context.extract(variants);
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'FR',
    store: 'boulanger',
    transform: null,
    domain: 'boulanger.com',
    zipcode: '',
  },
  implementation,
};
