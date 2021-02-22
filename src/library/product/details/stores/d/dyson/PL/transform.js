/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const cleanUp = (data, context) => {
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

  for (const { group }
    of data) {
    for (const row of group) {
      try {
        if (row.price) {
          row.price = [{ text: row.price[0].text.replace('.', ',').trim() }];
        }
        // if (row.weightNet) {
        //   row.weightNet = [{ text: row.weightNet[0].text.replace('.', ',').trim() }];
        // }
        if (row.manufacturerDescription) {
          const text = [];
          row.manufacturerDescription.forEach(item => {
            text.push(item.text);
          });
          row.manufacturerDescription = [{ text: text.join(' ') }];
        }

        if (row.specifications) {
          const text = [];
          row.specifications.forEach(item => {
            text.push(item.text);
          });
          row.specifications = [{ text: text.join(' ') }];
        }

        if (row.videos) {
          row.videos.forEach(item => {
            if (!(item.text.startsWith('http'))) {
              item.text = '';
            }
          });
        }

        if (row.aggregateRating12) {
          const rating = (row.aggregateRating12[0].text / 100) * 5;
          row.aggregateRating = [{ text: (rating.toFixed(1)).toString() }];
        }
        if (row.aggregateRating) {
          row.aggregateRating = [{ text: row.aggregateRating[0].text.replace('.', ',').trim() }];
          row.aggregateRatingText = [{ text: row.aggregateRating[0].text }];
        }

        if (row.sku) {
          // eslint-disable-next-line no-useless-escape
          const id = (row.sku[0].text.match(/(?<={ productSKU:)(.*)(?=productName)/gm) || []).length ? row.sku[0].text.match(/(?<={ productSKU:)(.*)(?=productName)/gm)[0].replace(/(\")/gm, '').replace(',', '').trim() : '';
          row.sku = [{ text: id }];
          row.variantId = [{ text: id }];
          //   row.mpc = [{ text: id }];
        }

        if (row.availabilityText) {
          // if xpath matches for some In Stock flag i.e add to cart, available, InStock etc.
          row.availabilityText = [{ text: 'In Stock' }];
        } else {
          // if xpath doesn't find anything for instock, availabilityText attribute will be missing from raw.json. Add default value
          row.availabilityText = [{ text: 'Out Of Stock' }];
        }

        if (row.termsAndConditions) {
          row.termsAndConditions = [{ text: 'No' }];
        }
        if (row.inTheBoxUrl) {
          row.inTheBoxUrl.forEach((img) => {
            if (!img.text && img.src) {
              img.text = img.src;
            }
          });
        }

        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
      } catch (exception) { console.log('Error in transform', exception); }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform: cleanUp };
