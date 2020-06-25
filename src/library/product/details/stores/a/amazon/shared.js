
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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

      if (row.otherSellersShipping2) {
        for (const item of row.otherSellersShipping2) {
          if (item.text.toLowerCase().includes('free')) {
            item.text = '0.00';
          } else if (item.text.match(/\$([^\s]+)/)) {
            item.text = item.text.match(/\$([^\s]+)/)[1];
          }
        }
      }

      if (row.otherSellersPrime) {
        for (const item of row.otherSellersPrime) {
          if (item.text.includes('Details')) {
            item.text = 'YES';
          } else {
            item.text = 'NO';
          }
        }
      }

      if (row.videos) {
        for (const item of row.videos) {
          if (item.text.includes('.hls.m3u8')) {
            item.text = item.text.replace('.hls.m3u8', '.mp4.480.mp4');
          }
        }
      }
    }
  }
  return data;
};

module.exports = { transform };
