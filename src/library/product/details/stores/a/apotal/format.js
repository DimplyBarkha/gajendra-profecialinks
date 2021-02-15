/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    // var rank = 1;
    for (const row of group) {
      if (row.image) {
        // const image = row.image.map((item) => {
        //   return 'https://shop.apotal.de' + item.text;
        // });
        let image = row.image[0].text.split("'")[1];
        image = 'https://shop.apotal.de' + image;
        row.image = [{ text: image, xpath: row.image[0].xpath }];
        row.imageZoomFeaturePresent = [{ text: 'Yes', xpath: row.image[0].xpath }];
      }
      // if (row.availabilityText) {
      //   const availabilityTextArr = row.availabilityText.map((item) => {
      //     return (typeof (item.text) === 'string') && (item.text.trim() === 'sofort lieferbar') ? 'In Stock' : 'Out of Stock';
      //   });
      //   row.availabilityText = [{ text: availabilityTextArr.join(), xpath: row.availabilityText[0].xpath }];
      // }
      if (row.description) {
        const descriptionArr = row.description.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n \n \n \n/g, '').replace(/\n \n \n \n \n/g, '') : '';
        });
        row.description = [{ text: descriptionArr.join('|'), xpath: row.description[0].xpath }];
      }
      if (row.nameExtended) {
        let nameExtended = row.nameExtended[0].text.trim();
        nameExtended = nameExtended.charAt(nameExtended.length - 1) === '-' ? nameExtended.substring(0, nameExtended.length - 3) : nameExtended;
        row.nameExtended = [{ text: nameExtended, xpath: row.nameExtended[0].xpath }];
      }
      if (row.manufacturerImages) {
        const manufacturerImagesArr = row.manufacturerImages.map((item) => {
          return typeof (item.text) === 'string' ? 'https://shop.apotal.de' + item.text.trim() : '';
        });
        row.manufacturerImages = [{ text: manufacturerImagesArr.join('|'), xpath: row.manufacturerImages[0].xpath }];
      }
      if (row.videos) {
        const videos = row.videos.map((item) => {
          return typeof (item.text) === 'string' ? item.text.trim() : '';
        });
        row.manufacturerImages = [{ text: videos.join('|'), xpath: row.videos[0].xpath }];
      }
      if (row.variants) {
        const variants = row.variants.map((item) => {
          return typeof (item.text) === 'string' ? item.text.substring(item.text.lastIndexOf('-') + 1) : '';
        });
        row.variants = [{ text: variants.join('|'), xpath: row.variants[0].xpath }];
        row.variantCount = [{ text: variants.length, xpath: row.variants[0].xpath }];
      } else {
        row.variantCount = [{ text: 0 }];
      }
      if (row.variantInformation) {
        const variantInformation = row.variantInformation.map((item) => {
          return typeof (item.text) === 'string' ? item.text : '';
        });
        row.variantInformation = [{ text: variantInformation.join('|'), xpath: row.variantInformation[0].xpath }];
      }
      if (row.aggregateRating2) {
        const aggregateRating2 = row.aggregateRating2[0].text.replace('(', '').replace(')', '').replace('.', ',');
        row.aggregateRating2 = [{ text: aggregateRating2, xpath: row.aggregateRating2[0].xpath }];
      }
      if (row.aggregateRating) {
        const aggregateRating = row.aggregateRating[0].text.replace('(', '').replace(')', '').replace('.', ',');
        row.aggregateRating = [{ text: aggregateRating, xpath: row.aggregateRating[0].xpath }];
      }
      if (row.ratingCount) {
        const ratingCount = row.ratingCount.length === 1
          ? row.ratingCount[0].text : row.ratingCount[2].text;
        row.ratingCount = [{ text: ratingCount, xpath: row.ratingCount[0].xpath }];
      }
      if (row.category) {
        const categoryArray = row.category.map((item) => {
          return item.text.trim();
        });
        categoryArray.shift();
        row.category = categoryArray.map((item) => {
          return { text: item, xpath: row.category[0].xpath };
        });
      }
      if (row.ingredientsList) {
        let ingredients = row.ingredientsList[0].text.trim();
        ingredients = ingredients.startsWith('Wirkstoff:') ? ingredients.substr(11) : '';
        row.ingredientsList = [{ text: ingredients, xpath: row.ingredientsList[0].xpath }];
      }
      if (row.ingredientsList2) {
        const ingredients = row.ingredientsList2[0].text.trim();
        if (ingredients) {
          row.ingredientsList = [{ text: ingredients, xpath: row.ingredientsList2[0].xpath }];
        }
      }
      if (row.ingredientsList3) {
        const ingredients = row.ingredientsList3[0].text.trim();
        if (ingredients) {
          row.ingredientsList = [{ text: ingredients, xpath: row.ingredientsList3[0].xpath }];
        }
      }
      if (row.ingredientsList4) {
        const ingredients = row.ingredientsList4.map((item) => {
          return typeof (item.text) === 'string' ? item.text.trim() : '';
        });
        if (ingredients) {
          row.ingredientsList = [{ text: ingredients.join(' '), xpath: row.ingredientsList4[0].xpath }];
        }
      }
      if (row.ingredientsList5) {
        const ingredients = row.ingredientsList5[0].text.trim();
        if (ingredients) {
          row.ingredientsList = [{ text: ingredients, xpath: row.ingredientsList5[0].xpath }];
        }
      }
      if (row.promotion) {
        const promotion_data = row.promotion[0].text.trim();
        if (promotion_data) {
          row.promotion = [{ text: promotion_data.replace(' € ','').replace(',','.'), xpath: row.promotion[0].xpath }];
        }
      }
      if (row.directions) {
        const directions_data = row.directions[0].text.trim();
        if (directions_data) {
          row.directions = [{ text: directions_data, xpath: row.directions[0].xpath }];
        }
      }
      if (row.gtin) {
        const gtin_data = row.gtin[0].text.trim();
        if (gtin_data) {
          row.gtin = [{ text: gtin_data.replace(/^0+/, ''), xpath: row.gtin[0].xpath }];
        }
      }


      if (row.warnings) {
        const warnings_data = row.warnings[0].text.trim();
        if (warnings_data) {
          row.warnings = [{ text: warnings_data, xpath: row.warnings[0].xpath }];
        }
      }
      
      if (row.storage) {
        const storage_data = row.storage[0].text.trim();
        if (storage_data) {
          row.storage = [{ text: storage_data, xpath: row.storage[0].xpath }];
        }
      }
      
    }
  }

  const clean = text =>
    text
      .toString()
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

  data.forEach(obj =>
    obj.group.forEach(row =>
      Object.keys(row).forEach(header =>
        row[header].forEach(el => {
          el.text = clean(el.text);
        }),
      ),
    ),
  );
  return data;
};

module.exports = { transform };
