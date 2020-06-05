
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'morrisons',
    transform: null,
    domain: 'groceries.morrisons.com',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 100000));
    await context.evaluate(async function () {
      const desc = document.querySelector('.bop-productDetails > .gn-accordionElement > div.gn-accordionElement__content.gn-accordionElement__content--expanded > .gn-accordionElement__wrapper');
      let text = '';
      if (desc) {
        text = desc.innerText.replace(/[\r\n]+/gm, ' ');
      }
      document.querySelector('body').setAttribute('description', text);
    });
    await context.extract(productDetails);
  },
};
