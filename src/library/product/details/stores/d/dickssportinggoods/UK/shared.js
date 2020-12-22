
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {

      if (row.aggregateRating) {
        let text = '';
        row.aggregateRating.forEach(item => {

          text = item.value;
        });
        row.aggregateRating = [
          {
            text: text,
          },
        ];
      }
      if (row.ratingCount) {
        let text = '';
        row.ratingCount.forEach(item => {
          console.log("item",item);
          text = item.value;
        });
        row.ratingCount = [
          {
            text: text,
          },
        ];
      }

       if (row.packSize) {
         console.log("row.packSize",row.packSize)
        let text = '';
        row.packSize.forEach(item => {
          console.log("item",item);
          let text1 = item.text;
          text = text1.slice(11);
          console.log("text",text);
        });
        row.packSize = [
          {
            text: text,
          },
        ];
       }
        if (row.availabilityText){
        row.availabilityText.forEach(item => {
        item.text="In Stock"

      });
    }
    else {
           row.availabilityText.forEach(item => {
        item.text="Out of Stock"

      });
    }
       if (row.descriptionBullets) {
        let text = '';
        row.descriptionBullets.forEach(item => {
          console.log("item",item);
          text = item.value;
        });
        row.descriptionBullets = [
          {
            text: text,
          },
        ];
      }


    }
  }
   // Clean up data
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

  return data;
};

module.exports = { transform };
