
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
         if (row.price) {
        row.price.forEach(item => {

          item.text = item.text.replace('$','').trim();
        });
         }
         if (row.countryOfOrigin) {
        row.countryOfOrigin.forEach(item => {
          item.text = item.text.replace('Country of Origin:','').trim();
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
       if(row.gtin){
         row.gtin.forEach(item =>{
            item.text = item.text.replace('UPC:','').trim();
         })
       }

    if(row.materials){
       row.materials.forEach(item => {
         item.text = item.text.replace('Materials:','').trim();
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
       if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          if (item.text == "true"){

            item.text = "In Stock";

          }
          else{
             item.text = "Out Of Stock";

          }

        });
      }
     if (row.description) {
  let desc = '';
  row.description.forEach (item => {
    desc += `${item.text}`;
  });
  row.description = [
    {
      text: desc,
    },
  ];
}

if (row.shortDescription) {
  let shortDesc = '';
  row.shortDescription.forEach (item => {
    shortDesc += `${item.text}`;
  });
  row.shortDescription = [
    {
      text: shortDesc,
    },
  ];
}
if (row.highQualityImages) {
  row.highQualityImages.forEach (item => {
    if (item.text.includes ('?')) {
      let split1 = item.text.split ('?');
      item.text = `${split1[0]}`;
    }
  });
}
if(row.gtin){
  row.gtin.forEach(item =>{
    item.text=item.text.replace("UPC:"," ").trim();
  })
}
if (row.quetionCount) {
  row.quetionCount.forEach (item => {
    item.text = item.text.replace ('Questions', ' ').trim ();
    item.text= item.text.replace (/[()]/g, '');
  });
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
}
module.exports = { transform };
