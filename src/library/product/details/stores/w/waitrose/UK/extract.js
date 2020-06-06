
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    transform: null,
    domain: 'waitrose.com',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const availableStatus = document.querySelector('button[data-origincomponent="AddToTrolley"]') ? 'In stock' : 'Out of stock';
      document.querySelector('body').setAttribute('available_status', availableStatus);

      const countryOfOriginText = document.querySelector("ul.origins___1t3R-") ? document.querySelector("ul.origins___1t3R-").innerText.replace( /[\r\n]+/gm, " " ): " ";
      document.querySelector('body').setAttribute('country_of_origin', countryOfOriginText);

      const warningText = document.evaluate('//div[@id="sectproductDetails"]//h3[contains(.,"Warning")]/../ul', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext() ? document.evaluate('//div[@id="sectproductDetails"]//h3[contains(.,"Warning")]/../ul', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext().textContent.replace( /[\r<br>]+/gm, " " ): " ";
      document.querySelector('body').setAttribute('warnings', warningText);

    });
    await context.extract(productDetails);
  },
};
