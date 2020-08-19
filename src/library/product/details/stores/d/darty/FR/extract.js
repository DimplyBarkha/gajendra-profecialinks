const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'darty',
    transform,
    domain: 'darty.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.waitForSelector('p[id="pc-policy-text"]');
    await context.evaluate(async function () {
      let listPrice;
      const originalPrice = document.querySelector('div.product_price_infos span');
      if (originalPrice) {
        if (originalPrice.innerText) {
          listPrice = originalPrice.innerText.split('\n').join('');
        }
      } else {
        listPrice = document.querySelector('div.product_price > span').innerText.split('\n').join('');
      }
      var tag = document.createElement('div');
      var text = document.createTextNode(listPrice);
      tag.appendChild(text);
      tag.setAttribute('id', 'listPrice');
      document.body.appendChild(tag);

      const availability = document.getElementsByClassName('btn-add-basket')[0] ? document.getElementsByClassName('btn-add-basket')[0].disabled : true;
      let avl;
      if (availability) {
        avl = 'Out Of Stock';
      } else {
        avl = 'In Stock';
      }
      var available = document.createElement('div');
      var avail = document.createTextNode(avl);
      available.appendChild(avail);
      available.setAttribute('id', 'availability');
      document.body.appendChild(available);

      const rateCnt = document.evaluate('//span[contains(@class,"rating")]/descendant::span[contains(@class,"rating_avis")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue ? document.evaluate('//span[contains(@class,"rating")]/descendant::span[contains(@class,"rating_avis")]/u[text()]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText.split(' ')[0] : '';
      var rate = document.createElement('div');
      var rateCount = document.createTextNode(rateCnt);
      rate.appendChild(rateCount);
      rate.setAttribute('id', 'rateCnt');
      document.body.appendChild(rate);

      const rated = document.evaluate('//span[contains(@class,"rating")]/descendant::span[contains(@class,"rating_avis")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue ? document.evaluate('//span[contains(@class,"rating")]/descendant::span[contains(@class,"rating_avis")][text()]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText.split(' ')[0].split('/')[0].replace(',', '.') : '';
      var rating = document.createElement('div');
      var r = document.createTextNode(rated);
      rating.appendChild(r);
      rating.setAttribute('id', 'rated');
      document.body.appendChild(rating);

      const shipDim = document.evaluate('//th[contains(text(),"Dimensions")]/following-sibling::td[@class="font-2-b"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue ? document.evaluate('//th[contains(text(),"Hauteur")]/following-sibling::td[@class="font-2-b"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue ? document.evaluate('//th[contains(text(),"Dimensions")]/following-sibling::td[@class="font-2-b"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText : document.evaluate('//th[contains(text(),"Hauteur")]/following-sibling::td[@class="font-2-b"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText : '';
      var shippingDim = document.createElement('div');
      var dim = document.createTextNode(shipDim);
      shippingDim.appendChild(dim);
      shippingDim.setAttribute('id', 'shipDim');
      document.body.appendChild(shippingDim);
    });
    return await context.extract(productDetails);
  },
};
