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
    // let ratingParentDiv = document.querySelector('span[class="ui-pdp-review__ratings"]');
    // let ratingParentDiv1 = document.querySelector('span[class="star-container"]');
    // console.log('ratingParentDiv1: ', ratingParentDiv1);
    // if (ratingParentDiv) {
    //   await new Promise((resolve) => setTimeout(resolve, 3000));
    //   let starList = ratingParentDiv ? ratingParentDiv.querySelectorAll('svg') : [];
    //   let fullStarCount = 0;
    //   let halfStarCount = 0;
    //   starList.forEach(element => {
    //     let classList = element.classList;
    //     console.log('classList: ', classList);
    //     // @ts-ignore
    //     classList.forEach(element => {
    //       if (element === "ui-pdp-icon--star-full") {
    //         fullStarCount = fullStarCount + 1;
    //       } else if (element === "ui-pdp-icon--star-half") {
    //         halfStarCount = halfStarCount + 0.5;
    //       }
    //     });
    //   });
    //   console.log("fullStarCount", fullStarCount);
    //   console.log("Halfstarcount", halfStarCount);
    //   console.log("RatingCount", (Number(fullStarCount) + Number(halfStarCount)))
    //   let aggregateRating = Number(fullStarCount) + Number(halfStarCount);
    //   let aggregateRating2 = aggregateRating;
    //   if (aggregateRating2 == 0) {
    //     addElementToDocument('mc_aggregateRating2', '');
    //   } else {
    //     addElementToDocument('mc_aggregateRating2', aggregateRating2);
    //   }
    // } else if (ratingParentDiv1) {
    //   await new Promise((resolve) => setTimeout(resolve, 3000));
    //   let starList = ratingParentDiv ? ratingParentDiv.querySelectorAll('label') : [];
    //   let fullStarCount = 0;
    //   let halfStarCount = 0;
    //   starList.forEach(element => {
    //     let classList = element.classList;
    //     console.log('classList: ', classList);
    //     // @ts-ignore
    //     classList.forEach(element => {
    //       if (element === "star-icon star-icon-full") {
    //         fullStarCount = fullStarCount + 1;
    //       } else if (element === "star-icon star-icon-half") {
    //         halfStarCount = halfStarCount + 0.5;
    //       }
    //     });
    //   });
    //   console.log("fullStarCount", fullStarCount);
    //   console.log("Halfstarcount", halfStarCount);
    //   console.log("RatingCount", (Number(fullStarCount) + Number(halfStarCount)))
    //   let aggregateRating = Number(fullStarCount) + Number(halfStarCount);
    //   let aggregateRating2 = aggregateRating;
    //   if (aggregateRating2 == 0) {
    //     addElementToDocument('mc_aggregateRating2', '');
    //   } else {
    //     addElementToDocument('mc_aggregateRating2', aggregateRating2);
    //   }
    // }
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
      descBullet =  bulletArr.join(' || ');
    }
    finalArr.push("|| "+descBullet);
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
    addElementToDocument('mc_description', mc_desc.replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').replace(/(\s*[\r\n]\s*)+/g, ' ').trim());
  });
  return await context.extract(productDetails, { transform });
}
