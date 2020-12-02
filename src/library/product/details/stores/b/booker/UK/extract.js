const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'booker',
    transform: cleanUp,
    domain: 'booker.co.uk',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const cookies = document.querySelector('input#EUCookieButton');
      if (cookies) cookies.click();
      // Get legalDisclaimer info
      const legalDisclaimer = Array.from(document.querySelectorAll('div.piDisclaimer')).map(elm => {
        const value = elm.textContent.trim();
        return `${value}`;
      }).filter(elm => elm);
      const newDisclaimer = document.createElement('new-disclaimer');
      newDisclaimer.innerText = legalDisclaimer.join(' ');
      document.body.append(newDisclaimer);

      // function to append the elements to DOM
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      // Get metakeywords
      const metaKeyword = (document.querySelector('meta[name="keywords"]') && document.querySelector('meta[name="keywords"]').getAttribute('content')) || '';
      addElementToDocument('metaKeyword', metaKeyword);

      // Get availability text
      const availability = !document.querySelector('div.discontinuedBox') && document.querySelector('div#mainContent') ? 'In Stock' : 'Out of Stock';
      addElementToDocument('availability', availability);

      // Get terms and conditions
      const tandc = document.querySelector('a#FC_hypTermsAndConditions') ? 'Yes' : 'No';
      addElementToDocument('tandc', tandc);

      // Get privacy policy
      const privacyPolicy = document.querySelector('a#FC_hypPrivacyStatement') ? 'Yes' : 'No';
      addElementToDocument('privacyPolicy', privacyPolicy);

      // Get serving size Uom
      const servingSizeUom = document.evaluate('//h1[contains(.,"Nutrition")]/following-sibling::div/table//tr[1]/th[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      addElementToDocument('servingSizeUom', servingSizeUom.textContent.replace(/.*\d+\s?(\w+)\s?.*/g, '$1'));

      // Get zoomIn feature
      const zoomIn = document.querySelector('img[alt="Click for larger image"]') ? 'Yes' : 'No';
      addElementToDocument('zoomIn', zoomIn);
    });
    await context.extract(productDetails, { transform });
  },
};
