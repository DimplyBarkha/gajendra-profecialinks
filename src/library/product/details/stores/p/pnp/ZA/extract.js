const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ZA',
    store: 'pnp',
    transform: cleanUp,
    domain: 'pnp.co.za',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    await context.evaluate(() => {
      // function to append the elements to DOM
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const numOfTabs = document.querySelectorAll('ul.tabs-list li a');
      for (let i = 0; i < numOfTabs.length; i++) {
        numOfTabs[i].click();
      }
      const listPrice = document.querySelector('div.oldprice') ? document.querySelector('div.oldprice').textContent : '';
      if (listPrice) addElementToDocument('listPrice', listPrice.replace(/(.*)(\d{2})/g, '$1,$2'));
      const availability = document.querySelector('button#addToCartButton') ? 'In Stock' : 'Out Of Stock';
      addElementToDocument('availability', availability);
      const savings = document.querySelector('div.savings') ? document.querySelector('div.savings').textContent : '';
      if (savings) addElementToDocument('promotion', `SAVE ${savings.replace(/(.*)(\d{2})/g, '$1,$2')}`);
      const promotion = document.querySelector('div[class*=product-details-price-promo] p') ? document.querySelector('div[class*=product-details-price-promo] p').textContent : '';
      if (promotion) addElementToDocument('promotion', promotion);

      const descriptionNode = document.evaluate('//div[@class="headline"][contains(text(),"DESCRIPTION")]/../..', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const description = descriptionNode ? descriptionNode.textContent : '';
      const featuresNode = document.evaluate('//div[@class="headline"][contains(text(),"FEATURES")]/../..', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const features = featuresNode ? featuresNode.textContent : '';
      addElementToDocument('div_description', `${description} ${features}`);

      const directionsNode = document.evaluate('//div[@class="headline"][contains(text(),"USAGE")]/../..', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const directions = directionsNode ? directionsNode.textContent : '';
      addElementToDocument('div_directions', directions);
    });
    await context.extract(productDetails, { transform });
  },
};
