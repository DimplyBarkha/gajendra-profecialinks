
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    transform: null,
    domain: 'waitrose.com',
  },
  // @ts-ignore
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const isSearchPage = document.querySelector('#searchMeta');
      // @ts-ignore
      function timeout (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      // @ts-ignore
      async function waitForElementWithTimeout (selector, reloadSec, maxTime) {
        let element = document.querySelector(selector);
        let count = 0;
        while (element === null) {
          count = count + reloadSec;
          element = document.querySelector(selector);
          await timeout(reloadSec);
          if (count >= +maxTime) {
            console.log('Element not found');
            return false;
          }
        }
        console.log('Element found');
        return true;
      }
      async function waitForCookieToBeClicked () {
        const cookieBar = document.querySelector('button.button___2YB28[data-webviewid="accept-cookies"]');
        // @ts-ignore
        cookieBar.click();
        // eslint-disable-next-line promise/param-names
        await new Promise(r => setTimeout(r, 2000));
        await waitForElementWithTimeout('a > h2 > div > span.name___CmYia', 100, 5000);
      }
      const cookiesSelector = document.querySelector('section[data-test="initial-waitrose-cookie-consent-banner"]');
      if (cookiesSelector) {
        document.cookie =
          'wtr_cookie_consent=1;path=/';
        await waitForCookieToBeClicked();
      }
      if (isSearchPage) {
        const isProductMatched = document.querySelectorAll('.flexGrid___1DH6K article');
        if (isProductMatched.length === 1) {
          // @ts-ignore
          document.querySelector('a[data-origincomponent="ProductPod"]').click();
          await waitForElementWithTimeout('section#productDescription', 100, 5000);
          await waitForElementWithTimeout('section#marketingDescriptionBop', 100, 5000);
        }
      }
      const availableStatus = document.querySelector('button[data-origincomponent="AddToTrolley"]') ? 'In stock' : 'Out of stock';
      document.querySelector('body').setAttribute('available_status', availableStatus);

      // @ts-ignore
      const countryOfOriginText = document.querySelector('ul.origins___1t3R-') ? document.querySelector('ul.origins___1t3R-').innerText.replace(/[\r\n]+/gm, ' ') : ' ';
      document.querySelector('body').setAttribute('country_of_origin', countryOfOriginText);

      const warningText = document.evaluate('//div[@id="sectproductDetails"]//h3[contains(.,"Warning")]/../ul', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext() ? document.evaluate('//div[@id="sectproductDetails"]//h3[contains(.,"Warning")]/../ul', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext().textContent.replace(/[\r<br>]+/gm, ' ') : ' ';
      document.querySelector('body').setAttribute('warnings', warningText);

      const allergyAdviceText = document.evaluate('//div[@id="sectproductDetails"]//h3[contains(.,"Allergy advice")]/../ul', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext() ? document.evaluate('//div[@id="sectproductDetails"]//h3[contains(.,"Allergy advice")]/../ul', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext().textContent.replace(/[\r\n]+/gm, ' ') : ' ';
      document.querySelector('body').setAttribute('allergy_advice', allergyAdviceText);

      // @ts-ignore
      const legalDisclaimerText = document.querySelector('section.disclaimer___2uRzl') ? document.querySelector('section.disclaimer___2uRzl').innerText.replace(/[\r\n]+/gm, ' ') : ' ';
      document.querySelector('body').setAttribute('legal_disclaimer', legalDisclaimerText);

      // @ts-ignore
      const productOtherInformationText = document.querySelector('div#sectproductDetails') ? document.querySelector('div#sectproductDetails').innerText.replace(/[\r\n]+/gm, ' ') : ' ';
      document.querySelector('body').setAttribute('product_other_information', productOtherInformationText);
    });
    await context.extract(productDetails);
  },
};
