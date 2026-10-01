/* ==========================================================================
   NOURIPET — REAL-TIME CALENDAR ENGINE
   Interactive Monthly Calendar, Real-time Slot Generator, Empty States
   ========================================================================== */

class NouriCalendar {
  constructor(options = {}) {
    this.container = typeof options.container === 'string' 
      ? document.querySelector(options.container) 
      : options.container;

    this.slotsContainer = typeof options.slotsContainer === 'string'
      ? document.querySelector(options.slotsContainer)
      : options.slotsContainer;

    this.onDateSelected = options.onDateSelected || (() => {});
    this.onSlotSelected = options.onSlotSelected || (() => {});

    // Calendar State
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth(); // 0-indexed
    this.selectedDate = null;
    this.selectedSlot = null;

    // Simulated schedule availability rules
    // (Sundays fully booked or off, Wednesdays limited, others open)
    this.monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    this.init();
  }

  init() {
    if (!this.container) return;
    this.renderCalendar();
  }

  renderCalendar() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayIndex = new Date(this.currentYear, this.currentMonth, 1).getDay(); // 0 is Sun
    const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    // Adjust for Monday start (0=Mo, 6=Su)
    const adjustedStart = (firstDayIndex + 6) % 7;

    const monthLabel = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;

    let html = `
      <div class="calendar-header">
        <h5 class="mb-0 fw-bold" style="font-family: var(--font-primary); font-size: 1.1rem;">
          <i class="bi bi-calendar3 me-2 text-success"></i> ${monthLabel}
        </h5>
        <div class="d-flex gap-2">
          <button type="button" class="calendar-nav-btn prev-month" aria-label="Previous month" id="calPrevBtn">
            <i class="bi bi-chevron-left"></i>
          </button>
          <button type="button" class="calendar-nav-btn next-month" aria-label="Next month" id="calNextBtn">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <div class="calendar-grid">
        <div class="calendar-day-header">Mon</div>
        <div class="calendar-day-header">Tue</div>
        <div class="calendar-day-header">Wed</div>
        <div class="calendar-day-header">Thu</div>
        <div class="calendar-day-header">Fri</div>
        <div class="calendar-day-header">Sat</div>
        <div class="calendar-day-header">Sun</div>
    `;

    // Empty cells before first day
    for (let i = 0; i < adjustedStart; i++) {
      html += `<div class="calendar-date-cell empty"></div>`;
    }

    // Date cells
    let firstAvailableDay = null;

    for (let day = 1; day <= totalDays; day++) {
      const cellDate = new Date(this.currentYear, this.currentMonth, day);
      cellDate.setHours(0, 0, 0, 0);
      const dayOfWeek = cellDate.getDay(); // 0 is Sunday

      const isPast = cellDate < today;
      const isToday = cellDate.getTime() === today.getTime();
      // Fictional availability: Sundays unavailable, 1st and 3rd Wednesday unavailable for clinic maintenance
      const isUnavailable = isPast || dayOfWeek === 0 || (dayOfWeek === 3 && day % 2 === 0);

      let classes = ['calendar-date-cell'];
      if (isToday) classes.push('today');

      if (isUnavailable) {
        classes.push('unavailable');
      } else {
        classes.push('available');
        if (!firstAvailableDay && !isPast) {
          firstAvailableDay = day;
        }
      }

      if (this.selectedDate && 
          this.selectedDate.getFullYear() === this.currentYear && 
          this.selectedDate.getMonth() === this.currentMonth && 
          this.selectedDate.getDate() === day) {
        classes.push('selected');
      }

      const disabledAttr = isUnavailable ? 'aria-disabled="true"' : `data-day="${day}" tabindex="0"`;

      html += `
        <div class="${classes.join(' ')}" ${disabledAttr} title="${cellDate.toDateString()}">
          <span>${day}</span>
        </div>
      `;
    }

    html += `</div>`;
    this.container.innerHTML = html;

    // Attach navigation listeners
    this.container.querySelector('#calPrevBtn').addEventListener('click', () => {
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
      this.renderCalendar();
    });

    this.container.querySelector('#calNextBtn').addEventListener('click', () => {
      this.currentMonth++;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.renderCalendar();
    });

