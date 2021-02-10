const { cleanUp } = require('../../../../shared'); 
  module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
      country: 'uk',
      store: 'sainsburys',
      transform: cleanUp,
      domain: 'sainsburys.co.uk',
      zipcode: '',
    },
    implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
  await context.waitForSelector('h2[class="pt__info__description"] a', 3000);
   await context.click('h2[class="pt__info__description"] a');
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await context.evaluate(() => {
    function addHiddenDiv (key, value) {


      const catElement = document.createElement('div');
      
      catElement.id = key;
      
      catElement.textContent = value;
      
      catElement.style.display = 'none';
      
      document.body.appendChild(catElement);
      
      }
    const rawdata = document.querySelectorAll('script[type="application/ld+json"]')[0].innerText;
    const jsondata = JSON.parse(rawdata);
    const gtin = jsondata.gtin13;
    let availabilityText = jsondata.offers.availability;
    if (availabilityText=='https://schema.org/InStock'){
      availabilityText = "In Stock"
    }
    if (availabilityText=='https://schema.org/OutOfStock'){
      availabilityText = "Out of Stock"
    }
    addHiddenDiv('availabilityText',availabilityText);
    const url=jsondata.url;
    // const price= jsondata.offers.price;
    const aggregateRating = jsondata.review.reviewRating.ratingValue;
    const brand = jsondata.brand.name;
    addHiddenDiv('url', url,);
    
    addHiddenDiv('aggregateRating', aggregateRating);
    addHiddenDiv('brandText',brand);
  // let firstChildNode;
  // let finalaggregateRating;
  // const aggregateRating = document.querySelectorAll("div[class='star-rating']")
  // for (let k = 0; k < aggregateRating.length; k++) {
  //  let secondChildNode, thirdChildNode = 0;
  //   firstChildNode = aggregateRating[k].childNodes;
  //   for (let j = 0; j < firstChildNode.length; j++) {
  //     secondChildNode = firstChildNode[j].firstChild;
  //     console.log(secondChildNode)
  //     // @ts-ignore
  //     if (secondChildNode.childNodes.length) {
  //       // @ts-ignore
  //       thirdChildNode = thirdChildNode + secondChildNode.firstChild.firstChild.width.animVal.value;
  //       finalaggregateRating= thirdChildNode/20
  //       console.log(finalaggregateRating)
  //     }
  //     addHiddenDiv('aggregateRating',finalaggregateRating,);
  //   }
    
  // }
});
    

await context.extract(productDetails);
},
};