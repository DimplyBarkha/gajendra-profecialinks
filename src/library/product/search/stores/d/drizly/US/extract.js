
const { transform } = require('../../../../shared');
//const { transform } = require('./transform');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  //await context.waitForXPath('///a[@class="item-title"]/text()');

  await context.evaluate(() => {
      function addHiddenDiv (key, content) {
        const newDiv = document.createElement('div');
        newDiv.setAttribute('id', key);
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
       
      // document.querySelectorAll('section > ul > li > a > div > img').forEach(e =>{
      //   var prodImage = e.getAttribute('src');
      //   console.log(prodImage+"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"); 
      //   // var image = .appendChild(newDiv);
      //   // console.log(image+"%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5"); 
      //   addHiddenDiv('productImg',prodImage);
      // });
        // addHiddenDivs('productImg', prodImage);
          // const newDiv = document.createElement('div');
          // newDiv.setAttribute('class', myClass);
          // newDiv.src = prodImage;
          // el.appendChild(newDiv);
          // var image = newDiv.append(prodImage);
          // console.log(newDiv.setAttribute(prodImage)+"%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5"); 
          // addHiddenDivs('productImg',image);

          // let element = document.createElement('div');
          // element.src = prodImage;
          // document.body.append(element);
      // const itemContainers = document.querySelectorAll('section > ul > li');
      // let rank = 1;
      // for (const itemContainer of itemContainers) {
      //   console.log(itemContainer);
      //   const totalRank = itemContainer + rank;
      //   addHiddenDiv(itemContainer, 'rank', totalRank);
      //   rank++;
      // }

      function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }
      });
      // const ratingDetails = document.querySelector('body > div[data-integration-name="react-component"]');
      // getElementByXpath('/html/body/div[4]').getAttribute('data-payload');
      await context.evaluate(() => {
        function addHiddenDivs (myClass, content) {
          const newDiv = document.createElement('div');
          newDiv.setAttribute('class', myClass);
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          // el.appendChild(newDiv);
          document.body.appendChild(newDiv);
        }
        //@ts-ignore
      var data = document.querySelector('body > div[data-integration-name="react-component"]').dataset.payload;
      if(data && data.trim()){
      var ratingDetails = JSON.parse(data).props.catalogItems.length;
      // var productDetails = JSON.parse(data).props.catalogCommerceData.length; 
      }
      // const url = window.location.href;
      // if(JSON.parse(data).props.pagination[0].pages[0] !== undefined){
      // const pageURL = JSON.parse(data).props.pagination[0].pages[0].url;
      // console.log(pageURL,"@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      // addHiddenDivs('url', pageURL);
      // }
      console.log('###########veri',ratingDetails);
      if(JSON.parse(data).props.catalogItems !== undefined){

      for(var k=0;k<ratingDetails;k++){
      
        if(JSON.parse(data).props.pagination[0].pages[0] !== undefined){
          const pageURL = JSON.parse(data).props.pagination[0].pages[0].url;
          console.log(pageURL,"@@@@@@@@@@@@@@@@@@@@@@@@@@@");
          addHiddenDivs('url', pageURL);
          }
          var productID = JSON.parse(data).props.catalogItems[k].catalogItem.catalogItemID;
          var brandUrl = JSON.parse(data).props.catalogItems[k].catalogItem.clickUrl;
          var prodBrandUrl = 'https://drizly.com'+brandUrl;
          var productImg = JSON.parse(data).props.catalogItems[k].imgSrc;
          addHiddenDivs('productID', productID);
          addHiddenDivs('brandUrl', prodBrandUrl);
          addHiddenDivs('productImg', productImg);
          var prodDetails = JSON.parse(data).props.catalogCommerceData[productID];
          if(prodDetails !== null){
            var name= prodDetails.name;
            var price = prodDetails.ec_price;
            var rank = prodDetails.position;
            var brand = prodDetails.brand_name;
            addHiddenDivs('productname', name);
            addHiddenDivs('productprice', price);
            addHiddenDivs('productrank', rank);
            addHiddenDivs('productbrand', brand);
          }
        var prodRating = JSON.parse(data).props.catalogItems[k].catalogItem.product_rating;
        if(prodRating !== null && prodRating!== undefined){
          var rating= prodRating.rating;
          if(rating){
          var prodRatings = rating.toFixed(1);
          if(prodRatings!=null && prodRatings!=undefined)
          var review= prodRating.rating_count;
          addHiddenDivs('productRating', prodRatings);
          console.log(prodRating,"@@@@@@@@@@@@@@@@@@@");
          addHiddenDivs('productreview', review);
        }
      }  
        // if(productImg == ""){
        // var image = "https://products3.imgix.drizly.com/default_product_beer.png?auto=format%2Ccompress&dpr=2&fm=jpeg&h=240&q=20";
        // console.log(image+"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        // addHiddenDivs('productImg', image);
        // }
            
        } 
      // }
      }
      else{
        console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC");
      }

      // const searchUrl = window.location.href.replace(/%20/g, ' ');
      // addHiddenDivs('search-url', searchUrl);
      // document.querySelectorAll('section > ul > li > a > div > img').forEach(e =>{
      //   var prodImage = e.getAttribute('src');
      //   if (prodImage) {
      //    console.log(prodImage+"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"); 
      //   //  addVideoElementToDocument('pd_video', prodImage);
      //  }
      // //Create the element using the createElement method.
      // var imgDiv = document.createElement("div");
      // imgDiv.id = "div";
      // var image = document.createElement("img");
      // image.setAttribute("src", prodImage);
      // console.log(image+"$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
      // imgDiv.appendChild(image); 
      // console.log(imgDiv+"&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
      // addHiddenDivs('productImgs',imgDiv);
      // // .appendChild(imgDiv);
      // });
      
       
     
      //   var elemDiv = document.createElement('div');
      // elemDiv.src = e.getAttribute('src');
      // // const Images = document.body.appendChild(elemDiv);
      //   console.log(elemDiv+"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"); 
      //   // var image = .appendChild(newDiv);
      //   // console.log(image+"%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5"); 
      //   addHiddenDivs('productImg',elemDiv);
      // });

      
      
      // document.querySelectorAll('section > ul > li > a > div > img').forEach(e =>{
      //   var prodImage = e.getAttribute('src');
      //   console.log(prodImage+"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"); 
      //   // var image = .appendChild(newDiv);
      //   // console.log(image+"%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5"); 
      //   // addHiddenDivs('productImg',image);

      //   // addHiddenDivs('productImg', prodImage);
      //     const newDiv = document.createElement('div');
      //     // newDiv.setAttribute('class', myClass);
      //     // newDiv.src = prodImage;
      //     // el.appendChild(newDiv);
      //     var image = newDiv.append(prodImage);
      //     console.log(newDiv.setAttribute(prodImage)+"%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5"); 
      //     addHiddenDivs('productImg',image);

      //     let element = document.createElement('div');
      //     element.src = prodImage;
      //     document.body.append(element);
        //  }
        //  addHiddenDivs('productImg', addHiddenDivss('img',image));
        //  });
        
       
     });
  // return await context.extract(productDetails, { transform });
  return await context.extract(productDetails, { transform });
}


module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'drizly',
    transform: transform,
    domain: 'drizly.com',
    zipcode: "''",
  },
  implementation,
};
