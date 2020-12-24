const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NO',
    store: 'blivakker',
    transform: transform,
    domain: 'blivakker.no',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      const findScriptValue = (xpath) => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const textContent = element.textContent;
        return textContent;
      };

      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      const aggregateRatingPath = getXpath("//div[@itemprop='ratingValue']/text()", 'nodeValue');
      // eslint-disable-next-line quotes
      console.log(">>>>>>>>>>" + aggregateRatingPath);
      if (aggregateRatingPath) {
        addElementToDocument('added_aggregateRating', aggregateRatingPath.replace('.', ','));
      }
      // added name
      // var nameText = getXpath('//h1[@data-dmid="detail-page-headline-product-title"]/text()', 'nodeValue');
      // var nameValue = nameText.split(',');
      // addElementToDocument('addedName', nameValue[(0)]);

      // Single Pipe Concatenation
      // const pipeSeparatorSingle = (id, data) => {
      //   var singleSeparatorText = data.join(' | ');
      //   addElementToDocument(id, singleSeparatorText);
      // };
      // Double Pipe Concatenation
      const pipeSeparatorDouble = (id, data) => {
        var doubleSeparatorText = data.join(' || ');
        addElementToDocument(id, doubleSeparatorText);
      };
      const pricePerProductNode = getXpath("//div[@data-dmid='detail-page-base-price-container']//div[@data-dmid='product-base-price']/text()", 'nodeValue');
      if (pricePerProductNode != null) {
        var pricePerProduct = pricePerProductNode.substr((pricePerProductNode.indexOf('(') + 1), pricePerProductNode.length);
        var finalValue = pricePerProduct.split('/');
        addElementToDocument('addedPricePerProduct', finalValue[0]);
      }

      const additionalDescription = getAllXpath("//div[@data-dmid='detail-first-section']//ul[@data-dmid='description-relevant-selling-points']/li/text() | //div[@data-dmid='expandable-text-container']/@content", 'nodeValue');
      addElementToDocument('addedAdditionalDescription', additionalDescription);
      if (additionalDescription !== null && additionalDescription.length > 0) {
        pipeSeparatorDouble('addedAdditionalDescription', additionalDescription);
      }
      // const getSize = getXpath("//meta[@property='og:url']/@content", 'nodeValue');
      // if (getSize !== '') {
      //   var getSizeArr = getSize.split('-');
      //   if (getSizeArr !== '' && getSizeArr.length > 0) {
      //     if (getSizeArr[getSizeArr.length - 1] !== '' && ( getSizeArr[getSizeArr.length - 1] =='ml'|| getSizeArr[getSizeArr.length - 1]=='')) {
      //       addElementToDocument('added_size', (getSizeArr[getSizeArr.length - 2] + getSizeArr[getSizeArr.length - 1]));
      //       // addElementToDocument('added_size_unm', sizeValue[getSizeArr.length - 2]);
      //     }
      //   }
      // }
      var sizeText = getXpath('//h1[@data-dmid="detail-page-headline-product-title"]/text()', 'nodeValue');
      console.log('sizeText', sizeText);
      if (sizeText != null) {
        var sizeValue = sizeText.split(',');
        console.log('sizeValue', sizeValue);
        addElementToDocument('addedSize', sizeValue[(sizeValue.length - 1)]);
        addElementToDocument('addedName', sizeValue[0]);
      }
      var aa = findScriptValue("//script[@type='application/ld+json']/text()");
      // console.log('===========' + aa);
      var sku = '';
      if (aa != null) {
        var obj1 = JSON.parse(aa);
        console.log('===========');
        console.log(obj1);
        addElementToDocument('nameExtended', (obj1 && obj1.name) ? obj1.name : '');
        console.log(obj1.offers.availability);
        var str = obj1.offers.availability;
        var res = str.split('/');
        console.log(res[res.length - 1]);
        if (res[res.length - 1] === 'InStock') {
          addElementToDocument('availabilityText', 'In Stock');
        } else {
          addElementToDocument('availabilityText', 'Out Of Stock');
        }
        addElementToDocument('availabilityText', obj1.offers.availability);
        addElementToDocument('brandText', ((obj1 && obj1.brand) && obj1.brand.name) ? obj1.brand.name : '');
        console.log(obj1.sku);
        addElementToDocument('sku', obj1.sku);
        // console.log(obj1.aggregateRating.ratingCount);
        addElementToDocument('ratingCount', ((obj1 && obj1.aggregateRating) && obj1.aggregateRating.ratingCount) ? obj1.aggregateRating.ratingCount : '');
        // console.log(obj1.aggregateRating.ratingValue);
        if (((obj1 && obj1.aggregateRating) && obj1.aggregateRating.ratingValue)) {
          var avgRating = obj1.aggregateRating.ratingValue;
          avgRating = avgRating.replace(',', '.');
          console.log(avgRating);
          addElementToDocument('aggregateRating', avgRating);
        }
        console.log(obj1.sku);
        addElementToDocument('firstVariant', obj1.sku);
        sku = obj1.sku;
      }
      const variantInformation = getAllXpath("//div[@id='attributesOptionsWrapper']//input[@type='radio']/@aria-label", 'nodeValue');
      console.log(variantInformation);
      if (typeof variantInformation !== 'undefined' && variantInformation.length > 0) {
        var variantInformationAll = '';
        for (var informationKey in variantInformation) {
          variantInformationAll += variantInformation[informationKey] + ' - ' + sku + ', ';
          console.log('..............' + variantInformation[informationKey]);
        }
        variantInformationAll = variantInformationAll.replace(/,\s*$/, '');
        addElementToDocument('added_variant_information', variantInformationAll);
      }

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
