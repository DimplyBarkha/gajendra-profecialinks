/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  const state = context.getState();
  let orgRankCounter = state.orgRankCounter || 0;
  let rankCounter = state.rankCounter || 0;
  const productCodes = state.productCodes || [];
  for (const { group } of data) {
    for (const row of group) {
      rankCounter += 1;
      let skyIdStr='';
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));  
          if(row.price){
              row.price.forEach(item => {
                let tmpObj=JSON.parse(item.text).skus[0];
                if(tmpObj.hasOwnProperty('clubOffer')){
                  let tmpObj1=tmpObj.clubOffer;
                  if(tmpObj1.hasOwnProperty('price')){
                    let tmpObj2=tmpObj1.price;
                    if(tmpObj2.hasOwnProperty('finalPrice')){
                      item.text="$ "+tmpObj2.finalPrice.amount;
                    }
                  }
                }else if(tmpObj.hasOwnProperty('onlineOffer')){
                  let tmpObj1=tmpObj.onlineOffer;
                  if(tmpObj1.hasOwnProperty('price')){
                    let tmpObj2=tmpObj1.price;
                    if(tmpObj2.hasOwnProperty('finalPrice')){
                      item.text="$ "+tmpObj2.finalPrice.amount;
                    }else{
                      console.log('tmpObj1 :',tmpObj1);
                    }
                  }else{
                    console.log('tmpObj1 :',tmpObj1);
                  }
                }
                //item.text="$ "+JSON.parse(item.text).skus[0].clubOffer.price.finalPrice;
              })
          }
          if(row.id){
            row.id.forEach(item => {
              //let tmptmp=JSON.parse(item.text).skus[0].clubOffer.itemNumber;
              let tmpObj=JSON.parse(item.text).skus[0];
              if(tmpObj.hasOwnProperty('clubOffer')){
                let tmpObj1=tmpObj.clubOffer;
                if(tmpObj1.hasOwnProperty('itemNumber')){
                  item.text=tmpObj1.itemNumber;
                }else{
                  console.log('tmpObj1 :',tmpObj1);
                }
              }else if(tmpObj.hasOwnProperty('onlineOffer')){
                let tmpObj1=tmpObj.onlineOffer;
                if(tmpObj1.hasOwnProperty('itemNumber')){
                  item.text=tmpObj1.itemNumber;
                }else{
                  console.log('tmpObj1 :',tmpObj1);
                }
              }
            })
          }
          if(row.name){
            row.name.forEach(item => {
              item.text=JSON.parse(item.text).descriptors.name
            })
          }
          if(row.productUrl){
            row.productUrl.forEach(item => {
              item.text="https://www.samsclub.com"+JSON.parse(item.text).searchAndSeo.url;
            })
          }
          if(row.thumbnail){
            row.thumbnail.forEach(item => {
              //item.text="https://scene7.samsclub.com/is/image/samsclub/"+JSON.parse(item.text).skus[0].assets.image
              let tmpObj=JSON.parse(item.text).skus[0];
                if(tmpObj.hasOwnProperty('assets')){
                  let tmpObj1=tmpObj.assets;
                  if(tmpObj1.hasOwnProperty('image')){
                    item.text="https://scene7.samsclub.com/is/image/samsclub/"+tmpObj1.image;
                  }
                }
            })
          }
          if(row.aggregateRating){
            row.aggregateRating.forEach(item => {
              let tmp =JSON.parse(item.text).reviewsAndRatings
              if(tmp.hasOwnProperty('avgRating')){
                let tmp1=tmp.avgRating;
                item.text=parseFloat(tmp1).toFixed(1).toString();
              }else{
                item.text=0;
              }
            })
          }
          if(row.reviewCount){
            row.reviewCount.forEach(item => {
              let tmp=JSON.parse(item.text).reviewsAndRatings;
              if(tmp.hasOwnProperty('numReviews')){
                item.text=tmp.numReviews;
              }else{
                item.text=0;
              }
            })
          }
          if(row.ratingCount){
            row.ratingCount.forEach(item => {
              let tmp=JSON.parse(item.text).reviewsAndRatings
              if(tmp.hasOwnProperty('numReviews')){
                item.text=tmp.numReviews;
              }else{
                item.text=0;
              }
            })
          }
        }
      }
      context.setState({ rankCounter });
      context.setState({ orgRankCounter });
      context.setState({ productCodes });
      console.log(productCodes);
      return data;
    };
    module.exports = { transform };