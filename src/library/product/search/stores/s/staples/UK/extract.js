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
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, { productDetails }) => {
    // @ts-ignore
    // document.querySelector('#emailsignupmainview > div.emailsignupnew_close.scTrack.scLink').click();
    async function addUrl () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
        // @ts-ignore
        // Sdocument.querySelector('#btnCookieContainer > input.accept-all-cookies').click();
        // var element = document.querySelector('#emailsignupmainview > div.emailsignupnew_close.scTrack.scLink').click();
        // if (element) {
        //   element.click();
        // }
        document.querySelector('#VATContent > div.dvVatCnt.alignCenter.clear > div.dvCustType.R > div.formRow > input').click();
      }

      // @ts-ignore
      // document.querySelector('#emailsignupmainview > div.emailsignupnew_close.scTrack.scLink').click();
      const url = window.location.href;
      addHiddenDiv('added-searchurl', url);
      if (document.querySelector('input[class="accept-all-cookies"]')) {
        // @ts-ignore
        document.querySelector('input[class="accept-all-cookies"]').click();
        // eslint-disable-next-line promise/param-names
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    await context.evaluate(addUrl);
    return await context.extract(productDetails, { transform: transformParam });
  },
};
