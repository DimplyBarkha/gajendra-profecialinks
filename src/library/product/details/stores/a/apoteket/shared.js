/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data, context) => {
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
          if (row.description) {
            row.description.forEach(item => {
              item.text = item.text.trim();
            })
          }
          if (row.listPrice) {
            row.listPrice.forEach(item => {
              if(item.text.includes('Butikspris')){
                  item.text = item.text.replace(/Butikspris\:\s/,'');
              }else if(item.text.includes('Ord. pris')){
                item.text =  item.text.replace('Ord. pris','').replace('(','').replace(')','').trim();
              }
            });
          }
          if (row.quantity) {
            row.quantity.forEach(item => {
              if(item.text.includes(' ml')){
                  item.text = item.text.match(/\s(\d+)\sml/g,'$1').replace(' ml','').trim();
              }else if(item.text.includes(' g')){
                item.text =  item.text.match(/\s(\d+)\sg/g,'$1').replace(' g','').trim();
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
              if((item.text.includes('http')) ||(item.text.includes('https'))){
                  item.text = item.text;
              }else{
                item.text = 'https://www.apoteket.se'+item.text;
              }
            });
          }
          if (row.variantId) {
            row.variantId.forEach(item => {
                let arr = item.text.split('-');
                let length = arr ? arr.length : 0;
                item.text = arr[length-1].replace(/\//,'');
            });
          }
      }
    }
    return data;
  };
  
  module.exports = { transform };