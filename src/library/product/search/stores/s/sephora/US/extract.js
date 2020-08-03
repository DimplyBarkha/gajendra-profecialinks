// const { transform } = require('../../../../shared');
const { transform } = require('../format');


module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'sephora',
    transform,
    domain: 'sephora.com',
    zipcode: '',
  },
  implementation
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {

    function addHiddenDiv (id, content, attribute, attributeValue, aTag = false) {
      const newDiv = document.createElement('div');
      const newA = document.createElement('a');
      const recordDiv = document.querySelector('div[data-comp="ProductGrid"]')
      const recordADiv = document.querySelector('div[data-comp="ProductGrid"] a')

      if(attribute){

        newDiv.setAttribute(attribute,attributeValue)
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
        
      } else if(aTag){
        recordDiv.appendChild(newA)
      }
       else{
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        recordADiv.appendChild(newDiv);
      }
    }

    // debugger
    // let noResultsXpath = '//h1//text()="0 Product results:"';
    // var element = document.evaluate( noResultsXpath, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    // if( element.snapshotLength > 0 ) {
    //   throw new Error("notFound");
    // }

    const recordADiv = document.querySelector('div[data-comp="ProductGrid"] a')
    if(recordADiv){
      let xpathCheck = '//div[contains(@data-comp, "ProductGrid")]//a'
      var checkElement = document.evaluate( xpathCheck, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if( checkElement.snapshotLength === 0 ) {
          addHiddenDiv(`ii_hello`, ' wuba', 'data-comp','ProductGrid');
          addHiddenDiv(`ii_aTag`, ' wuba', null, null, true);
  
      }

      let brand = '//h1/a[contains(@data-comp,"Link Box")]/span'
      let price = '//div[contains(@data-comp,"Price Box")]/span[last()]'
      let image = '(//div[contains(@data-comp, "Carousel")]//img/@src)[1]'
      let aggregateRating = '//a[contains(@data-comp,"RatingsSummary Flex Box")]//@aria-label'
      let reviews = '//a[contains(@data-comp, "RatingsSummary Flex Box")]/span'
      let url = '//div[@id="ii_url"]'
      let listPrice = '//span[@data-at="price"]'
      let name = '//h1[contains(@data-comp, "DisplayName")]/span'
      addHiddenDiv(`ii_url`, window.location.href);
  
      var brandElement = document.evaluate( brand, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if( brandElement.snapshotLength > 0 ) {
        for(let i = 0; i < brandElement.snapshotLength; i++) {
          addHiddenDiv(`ii_brand`, `${brandElement.snapshotItem(i).textContent}`);
  
        }
      }
      var priceElement = document.evaluate( price, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if( priceElement.snapshotLength > 0 ) {
        for(let i = 0; i < priceElement.snapshotLength; i++) {
          addHiddenDiv(`ii_price`, `${priceElement.snapshotItem(i).textContent}`);
        }
      }
      var imageElement = document.evaluate( image, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if( imageElement.snapshotLength > 0 ) {
        for(let i = 0; i < imageElement.snapshotLength; i++) {
          addHiddenDiv(`ii_image`, `https://www.sephora.com/${imageElement.snapshotItem(i).textContent}`);
        }
      }
      var aggregateRatingElement = document.evaluate( aggregateRating, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if( aggregateRatingElement.snapshotLength > 0 ) {
        for(let i = 0; i < aggregateRatingElement.snapshotLength; i++) {
          let rating = aggregateRatingElement.snapshotItem(i).textContent.split(" ")
          if(rating[0]){
            addHiddenDiv(`ii_aggregateRating`, `${rating[0]}`);
          }
          addHiddenDiv(`ii_aggregateRatingText`, `${aggregateRatingElement.snapshotItem(i).textContent}`);
  
        }
      }
      var reviewsElement = document.evaluate( reviews, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if( reviewsElement.snapshotLength > 0 ) {
        for(let i = 0; i < reviewsElement.snapshotLength; i++) {
          let rating = reviewsElement.snapshotItem(i).textContent.split(" ")
          if(rating[0]){
            addHiddenDiv(`ii_reviews`, `${rating[0]}`);
          }
        }
      }
      var urlElement = document.evaluate( url, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if( urlElement.snapshotLength > 0 ) {
        for(let i = 0; i < urlElement.snapshotLength; i++) {
          let rating =  urlElement.snapshotItem(i).textContent
          let sku = urlElement.snapshotItem(i).textContent.match(/[0-9]+/g)
          if(sku[0]){
            addHiddenDiv(`ii_sku`, `${sku[0]}`);
          }
        }
      }
      var listPriceElement = document.evaluate( listPrice, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if( listPriceElement.snapshotLength > 0 ) {
        for(let i = 0; i < listPriceElement.snapshotLength; i++) {
          let lPrice = listPriceElement.snapshotItem(i).textContent.match(/[+-]?\d+(,d{3})*(\.\d+)?(e[+-]?\d+)?/g)
          debugger
          if(lPrice[0]){
            addHiddenDiv(`ii_listPrice`, `${lPrice[0]}`);
          }
        }
      }
      var nameElement = document.evaluate( name, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if( nameElement.snapshotLength > 0 ) {
        for(let i = 0; i < nameElement.snapshotLength; i++) {
          addHiddenDiv(`ii_name`, `${nameElement.snapshotItem(i).textContent}`);
        }
      }
    }


      debugger
    let scrollTop = 0;
    while (scrollTop !== 20000) {
      // await stall(2500);
      // await new Promise(resolve => setTimeout(resolve, 5000));
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log("SCROLLING")
      if (scrollTop === 20000) {
        break;
      }
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
  });




  return await context.extract(productDetails, { transform });
}