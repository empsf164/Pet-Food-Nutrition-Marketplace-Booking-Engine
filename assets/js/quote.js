/* ==========================================================================
   NOURIPET — INSTANT PRICING & QUOTE ENGINE
   Front-End Real-Time Dynamic Pricing Calculation & Deposit Breakdown
   ========================================================================== */

(function () {
  'use strict';

  // Base service rates
  const SERVICE_RATES = {
    'consultation': { name: 'Personalized Nutrition Consultation', basePrice: 75, baseMinutes: 60 },
    'meal-plan': { name: 'Customized 30-Day Fresh Meal Plan', basePrice: 120, baseMinutes: 90 },
    'food-assessment': { name: 'Commercial Pet Food & Label Assessment', basePrice: 55, baseMinutes: 45 },
    'allergy': { name: 'Allergy & Gut Microbiome Guidance', basePrice: 95, baseMinutes: 60 },
    'weight': { name: 'Metabolic Weight Management Protocol', basePrice: 85, baseMinutes: 60 },
    'puppy': { name: 'Puppy & Kitten Growth Nutrition Plan', basePrice: 80, baseMinutes: 60 }
  };

  // Host multipliers / adjustments
  const HOST_RATES = {
    'dr-maya-carter': { name: 'Dr. Maya Carter, M.S.', title: 'Lead Canine Clinical Nutritionist', surcharge: 10 },
    'dr-julian-vance': { name: 'Dr. Julian Vance, DVM', title: 'Feline Renal & GI Specialist', surcharge: 15 },
    'elena-rostova': { name: 'Elena Rostova, M.Sc.', title: 'Raw & Microbiome Formulator', surcharge: 5 },
    'marcus-chen': { name: 'Marcus Chen, B.Sc.', title: 'Sport & Working Dog Specialist', surcharge: 0 },
    'dr-sarah-jenkins': { name: 'Dr. Sarah Jenkins, Ph.D.', title: 'Early Life & Pediatric Dietetics', surcharge: 10 },
    'amara-okafor': { name: 'Amara Okafor, C.V.T.', title: 'Senior Pet Metabolic Specialist', surcharge: 5 }
  };

  // Add-on options
  const ADD_ONS = {
    'recipe-cards': { name: 'Printed 30-Day Step-by-Step Recipe Book', price: 20 },
    'microbiome-review': { name: 'Gut Microbiome Stool Lab Review', price: 35 },
    'allergen-crosscheck': { name: 'Commercial Brand Allergen Cross-Check', price: 15 },
    'followup-checkin': { name: '14-Day Priority Chat Follow-up Access', price: 25 }
  };

  // Duration multipliers
  const DURATION_MODIFIERS = {
    '30': 0.7,
    '45': 0.85,
    '60': 1.0,
    '90': 1.35
  };

  // Modality fee (e.g. in-person travel vs online)
  const MODALITY_FEES = {
    'online': 0,
    'clinic': 10,
    'home-visit': 25
  };

  const PLATFORM_BOOKING_FEE = 5;

  class NouriQuoteEngine {
    constructor(config = {}) {
      this.serviceId = config.serviceId || 'consultation';
      this.hostId = config.hostId || 'dr-maya-carter';
      this.duration = config.duration || '60';
      this.modality = config.modality || 'online';
      this.petType = config.petType || 'dog';
      this.selectedAddons = new Set(config.addons || []);
      this.depositPercentage = 0.30; // 30% or minimum $25
      this.fixedMinDeposit = 25;
    }

    setService(serviceId) {
      if (SERVICE_RATES[serviceId]) this.serviceId = serviceId;
      return this.calculate();
    }

    setHost(hostId) {
      if (HOST_RATES[hostId]) this.hostId = hostId;
      return this.calculate();
    }

    setDuration(durationMinutes) {
      if (DURATION_MODIFIERS[durationMinutes]) this.duration = durationMinutes;
      return this.calculate();
    }

    setModality(modalityKey) {
      if (MODALITY_FEES[modalityKey] !== undefined) this.modality = modalityKey;
      return this.calculate();
    }

    toggleAddon(addonId, enable) {
      if (enable !== undefined) {
        if (enable) this.selectedAddons.add(addonId);
        else this.selectedAddons.delete(addonId);
      } else {
        if (this.selectedAddons.has(addonId)) this.selectedAddons.delete(addonId);
        else this.selectedAddons.add(addonId);
      }
      return this.calculate();
    }

    calculate() {
      const service = SERVICE_RATES[this.serviceId] || SERVICE_RATES['consultation'];
      const host = HOST_RATES[this.hostId] || HOST_RATES['dr-maya-carter'];
      const durationMod = DURATION_MODIFIERS[this.duration] || 1.0;
      const modalityFee = MODALITY_FEES[this.modality] || 0;

      // Base service calculation
      const adjustedBase = Math.round(service.basePrice * durationMod) + host.surcharge;

      // Addons total
      let addonsTotal = 0;
      const addonDetails = [];
      this.selectedAddons.forEach(addonId => {
        if (ADD_ONS[addonId]) {
          addonsTotal += ADD_ONS[addonId].price;
          addonDetails.push({
            id: addonId,
            name: ADD_ONS[addonId].name,
            price: ADD_ONS[addonId].price
          });
        }
      });

      const subtotal = adjustedBase + modalityFee + addonsTotal;
      const bookingFee = PLATFORM_BOOKING_FEE;
      const totalAmount = subtotal + bookingFee;

      // Deposit logic: 30% of total rounded up, or min $25
      let depositRequired = Math.max(this.fixedMinDeposit, Math.round(totalAmount * this.depositPercentage));
      if (depositRequired > totalAmount) depositRequired = totalAmount;

      const remainingBalance = totalAmount - depositRequired;

      return {
        serviceId: this.serviceId,
        serviceName: service.name,
        hostId: this.hostId,
        hostName: host.name,
        hostTitle: host.title,
        durationMinutes: parseInt(this.duration, 10),
        modality: this.modality,
        baseServiceFee: adjustedBase,
        modalityFee: modalityFee,
        addonItems: addonDetails,
        addonsTotal: addonsTotal,
        bookingFee: bookingFee,
        subtotal: subtotal,
        totalAmount: totalAmount,
        depositRequired: depositRequired,
        remainingBalance: remainingBalance,
        isDemo: true
      };
    }
  }

  window.NouriQuoteEngine = NouriQuoteEngine;
  window.NouriRates = {
    SERVICE_RATES,
    HOST_RATES,
    ADD_ONS,
    DURATION_MODIFIERS,
    MODALITY_FEES,
    PLATFORM_BOOKING_FEE
  };
})();
