
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

    const variantList = [];

    function getVariantsText (url) {
      let variantUrl = url.match(/((?<=-)(.*?)(?=\.))/gm) ? url.match(/((?<=-)(.*?)(?=\.))/gm)[0] : '';
      variantUrl = variantUrl.length ? (variantUrl.match(/[^-]+$/gm) ? variantUrl.match(/[^-]+$/gm)[0] : '') : '';
      return variantUrl;
      // return `https://www.mediamarkt.at/${url}`;
    }

    const url = window.location.href;
    const mainVariant = getVariantsText(url);
    variantList.push(mainVariant);

    const variantNodes = document.querySelectorAll('div[class^="ProductVar"] a[class^="Linkstyle"]');
    if (variantNodes.length) {
      [...variantNodes].forEach((element) => {
        const text = getVariantsText(element.getAttribute('href'));
        variantList.push(text);
      });
    }

    const variants = new Set(variantList);
    variants.forEach((element) => {
      addHiddenDiv('ii_variant', element);
    });
  }, createUrl);
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AT',
    store: 'mediamarkt',
    transform: null,
    domain: 'mediamarkt.at',
    zipcode: '',
  },
  implementation,
};
