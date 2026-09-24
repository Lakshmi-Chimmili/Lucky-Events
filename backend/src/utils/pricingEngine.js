/**
 * Computes exact price breakdown server-side according to the platform spec:
 *
 * categoryTotal = category.basePricePerAttendee * attendeeCount
 * addOnsTotal   = sum(addon.price)                  for each "flat" add-on
 *               + sum(addon.price * attendeeCount)  for each "perAttendee" add-on
 * grandTotal    = categoryTotal + addOnsTotal
 *
 * @param {Object} category - Mongoose Category document or object
 * @param {Array<Object>} addOnServices - Array of Mongoose Service documents
 * @param {number} attendeeCount - Valid positive integer
 * @returns {Object} Complete frozen price breakdown object
 */
function computeBookingPrice(category, addOnServices, attendeeCount) {
  if (!category || typeof category.basePricePerAttendee !== 'number') {
    throw new Error('Valid category with basePricePerAttendee is required');
  }

  const count = Math.max(1, parseInt(attendeeCount, 10) || 1);
  const categoryTotal = category.basePricePerAttendee * count;

  let addOnsTotal = 0;
  const addOnsBreakdown = [];

  if (Array.isArray(addOnServices)) {
    for (const addon of addOnServices) {
      if (!addon) continue;

      const isPerAttendee = addon.pricingType === 'perAttendee';
      const lineTotal = isPerAttendee ? addon.price * count : addon.price;

      addOnsTotal += lineTotal;
      addOnsBreakdown.push({
        serviceId: addon._id,
        name: addon.name,
        pricingType: addon.pricingType,
        unitPrice: addon.price,
        lineTotal,
      });
    }
  }

  const grandTotal = categoryTotal + addOnsTotal;

  return {
    categoryName: category.name,
    basePricePerAttendee: category.basePricePerAttendee,
    categoryTotal,
    addOnsBreakdown,
    addOnsTotal,
    grandTotal,
  };
}

module.exports = {
  computeBookingPrice,
};
