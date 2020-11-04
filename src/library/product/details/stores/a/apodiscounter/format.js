
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
            text += `${item.text.replace(/\n \n/g, ':')} || `;
          });
          row.specifications = [
            {
              text: text.slice(0, -4),
            },
          ];
        }
    
        if (row.category){
            row.category.forEach(item => {
                item.text = String(item.text).replace(">","");
              });
        }
        if(row.manufacturer){
            var text = row.manufacturer[0].text;
             var array = String(text).split("\n");
            if(array.length > 0){
                row.manufacturer[0].text = array[0].replace("Originalprodukt von","").trim()
            }
        }
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
        if(row.ratingCount){
            var text = row.ratingCount[0].text;
                row.ratingCount[0].text = String(text).replace("(","").replace(")","").trim();
        }
        if(row.alternateImages){
            const text = String(row.alternateImages.length);
            row.secondaryImageTotal = [{ text: text, xpath: '' }];
          }

          if (row.imageZoomFeaturePresent) {
            if (row.imageZoomFeaturePresent.length) {
              row.imageZoomFeaturePresent[0].text = 'Yes';
            } else {
              row.imageZoomFeaturePresent = [{ text: 'No', xpath: '' }];
            }
          }
          if(row.price){
            var text = row.price[0].text;
            row.price[0].text = String(text).replace("*","");
          }
          if(row.listPrice){
            var text = row.listPrice[0].text;
            row.listPrice[0].text = String(text).replace("*","");
          }
          // if(row.descriptionBullets){
          //   var length = row.descriptionBullets.length;
          //   row.descriptionBullets = [{ text: length, xpath: '' }]
          // }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  