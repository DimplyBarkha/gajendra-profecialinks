const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'otto-office',
    transform: transform,
    domain: 'otto-office.com',
    zipcode: '',
  },
implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
  await context.evaluate(() => {
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    function addHiddenDiv1(id, content, index) {
      const newDiv = document.createElement("div");
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = "none";
      const originalDiv = document.querySelectorAll('h1[id="oo-block-hl"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    let rawRating=document.querySelectorAll('div[class="item-rating-stars_gold ooB-abs"]');
    let temp;
    for(let i=0; i<rawRating.length; i++){
      temp = rawRating[i].getAttribute('style')
      temp = temp.match(/width:(\d*)px;/g);
    }



  });
  await context.extract(productDetails);
},
};
