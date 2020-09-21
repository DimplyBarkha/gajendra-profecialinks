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
      newDiv.setAttribute('class', id);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }

    const variantList = [];
    const variantUrl = [];

    function getVariantsText (url) {
      let variantUrl = url.match(/(?<=~p)(.*)(?=\?)/gm) ? url.match(/(?<=~p)(.*)(?=\?)/gm)[0] : '';
      if (variantUrl.length === 0) {
        variantUrl = url.match(/(?<=~p)(.*)(?=)/gm) ? url.match(/(?<=~p)(.*)(?=)/gm)[0] : '';
      }
      return variantUrl;
    }

    const url = window.location.href.split('#[!opt!]')[0];
    variantUrl.push(url);
    const mainVariant = getVariantsText(url);
    variantList.push(mainVariant);

    const variantNodes = document.querySelectorAll('select.product-variant option');
    if (variantNodes.length) {
      [...variantNodes].forEach((element) => {
        const text = element.getAttribute('value');
        variantList.push(text);
        const variantUrlText = element.getAttribute('data-href');
        variantUrl.push(`https://www.expert.at${variantUrlText}`);
      });
    }

    const variants = new Set(variantList);
    variants.forEach((element) => {
      addHiddenDiv('ii_variantid', element);
    });
    const variantLinks = new Set(variantUrl);
    variantLinks.forEach((element) => {
      addHiddenDiv('ii_variantUrl', element);
    });
  }, createUrl);
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AT',
    store: 'expert',
    transform: null,
    domain: 'expert.at',
    zipcode: '',
  },
  implementation,
};
