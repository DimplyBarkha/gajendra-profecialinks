const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'freshamazon',
    transform: cleanUp,
    domain: 'freshamazon.de',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // Method to Retrieve Xpath content of a Multiple Nodes
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      // Double Pipe Concatenation
      const pipeSeparatorDouble = (data) => {
        var doubleSeparatorText = data.join(' || ');
        return doubleSeparatorText;
      };
      // Single Pipe Concatenation
      const pipeSeparatorSingle = (id, data) => {
        var singleSeparatorText = data.join(' | ');
        addElementToDocument(id, singleSeparatorText);
      };
      var finalDesc = [];
      const aggregateRating = getAllXpath("//div[@id='feature-bullets']/ul/li/span/text()", 'nodeValue');
      if (aggregateRating.length > 0) {
        let liDescBullets = '||' + pipeSeparatorDouble(aggregateRating);
        finalDesc.push(liDescBullets);
      }
      var temp = '';
      const descText = document.querySelectorAll('div[id="productDescription"]');
      for (let i = 1; i < descText[0].children.length; i++) {
        // @ts-ignore
        if (descText[0].children[0].innerText == 'Produktbeschreibung') {
          // @ts-ignore
          temp = temp + descText[0].children[i].innerText;
          if (descText[0].children[i + 1].tagName == 'H3') {
            break;
          }
        }
      }
      if (temp.length > 0) {
        finalDesc.push(temp);
      }

      try {
        var descriptionTextContent = descText[0].children;
        var descriptionText = [];
        var descriptionTextFinal = '';
        for (let i = 0; i < descriptionTextContent.length; i++) {
          // @ts-ignore
          descriptionText.push(descriptionTextContent[i].innerText)
        }
        let k;
        k = descriptionText.indexOf('Inhaltsstoffe / Zutaten') + 1;
        for (k; k < descText[0].children.length; k++) {
          // @ts-ignore
          descriptionTextFinal = descriptionTextFinal + descText[0].children[k].innerText;
          try {
            if (descText[0].children[k + 1].tagName == 'H3') {
              break;
            }
          } catch (error) {
            break;
          }
        }
      } catch (error) {

      }
      addElementToDocument('ingredients', descriptionTextFinal);
      pipeSeparatorSingle('addProductDescription', finalDesc);
      const rating = getAllXpath("//span[@id='acrCustomerReviewText']/text()", 'nodeValue');
      let finalRating = rating[0].replace(/[^\d.-]/g, '');
      addElementToDocument('finalRating', finalRating);
      const ratingNumber = getAllXpath("//span[@data-hook='rating-out-of-text']/text()", 'nodeValue');
      addElementToDocument('finalratingNumber', ratingNumber[0].split(' ')[0].replace(',', '.'));
      try {
        // @ts-ignore
        const manufacturerDescription = document.querySelector('div[class*="aplus-v2 desktop celwidget"]').innerText;
        addElementToDocument('manufacturerDescription', manufacturerDescription);
        const aplusImages = getAllXpath("//div[@class='aplus-v2 desktop celwidget']//img/@src", 'nodeValue');
        pipeSeparatorSingle('aplusImages', aplusImages);
      } catch (error) {

      }
      try {
        // @ts-ignore
        var video = document.querySelectorAll('div[id="imageBlockVariations_feature_div"] script')[0].outerText;
        video = video.split('Query.parseJSON(\'')[1].split('\');')[0];
        video = JSON.parse(video);
        addElementToDocument('video', video.videos[0].url);
      } catch (error) {

      }
      try {
        const pasin = getAllXpath("(//div[@id='reviewsMedley']/following-sibling::script[@type='a-state'])[1]/text()", 'nodeValue');
        const finalpasin = JSON.parse(pasin[0]);
        addElementToDocument('finalpasin', finalpasin.pageRefreshUrlParams.parentAsin);
      } catch (error) {

      }
      let variant_asins = [], finalvariant_asins;
      try {
        finalvariant_asins = getAllXpath("//div[contains(@id,'variation')]/ul/li/@data-defaultasin", 'nodeValue');
        for (let j = 0; j < finalvariant_asins.length; j++) {
          if (finalvariant_asins[j].length > 1) {
            variant_asins.push(finalvariant_asins[j])
          }
        }
        if (variant_asins.length > 1) {
          pipeSeparatorSingle('variant_asins', variant_asins);
        }
        else {
          variant_asins = getAllXpath("//input[@name='askAsin']/@value", 'nodeValue');
          addElementToDocument('variant_asins', variant_asins[0]);
        }
      } catch (error) {

      }
      try {
        const price_per_unit = getAllXpath("//span[@class='a-size-small a-color-price']/text()", 'nodeValue');
        let price_per_unitFinal = price_per_unit[0].replace('(', '');
        price_per_unitFinal = price_per_unitFinal.replace(')', '');
        let price_per_unit_split = price_per_unitFinal.split('/');
        for (let j = 0; j < price_per_unit_split.length; j++) {
          if (j == 0) {
            addElementToDocument('price_per_unit_split', price_per_unit_split[j]);
          }
          if (j == 1) {
            addElementToDocument('price_per_unit_splitMeasaure', price_per_unit_split[j]);
          }
        }
      } catch (error) {

      }
      try {
        const brand = getAllXpath("//table[@id='productDetails_techSpec_section_1']/tbody/tr/th[contains(text(),'Marke')]/following-sibling::td/text() | //span[@class='a-size-base a-text-bold' and contains(text(),'Marke')]/parent::td/following-sibling::td/span/text() | //div[@class='a-section a-spacing-none' and contains(text(),'Marke')]/text() | //div[@class='a-section a-spacing-none']/a[contains(text(),'Marke')]/text()", 'nodeValue');
        let brandFinal = brand[0].replace('Marke:', '');
        addElementToDocument('brandFinal', brandFinal);
      } catch (error) {

      }
      try {
        const fat = getAllXpath("//*[normalize-space(text()) = 'Fett']/following-sibling::td/text()", 'nodeValue');
        addElementToDocument('fatFinal', fat);
        let fatFinal = fat[0].replace(/[^\w\s]/gi, '');
        fatFinal = fatFinal.replace(/[0-9]/g, '');
        addElementToDocument('fatFinalUOM', fatFinal);
      } catch (error) {

      }
      try {
        const carb = getAllXpath("//*[contains(text(),'Kohlenhydrate')]/following-sibling::td/text()", 'nodeValue');
        addElementToDocument('carbFinal', carb);
        let carbFinal = carb[0].replace(/[^\w\s]/gi, '');
        carbFinal = carbFinal.replace(/[0-9]/g, '');
        addElementToDocument('carbFinalUOM', carbFinal);
      } catch (error) {

      }
      try {
        const sugar = getAllXpath("//*[contains(text(),'Zucker')]/following-sibling::td/text()", 'nodeValue');
        addElementToDocument('sugarFinal', sugar);
        let sugarFinal = sugar[0].replace(/[^\w\s]/gi, '');
        sugarFinal = sugarFinal.replace(/[0-9]/g, '');
        addElementToDocument('sugarFinalUOM', sugarFinal);
      } catch (error) {

      }
      try {
        const protien = getAllXpath("//*[contains(text(),'Eiweiß')]/following-sibling::td/text()", 'nodeValue');
        addElementToDocument('protienFinal', protien);
        let protienFinal = protien[0].replace(/[^\w\s]/gi, '');
        protienFinal = protienFinal.replace(/[0-9]/g, '');
        addElementToDocument('protienFinalUOM', protienFinal);
      } catch (error) {

      }
      try {
        const altImages = getAllXpath("//div[@id='imageBlock']/following-sibling::script[contains(text(),'data')]/text()", 'nodeValue');
        let altImagesFInal = altImages[0].split('colorImages\': { \'initial\': ')[1].split('}]')[0] + '}]';
        altImagesFInal = JSON.parse(altImagesFInal);
        for (let i = 1; i < altImagesFInal.length; i++) {
          // @ts-ignore
          addElementToDocument('altImagesFInal', altImagesFInal[i].hiRes);
        }
      } catch (error) {

      }
      try {
        const salt = getAllXpath("//*[contains(text(),'Salz')]/following-sibling::td/text()", 'nodeValue');
        addElementToDocument('saltFinal', salt);
        let saltFinal = salt[0].replace(/[^\w\s]/gi, '');
        saltFinal = saltFinal.replace(/[0-9]/g, '');
        addElementToDocument('saltFinalUOM', saltFinal);
      } catch (error) {

      }
    });
    return await context.extract(productDetails, { transform });
  },
};
