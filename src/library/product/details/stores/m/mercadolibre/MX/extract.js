const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'mercadolibre',
    transform,
    domain: 'mercadolibre.com.mx',
    zipcode: '',
  },
  implementation,
};

async function implementation(
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

  await context.evaluate(async (parentInput) => {

    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    //------------------------------------
    // @ts-ignore
    let parent_sku = window.__PRELOADED_STATE__;
    parent_sku = parent_sku ? parent_sku.initialState.history : '';
    parent_sku = parent_sku ? parent_sku.parent_product_id : '';
    addElementToDocument('bb_firstVariant', parent_sku);
    //------------------------------------
    let descArr = [];
    let finalArr = [];
    let bulletArr = [];
    let mc_desc;
    let description = document.querySelector('div[id="description-includes"]');
    let description2 = document.querySelector('p[class="ui-pdp-description__content"]');
    let bullets = document.querySelectorAll('ul.ui-pdp-features li');
    let descBullet;
    if (bullets) {
      bullets.forEach(element => {
      // @ts-ignore
      bulletArr.push(element.innerText);
      // finalArr.push(element.innerText)
      });
      if(bulletArr.length > 1){
        descBullet =  bulletArr.join(' || ');
        descBullet = "|| "+descBullet;
      }
    }
    finalArr.push(descBullet);
    if(description){
      // @ts-ignore
      descArr.push(description.innerText);
    }else if(description2){
      // @ts-ignore
      descArr.push(description2.innerText);
    }
    let descPara = descArr.join(' | ');
    console.log('descPara: ', descPara);
    finalArr.push(descPara);
    mc_desc = finalArr.join(' ');
    let bulletCount;
    if(bullets){
      bulletCount = bullets.length;
    }else{
      bulletCount = 0;
    }
    let desBullets;
    desBullets = mc_desc.match(/•/gm) ? mc_desc.match(/•/gm).length : 0;
    bulletCount = bulletCount + desBullets;
    addElementToDocument('mc_bulletCount', bulletCount)
    addElementToDocument('mc_description', mc_desc.replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').replace(/(\s*[\r\n]\s*)+/g, ' ').trim());
  });
  return await context.extract(productDetails, { transform });
}
