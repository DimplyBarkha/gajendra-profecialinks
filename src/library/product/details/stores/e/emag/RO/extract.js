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
        let indexOfLastBullet;
        const descriptionTextNodes = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < descriptionTextNodes.snapshotLength; i++) {
          descriptionTextNodes.snapshotItem(i).textContent = descriptionTextNodes.snapshotItem(i).textContent.replace(/^\s*?(•|-|\d\.|✓)/gm, 'SPACEHERE||SPACEHERE');
          if ((/^\s*(•|-|\*|\d\.|✓)\s*$/).test(descriptionTextNodes.snapshotItem(i).textContent)) {
            descriptionTextNodes.snapshotItem(i).textContent = descriptionTextNodes.snapshotItem(i).textContent.replace(/^\s*(•|-|\d\.|✓)\s*$/, 'SPACEHERE||SPACEHERE');
          }
          if (descriptionTextNodes.snapshotItem(i).textContent.includes('||')) {
            indexOfLastBullet = i;
          }
        }
        if (/^(SPACEHERE\|\|SPACEHERE)\s$/.test(descriptionTextNodes.snapshotItem(indexOfLastBullet).textContent)) {
          descriptionTextNodes.snapshotItem(descriptionTextNodes.snapshotLength - 1).textContent += ' |';
        } else {
          descriptionTextNodes.snapshotItem(indexOfLastBullet).textContent += ' |';
        }
      }
      // appending double pipes to each li tag in description SPACEHERE placeholder must be appended because spaces at the start of each textNode are beeing omitted durring extraction
      function changeLiBulletsPointsToDoublePipes (selector) {
        const bulletTextElements = document.querySelectorAll(selector);
        if (bulletTextElements) {
          bulletTextElements.forEach((el, index, array) => {
            el.textContent = `SPACEHERE|| ${el.textContent}`;
            if (index === array.length - 1) {
              el.textContent += ' |';
            }
            addElementToDocument('bullet', el.textContent);
          });
        }
      }

      /** Function used to extract all paragraph's text under given headers indicated by <strong> or <b> tag.
     * @param {object} node Parent node of all elements we want to iterate over
     * @param {Array} headers List of paragraph's headers that once we meet we start adding following paragraph's text
     */
      const addFollowingHeadersParagraphs = (key, node, headers) => {
        if (node === null) {
          return;
        }
        const parentNode = document.evaluate('self::*/ancestor::div', node, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
        const elements = document.createElement('div');
        let foundStartTitleFlag = false;
        elements.id = key;
        const allElements = parentNode.childNodes;
        for (let i = 0; i < allElements.length; i++) {
          const element = allElements[i];
          if (!headers || headers.some((header) => element.textContent.toLowerCase().trim().includes(header.toLowerCase()))) foundStartTitleFlag = true;
          if (!foundStartTitleFlag) continue;
          if (element.nodeType === 1 && (element.querySelector('Strong') || element.nodeName === 'STRONG') && !headers.some((header) => element.textContent.toLowerCase().trim().includes(header.toLowerCase()))) {
            console.log(element);
            break;
          }
          elements.appendChild(element.cloneNode(true));
        }
        document.body.appendChild(elements);
      };

      /** Function used to extract all paragraph's text starting with on of given phrases. We find textNode with one of given phrases in given node and then we move to its parent. Doing that we made sure that
     * we are selecting correct element which contains textNode childrens with desired data. Function stops appeding data to created Div if we encounter given nodeName for given times in a row
   * @param {object} node Node in which we want to look for specific textNode
   * @param {Array} textArray List of paragraph's texts that we whish to find in given node
   * @param {String} nodeNameToStop Node name which we want to count in each iteration
   * @param {Number} stopCounter Number indicating needed quantity of encounters for given nodeName in rows to stop iterating over textNodes
   */
      const addFollowingParagraphs = (key, node, textArray, nodeNameToStop, stopCounter) => {
        if (node === null) {
          return;
        }
        let parentNode;
        for (let i = 0; i < textArray.length; i++) {
          const tempNode = document.evaluate(`//text()[contains(.,"${textArray[i]}")]/..`, node, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
          if (tempNode !== null) {
            if (tempNode.nodeName === 'B' || tempNode.nodeName === 'STRONG') {
              parentNode = document.evaluate(`//text()[contains(.,"${textArray[i]}")]/../..`, node, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
              break;
            } else {
              parentNode = tempNode;
              break;
            }
          }
        }
        if (parentNode !== undefined) {
          let encounteredNodeInRow = 0;
          const elements = document.createElement('div');
          elements.id = key;
          let reading;
          const allElements = parentNode.childNodes;
          for (let i = 0; i < allElements.length; i++) {
            const element = allElements[i];
            element.nodeName === nodeNameToStop ? encounteredNodeInRow += 1 : encounteredNodeInRow = 0;
            if (!textArray || textArray.some((startTitleElem) => element.textContent.toLowerCase().trim().includes(startTitleElem.toLowerCase()))) reading = true;
            if (encounteredNodeInRow === stopCounter) break;
            if (reading) {
              elements.appendChild(element.cloneNode(true));
            }
          }
          document.body.appendChild(elements);
        }
      };

      const headerContainingElement = document.evaluate('//strong[contains(. , "Mod de preparare:")] | //strong[contains(. , "Instructiuni folosire:")] | //strong[contains(. , "Instructiuni ingrijire:")] | //strong[contains(. , "Utilizare:")] | //strong[contains(. , "Instructiuni utilizare:")] | //strong[contains(. , "Mod de utilizare:")] | //strong[contains(. , "Instructiuni de preparare:")] | //b[contains(. , "Instructiuni folosire:")] | //b[contains(. , "Instructiuni ingrijire:")] | //b[contains(. , "Utilizare:")] | //b[contains(. , "Instructiuni utilizare:")] | //b[contains(. , "Mod de utilizare:")] | //b[contains(. , "Instructiuni de preparare:")] | //b[contains(. , "Mod de preparare:")] ', document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
      const descriptionElement = document.evaluate('//div[@id="description-body"]', document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
      const allowedHeadersArray = ['Instructiuni folosire', 'Instructiuni ingrijire', 'Utilizare', 'Instructiuni utilizare', 'Mod de utilizare', 'Instructiuni de preparare:', 'Mod de preparare:'];
      addFollowingHeadersParagraphs('directions-from-headers', headerContainingElement, allowedHeadersArray);
      addFollowingParagraphs('directions-from-text-nodes', descriptionElement, allowedHeadersArray, 'BR', 2);

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
        addElementToDocument('specifications', text);
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
       this way in remote runs extractor might scrape duplicates of textNodes which we remove here omitting textNodes which indicating that there is a bullet point there because there might be multiple textNodes with just
       bullet points signs
       */
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
      if (/(\|\|.+)\|/.test(dataRef[0].group[0].description[0].text)) {
        dataRef[0].group[0].additionalDescBulletInfo = [{
          text: dataRef[0].group[0].description[0].text.match(/(\|\|.+)\|/)[1],
        }];
      }
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
      dataRef[0].group[0].manufacturerDescription[0].text = dataRef[0].group[0].manufacturerDescription[0].text.replace(/SPACEHERE\|\|SPACEHERE /g, '');
      dataRef[0].group[0].manufacturerDescription[0].text = dataRef[0].group[0].manufacturerDescription[0].text.replace(/\|\|/g, '');
    }
    if (dataRef[0].group[0].manufacturerImages) {
      dataRef[0].group[0].manufacturerImages = dataRef[0].group[0].manufacturerImages.filter((v, i, a) => a.findIndex(t => (t.text === v.text)) === i);
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
