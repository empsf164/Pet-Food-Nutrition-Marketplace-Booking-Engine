/* ==========================================================================
   NOURIPET — MULTI-STEP BOOKING WIZARD & DEPOSIT CONTROLLER
   Full 5-step Flow, State Management, Validation, Demo Payment Execution
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const bookingWizard = document.getElementById('nouripetBookingWizard');
  if (!bookingWizard) return;

  // State object
  const bookingState = {
    step: 1,
    pet: {
      type: 'dog',
      name: 'Barnaby',
      age: '3 years',
      breed: 'Golden Retriever',
      weight: '65 lbs',
      concern: 'Food Allergies & Sensitive Stomach',
      allergens: 'Chicken & Wheat'
    },
    service: {
      id: 'consultation',
      name: 'Personalized Nutrition Consultation',
      duration: '60',
      modality: 'online'
    },
    host: {
      id: 'dr-maya-carter',
      name: 'Dr. Maya Carter, M.S., C.P.N.',
      title: 'Lead Clinical Canine Nutritionist'
    },
    appointment: {
      date: null,
      dateString: 'Thursday, Oct 15, 2026',
      timeSlot: '10:30 AM'
    },
    contact: {
      ownerName: 'Sarah Jenkins',
      ownerEmail: 'sarah.jenkins@example.com',
      ownerPhone: '(555) 392-1084',
      notes: 'Barnaby scratches his ears after eating poultry based kibble.'
    },
    payment: {
      method: 'card',
      depositPaid: 25,
      remainingBalance: 55,
      totalAmount: 80,
      currency: 'USD'
    }
  };

  // Initialize quote engine
  const quoteEngine = new window.NouriQuoteEngine({
    serviceId: bookingState.service.id,
    hostId: bookingState.host.id,
    duration: bookingState.service.duration,
    modality: bookingState.service.modality,
    petType: bookingState.pet.type
  });

  // Read URL query parameters to prefill
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('service')) {
    bookingState.service.id = urlParams.get('service');
    quoteEngine.setService(bookingState.service.id);
  }
  if (urlParams.get('host')) {
    bookingState.host.id = urlParams.get('host');
    quoteEngine.setHost(bookingState.host.id);
  }
  if (urlParams.get('pet')) {
    bookingState.pet.type = urlParams.get('pet');
  }

  // UI Element References
  const stepPanels = document.querySelectorAll('.booking-step-panel');
  const stepIndicators = document.querySelectorAll('.booking-step-indicator');
  const btnPrev = document.getElementById('bookingPrevBtn');
  const btnNext = document.getElementById('bookingNextBtn');

  // Initialize Calendar
  const calendarContainer = document.getElementById('bookingCalendar');
  const slotsContainer = document.getElementById('bookingTimeSlots');
  if (calendarContainer && slotsContainer) {
    new window.NouriCalendar({
      container: calendarContainer,
      slotsContainer: slotsContainer,
      onDateSelected: (dateObj) => {
        bookingState.appointment.date = dateObj;
        bookingState.appointment.dateString = dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        updateStepReviewSummary();
      },
      onSlotSelected: (slotTime) => {
        bookingState.appointment.timeSlot = slotTime;
        updateStepReviewSummary();
      }
    });
  }

  // Pet Type Selector Cards
  const petOptions = document.querySelectorAll('.pet-type-option');
  petOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      petOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      bookingState.pet.type = opt.getAttribute('data-pet');
      updateStepReviewSummary();
    });
  });

  // Concern Chips
  const concernChips = document.querySelectorAll('.concern-chip');
  concernChips.forEach(chip => {
    chip.addEventListener('click', () => {
      concernChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      bookingState.pet.concern = chip.textContent.trim();
    });
  });

  // Service Selector radios/cards
  const serviceCards = document.querySelectorAll('.booking-service-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      bookingState.service.id = card.getAttribute('data-service');
      const nameElem = card.querySelector('.service-title');
      if (nameElem) bookingState.service.name = nameElem.textContent.trim();
      quoteEngine.setService(bookingState.service.id);
      renderLiveQuote();
      updateStepReviewSummary();
    });
  });

  // Host Selector radios/cards
  const hostCards = document.querySelectorAll('.booking-host-card');
  hostCards.forEach(card => {
    card.addEventListener('click', () => {
      hostCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      bookingState.host.id = card.getAttribute('data-host');
      const nameElem = card.querySelector('.host-card-name');
      if (nameElem) bookingState.host.name = nameElem.textContent.trim();
      quoteEngine.setHost(bookingState.host.id);
      renderLiveQuote();
      updateStepReviewSummary();
    });
  });

  // Modality Radio Selection
  const modalityInputs = document.querySelectorAll('input[name="bookingModality"]');
  modalityInputs.forEach(input => {
    input.addEventListener('change', () => {
      bookingState.service.modality = input.value;
      quoteEngine.setModality(input.value);
      renderLiveQuote();
      updateStepReviewSummary();
    });
  });

  // Add-ons Checkboxes
  const addonCheckboxes = document.querySelectorAll('.booking-addon-check');
  addonCheckboxes.forEach(chk => {
    chk.addEventListener('change', () => {
      quoteEngine.toggleAddon(chk.value, chk.checked);
      renderLiveQuote();
    });
  });

  // Payment Method Tabs
  const paymentMethodTabs = document.querySelectorAll('.payment-method-tab');
  paymentMethodTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      paymentMethodTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      bookingState.payment.method = tab.getAttribute('data-method');
      const cardForm = document.getElementById('cardPaymentForm');
      const digitalWalletForm = document.getElementById('digitalWalletNotice');
      if (bookingState.payment.method === 'card') {
        if (cardForm) cardForm.style.display = 'block';
        if (digitalWalletForm) digitalWalletForm.style.display = 'none';
      } else {
        if (cardForm) cardForm.style.display = 'none';
        if (digitalWalletForm) {
          digitalWalletForm.style.display = 'block';
          digitalWalletForm.querySelector('.wallet-name').textContent = 
            bookingState.payment.method === 'apple' ? 'Apple Pay' : 'Google Pay';
        }
      }
    });
  });

  function renderLiveQuote() {
    const quote = quoteEngine.calculate();
    bookingState.payment.depositPaid = quote.depositRequired;
    bookingState.payment.remainingBalance = quote.remainingBalance;
    bookingState.payment.totalAmount = quote.totalAmount;

    // Update numbers in DOM
    const baseFeeElem = document.getElementById('quoteBaseFee');
    const bookingFeeElem = document.getElementById('quoteBookingFee');
    const addonsElem = document.getElementById('quoteAddonsFee');
    const totalElem = document.getElementById('quoteTotalAmount');
    const depositElem = document.getElementById('quoteDepositAmount');
    const remainingElem = document.getElementById('quoteRemainingBalance');
    const payBtnText = document.getElementById('payDepositBtnText');

    if (baseFeeElem) baseFeeElem.textContent = `$${quote.baseServiceFee}`;
    if (bookingFeeElem) bookingFeeElem.textContent = `$${quote.bookingFee}`;
    if (addonsElem) addonsElem.textContent = `$${quote.addonsTotal}`;
    if (totalElem) totalElem.textContent = `$${quote.totalAmount}`;
    if (depositElem) depositElem.textContent = `$${quote.depositRequired}`;
    if (remainingElem) remainingElem.textContent = `$${quote.remainingBalance}`;
    if (payBtnText) payBtnText.textContent = `Authorize Deposit — $${quote.depositRequired}`;
  }

  function updateStepReviewSummary() {
    // Read input fields for pet info
    const nameInput = document.getElementById('petNameInput');
    const ageInput = document.getElementById('petAgeInput');
    const breedInput = document.getElementById('petBreedInput');
    const weightInput = document.getElementById('petWeightInput');

    if (nameInput && nameInput.value) bookingState.pet.name = nameInput.value;
    if (ageInput && ageInput.value) bookingState.pet.age = ageInput.value;
    if (breedInput && breedInput.value) bookingState.pet.breed = breedInput.value;
    if (weightInput && weightInput.value) bookingState.pet.weight = weightInput.value;

    // Contact fields
    const ownerNameInput = document.getElementById('ownerNameInput');
    const ownerEmailInput = document.getElementById('ownerEmailInput');
    const ownerPhoneInput = document.getElementById('ownerPhoneInput');
    const ownerNotesInput = document.getElementById('ownerNotesInput');

    if (ownerNameInput && ownerNameInput.value) bookingState.contact.ownerName = ownerNameInput.value;
    if (ownerEmailInput && ownerEmailInput.value) bookingState.contact.ownerEmail = ownerEmailInput.value;
    if (ownerPhoneInput && ownerPhoneInput.value) bookingState.contact.ownerPhone = ownerPhoneInput.value;
    if (ownerNotesInput && ownerNotesInput.value) bookingState.contact.notes = ownerNotesInput.value;

    // Update Step 4 summary labels
    const sPet = document.getElementById('summaryPetName');
    const sService = document.getElementById('summaryServiceName');
    const sHost = document.getElementById('summaryHostName');
    const sDateTime = document.getElementById('summaryDateTime');
    const sModality = document.getElementById('summaryModality');

    if (sPet) sPet.textContent = `${bookingState.pet.name} (${bookingState.pet.breed || bookingState.pet.type}, ${bookingState.pet.age})`;
    if (sService) sService.textContent = bookingState.service.name;
    if (sHost) sHost.textContent = bookingState.host.name;
    if (sDateTime) sDateTime.textContent = `${bookingState.appointment.dateString} at ${bookingState.appointment.timeSlot}`;
    if (sModality) {
      sModality.textContent = bookingState.service.modality === 'online' 
        ? 'Online Video Consultation (Zoom)'
        : (bookingState.service.modality === 'clinic' ? 'In-Person Clinic' : 'At-Home Visit');
    }
  }

  function goToStep(stepNum) {
    if (stepNum < 1 || stepNum > 5) return;
    bookingState.step = stepNum;

    // Update Panels
    stepPanels.forEach(panel => {
      const pStep = parseInt(panel.getAttribute('data-step'), 10);
      if (pStep === stepNum) {
        panel.classList.remove('d-none');
      } else {
        panel.classList.add('d-none');
      }
    });

    // Update Progress Indicator
    stepIndicators.forEach(ind => {
      const iStep = parseInt(ind.getAttribute('data-step'), 10);
      ind.classList.remove('active', 'completed');
      if (iStep === stepNum) {
        ind.classList.add('active');
      } else if (iStep < stepNum) {
        ind.classList.add('completed');
      }
    });

    // Update buttons
    if (btnPrev) {
      btnPrev.style.visibility = stepNum === 1 ? 'hidden' : 'visible';
    }
    if (btnNext) {
      if (stepNum === 5) {
        btnNext.classList.add('d-none');
      } else {
        btnNext.classList.remove('d-none');
        btnNext.textContent = stepNum === 4 ? 'Continue to Deposit Quote' : 'Continue to Next Step';
      }
    }

    if (stepNum === 4 || stepNum === 5) {
      updateStepReviewSummary();
      renderLiveQuote();
    }

    // Smooth scroll to top of wizard
    bookingWizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      goToStep(bookingState.step - 1);
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      // Basic validation for Step 1
      if (bookingState.step === 1) {
        const nameVal = document.getElementById('petNameInput')?.value.trim();
        if (!nameVal) {
          alert('Please enter your pet’s name to personalize nutrition recommendations.');
          document.getElementById('petNameInput')?.focus();
          return;
        }
      }
      goToStep(bookingState.step + 1);
    });
  }

  // Allow clicking on completed steps in the progress bar
  stepIndicators.forEach(ind => {
    ind.addEventListener('click', () => {
      const targetStep = parseInt(ind.getAttribute('data-step'), 10);
      if (targetStep < bookingState.step) {
        goToStep(targetStep);
      }
    });
  });

  // Final Deposit Submission (Demo)
  const depositForm = document.getElementById('depositPaymentForm');
  if (depositForm) {
    depositForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const payBtn = document.getElementById('payDepositSubmitBtn');
      if (payBtn) {
        payBtn.disabled = true;
        payBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Securing Slot & Authorizing Deposit...`;
      }

      // Generate random booking ID
      const randomBookingId = 'NP-' + Math.floor(100000 + Math.random() * 900000);
      const finalizedBooking = {
        bookingId: randomBookingId,
        bookedAt: new Date().toISOString(),
        ...bookingState
      };

      // Store in localStorage & sessionStorage for booking-confirmation.html
      localStorage.setItem('nouripet_confirmed_booking', JSON.stringify(finalizedBooking));
      sessionStorage.setItem('nouripet_confirmed_booking', JSON.stringify(finalizedBooking));

      // Simulate network authorization delay (1.2s)
      setTimeout(() => {
        window.location.href = `booking-confirmation.html?id=${randomBookingId}`;
      }, 1200);
    });
  }

  // Initial calculation and summary update
  renderLiveQuote();
  updateStepReviewSummary();
});
