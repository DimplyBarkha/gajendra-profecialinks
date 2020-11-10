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
  
          if (row.price) {
            row.price.forEach(item => {
              item.text = item.text.replace('.',',');
            });
          }
          if (row.listPrice) {
              row.listPrice.forEach(item => {
                item.text = item.text.replace('.',',');
              });
            }
            if (row.alternateImages) {
              row.alternateImages.shift();
              row.alternateImages.forEach(item => {
                if((item.text.includes('https://www.carrefour.fr'))){
                  item.text = item.text;
                }else{
                  item.text = 'https://www.carrefour.fr'+item.text;
                } 
              }); 
            }
            if (row.manufacturerImages) {
              row.manufacturerImages.forEach(item => {
                if((item.text.includes('https:')) ||(item.text.includes('http:'))){
                  item.text = item.text;
                }else{
                  item.text = 'https:'+item.text;
                } 
              });
            }
            if (row.image) {
              row.image.forEach(item => {
                if((item.text.includes('https://www.carrefour.fr'))){
                  item.text = item.text;
                }else{
                  item.text = 'https://www.carrefour.fr'+item.text;
                } 
              });
            }
            if (row.videos) {
              row.videos.forEach(item => {
                // item.text = item.text.replace(/\[\{\"file\"\:\"(.*).mp4/gm, '$1');
                item.text = item.text.replace(/\\/g, "");
                if((item.text.includes('https:'))|| (item.text.includes('https:'))){
                  item.text = item.text+'.mp4';
                }else{
                  item.text = 'https:'+item.text+'.mp4';
                } 
              });
            }
            if (row.specifications) {
              let text = '';
              row.specifications.forEach(item => {
                text += `${item.text.replace(/\n/g, ' : ')} || `;
              });
              row.specifications = [
                {
                  text: text.slice(0, -4),
                },
              ];
            }
            if (row.availabilityText) {
              row.availabilityText.forEach(item => {
                if((item.text.includes('InStoreOnly')) || (item.text.includes('Product to be collected in store in 2 hours'))){
                  item.text = 'In Stock';
                }else{
                  item.text = 'Out Of Stock';
                } 
              });
            }
            if (row.category) {
              row.category.pop(); 
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
            if (row.description) {
              let text = '';
              row.description.forEach(item => {
                text += `${item.text} | `;
              });
              row.description = [
                {
                  text: text.slice(0, -2),
                },
              ];
            }
        }
      }
      data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }))));
      return data;
    };
    
    module.exports = { transform };