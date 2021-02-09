const { cleanUp } = require('../../../../shared.js');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RO',
    store: 'emag',
    transform: cleanUp,
    domain: 'emag.ro',
    zipcode: '',
  },
  implementation: async function implementation (inputs, parameters, context, dependencies) {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    function reduceInfoToOneField (field, separator = ' ') {
      if (field && field.length > 1) {
        field[0].text = field.map((element) => {
          return element.text;
        }).join(separator);
        field.splice(1);
      }
    }

    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // select each text node in description section and replace signs which are indicating that text is bullet point to double pipes
      function changeTextBulletPointsToDoublePipes (xpath) {
        const descriptionTextNodes = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < descriptionTextNodes.snapshotLength; i++) {
          console.log(descriptionTextNodes.snapshotItem(i).textContent);
          descriptionTextNodes.snapshotItem(i).textContent = descriptionTextNodes.snapshotItem(i).textContent.replace(/^\s*?(•|-|\d\.|✓)/gm, 'SPACEHERE||SPACEHERE');
          if ((/^\s*(•|-|\*|\d\.|✓)\s*$/).test(descriptionTextNodes.snapshotItem(i).textContent)) {
            descriptionTextNodes.snapshotItem(i).textContent = descriptionTextNodes.snapshotItem(i).textContent.replace(/^\s*(•|-|\d\.|✓)\s*$/, 'SPACEHERE||SPACEHERE');
          }
        }
      }
      // appending double pipes to each li tag in description SPACEHERE placeholder must be appended because spaces at the start of each textNode are beeing omitted durring extraction
      function changeLiBulletsPointsToDoublePipes (selector) {
        const bulletTextElements = document.querySelectorAll(selector);
        if (bulletTextElements) {
          bulletTextElements.forEach(el => {
            el.textContent = ` || ${el.textContent}`;
            addElementToDocument('bullet', el.textContent);
          });
        }
      }
      changeTextBulletPointsToDoublePipes('//div[@id="description-body"]//*[not(contains(@class,"plyr"))]/text()[not(.="0")] | //div[@id="description-body"]/text()');
      changeLiBulletsPointsToDoublePipes('div#description-body li');
      addElementToDocument('url', window.location.href);

      const otherInfo = document.evaluate('//p[contains(.,"Caracteristici generale")]/following-sibling::div[@class="table-responsive"]//tbody/tr', document, null, XPathResult.ANY_TYPE, null);
      const nodes = [];
      let node;
      node = otherInfo.iterateNext();
      while (node) {
        nodes.push(node);
        node = otherInfo.iterateNext();
      }
      if (nodes.length > 0) {
        let text = '';
        nodes.forEach(info => {
          text += `${info.textContent.trim()} || `;
        });
        text = text.slice(0, -3);
        addElementToDocument('other-info', text);
      }

      const price = document.querySelector('div.product-highlights-wrapper p.product-new-price');
      if (price) {
        price.querySelector('sup').textContent = `,${price.querySelector('sup').textContent}`;
        addElementToDocument('price', price.textContent.replace(/\./g, '').match(/\d.+/)[0]);
      } else {
        const priceFromScript = document.evaluate('//script[contains(.,"offer_id")]', document, null, XPathResult.STRING_TYPE, null).stringValue;
        if (priceFromScript && /price: {"current":(.+?),/.test(priceFromScript)) {
          addElementToDocument('price', priceFromScript.match(/price: {"current":(.+?),/)[1].replace(/\./g, ',') + ' Lei');
        }
      }
    });

    const dataRef = await context.extract(productDetails, { transform });
    /* to correctly scrape additional description / bullet fields we need to go through all textNodes (avoiding textNodes from videos etc and taking into consideration that emag details page DOM is complicated)
       this way in remote runs extractor might scrape duplicates of textNodes which we remove here omitting textNodes which indicating that there is a bullet point there */
    if (dataRef[0].group[0].description) {
      dataRef[0].group[0].description = dataRef[0].group[0].description.filter((v, i, a) => {
        return v.text === 'SPACEHERE||SPACEHERE' ? true : a.findIndex(t => (t.text === v.text)) === i;
      });
    }
    reduceInfoToOneField(dataRef[0].group[0].description, '');
    reduceInfoToOneField(dataRef[0].group[0].directions);
    if (dataRef[0].group[0].manufacturerDescription && dataRef[0].group[0].manufacturerDescription.length > 1) {
      dataRef[0].group[0].manufacturerDescription = dataRef[0].group[0].manufacturerDescription.filter((v, i, a) => a.findIndex(t => (t.text === v.text)) === i);
      reduceInfoToOneField(dataRef[0].group[0].manufacturerDescription);
    }
    if (dataRef[0].group[0].listPrice) {
      if (dataRef[0].group[0].listPrice[0].text === ',') {
        delete dataRef[0].group[0].listPrice;
      }
    }
    if (dataRef[0].group[0].price) {
      if (dataRef[0].group[0].price[0].text === ',') {
        delete dataRef[0].group[0].price;
      }
    }
    if (dataRef[0].group[0].description && dataRef[0].group[0].description[0].text.includes('||')) {
      dataRef[0].group[0].description[0].text = dataRef[0].group[0].description[0].text.replace(/\s{2,}/g, ' ').replace(/SPACEHERE/g, ' ');
      dataRef[0].group[0].descriptionBullets = [{
        text: dataRef[0].group[0].description[0].text.match(/\|\|/gm).length,
      }];
    }

    if (dataRef[0].group[0].aggregateRating) {
      dataRef[0].group[0].aggregateRating[0].text = dataRef[0].group[0].aggregateRating[0].text.replace('.', ',');
      dataRef[0].group[0].aggregateRatingText[0].text = dataRef[0].group[0].aggregateRatingText[0].text.replace('.', ',');
    }
    if (dataRef[0].group[0].variants) {
      dataRef[0].group[0].variantCount[0].text = dataRef[0].group[0].variants.length;
    }
    if (dataRef[0].group[0].gtin) {
      dataRef[0].group[0].gtin[0].text = dataRef[0].group[0].gtin[0].text.match(/: (.+)/)[1];
    }
    if (dataRef[0].group[0].mpc) {
      dataRef[0].group[0].mpc[0].text = dataRef[0].group[0].mpc[0].text.match(/: (.+)/)[1];
    }
    if (dataRef[0].group[0].brandLink) {
      dataRef[0].group[0].brandLink[0].text = `http://www.emag.ro${dataRef[0].group[0].brandLink[0].text}`;
    }
    if (dataRef[0].group[0].manufacturerDescription) {
      dataRef[0].group[0].manufacturerDescription[0].text = dataRef[0].group[0].manufacturerDescription[0].text.replace(/\|\| /g, '').replace(/SPACEHERE/g, ' ');
    }
    if (dataRef[0].group[0].price) {
      if (/oferte/.test(dataRef[0].group[0].price[0].text)) {
        dataRef[0].group[0].price[0].text = dataRef[0].group[0].price[0].text.match(/(\d+,?\d+ Lei)/)[1];
      }
    }
    if (dataRef[0].group[0].videos) {
      dataRef[0].group[0].videos.forEach((element, index) => {
        if (element.text.includes('[')) {
          element.text.match(/"mp4":.+?url":"(.+?)"/).length > 1 ? element.text = element.text.match(/"mp4":.+?url":"(.+?)"/)[1] : delete dataRef[0].group[0].videos[index];
        }
      });
    }
    return dataRef;
  },
};
