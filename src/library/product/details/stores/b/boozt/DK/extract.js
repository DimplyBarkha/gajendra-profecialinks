const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'boozt',
    transform: cleanUp,
    domain: 'boozt.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {

    await context.evaluate(async () => {
      // await new Promise((resolve, reject) => setTimeout(resolve, 3000));

      function addElementToDocument(id, value, key) {
        const catElement = document.createElement('div');
        catElement.id = id;
        catElement.innerText = value;
        catElement.setAttribute('content', key);
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };
      const availability = document.querySelector("meta[property='og:availability']") ? document.querySelector("meta[property='og:availability']").getAttribute('content') : '';
      addElementToDocument('availability', availability === 'instock' ? 'In Stock' : 'Out Of Stock');
    });
    await context.extract(productDetails);

    const allInfo = await context.evaluate(async function () {
      // taking all buttons with information about the product
      const infoBtns = document.querySelectorAll('div.pp-tabs__list button');

      var allInfoRaw = {
        prodInfo: '',
        careTips: '',
        shippingInfo: '',
      };

      // iteration through all the buttons and click on them for loading the div with text
      for (let i = 0; i < infoBtns.length; i++) {
        if (infoBtns[i].innerText === 'BÆREDYGTIG FASHION' || infoBtns[i].innerText === 'TØJPLEJE' || infoBtns[i].innerText === 'CARE TIPS') {
          infoBtns[i].click();
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          const careTips = document.querySelector('div.pp-tabs__content.pp-content').innerText;
          allInfoRaw.careTips = careTips;
        }
      }
      return allInfoRaw;
    });

    var dataRef = await context.data();

    if (!('productOtherInformation' in dataRef[0].data[0].group[0])) {
      dataRef[0].data[0].group[0].productOtherInformation = [{ text: allInfo.careTips }];
    } else if ('text' in dataRef[0].data[0].group[0].productOtherInformation[0]) {
      dataRef[0].data[0].group[0].productOtherInformation[0].text = allInfo.careTips;
    } else {
      dataRef[0].data[0].group[0].productOtherInformation[0].push({ text: allInfo.careTips });
    }
  },
};
