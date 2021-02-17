const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'snipes',
    transform: cleanUp,
    domain: 'snipes.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      try {
        // @ts-ignore
        document.querySelector('button[class="js-close-btn a-modal-close-button close"]>span[class="i-close-thin"]').click();
        // eslint-disable-next-line promise/param-names
        await new Promise(r => setTimeout(r, 6000));
      } catch (error) {
      }
      try {
        // @ts-ignore
        document.querySelector('span[class="i-close-circle"]').click();
        // eslint-disable-next-line promise/param-names
        await new Promise(r => setTimeout(r, 6000));
      } catch (error) {
      }
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function addHiddenDiv (id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.getElementsByClassName('variants')[index].appendChild(newDiv);
      }
      function addEmptyDiv () {
        const newDiv = document.createElement('div');
        newDiv.className = 'variants';
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      var pp = getAllXpath("(//div[@class='b-pdp-attribute b-pdp-attribute--size js-pdp-attributes--size']/div/a/@data-value)", 'nodeValue');
      if (pp != null) {
        var ab = pp.join(' | ');
        addElementToDocument('ab', ab);
      }

      // var desc = getAllXpath("//div[@class='b-details-content']/ul/li/text()", 'nodeValue');
      // if (desc != null) {
      //   var specs = desc.join(' || ');
      //   addElementToDocument('specs', specs);
      // }

      // Method to Retrieve Xpath content of a Multiple Nodes

      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      // var description = getXpath('//div[@class="js-target"]/a/text()', 'nodeValue');
      // var description1 = getXpath("(//div[@class='b-pdp-carousel-item']/picture/img/@alt)[1]", 'nodeValue');
      // description = description + ' ' + description1;
      // addElementToDocument('description', description);

      // availability
      var aval = getXpath('//span[@class="b-availability-label-message js-availability-label-message"]/text()[1]', 'nodeValue');
      if (aval != null) {
        if (aval.includes('Dieser Artikel ist online leider nicht mehr verfügbar.')) {
          aval = 'Out of stock';
          addElementToDocument('aval', aval);
        } else {
          aval = 'In stock';
          addElementToDocument('aval', aval);
        }
      } else {
        aval = 'In stock';
        addElementToDocument('aval', aval);
      }
      // aggregateRating
      var str = getXpath('(//div[@class="b-rating-value"]/@style)[1]', 'nodeValue');
      if (str != null) {
        // for (var i = 0; i < str.length; i++) {
        var abc = str.split(': ')[1];
        abc = abc.slice(0, -1);
        abc = (abc) / 20;
        console.log('amol' + abc);
        addElementToDocument('agg', abc);
        // }
      }
      // alternateimage
      var alternateimage = getAllXpath('(//div[@class="b-pdp-thumbs-carousel js-pdp-thumbs-carousel slick-initialized slick-slider slick-vertical"])/div/div/div[position()>1 and position() <= last()]/div/div/picture/img/@src', 'nodeValue');
      if (alternateimage != null) {
        var AltImg = alternateimage.join(' | ');
        addElementToDocument('AltImg', AltImg);
      }
      // quantity
      var qq = getAllXpath('//div[@class="b-swatch-value-wrapper"]/a/span/span/text()', 'nodeValue');
      var color1 = getXpath("(//td[@class='b-fact-value js-fact-value']/text())[3]", 'nodeValue');
      var id = getXpath("//div[@class='s-pdp l-container js-product-details']/@data-pid", 'nodeValue');
      if (qq != null) {
        for (var i = 0; i < qq.length; i++) {
          var colorVar = color1 + ' - ' + qq[i];
          var vid = '';
          if (i < 10) {
            vid = id + '0000000' + [i];
          } else {
            vid = id + '000000' + [i];
          }

          addEmptyDiv();
          addHiddenDiv('qty', qq[i], i);
          addHiddenDiv('colorVar', colorVar, i);
          addHiddenDiv('variantId', vid, i);
          // console.log('amol'+qq[i]);
        }
      }
      // var availability = document.querySelectorAll('div[class="b-swatch-value-wrapper"] a span[class*="js-pdp-attribute-tile"]')
      var availability = getAllXpath('//div[@class="b-swatch-value-wrapper"]/a/span/@class', 'nodeValue');
      if (availability.length >= 1) {
        var avail = [];
        for (var j = 0; j < availability.length; j++) {
          if (availability[j].includes('orderable')) {
            avail[j] = 'In stock';
          } else {
            avail[j] = 'Out Of Stock';
          }
          addHiddenDiv('availability1', avail[j], j);
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
