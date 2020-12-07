const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    transform: cleanUp,
    domain: 'coolblue.nl',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
/*     function reduceInfoToOneField (field) {
      if (field && field.length > 1) {
        let fieldText = '';
        field.forEach(element => {
          fieldText += ' -' + element.text;
        });
        field[0].text = fieldText.replace(/\n/g, ': ');
        return field.splice(1);
      }
    } */
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const blacklist = ['Artikelnummer', 'Fabrikantcode', 'Merk', 'Garantie'];
      const otherInfo = document.querySelectorAll('div.product-specs>dl');
      const fillteredInfo = await [...otherInfo].filter(u => blacklist.every(s => !u.getAttribute('data-property-name').includes(s)));
      if (fillteredInfo) {
        let text = '';
        fillteredInfo.forEach(info => {
          text += info.getAttribute('data-property-name');
          text += ` - ${info.querySelector('dd').textContent.trim()} || `;
        });
        if (text) {
          document.querySelector('div.js-specifications-content').setAttribute('product-other-information', text.slice(0, text.length - 4));
        }
      }
      addElementToDocument('url', window.location.href);
      const pdfPresent = document.evaluate('(//div[@class="js-product-in-the-box-container"]//a[contains(@data-trackclickevent,"Download manual") and contains(@href,"pdf")])[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (pdfPresent) {
        console.log('jest pdfik');
        pdfPresent.setAttribute('pdf-present', 'Yes');
      }
    });
    const dataRef = await context.extract(productDetails, { transform });
    if (dataRef[0].group[0].aggregateRating) {
      dataRef[0].group[0].aggregateRating[0].text = dataRef[0].group[0].aggregateRating[0].text.replace('.', ',');
    }

    /* reduceInfoToOneField(dataRef[0].group[0].additionalDescBulletInfo); */
    /*  dataRef[0].group[0].variantId[0].text = dataRef[0].group[0].variantId[0].text.match(/:"(\w+)"/)[1]; */
    return dataRef;
  },
};
