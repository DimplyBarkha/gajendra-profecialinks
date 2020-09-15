
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        
        if (row.availabilityText) {
          row.availabilityText.forEach(item => {
            if(item.text.includes("Ajouter au panier")){
                item.text = "In Stock";
            }else if(item.text.includes('Créer une alerte')){
                item.text = "Out of Stock";
            }
          });
        }

        if (row.category) {
          row.category.pop();
        }

        if (row.description) {
          row.description.forEach(item => {
          item.text = item.text.replace(/(\s*[\r\n]\s*)+/g, ' ').trim();
          });
        }
        if (row.aggregateRating) {
          row.aggregateRating.forEach(item => {
          item.text = item.text.replace('.', ',');
          });
        }
        if (row.weightNet) {
          row.weightNet.forEach(item => {
          item.text = item.text.trim();
          });
        }
        if (row.brandText) {
          let text = '';
          row.brandText.forEach(item => {
            if(item.text === 'BRAND'){
              if(row.name){
                row.name.forEach(item => {
                  text = item.text.split(' ')[0];
               });
              }
              item.text = text;
            }
         });
        }
        if (row.description) {
          row.description.forEach(item => {
             item.text = item.text.replace(/(\|\|\s\|\|)/g,'||').replace(/(\s*[\r\n]\s*)+/g, ' ').replace(/&nbsp;/g, ' ').replace('&amp;','&').trim();
          });
        }
        if (row.specifications) {
          row.specifications.forEach(item => {
            item.text = item.text.replace(/(\|\|\s\|\|)/g,'||').replace(/(\s*[\r\n]\s*)+/g, ' ').replace(/&nbsp;/g, ' ').replace('&amp;','&').trim();
          });
        }
        if (row.image) {
          row.image.forEach(item => {
          item.text = item.text.split('(')[1];
          item.text = item.text.split(')')[0];
          item.text = item.text.replace('"','').replace("'",'').replace(/\"/,'');
          });
        }
        if (row.alternateImages) {
          row.alternateImages.forEach(item => {
          item.text = item.text.split('(')[1];
          item.text = item.text.split(')')[0];
          item.text = item.text.replace('"','').replace("'",'').replace(/\"/,'');
          });
        }
        if (row.additionalDescBulletInfo) {
          let text = '';
          row.additionalDescBulletInfo.forEach(item => {
            text += `|| ${item.text.replace(/\n \n/g, ' ')}  `;
          });
          row.additionalDescBulletInfo = [
            {
              text: text,
            },
          ];
        }
        if (row.variantId) {
          row.variantId.forEach(item => {
          let arr = item.text.split('/');
          let length = arr.length;
          let id = arr[length-1];
          item.text = id.replace(/(.*)\.html/,'$1').trim();
          });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  