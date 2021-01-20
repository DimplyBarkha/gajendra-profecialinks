
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CO',
    store: 'larebajavirtual',
    transform: null,
    domain: 'larebajavirtual.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
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
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      // price
      var price = getXpath("(//span[@class='ahora'])[1]/text() | //section[@class='product_detail']/div[@class='container']//div[@class='descripciones']/div[2]/div/div[@class='subtotal']/span/span/text()", 'nodeValue');
      if (price != null) {
        price = price.replace('.', ',');
        addElementToDocument('price', price);
      }
      // listPrice
      var listprice = getXpath("//span[@class='strike2']/text()", 'nodeValue');
      if (listprice != null) {
        listprice = listprice.replace('.', ',');
        addElementToDocument('listprice', listprice);
      }
      var variant = getAllXpath("//div[@class='sep-dashed']/label/text()", 'nodeValue');
      if (variant != null) {
        var ab = variant.join(' | ');
        addElementToDocument('variant', ab);
      }
      // secondaryImages
      var secimg = getAllXpath("//ul[@class='ad-thumb-list']/li[position()>1 and position()<= last()]/a/@href", 'nodeValue');
      for (var i = 0; i < secimg.length; i++) {
        secimg[i] = 'https://www.larebajavirtual.com' + secimg[i];
      }
      if (secimg != null) {
        var secondaryImages = secimg.join(' | ');
        addElementToDocument('secondaryImages', secondaryImages);
      }
      var url = getXpath("(//ol[@class='breadcrumb']/li/a/@href)[1]", 'nodeValue');
      var url1 = 'https://www.larebajavirtual.com' + url + '/';
      var rem = getXpath("(//div[@class='descripciones']/div/h1/text())[4]", 'nodeValue');
      if (rem.includes(' ')) {
        rem = rem.replaceAll(' ', '-').replaceAll('+', '%2B');
      }
      var url2 = url1 + rem + '.html';
      addElementToDocument('URL', url2);
    });
    await context.extract(productDetails);
  },
};
