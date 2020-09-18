
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
	for (const { group } of data) {
		for (const row of group) {
			if (row.availabilityText) {
				let newText = 'Out Of Stock';
				row.availabilityText.forEach(item => {
					if (item.text.trim() === 'true') {
						newText = 'In Stock';
					}
				});
				row.availabilityText = [{ text: newText }];
			}
			if (row.sku) {
				let newText = "";
				row.sku.forEach(item => {
					newText = item.text.replace("Art.nr: ", "")
				});
				row.sku = [{ text: newText }];
			}
			if (row.variantId) {
				let newText = "";
				row.variantId.forEach(item => {
					newText = item.text.replace("Art.nr: ", "")
				});
				row.variantId = [{ text: newText }];
			}

			if (row.price) {
				/* 
				let newText = "";
				row.price.forEach(item => {
					newText = item.text.trim().replace(":-", "");
				}); */
				row.price = [{ text: row.price[0].text}, { text: row.price[1].text.trim().replace(":-", "") }];
			}

			if (row.listPrice) {
				let newText = "";
				row.listPrice.forEach(item => {
					newText = item.text.trim().replace(":-", "");
				});
				row.listPrice = [{ text: newText }];
			}

			if (row.firstVariant) {
				let newText = "";
				row.firstVariant.forEach(item => {
					var res = item.text.trim().split("/");
					var res = res[res.length-2].split(".")[1];
					newText = res;
				});
				row.firstVariant = [{ text: newText }];
			}
			if (row.aggregateRating) {
				let newText = 0;
				row.aggregateRating.forEach(item => {
					var received_per = item.raw.replace("width: ", "")
					var received_per = received_per.replace("%", "");
					if(received_per >= 1){
						var aggregate_rating = ( received_per * 5 )/100;
						newText = aggregate_rating;
					}
				});
				row.aggregateRating = [{ text: newText }];
			}
			if (row.additionalDescBulletInfo) {  
				let newText = '';
				row.additionalDescBulletInfo.forEach(item => {
					newText +=  `${item.text.replace(/ \n|&dash;|\r/g, ' || ')}`;
				});
				row.additionalDescBulletInfo = [{ text: newText.slice(0, -4) }];
			}
		}
	}

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