const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'mediamarkt_ch_fr',
    transform: cleanUp,
    domain: 'mediamarkt.ch',
    zipcode: "''",
  },
  implementation: async ({ inputString }, { transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
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
          const name = `product-${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
          addElementToDocument(name, data[key]);
        }
      }
      const data = {};
      const prefix = 'http:';
      data.photo = prefix + document.querySelector('#product-sidebar > div.preview > a > img').getAttribute('src');
      data.imgAlt = document.querySelector('#product-sidebar > div.preview > a > img').getAttribute('alt');
      const alternateImages = document.querySelectorAll('#product-sidebar > ul > li').length > 1
        // @ts-ignore
        ? [...document.querySelectorAll('#product-sidebar > ul > li')].map(el => prefix + el.querySelector('a').getAttribute('data-preview')).slice(1) : [];
      data.secImageTotal = alternateImages.length || null;
      data.alternateImages = alternateImages.join(' | ');
      data.price = document.querySelector('div.price-sidebar meta[itemprop="price"]') ? document.querySelector('div.price-sidebar meta[itemprop="price"]').getAttribute('content') : '';
      data.listPrice = document.querySelector('div.price-details.has-old-price > div.old-price-block > div')
        ? document.querySelector('div.price-details.has-old-price > div.old-price-block > div').textContent.replace(/\n|.-/g, '') : data.price;
      data.availabilityText = document.querySelector('#pdp-add-to-cart') ? 'In Stock' : 'Out Of Stock';
      data.aggregateRating = document.querySelector('div.bv_avgRating_component_container')
        ? document.querySelector('div.bv_avgRating_component_container').textContent : '';
      const uomText = document.evaluate('//section/h2[contains(text(), "Informations nutritionnelles")]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      const uomMatch = uomText.match(/(\d+.?\d+?)\s?(\w+)/);
      if (uomMatch) {
        data.servingSize = uomMatch[1] || '';
        data.servingSizeUom = uomMatch[2] || '';
      }
      let weight = document.evaluate('//dl[@class="specification"]/dt[text()="Poids:"]/following-sibling::dd[1]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      const saturatedFat = document.evaluate('//dl[@class="specification"]/dt[contains(text(),"gras saturés:")]/following-sibling::dd[1]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      data.saturatedFat = saturatedFat.match(/(\d+(.\d+)?)\s?(\w+)/) ? saturatedFat.match(/(\d+(.\d+)?)\s?(\w+)/)[1] : '';
      data.saturatedFatUom = saturatedFat.match(/(\d+(.\d+)?)\s?(\w+)/) ? saturatedFat.match(/(\d+(.\d+)?)\s?(\w+)/)[3] : '';
      if (!weight || weight === '-') weight = document.evaluate('//dl[@class="specification"]/dt[text()="Volume de ventes:"]/following-sibling::dd[1]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      if (!weight || weight === '-') weight = document.evaluate('//dl[@class="specification"]/dt[text()="Quantité de remplissage nette:"]/following-sibling::dd[1]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      if (weight && weight !== '-') data.weightNet = weight;
      data.url = window.location.href;
      const upcMatch = document.evaluate('//script[contains(text(),\'"ean"\')]', document, null, XPathResult.STRING_TYPE, null).stringValue.match(/"ean":"(.*?)"/);
      if (upcMatch && upcMatch.length) data.upc = upcMatch[1];
      data.description = document.evaluate('concat(//dl[@class="product-details"],//article[contains(@class,"description")])', document, null, XPathResult.STRING_TYPE, null).stringValue.replace(/\n|montrer plus/g, ' ').replace(/\s+/g, ' ').trim();
      appendData(data);
    });
    await context.extract(productDetails, { transform });
  },
};
