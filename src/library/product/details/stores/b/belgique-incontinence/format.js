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
      for (let row of group) {
        if (row.aggregateRating) {         
          row.aggregateRating.forEach(item => { 
            item.text = item.text.match(/\d/g);
            item.text = String(item.text).replace(/\,/g,''); 
            var rating = parseInt(item.text);
            item.text  = rating*5/100;
            item.text = item.text.toString().replace(".",",");      
          });        
        }
        if (row.price) {         
          row.price.forEach(item => { 
           item.text = item.text+' €'
           item.text = String(item.text).replace('.',',')   
          });        
        }
        if (row.listPrice) {         
          row.listPrice.forEach(item => { 
           item.text = item.text+' €'
           item.text = String(item.text).replace('.',',')   
          });        
        }
        if (row.category) {
          let info = [];
          row.category.forEach(item => {
            info.push(item.text.trim());
          });
          if (info.length) {
            row.category = [];
            info.forEach(item => {
              row.category.push({ "text": item });
            });
          }
        }
        if(row.variantCount){
          var tot=0;
          row.variantCount.forEach(item => {
            tot++;
          });
          if(tot==1)
          {
            tot=0;
          }
          row.variantCount=[{'text':tot}];
        }
        if(row.variantInformation){
          var arr_info=[];
          row.variantInformation.forEach(item => {          
            arr_info.push(item.text)
          });
          row.variantInformation=[{text:arr_info.join(' | ')}];
        }
        if(row.variants){
          var arr_info=[];
          row.variants.forEach(item => {          
            arr_info.push(item.text)
          });
          row.variants=[{text:arr_info.join(' | ')}];
        }
        if (row.descriptionBullets) {
          row.descriptionBullets = [{'text':row.descriptionBullets.length,'xpath':row.descriptionBullets[0].xpath}];
        }
        if (row.brandLink) {
          row.brandLink.forEach(item => {
            item.text = 'https://belgique-incontinence' + item.text
          });
        }
        if (row.availabilityText) {
          row.availabilityText.forEach(item => {
            if(item.text =="display:none;")
            {
              item.text="In Stok"
            }
            else if(item.text =="display:block;")
            {
              item.text="out of stock"
            }
          });
        }
        if (row.description) {
          let info = [];          
          row.description.forEach(item => {
            info.push(item.text.replace(/(\s*\n\s*)+/g, ' || ').trim());            
          });
          row.description = [{'text':info.join(' || '),'xpath':row.description[0].xpath}];
          row.description[0].text = ' || ' + row.description[0].text;          
        }
        if (row.shippingInfo) {
          let info = [];          
          row.shippingInfo.forEach(item => {
            info.push(item.text.replace(/(\s*\n\s*)+/g, ' ').trim());            
          });
          row.shippingInfo = [{'text':info.join(' '),'xpath':row.description[0].xpath}];          
        }
        if (row.directions) {
          let info = [];          
          row.directions.forEach(item => {
            info.push(item.text.replace(/(\s*\n\s*)+/g, ' ').trim());            
          });
          row.directions = [{'text':info.join(' || '),'xpath':row.directions[0].xpath}];
          row.directions[0].text = ' || ' + row.directions[0].text          
        }
        if (row.additionalDescBulletInfo) {
          let info = [];          
          row.additionalDescBulletInfo.forEach(item => {
            info.push(item.text)            
          });
          row.additionalDescBulletInfo= [{'text':info.join(' | '),'xpath':row.additionalDescBulletInfo[0].xpath}];
          row.additionalDescBulletInfo[0].text = ' | ' + row.additionalDescBulletInfo[0].text          
        }
      }
  }
  return cleanUp(data);
};

module.exports = { transform };