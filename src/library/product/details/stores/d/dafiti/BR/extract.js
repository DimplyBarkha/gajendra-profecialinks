const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'dafiti',
    transform: transform,
    domain: 'dafiti.com.br',
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

      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 1000) {
          break;
        }
      }

      const availabilityText = getXpath("//div//button[contains(text(),'Comprar')]/text()", 'nodeValue');
      if (availabilityText.includes('Comprar')) {
        addElementToDocument('added_availabilityText', 'In Stock');
      } else {
        addElementToDocument('added_availabilityText', 'Out of Stock');
      }

      const description = getAllXpath("//p[@class='product-information-description']/text() |  //div[@class='box-informations']//table//tr/td/text()", 'nodeValue').join('||');
      addElementToDocument('added_description', description);

      let rating = getXpath("//span[@class='rating-value i-new-stars-on']/@style", 'nodeValue');
      console.log('rating fetched ' + rating);

      if (rating !== null && rating.includes('width')) {
        rating = rating.split(':');
        rating = rating[1];
        rating = rating.trim();
        console.log('rating fetched ' + rating);
        if (rating.includes('%')) {
          rating = rating.split('%');
          rating = rating[0];
          console.log('rating fetched ' + rating);
          rating = rating * 0.05;
          console.log('rating fetched ** ' + rating);
          addElementToDocument('added_rating', rating);
        }
      }
      let listPrice = getXpath("//span[@data-field='specialPrice']/text()", 'nodeValue');
      console.log('listPrice fetched ** ' + rating);
      if (listPrice.includes(',')) {
        listPrice = listPrice.replace(',', '.');
      }
      addElementToDocument('added_listPrice', listPrice);

      let price = getXpath("//div[@class='catalog-detail-price-line']/span[@data-field='finalPrice']/text()", 'nodeValue');
      console.log('price fetched ** ' + rating);
      if (price.includes(',')) {
        price = price.replace(',', '.');
      }
      addElementToDocument('added_price', price);

      const shippingInfo = getXpath("//p[@class='product-seller-name']", 'innerText');
      console.log('shippingInfo   ' + shippingInfo);
      addElementToDocument('added_shippingInfo', shippingInfo);

      let quantity = getAllXpath("//p[contains(@class, 'product-information-description')]/text()", 'nodeValue').join('|');
      if (quantity != null && quantity.length > 0 && quantity.includes('|')) {
        const quantityArr = quantity.split('|');
        quantityArr.forEach(element => {
          if (element.includes('Tamanho') && element.includes(':')) {
            quantity = element.split(':')[1];
            console.log('quantity   ' + quantity);
            addElementToDocument('added_quantity', quantity);
          }
        });
      }

      // const alternateImages = getAllXpath("//div[@id='offer-bg']//div[@id='offerImges']/div[position()>1]/img/@src", 'nodeValue').join(' | ');
      // console.log('alternateImages   ' + alternateImages);
      // addElementToDocument('added_alternateImages', alternateImages);

      // const description = getAllXpath("//div[@class='finePrint']/p", 'innerText');
      // console.log('description   ' + description);
      // addElementToDocument('added_description', description);

      // const weightNet = getXpath("//div[@class='finePrint']/ul[16]/li[contains(text(),'משקל')]/text()", 'nodeValue');
      // console.log('weightNet   ' + weightNet);
      // addElementToDocument('added_weightNet', weightNet);

      // const category = getAllXpath("//div[@id='firstDiv']//span[contains(text(), 'מתוך קטגוריית ')]/following::a[contains(@href,'/c/') and position()<4]/@href", 'nodeValue').join(' > ');
      // console.log('category   ' + category);
      // addElementToDocument('added_category', category);

      // const specifications = getAllXpath("//div[@class='finePrint']/p/strong[contains(text(),'מפרט טכני')]/following::ul/li/text()", 'nodeValue');
      // console.log('specifications   ' + specifications);
      // addElementToDocument('added_specifications', specifications);

      // let video = getXpath("//div[@class='fullJwPlayerWarp']//div//input/@value", 'nodeValue');
      // if (video != null) {
      //   video = JSON.parse(video);
      //   video = video.playlist[0].file;
      //   console.log('video fetched ' + video);
      //   addElementToDocument('added_video', video);
      // }

      // const manufacturerImages = getAllXpath("//div[@class='flix-background-image inpage_wowimg' or @class='flix-background-image']/img/@srcset", 'nodeValue').join(' | ');
      // // console.log('manufacturerImages   ' + manufacturerImages);
      // addElementToDocument('added_manufacturerImages', manufacturerImages);
      // const manufacturerDescription = getAllXpath("//div[@class='flix-std-title flix-Header flix-d-h3' or @class='flix-std-desc flix-Body flix-d-p']/text()  |  //div[@class='flix-std-content']//div[contains(@class,'flix-std-title flix-d-h3')]//text() | //div[@class='flix-std-content']//div[contains(@class,'flix-std-desc flix-d-p')]//text()", 'nodeValue').join(' ');
      // // console.log('manufacturerDescription   ' + manufacturerDescription);
      // addElementToDocument('added_manufacturerDescription', manufacturerDescription);

      // const productOtherInformation = getAllXpath("//tbody//tr//th[@class='label']/text() | //tbody//tr//td[@class='data last']/text()", 'nodeValue').join('|');
      // // console.log('productOtherInformation  ' + productOtherInformation);
      // addElementToDocument('added_productOtherInformation', productOtherInformation);

      // const additionalDescBulletInfo = getAllXpath("//p[contains(@class,'MsoListParagraph')]//font/text()", 'nodeValue').join(' | ');
      // // console.log('additionalDescBulletInfo   ' + additionalDescBulletInfo);
      // addElementToDocument('added_additionalDescBulletInfo', additionalDescBulletInfo);

      // addElementToDocument('added_variantCount', 0);
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
