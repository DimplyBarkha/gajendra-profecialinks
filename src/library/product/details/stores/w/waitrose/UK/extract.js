
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

      const countryOfOriginText = document.querySelector('ul.origins___1t3R-') ? document.querySelector('ul.origins___1t3R-').innerText.replace(/[\r\n]+/gm, ' ') : ' ';
      document.querySelector('body').setAttribute('country_of_origin', countryOfOriginText);

      const warningText = document.evaluate('//div[@id="sectproductDetails"]//h3[contains(.,"Warning")]/../ul', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext() ? document.evaluate('//div[@id="sectproductDetails"]//h3[contains(.,"Warning")]/../ul', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext().textContent.replace(/[\r<br>]+/gm, ' ') : ' ';
      document.querySelector('body').setAttribute('warnings', warningText);

      const allergyAdviceText = document.evaluate('//div[@id="sectproductDetails"]//h3[contains(.,"Allergy advice")]/../ul', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext() ? document.evaluate('//div[@id="sectproductDetails"]//h3[contains(.,"Allergy advice")]/../ul', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext().textContent.replace(/[\r\n]+/gm, ' ') : ' ';
      document.querySelector('body').setAttribute('allergy_advice', allergyAdviceText);

      const legalDisclaimerText = document.querySelector('section.disclaimer___2uRzl') ? document.querySelector('section.disclaimer___2uRzl').innerText.replace(/[\r\n]+/gm, ' ') : ' ';
      document.querySelector('body').setAttribute('legal_disclaimer', legalDisclaimerText);

      const productOtherInformationText = document.querySelector('div#sectproductDetails') ? document.querySelector('div#sectproductDetails').innerText.replace(/[\r\n]+/gm, ' ') : ' ';
      document.querySelector('body').setAttribute('product_other_information', productOtherInformationText);
    });
    await context.extract(productDetails);
  },
};
