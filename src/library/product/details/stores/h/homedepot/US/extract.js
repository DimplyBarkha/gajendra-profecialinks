const { cleanUp } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // await context.setFirstRequestTimeout(firstRequestTimeout: 60000): Promise<void>
  await context.evaluate(async function () {
    function addElementToDocument (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    function getElementByXpath (path) {
      return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    // This is for description
    new Promise(r => setTimeout(r, 5000));
    // const description =(document.querySelector('.desktop-content-wrapper__main-description').textContent).split(/[\n]/).join('||');
    // const description =document.querySelector('.desktop-content-wrapper__main-description > div.bullet-list-wrapper > ul > li').textContent
    const description = getElementByXpath('//div[@class="grid desktop-content-wrapper__main-description"]/text()');
    // const description = document.querySelector('.desktop-content-wrapper__main-description').textContent
    console.log('new Des : ', description);
    var specification = [];
    if (document.querySelectorAll('div[class="grid desktop-content-wrapper__main-description"] > div[class="bullet-list-wrapper"]>ul>li') != null && document.querySelectorAll('div[class="grid desktop-content-wrapper__main-description"] > div[class="bullet-list-wrapper"]>ul>li') != undefined) {
      document.querySelectorAll('div[class="grid desktop-content-wrapper__main-description"] > div[class="bullet-list-wrapper"]>ul>li').forEach(e => {
        specification.push(e.textContent);
      });
      console.log(specification.join(' || '), '##########');
      // console.log("New Description : ",(description.textContent+' || '+specification.join(' || ')))
    }
    if (description != null && description != undefined) {
      addElementToDocument('description', (description.textContent + ' || ' + specification.join(' || ')));
    }
    // This is for descriptionBullets
    if (specification != null && specification != undefined) {
      var descriptionBulletsCount = specification.length;
      addElementToDocument('descriptionBullets', descriptionBulletsCount);
    }
    // This end of descriptionBullets

    // This is for PackSize

    const numPack4 = getElementByXpath('//div[@class="grid"]//div[@class="specifications__wrapper"]/div/div[contains(text(), "Number in")]/following-sibling::*[1]');
    const numPack2 = getElementByXpath('//div[@class="grid"]//div[@class="specifications__wrapper"]/div/div[contains(text(), "Package Quantity")]/following-sibling::*[1]');
    const numPack3 = getElementByXpath('//div[@class="grid"]//div[@class="specifications__wrapper"]/div/div[contains(text(), "Number of")]/following-sibling::*[1]');
    const numPack5 = getElementByXpath('//*[@id="specsContainer"]/div/div/div[contains(text(),"Number Of")]/following-sibling::*[1]');
    const numPack1 = getElementByXpath('//div[@class="grid"]//div[@class="specifications__wrapper"]/div/div[contains(text(), "Pack Size")]/following-sibling::*[1]');

    // console.log(typeof(numPack1.textContent))
    if (numPack1 != null && numPack1 != undefined) {
      addElementToDocument('packSize', numPack1.textContent);
    } else if (numPack2 != null && numPack2 != undefined) {
      addElementToDocument('packSize', numPack2.textContent);
    } else if (numPack3 != null && numPack3 != undefined) {
      addElementToDocument('packSize', numPack3.textContent);
    } else if (numPack4 != null && numPack4 != undefined) {
      addElementToDocument('packSize', numPack4.textContent);
    } else if (numPack5 != null && numPack5 != undefined) {
      addElementToDocument('packSize', numPack5.textContent);
    }

    // This is for SKU

    const siteSKU = getElementByXpath('//div/div[3]/div/div/div[2]/div/div[1]/div/div/h2[starts-with(@class,"product")][contains(text(),"Store SO SKU")]/text()[2] | //*[@id="mediaPlayerContainer"]/div/div[1]/h2[starts-with(@class,"product")][contains(text(),"Store SO SKU")]/span/text()');
    if (siteSKU != null && siteSKU != undefined) {
      console.log(siteSKU);
      console.log('Hello4');
      addElementToDocument('sku', siteSKU.textContent);
    } else {
      console.log('Not found on site');
      // const scriptSKU = getElementByXpath('//script[contains(text(), "gtin13")]/text()')
      console.log('Hello5');
      if (document.querySelector('script[type="application/ld+json"]')) {
        var data = JSON.parse(document.querySelectorAll('script[type="application/ld+json"]')[0].innerText);
        console.log('Hello6');
        var sku = '';
        if (data != null && data != undefined) {
          sku = data.sku;
          console.log('Hello7');
          addElementToDocument('sku', sku);
        }
      } else {
        const newSiteSKU = getElementByXpath('//h2[starts-with(@class,"product")][contains(text(),"Store SKU")]/span/text()');
        if (newSiteSKU != null && newSiteSKU != undefined) {
          console.log(newSiteSKU);
          addElementToDocument('sku', newSiteSKU.textContent);
        }
      }
    }

    if (document.querySelector('html>head>script[type="application/ld+json"]')) {
      var priceJson = JSON.parse(document.querySelector('html > head > script[type="application/ld+json"]').innerText);
      console.log('This is for price check : ');
      console.log('This is for price check : ', priceJson.offers);
      console.log('This is for price check : 2');
      var actualPrice = '';
      // var productBrand = "";
      if (priceJson.offers != null && priceJson.offers != undefined) {
        actualPrice = priceJson.offers.price;
      }
      if (priceJson.brand != null && priceJson.brand != undefined) {
        var productBrand = priceJson.brand.name;
        addElementToDocument('brand', productBrand);
      }

      var productName = priceJson.name;
      var color = priceJson.color;
      addElementToDocument('color', color);

      console.log(actualPrice, 'price');
      console.log(productBrand, 'brand');
      console.log(productName, 'name');
    }
    // var priceDetails = priceJson.match(/(price":)([^,]+)/);
    // var priceIndex = priceDetails[2];
    if (document.querySelector('span[itemprop="price"]')) {
      var priceContent = document.querySelector('span[itemprop="price"]');
      var mainPrice = priceContent.getAttribute('content');
    }
    if (document.querySelector('html > head > script[type="application/ld+json"]')) addElementToDocument('price', actualPrice);
    addElementToDocument('price', mainPrice);
    // if(JSON.parse(document.querySelector('html > head > script[type="application/ld+json"]').innerText).offers.price) addElementToDocument('price',actualPrice );

    if (getElementByXpath('//h2[@itemprop="brand"]//span')) {
      var brandSpan = getElementByXpath('//h2[@itemprop="brand"]//span').textContent;
      addElementToDocument('brand', brandSpan);
    }
    if (document.querySelector('h1.product-title__title')) {
      var nameSpan = document.querySelector('h1.product-title__title').innerText;
    }
    if (getElementByXpath('//div[@itemprop="color"]')) {
      var colorSpan = getElementByXpath('//div[@itemprop="color"]').textContent;
      addElementToDocument('color', colorSpan);
    }
    var extendedName = productName;
    // var NameExtendeds ;
    if (document.querySelector('html > head > script[type="application/ld+json"]')) {
      if (productBrand != undefined && productBrand != null) {
        extendedName = productBrand.concat(' - ' + productName);
        console.log('hi1');
      }
      if (color != undefined && color != null && color != '') {
        extendedName = extendedName.concat(' - ' + color);
        console.log('hi2 : ', color);
      }
      console.log(extendedName, 'extendedName');
    } else {
      extendedName = nameSpan;
      if (brandSpan != undefined && nameSpan != null) {
        extendedName = brandSpan.concat(' - ' + nameSpan);
        console.log('hi3');
      }
      if (colorSpan != undefined && colorSpan != null && colorSpan != '') {
        extendedName = extendedName.concat(' - ' + colorSpan);
        console.log('hi4');
      }
    }

    // if(document.querySelector('html > head > script[type="application/ld+json"]')) addElementToDocument('price',actualPrice );
    addElementToDocument('extendedName', extendedName);
  });
  return await context.extract(productDetails, { transform });
//  return await context.extract(productDetails);
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'homedepot',
    transform: cleanUp,
    domain: 'homedepot.com',
    zipcode: "''",
  },
  implementation,
};

//* ************************************ */
// module.exports = {
//   implements: 'product/details/extract',
//   parameterValues: {
//     country: 'US',
//     store: 'homedepot',
//     transform: null,
//     domain: 'homedepot.com',
//     zipcode: '',
//   },
// };
