module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'loblaws',
    transform: null,
    domain: 'loblaws.ca',
    zipcode: '',
  },
<<<<<<< HEAD
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
    
    await context.waitForSelector('h3[class="product-tile__details__info__name"] a', 3000);
    await context.click('h3[class="product-tile__details__info__name"] a');
    await new Promise((resolve) => setTimeout(resolve, 5000));
    




    // delay
    await context.waitForSelector(' div.product-image-list > div > div > div > div > div > div > img', 5000)
    await context.evaluate(() => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function addElementToDocument(key, value) {
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
        var xyz=[]
      //  const pipeSeparatorDouble = (id, data) => {
      //   var doubleSeparatorText = data.join('|');
      //   finalDescText = doubleSeparatorText;
      //   addElementToDocument(id, doubleSeparatorText);
      // };
      const v = getAllXpath('//div[@class="slick-track"]/div[not(@data-index="0")]/div//img/@src', 'nodeValue');
      // @ts-ignore
      var uniq = [...new Set(v)];
      var y=uniq.join('|')
      // pipeSeparatorDouble('secondaryImages', uniq); 
      console.log('ssssssssss',uniq)
      addElementToDocument('secondaryImages',y)
  
=======
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop !== 1000) {
      await stall(500);
      scrollTop += 500;
      window.scroll(0, scrollTop);
      if (scrollTop === 1000) {
        await stall(500);
        break;
      }
    }
    function stall(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    function addElementToDocument(key, value) {
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

    const alternateImages = getAllXpath('//div[@class="slick-track"]/div[not(@data-index="0")]/div//img/@src', 'nodeValue');
    // @ts-ignore
    var uniqalternateImages = [...new Set(alternateImages)];
    for (let i = 0; i < uniqalternateImages.length; i++) {
      addElementToDocument('uniqalternateImages', uniqalternateImages[i]);
    }
    // @ts-ignore
    // const c = document.querySelectorAll('script[type="application/ld+json"]')[2].innerText;
    // if (c.includes('OutOfStock')) {
    //   a = "Out of Stock"
    // }
    // else {
    //   a = "In Stock"
    // }
  });

  return await context.extract(productDetails, { transform });
}
>>>>>>> e8e91c8047012b9ca8466a7eddd8dae752137e68



    });
  

  await context.extract(productDetails);
},
};
