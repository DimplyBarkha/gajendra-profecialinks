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
  
    const Set1 = new Set()

    for (const { group } of data) {
      for (const row of group) {
        if (row.image) {
          row.image.forEach(item => {
            if(item.text.includes('https')){
                item.text = item.text;
            }else{
                item.text = 'https://www.apoteket.se'+item.text; 
            }
          });
        }
        if (row.availabilityText) {
            row.availabilityText.forEach(item => {
              if(item.text.includes('Produkten finns för tillfället inte på webblagret.')){
                  item.text = 'Not sold online';
              }else if(item.text.includes('Finns i webblager.')){
                item.text = 'In Stock';
              }else if(item.text.includes('Denna produkt säljs endast via apotek eller med recept på apoteket.se.')){
                item.text = 'In Stock';
              }
            });
          }
          if (row.category) {
            row.category.pop();
            row.category.forEach(item => {
              item.text = item.text.replace(/\//g,'');
            })
          }
          if(row.brandText&&row.brandText.length>1){

            row.brandText=[{text:row.brandText[0].text}]
          }
          if (row.description) {
            row.description.forEach(item => {
              item.text = item.text.trim();
              
            })
          }
          if (row.name) {
            row.name.forEach(item => {
              item.text = item.text.replace(/(\r\n\s|\n|\r|\s)/gm, ' ').trim();
            })
          }
          if (row.nameExtended) {
            row.nameExtended.forEach(item => {
              item.text = item.text.replace(/(\r\n\s|\n|\r|\s)/gm, ' ').trim();
            })
          }
          if (row.listPrice) {
            row.listPrice.forEach(item => {
              // if(item.text.includes('Butikspris')){
              //     item.text = item.text.replace(/Butikspris\:\s/,'');
              // }else 
              if(item.text.includes('Ord. pris')){
                item.text =  item.text.replace('Ord. pris','').replace('(','').replace(')','').trim();
              }
            });
          }
          if (row.quantity) {
            row.quantity.forEach(item => {
              if(item.text.includes(' ml')){
                item.text = item.text.match(/\s(\d+)\sml/g,'$1')
                item.text = item.text ? item.text[0] : '';
                if(item.text.includes(" ml")){
                  item.text = item.text.replace(' ml','').trim();
                }else{
                  item.text = '';
                }  
              }
              else if(item.text.includes(' g')){
                item.text = item.text.match(/\s(\d+)\sg/,'$1');
                item.text = item.text ? item.text[0] : '';
                if(item.text.includes(" g")){
                  item.text = item.text.replace(' g','').trim();
                }else{
                  item.text = '';
                }
              }else if(item.text.includes(' portioner')){
                item.text = item.text.match(/(\d+)\sportioner/,'$1');
                item.text = item.text ? item.text[0] : '';
                if(item.text.includes(" portioner")){
                  item.text = item.text.replace(' portioner','').trim();
                }else{
                  item.text = '';
                }
              }else{
                item.text = '';
              }
            });
          }
          if (row.promotion) {
            row.promotion.forEach(item => {
              if(item.text.includes('Webbpris')){
                  item.text = '';
              }
            });
          }
          if (row.variantUrl) {
            
            row.variantUrl.forEach(item => {
              if(item.text.includes('{')&&item.text.includes('url'))
              {
                let str=item.text.substr(item.text.indexOf('url')+7,item.text.length-1)
                    str=str.substr(0,str.indexOf('"'))
                    item.text=str

              }
              if((item.text.includes('http')) || (item.text.includes('https'))){
                  item.text = item.text;
              }else{
                item.text = 'https://www.apoteket.se'+item.text;
              }
              if(Set1.has(item.text))
                {
                  delete row.variantUrl
                }
                else
                Set1.add(item.text)
                

            });
          }
          if (row.variantId) {
            row.variantId.forEach(item => {
              if(item.text.includes('{')&&item.text.includes('url'))
              {
                let str=item.text.substr(item.text.indexOf('url')+7,item.text.length-1)
                    str=str.substr(0,str.indexOf('"'))
                    item.text=str

              }
              
                let arr = item.text.split('-');
                let length = arr ? arr.length : 0;
                item.text = arr[length-1].replace(/\//,'');
                if(Set1.has(item.text))
                {
                  delete row.variantId
                }
                else
                Set1.add(item.text)
                
            });
          }
          if (row.firstVariant) {
            row.firstVariant.forEach(item => {
                let arr = item.text.split('-');
                let length = arr ? arr.length : 0;
                item.text = arr[length-1].replace(/\//,'');
            });
          }
          if (row.variants) {
            row.variants.forEach(item => {
                let arr = item.text.split('-');
                let length = arr ? arr.length : 0;
                item.text = arr[length-1].replace(/\//,'');
            });
          }


      }
  }
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };
  
  module.exports = { transform };