module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'loblaws',
    transform: null,
    domain: 'loblaws.ca',
    zipcode: '',
  },
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
      
    const v = getAllXpath('//div[@class="slick-track"]/div[not(@data-index="0")]/div//img/@src', 'nodeValue');
    console.log(v,'----------------------v')
    // @ts-ignore
    var uniq = [...new Set(v)];



    // @ts-ignore
    var a = ''
    // @ts-ignore
    // const c = document.querySelectorAll('script[type="application/ld+json"]')[2].innerText;
    // if (c.includes('OutOfStock')) {
    //   a = "Out of Stock"
    // }
    // else {
    //   a = "In Stock"
    // }
    addElementToDocument('a', uniq);
  });
  
  return await context.extract(productDetails, { transform });
  // return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}