    // Attach date click listeners
    const dateCells = this.container.querySelectorAll('.calendar-date-cell.available');
    dateCells.forEach(cell => {
      const handleSelect = () => {
        const day = parseInt(cell.getAttribute('data-day'), 10);
        this.selectDate(new Date(this.currentYear, this.currentMonth, day));
      };

      cell.addEventListener('click', handleSelect);
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      });
    });

    // Auto-select initial date if none selected yet
    if (!this.selectedDate && firstAvailableDay) {
      this.selectDate(new Date(this.currentYear, this.currentMonth, firstAvailableDay));
    } else if (this.selectedDate) {
      this.renderSlotsForDate(this.selectedDate);
    }
  }

  selectDate(dateObj) {
    this.selectedDate = dateObj;

    // Highlight cell in UI
    const cells = this.container.querySelectorAll('.calendar-date-cell');
    cells.forEach(c => c.classList.remove('selected'));

    const day = dateObj.getDate();
    const targetCell = this.container.querySelector(`.calendar-date-cell.available[data-day="${day}"]`);
    if (targetCell) targetCell.classList.add('selected');

    this.renderSlotsForDate(dateObj);
    this.onDateSelected(dateObj);
  }

  renderSlotsForDate(dateObj) {
    if (!this.slotsContainer) return;

    // Simulate slot generation based on date
    const dateFormatted = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });

    // Template sample times
    const allSlots = [
      { time: '09:00 AM', period: 'morning', available: true },
      { time: '10:30 AM', period: 'morning', available: true },
      { time: '11:45 AM', period: 'morning', available: false },
      { time: '01:15 PM', period: 'afternoon', available: true },
      { time: '02:30 PM', period: 'afternoon', available: false },
      { time: '03:45 PM', period: 'afternoon', available: true },
      { time: '05:00 PM', period: 'evening', available: true },
      { time: '06:15 PM', period: 'evening', available: true }
    ];

    // Some variation based on date
    const daySeed = dateObj.getDate();
    const availableCount = allSlots.filter((s, idx) => (s.available && (daySeed + idx) % 5 !== 0)).length;

    let html = `
      <div class="d-flex align-items-center justify-content-between mb-2">
        <label class="form-label mb-0 fw-bold">Available Slots for ${dateFormatted}</label>
        <span class="badge bg-light text-dark border">${availableCount} slots open</span>
      </div>
    `;

    if (availableCount === 0) {
      html += `
        <div class="text-center p-4 bg-light rounded-3 my-2 border">
          <i class="bi bi-calendar-x text-muted fs-3 mb-2 d-block"></i>
          <p class="mb-2 fw-semibold text-muted">No appointments available on this date.</p>
          <button type="button" class="btn btn-sm btn-np-secondary" id="calJumpNextBtn">
            <i class="bi bi-arrow-right-circle me-1"></i> View Next Available Date
          </button>
        </div>
      `;
      this.slotsContainer.innerHTML = html;
      this.slotsContainer.querySelector('#calJumpNextBtn')?.addEventListener('click', () => {
        this.jumpToNextAvailable();
      });
      return;
    }

    html += `<div class="time-slots-container">`;
    allSlots.forEach((slot, idx) => {
      const isSlotAvail = slot.available && (daySeed + idx) % 5 !== 0;
      const isSelected = this.selectedSlot === slot.time;
      const classes = ['time-slot-btn'];
      if (!isSlotAvail) classes.push('disabled');
      if (isSelected && isSlotAvail) classes.push('selected');

      html += `
        <button type="button" 
          class="${classes.join(' ')}" 
          data-time="${slot.time}" 
          ${!isSlotAvail ? 'disabled aria-disabled="true"' : ''}>
          <i class="bi bi-clock me-1"></i> ${slot.time}
        </button>
      `;
    });
    html += `</div>`;

    this.slotsContainer.innerHTML = html;

    // Attach slot click listeners
    const slotButtons = this.slotsContainer.querySelectorAll('.time-slot-btn:not(.disabled)');
    slotButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        slotButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedSlot = btn.getAttribute('data-time');
        this.onSlotSelected(this.selectedSlot, this.selectedDate);
      });
    });

    // Auto-select first slot if none selected
    if (!this.selectedSlot && slotButtons.length > 0) {
      slotButtons[0].click();
    }
  }

  jumpToNextAvailable() {
    if (!this.selectedDate) return;
    const nextDate = new Date(this.selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    
    // Jump past Sunday if needed
    if (nextDate.getDay() === 0) nextDate.setDate(nextDate.getDate() + 1);

    this.currentMonth = nextDate.getMonth();
    this.currentYear = nextDate.getFullYear();
    this.renderCalendar();
    this.selectDate(nextDate);
  }
}

window.NouriCalendar = NouriCalendar;
