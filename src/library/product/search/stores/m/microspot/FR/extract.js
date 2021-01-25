
const { transform } = require('../shared');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  await context.evaluate(async function () {
    let scrollSelector = document.querySelector('#container-productlist > div:last-child');
    // @ts-ignore
    let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
    let yPos = 0;
    while (scrollLimit && yPos < scrollLimit) {
      yPos = yPos + 350;
      window.scrollTo(0, yPos);
      scrollSelector = document.querySelector('#container-productlist > div:last-child');
      // @ts-ignore
      scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  });
  try {
    await context.waitForSelector('#container-productlist > div:last-child img');
  } catch (error) {
    console.log('img content not loaded');
  }
  await context.evaluate(async function () {
    const ratings = document.querySelectorAll('div[id="rating"]');
    if (ratings) {
      ratings.forEach(e => e.parentNode.removeChild(e));
    }
    const manufacturers = document.querySelectorAll('div[id="pd_manufacturer"]');
    if (manufacturers) {
      manufacturers.forEach(e => e.parentNode.removeChild(e));
    }
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div[class="_3Xsu6q"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }

    function addHiddenDiv1(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div[class="_35THZ2"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
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

    const agg = getAllXpath('(//div[@class="_3Xsu6q"])/@class', 'nodeValue');
    const d = getAllXpath('(//div[@class="_3Xsu6q"]/child::*/child::*)/@d', 'nodeValue');
    let j = 0;
    if (agg != null) {
      for (let i = 0; i < agg.length; i++) {
        let rat = 0;
        for (let one = 0; one < 5; one++) {
          if (d[j] === 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z') {
            rat = rat + 1;
          }
          if (d[j] === 'M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z') {
            rat = rat + 0;
          }
          if (d[j] === 'M22 9.2l-7.2-.6L12 2 9.2 8.6 2 9.2 7.5 14l-1.6 7 6.2-3.7 6.2 3.7-1.6-7L22 9.2zm-10 6.2V6.1l1.7 4 4.4.4-3.3 2.9 1 4.3-3.8-2.3z') {
            rat = rat + 0.5;
          }
          j = j + 1;
        }
        addHiddenDiv('rating', rat, i);
      }
    }

    // manufacture
    const manu = getAllXpath('//script[@id="INITIAL_STATE"]/text()', 'nodeValue');
    if (manu != null) {
      for (let i = 0; i < manu.length; i++) {
        if (manu && manu[i]) {
          const abc = manu[i].split('manufacturer":"')[1];
          if (abc) {
            const manufacture = abc.split('",')[0];
            addHiddenDiv1('pd_manufacture', manufacture, i);
          }
        }
      }
    }
    // @ts-ignore
    // const productInfo = JSON.parse(document.querySelector('script#INITIAL_STATE') && document.querySelector('script#INITIAL_STATE').innerText.trim()).products;

    // function addEleToDoc (key, value, code) {
    //   const productCode = new RegExp(`--p${code}`);
    //   const productsDiv = document.querySelectorAll('div.wQ1zdx._14LFJJ._1ryioq');
    //   const productDiv = Array.from(productsDiv, ele => ele.innerHTML);
    //   const filteredDiv = productDiv.filter(element => element.match(productCode));
    //   const prodEle = document.createElement('div');
    //   prodEle.id = key;
    //   prodEle.textContent = value;
    //   if (filteredDiv && filteredDiv.length) {
    //     const doc = new DOMParser().parseFromString(filteredDiv[0], 'text/xml');
    //     if (!doc.getElementById('rating')) {
    //       const href = doc.querySelector('._2FaHUU').getAttribute('href');
    //       if (href) {
    //         document.querySelector(`a[href='${href}']`).appendChild(prodEle);
    //       }
    //     }
    //   }
    // }
    // if (productInfo) {
    //   const info = Object.keys(productInfo);
    //   for (var i = 0; i < info.length; i++) {
    //     var code = info[i];
    //     var item = productInfo[code].code;
    //     var aggregateRating = productInfo[code].averageRating;
    //     if (item && aggregateRating !== 0) {
    //       addEleToDoc('rating', `${aggregateRating}`, `${item}`);
    //     }
    //     const manufacturer = productInfo[code].manufacturer;
    //     if (manufacturer) {
    //       addEleToDoc('pd_manufacturer', `${manufacturer}`, `${item}`);
    //     }
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    //   }
    // }
  });
  async function addUrl() {
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const url = window.location.href;
    addHiddenDiv('added-searchurl', url);
  }
  await context.evaluate(addUrl);
  const { transform } = parameters;
  const { productDetails } = dependencies;
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'microspot',
    transform,
    domain: 'microspot.ch/fr',
    zipcode: '',
  },
  implementation,
};