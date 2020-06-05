
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'uk',
    store: 'sainsburys',
    transform: null,
    domain: 'sainsburys.co.uk',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      console.log('EXECUTING INSIDE BROWSER');
      const elements = document.querySelectorAll('ol[class*="breadcrumbs"]>li');
      let text;
      const elementLength = elements.length;
      console.log(elementLength);
      for (let i = 0; i < elementLength; i++) {
        if (i === 1) {
          text = elements[i].textContent;
          continue;
        }
        text = `${text} > ${elements[i].textContent}`;
      }
      document.querySelector('body').setAttribute('breadcrumbs', text);
    });
    await context.extract(productDetails);
  },
};
