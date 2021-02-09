/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.caloriesPerServing) {
        let text = '';
        row.caloriesPerServing.forEach(item => {
          text += `${item.text.replace(/mg|g/, '')}`;
        });
        row.caloriesPerServing = [
          {
            text: text,
          },
        ];
      }
      /*if(row.temp_sku)
      {
        row.sku=[{text:''}]
        row.sku[0].text=row.temp_sku[0].text
        delete row.temp_sku
      }
      if(row.temp_allergyAdvice)
      {
        row.allergyAdvice=[{text:''}]
        row.allergyAdvice[0].text=row.temp_allergyAdvice[0].text
        delete row.temp_allergyAdvice
      }*/
      if (row.totalFatPerServing) {
        let text = '';
        row.totalFatPerServing.forEach(item => {
          text += `${item.text.replace(/mg|g/, '')}`;
        });
        row.totalFatPerServing = [
          {
            text: text,
          },
        ];
      }
      if (row.saturatedFatPerServing) {
        let text = '';
        row.saturatedFatPerServing.forEach(item => {
          text += `${item.text.replace(/mg|g/, '')}`;
        });
        row.saturatedFatPerServing = [
          {
            text: text,
          },
        ];
      }
      if (row.saltPerServing) {
        let text = '';
        row.saltPerServing.forEach(item => {
          text += `${item.text.replace(/mg|g/, '')}`;
        });
        row.saltPerServing = [
          {
            text: text,
          },
        ];
      }
      if (row.totalCarbPerServing) {
        let text = '';
        row.totalCarbPerServing.forEach(item => {
          text += `${item.text.replace(/mg|g/, '')}`;
        });
        row.totalCarbPerServing = [
          {
            text: text,
          },
        ];
      }
      if (row.totalSugarsPerServing) {
        let text = '';
        row.totalSugarsPerServing.forEach(item => {
          text += `${item.text.replace(/mg|g/, '')}`;
        });
        row.totalSugarsPerServing = [
          {
            text: text,
          },
        ];
      }
      if (row.proteinPerServing) {
        let text = '';
        row.proteinPerServing.forEach(item => {
          text += `${item.text.replace(/mg|g/, '')}`;
        });
        row.proteinPerServing = [
          {
            text: text,
          },
        ];
      }
      
      if (row.calciumPerServing) {
        let text = '';
        row.calciumPerServing.forEach(item => {
          text += `${item.text.replace(/mg|g/, '')}`;
        });
        row.calciumPerServing = [
          {
            text: text,
          },
        ];
      }
      let brandData='',variantIdData='';
      if(row.availabilityText){
        row.availabilityText.forEach(item=>{
          let tmp=JSON.parse(item.text);
          let avail=tmp.offers.availability;
          brandData=tmp.brand.name;
          variantIdData=tmp.url.split('/').pop();
          if(avail=="http://schema.org/InStock"){
            row.availabilityText=[{"text":"In Stock"}];
          }else{
            row.availabilityText=[{"text":"Out Of Stock"}];
          }
        })
        if(brandData!=''){
          row.brandText=[{"text":brandData}];
        }
        if(variantIdData!=''){
          row.variantId=[{"text":variantIdData}];
        }
      }
      if(row.sku){
        row.sku.forEach(item=>{
          item.text=item.text.split(':').pop().trim();
        })
      }
    }
  }

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

module.exports = { transform };
