
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
     .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
     // eslint-disable-next-line no-control-regex
     .replace(/[\x00-\x1F]/g, '')
     .replace(/\"/g, ' " ')
     .replace(/&#(\d+);/g, function(match, dec) {
       return String.fromCharCode(dec);
     })
     .replace(/\s{2,}/g, " ");

   for (const { group } of data) {
     for (let row of group) {

     }
   }
   // context.setState({ variantArray });
   return data;
 };
 module.exports = { transform };