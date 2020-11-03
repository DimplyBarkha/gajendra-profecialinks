const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'EG',
    store: 'souq',
    transform,
    domain: 'egypt.souq.com',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  { parentInput },
  parameters,
  context,
  dependencies,
) {
  // @ts-ignore
  const { transform } = parameters;
  // @ts-ignore
  const { productDetails } = dependencies;
  let list = await context.evaluate(() => !document.querySelector('div[class="tpl-results"]'))
  if (!list) {
  async function firstItemLink () {
    return await context.evaluate(function () {
      let firstItem = document.querySelector('a.itemLink.block.sPrimaryLink')
      // @ts-ignore
      firstItem = firstItem ? firstItem.href : '';
      return firstItem;
    });
  }
  const url = await firstItemLink();
  console.log('url: ', url);

  if ((url !== null) && (url !== '')) {
    await context.goto(url, { timeout: 100000, waitUntil: 'load', checkBlocked: true });
  }
  await context.waitForNavigation();
}
  await new Promise((resolve, reject) => setTimeout(resolve, 8000));
  //-------------------------
  await context.evaluate(async (parentInput) => {
  
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    let description1 = document.querySelector('div#description-full');
    let description2 = document.querySelector('div#description-short');
    let description;
    if(description1){
    description = description1;
    let descText = description ? description.innerHTML : '';
    descText = descText ? descText.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
    addElementToDocument('bb_description', descText);
    let descBulletCount = document.querySelectorAll('div#description-full ul li');
    let bullets = descBulletCount ? descBulletCount.length : '';
    addElementToDocument('bb_descriptionBullets', bullets);
    }else if(description2){
    description = description2;
    let descText = description ? description.innerHTML : '';
    descText = descText ? descText.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
    addElementToDocument('bb_description', descText);
    let descBulletCount = document.querySelectorAll('div#description-short ul li');
    let bullets = descBulletCount ? descBulletCount.length : '';
    addElementToDocument('bb_descriptionBullets', bullets);
    }
    let zoomImg = document.querySelector('i.fi-zoom-in');
    let zoom = 'No';
    if(zoomImg){
    zoom = 'Yes';
    addElementToDocument('bb_zoomImg', zoom);
    }
    });
    return await context.extract(productDetails, { transform });
    }