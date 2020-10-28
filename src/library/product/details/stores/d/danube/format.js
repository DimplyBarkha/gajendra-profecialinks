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
        if(row.availabilityText){
            row.availabilityText[0].text = cleanUp(row.availabilityText[0].text.toLowerCase() === 'Add To Cart'.toLowerCase() ? 'In stock' : 'Out of Stock');
        }
        if(row.nameExtended){
            row.nameExtended[0].text = cleanUp(row.nameExtended[0].text);
        }
        if(row.description){
            row.description[0].text = cleanUp(row.description[0].text);
        }
        if(row.aggregateRatingText){
            row.aggregateRatingText[0].text = cleanUp(row.aggregateRatingText[0].text);
        }
        if(row.name){
            row.name[0].text = cleanUp(row.name[0].text);
        }
        if(row.promotion){
            row.promotion[0].text = cleanUp(row.promotion[0].text);
        }
      }
    }
    return data;
  };
module.exports = { transform };