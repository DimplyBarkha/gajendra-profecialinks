
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
      let firstVariantStr='';
      for (const row of group) {
        if (row.alternateImages) {
          row.alternateImages.forEach(item=>{
            item.text=item.text.replace('&wid=75&hei=75&','&wid=1275&hei=1275&');
          })
        }
        if (row.image) {
          row.image.forEach(item=>{
            item.text=item.text.replace('&wid=75&hei=75&','&wid=1275&hei=1275&').replace('?$456$','?fit=constrain,1&wid=1275&hei=1275&fmt=jpg');
          })
        }
        if (row.name) {
          row.name.forEach(item => {
            item.text = item.text.replace(/(\s*\n\s*)+/g, ' ').trim();
          });
        }      
        if (row.nameExtended) {
          row.nameExtended.forEach(item => {
            item.text = item.text.replace(/(\s*\n\s*)+/g, ' ').trim();
          });
        }
        /*if (row.color) {
          row.color.forEach(item => {
            var myRegexp = /Farbe\s*:\s*(.+)/g;
            var match = myRegexp.exec(item.text);
            if (match) {
              if (match.length) {
                item.text = match[1].trim();
              } else {
                item.text = "";
              }
            }
          });
        }
        
        
        if (row.gtin) {
          row.gtin.forEach(item => {
            var myRegexp = /ean\"\s*:\s*\"(.+?)\"/g;
            var match = myRegexp.exec(item.text);
            if (match) {
              if (match.length) {
                item.text = match[1].trim();
              } else {
                item.text = "";
              }
            }
          });
        }
        if (row.description) {
          row.description.forEach(item => {
            item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
          });
          row.description[0].text = '||' + row.description[0].text
        }
        if (row.brandLink) {
          row.brandLink.forEach(item => {
            item.text = 'https://www.tractorsupply.com' + item.text
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
              row.category.push({ "text": item});
            });
          }
      }
        
        if (row.manufacturerImages) {
          row.manufacturerImages.forEach(item => {
            //item.text = 'https://www.tractorsupply.com' + item.text
          });
        }
        
        */
        if(row.variantId){
          row.variantId.forEach(item=>{
            let tmp=item.text.replace('productDisplayJS.setSKUImageId("productMainImage");','').replace('productDisplayJS.setSwatchSelected("','').trim().split(',');
            //console.log('tmp :',tmp[0].replace('"',''));
            item.text=tmp[0].replace('"','').trim();
            firstVariantStr=item.text;
          })
        }else{
          let variantIdStr;
          row.sku.forEach(item=>{
            variantIdStr=item.text;
            firstVariantStr=item.text;
          })
          row.variantId=[{"text":variantIdStr}];
        }
        if (row.variants) {
          let info = [];
          row.variants.forEach(item => {
            info.push(item.text.replace(/(.+\/)/g, '').trim());
          });
          row.variants = [{ 'text': info.join(' | '), 'xpath': row.variants[0].xpath }];
          row.variantCount=[{"text":info.length}];
          if(firstVariantStr!=''){
            row.firstVariant=[{"text":firstVariantStr}];
          }else{
            row.firstVariant=[{"text":info[0]}];
          }
        }
        if (row.specifications) {
          let inf=[];
          row.specifications.forEach(item => {
            //item.text = item.text.replace(/\n\s*\n\s*\n\s*/g, ' || ').trim();
            inf.push(item.text.replace(/\n\s*/g, ' : ').trim());
          });
          row.specifications=[{"text":inf.join(' || ').replace('Specification :','')}];
        }
        if (row.ratingCount) {
          row.ratingCount.forEach(item => {
            item.text = item.text.replace('(','').replace(')','').trim();
          });
        }
        if (row.aggregateRating) {
          row.aggregateRating.forEach(item => {          
            item.text = item.text.trim();
          });
        }
        if(row.additionalDescBulletInfo){
          let inf=[];
          row.additionalDescBulletInfo.forEach(item=>{
            inf.push(item.text);
          })
          row.additionalDescBulletInfo=[{"text":"|| "+inf.join(' || ')}];
        }
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };
  