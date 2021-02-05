
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.productOtherInformation) {
        let text = '';
        row.productOtherInformation.forEach(item => {
          text += ` || ${item.text}`;
        });
        row.productOtherInformation = [
          {
            text: text,
          },
        ];
      }

      if (row.alternateImages) {
        let data = [];
        row.alternateImages.forEach(item => {
          data = item.text.split('= ');
          item.text = data[1].replace(';', '');
          const data1 = JSON.parse(item.text);
          if (data1.product.images) {
            item.text = String(data1.product.images);
            item.text = item.text.replace(/^[^,]+, */, '');
            item.text = item.text.replace(',', ' | ');
          } else {
            item.text = '';
          }
        });
      }

      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `${item.text} || `;
        });
        row.additionalDescBulletInfo = [
          {
            text: text,
          },
        ];
      }
      if (row.aggregateRating2) {
        row.aggregateRating2.forEach(item => {
          item.text = item.text.replace(/\s*/g, '');
          item.text =  item.text.replace(".",",");
        });
    }
    if (row.description) {
      let text = '';
      row.description.forEach(item => {
        text += `${item.text}`;
      });
      row.description = [
        {
          text: text,
        },
      ];
    }

      if (row.sku) {
        row.sku.forEach(item => {
          let skuVal=item.text.replace('window.__PRODUCT_DETAIL_APP_INITIAL_STATE__ = ', '').slice(0, -1) ;
          let data = JSON.parse(skuVal);
          console.log('dataObjsku :',data.product.variants);
          if(data.product.hasOwnProperty('productCode')){
            item.text=data.product.productCode;
          }else if(data.product.hasOwnProperty('variants')){
            item.text=data.product.variants[0].barcode;
          }else{
            item.text="";
          }
          /*if(data.hasOwnProperty('gtin13')){
            item.text=data.gtin13;
          }else{
            item.text="";
          }*/
        });
      }
      if (row.gtin) {
        row.gtin.forEach(item => {
          let data = JSON.parse(item.text);
          if(data['gtin13']){
            if(data['gtin13']){
              item.text = data['gtin13'];
            }
          }else{
            item.text = "";
          }           
        });
      }
    }
  }
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
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

module.exports = { transform };
