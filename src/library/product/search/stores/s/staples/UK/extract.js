// @ts-nocheck
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'staples',
    transform: transform,
    domain: 'staples.co.uk',
    zipcode: '',
  },
  // @ts-ignore
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, { productDetails }) => {
    // @ts-ignore
    // document.querySelector('#emailsignupmainview > div.emailsignupnew_close.scTrack.scLink').click();
    // const sectionsDiv = 'div#ItemSrchCompare div[itemprop="productID"]';
    // await context.waitForSelector(sectionsDiv, { timeout: 9000 });
    async function addUrl () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'visible';
        document.body.appendChild(newDiv);
        // @ts-ignore
        // Sdocument.querySelector('#btnCookieContainer > input.accept-all-cookies').click();
        // var element = document.querySelector('#emailsignupmainview > div.emailsignupnew_close.scTrack.scLink').click();
        // if (element) {
        //   element.click();
        // }
        // document.querySelector('#VATContent > div.dvVatCnt.alignCenter.clear > div.dvCustType.R > div.formRow > input').click();
      }

      // @ts-ignore
      // document.querySelector('#emailsignupmainview > div.emailsignupnew_close.scTrack.scLink').click();
      const url = window.location.href;
      addHiddenDiv('added-searchurl', url);
      const cookies = document.querySelector('#btnCookieContainer > input.accept-all-cookies');
      // @ts-ignore
      if (cookies) cookies.click();
      const coffePopup = document.querySelector('#wp-close-1170165 > div');
      // @ts-ignore
      if (coffePopup) coffePopup.click();
      const VATContent = document.querySelector('#VATContent > div.dvVatCnt.alignCenter.clear > div.dvCustType.L > div.formRow > input');
      // @ts-ignore
      if (VATContent) VATContent.click();
      const discount = document.querySelector('#emailsignupmainview > div.emailsignupnew_close.scTrack.scLink');
      // @ts-ignore
      if (discount) discount.click();
      if (document.querySelector('input[class="accept-all-cookies"]')) {
      // @ts-ignore
        document.querySelector('input[class="accept-all-cookies"]').click();
        // eslint-disable-next-line promise/param-names
        await new Promise(r => setTimeout(r, 5000));
      }
    }
    await context.evaluate(addUrl);
    return await context.extract(productDetails, { transform: transformParam });
  },
};
