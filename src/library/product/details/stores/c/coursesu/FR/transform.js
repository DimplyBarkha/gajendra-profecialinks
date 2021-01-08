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
      if (row.ingredientsList) {
        let text = '';
        row.ingredientsList.forEach(item => {
          text += `${item.text} `;
        });
        row.ingredientsList = [
          {
            text: cleanUp(text.slice(0, -1)),
          },
        ];
      }
      if (row.proteinPerServing) {
        let text = '';
        row.proteinPerServing.forEach(item => {
          text = item.text.replace(/~/g, '').trim();
        });
        row.proteinPerServing = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.dietaryFibrePerServing) {
        let text = '';
        row.dietaryFibrePerServing.forEach(item => {
          text = item.text.replace(/~/g, '').trim();
        });
        row.dietaryFibrePerServing = [
          {
            text: cleanUp(text),
          },
        ];
      }
      // if (row.caloriesPerServing) {
      //   let text = '';
      //   row.caloriesPerServing.forEach(item => {
      //     if (item.text.includes('_url')) { text = ''; } else text = item.text.replace(/~/g, '').trim();
      //   });
      //   row.caloriesPerServing = [
      //     {
      //       text: cleanUp(text),
      //     },
      //   ];
      // }
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
      if (row.aggregateRating) {
        let rating;
        if (row.aggregateRating[0].text) {
          rating = parseInt(row.aggregateRating[0].text);
          rating = (rating / 100) * 5;
          rating = rating.toString().replace('.', ',');
        }

        row.aggregateRating = [
          {
            text: cleanUp(rating),
          },
        ];
      }
      if (row.weightNet) {
        let text = '';
        row.weightNet.forEach(item => {
          text = item.text.replace(': ', '');
        });
        row.weightNet = [
          {
            text: cleanUp(text.trim()),
          },
        ];
      }

      if (row.servingSize) {
        row.servingSize.forEach(item => {
          item.text = item.text.replace('Pour', '').trim();
        });
      }

      if (row.shownimages) {
        row.shownimages.forEach(item => {
          item.text = item.text.replace('250', '800').trim();
          item.text = item.text.replace('250', '800').trim();
        });
      }

      if (row.highQualityImages) {
        row.highQualityImages.forEach(item => {
          item.text = item.text.replace('250', '800').trim();
          item.text = item.text.replace('250', '800').trim();
        });
      }

       if (row.caloriesPerServing) {
        let text3 = '';
        row.caloriesPerServing.forEach(item => {
         const  text2 = item.text.split("|");
          const  text1 = `${text2[1]}`;
          text3 = text1.replace('~','');

        });
          row.caloriesPerServing = [
          {
            text: cleanUp(text3),
          },
        ];
      }




    //  if (row.servingSize) {
    //     let text = '';
    //     row.servingSize.forEach(item => {
    //       text = item.text.replace('servingSize', '');
    //     });
    //       row.weightNet = [
    //       {
    //         text: cleanUp(text),
    //       },
    //     ];
    //   }
    }
  }

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = cleanUp(el.text);
  }))));

  return data;
};
module.exports = { transform };
