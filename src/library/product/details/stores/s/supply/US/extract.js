
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
    await new Promise((resolve, reject) => setTimeout(resolve, 1500));
    await context.evaluate(async function () {
      const moreImgs = document.querySelector('span[class*= "trigger"]');
      // @ts-ignore
      if (moreImgs) moreImgs.click();
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 1500));
    await context.evaluate(async function () {
      function addElementToDocument (key, href, value) {
        const catElement = document.createElement('div');
        catElement.classList.add(key);
        catElement.setAttribute('href', href);
        catElement.innerText = value;
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
      const dataFromJSON = document.querySelector('main script[type*="json"]')
      // @ts-ignore
        ? document.querySelector('main script[type*="json"]').textContent : '';
      const reviewCount = JSON.parse(dataFromJSON).aggregateRating.reviewCount;
      addElementToDocument('reviewCount', '#', reviewCount);
      const ratingValue = JSON.parse(dataFromJSON).aggregateRating.ratingValue;
      addElementToDocument('ratingValue', '#', ratingValue);
      const brandName = JSON.parse(dataFromJSON).brand.name;
      addElementToDocument('brandName', '#', brandName);
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 1500));
    await context.evaluate(async function () {
      const closeMoreImgs = document.querySelector('a[class*= "trigger"]');
      // @ts-ignore
      if (closeMoreImgs) closeMoreImgs.click();
    });
    await context.extract(productDetails, { transform });
  },
};
