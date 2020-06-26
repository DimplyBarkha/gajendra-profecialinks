
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'booker',
    transform: null,
    domain: 'booker.co.uk',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      // Get legalDisclaimer info
      const legalDisclaimer = Array.from(document.querySelectorAll('div.piDisclaimer')).map(elm => {
        const value = elm.textContent.trim();
        return `${value}`;
      }).filter(elm => elm);

      document.body.setAttribute('disclaimer', legalDisclaimer.join(''));
      // Get ingredientsInfo
      const ingredientList =
      (document.querySelector('ul.piIngredientsList') &&
        document.querySelector('ul.piIngredientsList').textContent
          .split(/[\n]/)
          .filter((elm) => elm)
          .join('')) ||
      '';
      document.body.setAttribute('ingredientsInfo', ingredientList);
      // Get metakeywords
      const metaKeyword = (document.querySelector('meta[name="keywords"]') && document.querySelector('meta[name="keywords"]').getAttribute('content')) || '';
      const newEle = document.createElement('meta-key');
      newEle.innerText = metaKeyword;
      document.body.append(newEle);
    });
    await context.extract(productDetails);
  },
};
