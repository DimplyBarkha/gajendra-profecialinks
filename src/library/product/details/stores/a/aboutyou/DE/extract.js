const { transform } = require('./shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    const productAvailable = document.querySelector('div[data-test-id="SoldOutContainer"]');
    if (productAvailable) {
      // throw Error('Invalid page, Product sold out');
      return false;
    }
    const isHomePage = document.querySelector('div[data-test-id="StoryTitle"]');
    if (isHomePage) {
      // throw Error('Product is redirecting to home page');
      return false;
    }

    const optionalWait = async (sel) => {
      try {
        await context.waitForSelector(sel, { timeout: 60000 });
      } catch (err) {
        console.log(`Couldn't load selector => ${sel}`);
      }
    };
    optionalWait('div[data-test-id="ProductName"]');
    let variantId = '';
    variantId = document.querySelector('link[rel="canonical"]').href.match(/\d+$/)[0];
    const isVariants = document.querySelector('button[data-test-id="SingleSizeDropdownButton"]');
    if (isVariants) {
      const jsonString = JSON.parse(document.evaluate('//script[@type="application/ld+json"][contains(.,"Product")]', document).iterateNext().innerText);
      const sku = jsonString.offers.map(e => e.sku);
      for (i = 0; i < sku.length; i++) {
        const newLi = document.createElement('li');
        document.querySelector('ul[data-test-id="DropdownList"]').appendChild(newLi);
        newLi.id = `item${i}`;
      }
      const array = [...document.querySelectorAll('ul[data-test-id="DropdownList"] li')];

      fetch(`https://api-cloud.aboutyou.de/v1/products/${variantId}?with=variants%2Cvariants.attributes%2Cimages.attributes%3Alegacy%28false%29%2CpriceRange&campaignKey=px&shopId=605`)
        .then(response => response.json())
        .then(data => {
          console.log(data.variants);
          for (let i = 0; i < data.variants.length; i++) {
            array[i].setAttribute('sku', data.variants[i].id);
            array[i].setAttribute('price', data.variants[i].price.withTax);
            array[i].setAttribute('mpn', data.variants[i].referenceKey);
            array[i].setAttribute('availability', data.variants[i].stock.quantity === 0 ? 'Out of Stock' : 'In Stock');
            array[i].setAttribute('ean', data.variants[i].attributes.ean.values.value);
            array[i].setAttribute('size', `${data.variants[i].attributes.vendorSize.values.label}`);
            array[i].setAttribute('firstvariant', data.variants[0].id);
            array[i].setAttribute('nameExtended', `${document.evaluate('//meta[@property="og:title"]/@content', document).iterateNext().textContent} ${data.variants[i].attributes.vendorSize.values.value}`);
            array[i].setAttribute('variants', sku);
          }
        });
      optionalWait('ul[data-test-id="DropdownList"] li:nth-last-child(1)');
      document.querySelectorAll('li[data-test-id="BulletPoint"]').forEach((ele) => ele.textContent = (` || ${ele.textContent}`));
      const manufacturerImages = document.querySelector('aside div[data-test-id="ProductImage"] img');
      if (manufacturerImages) {
        let aplusImages = manufacturerImages.getAttribute('src');
        document.querySelector('div[data-test-id="ProductName"]').setAttribute('aplusimages', aplusImages);
      } else {
        let aplusImages = document.querySelector('div[data-test-id="AdpImageGrid"] div[data-test-id="ImageBoxContainer"] img').getAttribute('src');
        document.querySelector('div[data-test-id="ProductName"]').setAttribute('aplusimages', aplusImages);
      }
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'aboutyou',
    transform,
    domain: 'aboutyou.de',
    zipcode: '',
  },
  implementation,
};
