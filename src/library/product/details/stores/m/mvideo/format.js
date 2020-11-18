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
    for (const row of group) {
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' | ').trim();
        });
      }
      if (row.shippingInfo) {
        row.shippingInfo.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' ').trim();
        });
      }
      if (row.image) {
        row.image.forEach(item => {
          item.text = 'https:' + item.text;
        });
      }
      if (row.alternateImages) {
        var img_arr = [];
        row.alternateImages.forEach(item => {
          img_arr.push({ "text": 'https:' + item.text.replace(/small_pic\/65\//g, ''), "xpath": row.alternateImages[0]["xpath"] });
        });
        if (img_arr.length > 1) {
          img_arr.splice(0, 1);
          row.alternateImages = img_arr;
        } else {
          delete row.alternateImages;
        }
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = item.text.replace(/\D/g, '');
        });
      }
      if (row.sku) {
        row.sku.forEach(item => {
          item.text = item.text.replace(/.+-(\d+)/g, '$1');
        });
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          item.text = item.text.replace(/.+-(\d+)/g, '$1');          
          row.variantCount = [{ "text": 0, "xpath": row.variantId[0]["xpath"] }];
        });
      }
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n\s*\n\s*\n\s*\n\s*/g, ' || ').trim();
          item.text = item.text.replace(/\n\s*\n\s*/g, ' : ').trim();
        });
      }
      if (row.variants && row.variantId) {
        var temp_arr = [];
        row.variants.forEach(item => {
          item.text = item.text.replace(/.+-(\d+)/g, '$1');
          temp_arr.push(item.text);
        });
        row.firstVariant = [{ "text": row.variantId[0]["text"], "xpath": row.variantId[0]["xpath"] }];
        if (temp_arr.length) {
          row.variantCount = [{ "text": temp_arr.length, "xpath": row.variants[0]["xpath"] }];
          row.variants = [{ "text": temp_arr.join(' | '), "xpath": row.variants[0]["xpath"] }];
        } else {
          delete row.variants;
        }
      }
      if (row.variantInformation) {
        var temp_arr = [];
        row.variantInformation.forEach(item => {          
          temp_arr.push(item.text);
        });
        if (temp_arr.length) {
          row.variantInformation = [{ "text": temp_arr.join(' | '), "xpath": row.variantInformation[0]["xpath"] }];
        } else {
          delete row.variantInformation;
        }
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {       
          item.text = item.text.replace('width: ', '').trim();       
          item.text = item.text.replace('%;', '').trim();         
          if(item.text==1){
            item.text = 0;
          }else{
            var aggregateRatingNumber = (parseFloat(item.text) * 5) / 100;            
            item.text = aggregateRatingNumber.toFixed(1).replace('.', ',');
          } 
        });
      }
      if (row.price) {
        var temp_arr = [];
        row.price.forEach(item => {          
          temp_arr.push(item.text);
        });
        if (temp_arr.length > 1) {
          row.price = [{ "text": temp_arr[1], "xpath": row.price[0]["xpath"] }];
        } else {
          row.price = [{ "text": row.price[0]["text"], "xpath": row.price[0]["xpath"] }];
        }
      }
      if (row.warranty) {
        var temp_arr = [];
        row.warranty.forEach(item => {          
          temp_arr.push(item.text);
        });
        row.warranty = [{ "text": row.warranty[0]["text"], "xpath": row.warranty[0]["xpath"] }];     
      }
      if(row.Image360Present){
        if(row.Image360Present[0]['text']=='3d'){
          row.Image360Present = [{ "text":'Yes', "xpath": row.warranty[0]["xpath"] }];
        }
      }else{
        row.Image360Present = [{ "text":'No'}];
      }
      if(row.technicalInformationPdfPresent){
        row.technicalInformationPdfPresent.forEach(item=>{
          item.text='https:'+item.text;
        });
      }
    }
  }
  cleanUp(data);
  return data;
};

module.exports = { transform };