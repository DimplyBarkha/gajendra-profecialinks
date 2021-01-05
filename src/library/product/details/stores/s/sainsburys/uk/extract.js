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
    implementation,
  };
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function findLabel (productObj, label) {
      const value = productObj[label];
      if (Array.isArray(value)) {
        return {
          label: value.reduce((prevVal, currentVal) => {
            return (prevVal) ? prevVal + ',' + currentVal : currentVal;
          }, ''),
        };
      } else if (value) {
        return { label: value };
      }
      return null;
    }
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
    const availabilityText = jsondata.offers.availability;
    const url=jsondata.url;
    // const price= jsondata.offers.price;
    const aggregateRating = jsondata.review.reviewRating.ratingValue;
    const brand = jsondata.brand.name;
    addHiddenDiv('url', url,);
    addHiddenDiv('availabilityText',availabilityText);
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
  return await context.extract(productDetails, { transform });  
  }