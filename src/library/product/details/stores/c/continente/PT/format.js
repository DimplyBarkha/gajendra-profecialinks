/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
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
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };
  for (const { group } of data) {
    var idData = ''; var idData1 = ''; var bText = ''; var nText = ''; var skuText = '';
    for (let row of group) {
      if (row.brandText) {
        row.brandText.forEach(item => {
          bText = item.text;
        })
      }
      if (row.nameExtended) {
        row.nameExtended.forEach(item => {
          nText = item.text;
        })
      }
      if (row.sku) {
        //console.log('row.sku is comming');
        row.sku.forEach(item => {
          //console.log('row.sku is comming',item.text);
          var idDataArr = item.text.split('(');
          skuText = idDataArr[0];
          //console.log('idDataArr : ',idDataArr);
        });
        row.sku = [{ "text": skuText }];
        row.variantId = [{ "text": skuText }];
      }
      if (row.manufacturerImages) {
        let info = [];
        row.manufacturerImages.forEach(item => {
          info.push(item.text);
        })
        row.manufacturerImages = [{ "text": info.join(' | ') }];
      }
      if (row.reviewCount) {
        row.reviewCount.forEach(item => {
          let reviewCountData = item.text.split(' ');
          item.text = reviewCountData[0];
        });
      }
      // if(row.description){
      //   let inf=[];
      //   row.description.forEach(item=>{
      //     inf.push(item.text);
      //   })
      //   row.description=[{"text":inf.join(' ')}];
      // }
      if (row.description) {
        // console.log("row.description",row.description);
        let text = '';
        row.description.forEach(item => {
          text += item.text;
        });
        row.description = [{ text }];
      }

      if (row.aggregateRating) {
        let inf = [];
        row.aggregateRating.forEach(item => {
          inf.push(item.text);
        })
        row.aggregateRating = [{ "text": inf.length + ".0" }];
      }
      if (bText != '') {
        row.nameExtended = [{ "text": bText + " - " + nText }];
      }
      if (row.promotion) {
        let text = '';
        row.promotion.forEach(item => {
          text += ' '+item.text;
          text = text.replace('','').trim();
        });
        row.promotion = [{ text }];
      }

      if (row.availabilityText) {
        console.log("row.availabilityText", row.availabilityText);
        row.availabilityText.forEach(item => {
          if (item.text == 'true') {
            item.text = 'In Stock';
          }
          else {
            item.text = 'Out Of stock';

          }
        });
      }
      if (row.directions) {
        // console.log("row.description",row.description);
        let text = '';
        row.directions.forEach(item => {
          text += item.text;
        });
        row.directions = [{ text }];
      }
      if (row.alternateImages) {
        // console.log("row.description",row.description);
        row.alternateImages.forEach(item => {
          item.text = item.text.replace('124', '1024').trim();
          item.text = item.text.replace('124', '1024').trim();
        });
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };