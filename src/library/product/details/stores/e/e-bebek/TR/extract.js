
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'e-bebek',
    transform: null,
    domain: 'e-bebek.com',
    zipcode: '',
  },
  implementation: async ({ inputString, id }, { transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const addElementToDocument = (key, value) => {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };
      function appendData (data) {
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const name = `added-${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
          addElementToDocument(name, data[key]);
        }
      }
      const data = {};
      data.rating = document.querySelector('#addToCartForm > input[name=averageRating]')
        ? document.querySelector('#addToCartForm > input[name=averageRating]').getAttribute('value').replace('.', ',') : '';
      data.quantity = document.querySelector('h1.product-title').textContent.match(/(\d+) Adet/)
        ? document.querySelector('h1.product-title').textContent.match(/(\d+) Adet/)[1] : '';
      data.zoom = document.querySelector('img.zoomImg') ? 'Yes' : 'No';
      const unitPriceArr = document.querySelector('div.product-detail-main span.price-unit')
        ? document.querySelector('div.product-detail-main span.price-unit').textContent.split(':') : [];
      if (unitPriceArr.length && unitPriceArr.length === 2) {
        data.unitPriceUom = unitPriceArr[0].trim();
        data.unitPrice = unitPriceArr[1].trim();
      }
      // const additionalDescMatch = document.evaluate('concat(//meta[@property="og:title"]/@content, //meta[@property="og:description"]/@content,//div[@class="detail-list card-body"])',
      //   document, null, XPathResult.STRING_TYPE, null).stringValue.replace(/\n/g, '').replace(/\s+/g, ' ').match(/Özellikleri: (.*)/);
      const descHeader = document.querySelector('div.product-detail h3') ? document.querySelector('div.product-detail h3').textContent : '';
      const additionalDesc = document.querySelector('div.product-detail div.card')
        ? document.querySelector('div.product-detail div.card').textContent.replace(/\n/g, '').replace(/\s+/g, ' ').replace(/kWidget.thumbEmbed((.*?));/, '') : '';
      if (additionalDesc) data.additionalDesc = descHeader ? `${descHeader} ${additionalDesc}` : additionalDesc;
      const videoId = document.querySelector('div[itemprop=video]') ? document.querySelector('div[itemprop=video]').getAttribute('id') : '';
      const videoBtn = document.querySelector('button.kWidgetPlayBtn');
      data.warranty = document.querySelector('div[class="card warranty"]')
        ? document.querySelector('div[class="card warranty"]').textContent.replace(/\n/g, '').replace(/\s+/g, ' ') : '';
      if (videoBtn) {
        // @ts-ignore
        await videoBtn.click();
        await new Promise(resolve => setTimeout(resolve, 250));
      }
      if (videoId) {
        try {
          // @ts-ignore
          data.video = window.KWidget.iframeUrls[videoId].match(/(.*?)&flashvars/)[1];
        } catch (e) {
          console.log('Error extracting video url.');
        }
      }
      appendData(data);
    });
    await context.extract(productDetails, { transform });
  },
};
