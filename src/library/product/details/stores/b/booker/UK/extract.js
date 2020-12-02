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

      // Get metakeywords
      const metaKeyword = (document.querySelector('meta[name="keywords"]') && document.querySelector('meta[name="keywords"]').getAttribute('content')) || '';
      const newKeyword = document.createElement('meta-key');
      newKeyword.innerText = metaKeyword;
      document.body.append(newKeyword);

      // Get availability text
      const availability = !document.querySelector('div.discontinuedBox') && document.querySelector('div#mainContent') ? 'In Stock' : 'Out of Stock';
      const newAvailability = document.createElement('availability');
      newAvailability.innerText = availability;
      document.body.append(newAvailability);

      // Get terms and conditions
      const tandc = document.querySelector('a#FC_hypTermsAndConditions') ? 'Yes' : 'No';
      const newTandc = document.createElement('tandc');
      newTandc.innerText = tandc;
      document.body.append(newTandc);

      // Get privacy policy
      const privacyPolicy = document.querySelector('a#FC_hypPrivacyStatement') ? 'Yes' : 'No';
      const newPrivacyPolicy = document.createElement('privacyPolicy');
      newPrivacyPolicy.innerText = privacyPolicy;
      document.body.append(newPrivacyPolicy);
    });
    await context.extract(productDetails, { transform });
  },
};
