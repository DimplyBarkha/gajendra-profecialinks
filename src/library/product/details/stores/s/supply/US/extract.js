
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'supply',
    transform: cleanUp,
    domain: 'supply.com',
    zipcode: '',
  },
  // @ts-ignore
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    // await context.click('span[class*= "trigger"]');
    await context.evaluate(async function () {
      const moreImgs = document.querySelector('span[class*= "trigger"]');
      // @ts-ignore
      if (moreImgs) moreImgs.click();
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.evaluate(async function () {
      function addElementToDocument (key, href, value) {
        const catElement = document.createElement('div');
        catElement.classList.add(key);
        catElement.setAttribute('href', href);
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const imgList = document.querySelectorAll('div[data-testId="modal-container"] img')
        ? document.querySelectorAll('div[data-testId="modal-container"] img') : [];
      imgList.forEach(e => addElementToDocument('alternate-images', e.src));

      const pdfPresent = document.querySelectorAll('a[href*=".pdf"]')
        ? document.querySelector('a[href*=".pdf"]') : [];
      if (pdfPresent) {
        addElementToDocument('pdfPresent', '#', 'Yes');
      } else addElementToDocument('pdfPresent', '#', 'No');

      const ratingCount = document.querySelector('button[class*="numReviews"]')
        // @ts-ignore
        ? document.querySelector('button[class*="numReviews"]').innerText : '';
      addElementToDocument('ratingCount', '#', ratingCount.replace(/[()']+/g, ''));
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.evaluate(async function () {
      const closeMoreImgs = document.querySelector('a[class*= "trigger"]');
      // @ts-ignore
      if (closeMoreImgs) closeMoreImgs.click();
    });
    // await context.click('a[class*= "trigger"]');
    await context.extract(productDetails, { transform });
  },
};
