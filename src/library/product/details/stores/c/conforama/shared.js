
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
    for (const { group } of data) {
      for (const row of group) {
        if (row.specifications) {
          let text = '';
          row.specifications.forEach(item => {
            text += `${item.text.replace(/\n \n/g, ' : ')} || `;
          });
          row.specifications = [
            {
              text: text.slice(0, -4),
            },
          ];
        }
        if (row.additionalDescBulletInfo) {
          let text = '';
          row.additionalDescBulletInfo.forEach(item => {
            text += ` || ${item.text}`;
          });
          row.additionalDescBulletInfo = [
            {
              text: text.trim(),
            },
          ];
        }
        if (row.ratingCount) {
          row.ratingCount.forEach(item => {
            item.text = item.text ? item.text.replace(/[()]/g, '') : '';
          });
        }
        if (row.aggregateRating) {
          row.aggregateRating.forEach(item => {
            item.text = item.text.replace('.', ',');
          });
        }
        if (row.manufacturerDescription) {
          row.manufacturerDescription.forEach(item => {
            item.text = item.text.replace(/\|\|\s\|\|/g,'');
          });
        }
        if (row.description) {
          row.description.forEach(item => {
            item.text = item.text.replace('La marque vous parle La marque vous parle','');
          });
        }
        if (row.manufacturerImages) {
          row.manufacturerImages.forEach(item => {
            if(item.text.includes('https:')){
              item.text = item.text;
            }else{
              item.text = 'https:'+item.text;
            } 
          });
        }
        if (row.availabilityText) {
          row.availabilityText.forEach(item => {
            if (item.text.includes("M'alerter de la disponiblité produit")) {
              item.text = 'Out of Stock';
            } else{
              item.text = 'In Stock';
            }
          });
        }
      
        if (row.warranty) {
          let text = '';
          row.warranty.forEach(item => {
            text += `${item.text.replace(/\n \n/g, ' ')} |`;
          });
          row.warranty = [
            {
              text: text,
            },
          ];
        }
        if (row.price) {
          row.price.forEach(item => {
            if (item.text) {
              item.text = item.text.replace('€', ',')
            }
          });
        }

        if (row.videos) {
          row.videos.forEach(item => {
              item.text = item.text+'.mp4';
          });
        }

        if (row.listPrice) {
          row.listPrice.forEach(item => {
            if (item.text) {
              item.text = item.text.replace('€', ',')
            }
          });
        }

        if (row.brandText) {
          let Btext = '';
          if(row.name){
            row.name.forEach(item => {
                Btext = item.text.split(' ')[0];
            });
            }
          row.brandText.forEach(item => {
            if(item.text === 'BRAND'){
              item.text = Btext;
            } 
          });
        }
        if (row.category) {
          row.category.pop();
        }  
      }
    }
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };
  
  module.exports = { transform };
  