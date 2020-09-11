
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    // Default transform function
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
  
    for (const { group } of data) {
      for (const row of group) {

        if (row.alternateImages) {
           row.alternateImages.shift();
        }
        if (row.brandText) {
            row.brandText.forEach(element => {
                if(element.text.includes("BrandC")){
                    element.text = row.name[0].text.split(' ')[0];
                }
            });
         }
         if (row.aggregateRating) {
          row.aggregateRating.forEach(element => {
            element.text = element.text.replace('.',',')
          });
         }
         if (row.videos) {
          row.videos.forEach(element => {
              if(element.text.includes('https://')){
                element.text = element.text;
              }else{
                element.text = 'https://youtu.be/'+element.text;
              }
          });
       }
         if (row.variantInformation) {
             let text = '';
             row.variantInformation.forEach(item => {
               text += ` | ${item.text}`;
             });
             row.variantInformation = [
               {
                 text: text.trim(),
               },
             ];
         }
        
        if (row.availabilityText) {
            row.availabilityText.forEach(item => {
                if(item.text.includes('disponible') || item.text.includes('Agregar al carrito')) {
                    item.text = 'In Stock'
                } else {
                    item.text = 'Out of Stock'
                }
            });
        }
        if (row.specifications) {
          let text = '';
          row.specifications.forEach(item => {
            text += `|| ${item.text.replace(/\n \n/g, ':')}`;
          });
          row.specifications = [
            {
              text: text,
            },
          ];
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  