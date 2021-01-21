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

  for (const { group }
    of data) {

    for (const row of group) {
      if (row.shownImages) {
        row.shownImages.forEach(item => {
          item.text = "https:" + item.text;
        });
      }

      if (row.highQualityImages) {
        row.highQualityImages.forEach(item => {
          item.text = "https:" + item.text;
        });
      }

      if (row.description) {
        let desc = '';
        row.description.forEach(item => {
          desc += `${item.text}`;
        });
        row.description = [
          {
            text: desc
          },
        ];
      }

      if (row.shortDescription) {
        let desc = '';
        row.shortDescription.forEach(item => {
          desc += `${item.text}`;
        });
        row.shortDescription = [
          {
            text: desc
          },
        ];
      }
      if(row.price){
        row.price.forEach(item => {
          item.text=item.text.replace(' / each','').trim();
        });
      }
      if(row.priceCurrency){
        row.priceCurrency.forEach(item =>{
        item.text = item.text.replace (' / each', '').replace (/[0-9.]/g, '');
        item.text = item.text.replace ('$', 'USD').trim();

         });
      }
 if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          if (item.text == "false"){
            item.text = "In Stock";
          }
          else{
             item.text = "Out Of Stock";
          }
        });
      }
    }
  }
  return data;
};

module.exports = { transform };