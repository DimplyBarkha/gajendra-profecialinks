module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'MedikamentePerKlick',
    transform: null,
    domain: 'medikamente-per-klick.de',
  },
  implementation: async ({ url }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      // description Block
      const descSelector = document.querySelector('meta[name=\'description\']');
      const description = descSelector ? descSelector.getAttribute('content').replace(/(.*?)-.*/, '$1') : '';
      addHiddenDiv('ii_description', description);
      // prices Block
      const priceSelector = document.querySelector('dl[class="productPrice"] dd[class*="yourPrice"]');
      // @ts-ignore
      const price = priceSelector ? priceSelector.innerText.replace('.', '').replace(',', '.').trim() : '';
      addHiddenDiv('ii_price', price);

      const listPriceSelector = document.querySelector('dl[class="productPrice"]>dd[class="listPrice"]');
      // @ts-ignore
      const listPrice = listPriceSelector ? listPriceSelector.innerText.replace('.', '').replace(',', '.').trim() : '';
      addHiddenDiv('ii_listPrice', listPrice);

      var PricePerUnitSelector = document.querySelector('dl[class="productPrice"]>dd[class="groundPrice"]');
      // @ts-ignore
      var pricePerUnit = PricePerUnitSelector ? PricePerUnitSelector.innerText.replace('.', '').replace(',', '.').trim() : '';
      if (pricePerUnit.includes("*")) {
        pricePerUnit = pricePerUnit.split("*")[0];
        addHiddenDiv('ii_pricePerUnit', pricePerUnit);
      }
      let imageURL = '';
      document.querySelectorAll('#productDesc img').forEach(image => {
        // @ts-ignore
        imageURL = imageURL ? `${imageURL} || ${image.src}` : image.src;
      });
      addHiddenDiv('ii_manufacturerImages', imageURL);

      // gtin
      // const gtinForm = document.querySelector('div[class="addToCartForm"] input[name="product_id"]');
      // if (!gtinForm) {
      // const gtinSelector = document.evaluate('//*[contains(text(),"product_id")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      // let gtin = gtinSelector ? gtinSelector.textContent.match(/.*product_id=(\w+?)".*/) : '';
      // gtin = gtin ? gtin[1] : '';
      // addHiddenDiv('ii_gtin', gtin);
      // }
      // manufacturer Desc
      const manufacturerDescSelector = document.querySelector('dd[class="productLongDescription"]');
      let additionalDescription = '';
      manufacturerDescSelector && Array.from(manufacturerDescSelector.children).forEach(node => {
        if (!/(BR|STYLE|IMG)/.test(node.nodeName)) {
          console.log(node.nodeName !== 'BR');
          // @ts-ignore
          additionalDescription = additionalDescription + node.innerText.trim();
        }
      });
      addHiddenDiv('ii_desc', additionalDescription);

      // Availability
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      var availability = getXpath('//div[@class="wide-6 productInformations offerDetails"]//dd[contains(@class,"availability")]/span[@class="value-title"]/@title', 'nodeValue');
      if (availability != null) {
        if (availability.includes("in_")) {
          availability = "In Stock";
        } else if (availability.includes("out_of")) {
          availability = "Out of Stock";
        }
        addElementToDocument('availability', availability);
      } else {
        availability = "Out of Stock";
        addElementToDocument('availability', availability);
      }


    });
    return await context.extract(productDetails);
  },
};
