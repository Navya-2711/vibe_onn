/* ==========================================================================
   VIBEONN PARTY HALL - BOOKING FORM & WHATSAPP INTEGRATION (8519963801)
   ========================================================================== */

export function initBookingForm() {
  const bookingForms = document.querySelectorAll('.booking-form');

  bookingForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('[name="name"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const addressInput = form.querySelector('[name="address"]');
      const partyTypeSelect = form.querySelector('[name="party_type"]');
      const dateInput = form.querySelector('[name="slot_date"]');
      const timeSelect = form.querySelector('[name="slot_time"]');
      const partyVibeRadio = form.querySelector('[name="party_vibe"]:checked');

      // Validation
      let isValid = true;
      let errorMsg = '';

      if (!nameInput || !nameInput.value.trim()) {
        isValid = false;
        errorMsg += '• Please enter your Full Name.\n';
      }

      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneInput || !phoneRegex.test(phoneInput.value.trim())) {
        isValid = false;
        errorMsg += '• Please enter a valid 10-digit Phone Number.\n';
      }

      if (!addressInput || !addressInput.value.trim()) {
        isValid = false;
        errorMsg += '• Please enter your Address / Locality in Vijayawada.\n';
      }

      if (!partyTypeSelect || !partyTypeSelect.value) {
        isValid = false;
        errorMsg += '• Please select a Party Type.\n';
      }

      if (!dateInput || !dateInput.value) {
        isValid = false;
        errorMsg += '• Please choose your preferred Slot Date.\n';
      }

      if (!timeSelect || !timeSelect.value) {
        isValid = false;
        errorMsg += '• Please choose your Slot Time.\n';
      }

      if (!partyVibeRadio) {
        isValid = false;
        errorMsg += '• Please select your Party Vibe (Inside Party Hall or Another Place).\n';
      }

      if (!isValid) {
        alert('Please correct the following fields:\n\n' + errorMsg);
        return;
      }

      // Values
      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const address = addressInput.value.trim();
      const partyType = partyTypeSelect.value;
      const slotDate = dateInput.value;
      const slotTime = timeSelect.value;
      const partyVibe = partyVibeRadio.value;

      // Construct WhatsApp message
      const message = `🎉 *NEW BOOKING ENQUIRY - VIBEONN PARTY HALL VIJAYAWADA* 🎉\n\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `📍 *Address:* ${address}\n` +
        `🎈 *Party Type:* ${partyType}\n` +
        `📅 *Slot Date:* ${slotDate}\n` +
        `⏰ *Slot Time:* ${slotTime}\n` +
        `✨ *Party Vibe:* ${partyVibe}\n\n` +
        `Please confirm slot availability and details!`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/918519963801?text=${encodedMessage}`;

      // Open WhatsApp chat in new tab
      window.open(whatsappUrl, '_blank');

      // Feedback alert / Modal trigger
      alert('Thank you, ' + name + '! Your booking enquiry has been submitted. Opening WhatsApp to connect with VibeOnn team (8519963801)...');

      form.reset();
    });
  });
}
