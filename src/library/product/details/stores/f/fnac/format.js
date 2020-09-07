/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
    const cleanUp = text => text.toString()
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
        
        if (row.description) {
            row.description[0].text = row.description[0].text.replace(/(\n\s*){3,}/g, '').replace(/(\n\s*){2,}/g, '').replace(/(\n\s*){1,}/g, ' || ');
        }
        
        if (row.specifications) {
            row.specifications = row.specifications.map((specification) => {
               return { text: specification.text.replace(/(\n\s*){3,}/g, ' : ').replace(/(\n\s*){1,}/g, ' : ')};
            });
        }
        if (row.imageZoomFeaturePresent) {
            row.imageZoomFeaturePresent[0].text = "Yes"
        } else {
            row.imageZoomFeaturePresent[0].text = "No"
        }

        if(row.aggregateRating) {
            row.aggregateRating[0].text = Number(row.aggregateRating[0].text).toFixed(1);
        }
      }
    }
    return data;
  };
module.exports = { transform };