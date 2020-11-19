const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'officeworks',
    transform: cleanUp,
    domain: 'officeworks.com.au',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      // function to append the elements to DOM
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const alternateImg = document.querySelectorAll("img[class*='abs__ProductThumb']");
      let imgArr = [];
      for (let i = 1; i < alternateImg.length; i++) {
        const img = alternateImg[i].getAttribute('src').replace('size=60', 'size=300').replace('JPEG_150x150', 'JPEG_300x300');
        imgArr.push(`https:${img}`);
      }
      addElementToDocument('alternateImg', imgArr.join(' | '));

      const aggRating = document.querySelector('div[itemprop=ratingValue]') ? document.querySelector('div[itemprop=ratingValue]').innerText.replace('.', ',') : '';
      addElementToDocument('aggRating', aggRating);

      const specTabs = document.querySelectorAll('li[class*=SpecificationsTab__SpecsListItem]');
      let specArr = [];
      specTabs.forEach(element => {
        specArr.push(element.innerText);
      });
      addElementToDocument('product-spec', specArr.join(' || ').trim());

      const availability = document.querySelector('meta[itemprop="availability"][content="http://schema.org/InStock"]') ? 'In Stock' : 'Out of Stock';
      addElementToDocument('availability', availability);
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.extract(productDetails, { transform });
  },
};
