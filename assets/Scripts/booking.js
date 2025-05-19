document.addEventListener('DOMContentLoaded', function() {
    // متغیرهای مورد نیاز
    const categoryCards = document.querySelectorAll('.category-card');
    const serviceItems = document.querySelectorAll('.service-item');
    const sections = document.querySelectorAll('.booking-section');
    const steps = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const summaryItems = document.querySelectorAll('.summary-item .summary-value');
    const bookingContent = document.querySelector('.booking-content'); // Get the booking content element


    // اطلاعات رزرو
    let bookingData = {
        service: null,
        doctor: null,
        datetime: null,
        userInfo: null
    };
            // فعال سازی تقویم فارسی
            flatpickr("#booking-date", {
                locale: "fa",
                minDate: "today",
                disable: [
                    function(date) {
                        // غیرفعال کردن جمعه‌ها
                        return (date.getDay() === 5);
                    }
                ]
            });
    // تابع نمایش سرویس‌ها برای دسته‌بندی خاص
    function showServices(category) {
        serviceItems.forEach(item => {
            if (item.dataset.category === category) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // نمایش دسته‌بندی اولیه
    showServices('general');

    // مدیریت کلیک روی دسته‌بندی‌ها
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            categoryCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            showServices(category);
        });
    });

   // مدیریت انتخاب خدمت
   serviceItems.forEach(item => {
    const selectButton = item.querySelector('.select-service');
    selectButton.addEventListener('click', function() {
        // حذف انتخاب قبلی
        serviceItems.forEach(s => s.classList.remove('selected'));

        // انتخاب جدید
        item.classList.add('selected');

        // ذخیره اطلاعات
        const serviceName = item.querySelector('h3').textContent;
        const servicePrice = item.querySelector('.price').textContent;
        bookingData.service = {
            name: serviceName,
            price: servicePrice
        };

        // به‌روزرسانی خلاصه
        summaryItems[0].textContent = serviceName;
        summaryItems[3].textContent = servicePrice;

        // فعال کردن دکمه ادامه
        const nextButton = document.querySelector('#service-selection .next-step');
        if (nextButton) nextButton.disabled = false;
    });
});

// مدیریت دکمه‌های قبلی و بعدی
nextButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const currentSection = this.closest('.booking-section');
        const nextSectionId = this.dataset.next;
        const nextSection = document.getElementById(nextSectionId);

        if (nextSection) {
            currentSection.classList.remove('active');
            nextSection.classList.add('active');

            // به‌روزرسانی مراحل
            const currentStepIndex = Array.from(sections).indexOf(currentSection);
            steps[currentStepIndex].classList.remove('active');
            steps[currentStepIndex + 1].classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});


// مدیریت انتخاب پزشک
const doctorCards = document.querySelectorAll('.doctor-card');
doctorCards.forEach(card => {
    const selectButton = card.querySelector('.select-doctor');
    selectButton.addEventListener('click', function() {
        // حذف انتخاب قبلی
        doctorCards.forEach(d => d.classList.remove('selected'));

        // انتخاب جدید
        card.classList.add('selected');

        // ذخیره اطلاعات
        const doctorName = card.querySelector('h3').textContent;
        bookingData.doctor = doctorName;

        // به‌روزرسانی خلاصه
        summaryItems[1].textContent = doctorName;

        // فعال کردن دکمه ادامه
        const nextButton = document.querySelector('#doctor-selection .next-step');
        if (nextButton) nextButton.disabled = false;
    });
});

// مدیریت انتخاب زمان (با استفاده از Event Delegation)
const timeSelectionSection = document.getElementById('time-selection'); // Get the section
const prevWeekBtn = document.getElementById('prev-week');
const nextWeekBtn = document.getElementById('next-week');
const currentMonthDisplay = document.querySelector('.current-month');
const timeSelectionNextButton = document.querySelector('#time-selection .next-step'); // Get the button once

// تنظیم تاریخ اولیه
let currentDate = new Date();
updateCalendar(currentDate);

function updateCalendar(date) {
    // به‌روزرسانی نمایش ماه و سال
    const persianDate = new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long'
    }).format(date);

    const startDate = new Date(date);
    // تنظیم به شنبه هفته جاری
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
    startDate.setDate(diff);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // نمایش 7 روز کامل

    // به‌روزرسانی عنوان تقویم
    if (currentMonthDisplay) {
        const persianStartDate = new Intl.DateTimeFormat('fa-IR', {
            month: 'long',
            day: 'numeric'
        }).format(startDate);

        const persianEndDate = new Intl.DateTimeFormat('fa-IR', {
            month: 'long',
            day: 'numeric'
        }).format(endDate);

        currentMonthDisplay.innerHTML = `
            <span>${new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(date)}</span>
            <span>${persianStartDate} - ${persianEndDate}</span>
        `;
    }

    // به‌روزرسانی ستون‌های روزها
    const dayColumns = document.querySelectorAll('.day-column');
    dayColumns.forEach((column, index) => {
        const dayDate = new Date(startDate);
        dayDate.setDate(startDate.getDate() + index);

        const dayHeader = column.querySelector('.day-header');
        if (dayHeader) {
            const persianDayDate = new Intl.DateTimeFormat('fa-IR', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            }).format(dayDate);
            dayHeader.textContent = persianDayDate;
        }

        // ایجاد تایم‌های روزانه
        const timeSlotsContainer = column.querySelector('.time-slots');
        if (timeSlotsContainer) {
            // پاک کردن تایم‌های قبلی
            timeSlotsContainer.innerHTML = '';

            // ساعت‌های کاری (از ۹ صبح تا ۵ عصر)
            const workHours = [
                "09:00", "10:00", "11:00", "12:00",
                "14:00", "15:00", "16:00", "17:00"
            ];

            workHours.forEach(time => {
                const [hourStr, minuteStr] = time.split(':');
                const hour = parseInt(hourStr);
                const minute = parseInt(minuteStr);

                const timeSlot = document.createElement('div');
                timeSlot.className = 'time-slot';
                timeSlot.setAttribute('data-time', time);
                // Store the full date and time string for easier access
                timeSlot.setAttribute('data-full-datetime', `${dayDate.toISOString().split('T')[0]} ${time}`);


                const period = hour >= 12 ? 'بعد از ظهر' : 'صبح';
                const persianHour = new Intl.NumberFormat('fa-IR').format(hour > 12 ? hour - 12 : hour);
                const persianMinute = new Intl.NumberFormat('fa-IR').format(minute);

                timeSlot.textContent = `${persianHour}:${persianMinute} ${period}`;

                // *** REMOVE individual event listener here ***
                // timeSlot.addEventListener('click', function() { ... });

                timeSlotsContainer.appendChild(timeSlot);
            });
        }
    });

    // Initialize time selection button as disabled AFTER updating calendar
    if (timeSelectionNextButton) {
        timeSelectionNextButton.disabled = true;
    }
}

// Add event delegation listener to the time selection section
if (timeSelectionSection) {
    timeSelectionSection.addEventListener('click', function(event) {
        const clickedElement = event.target;

        // Check if the clicked element is a time slot
        if (clickedElement.classList.contains('time-slot')) {
            // Remove 'selected' class from all time slots within this section
            timeSelectionSection.querySelectorAll('.time-slot').forEach(slot =>
                slot.classList.remove('selected')
            );

            // Add 'selected' class to the clicked time slot
            clickedElement.classList.add('selected');

            // Store selected date and time
            const selectedFullDatetime = clickedElement.getAttribute('data-full-datetime');
            const selectedDisplayTime = clickedElement.textContent;

            // Find the corresponding day header to get the date part
            const dayColumn = clickedElement.closest('.day-column');
            const dayHeader = dayColumn ? dayColumn.querySelector('.day-header').textContent : '';

            bookingData.datetime = `${dayHeader} - ${selectedDisplayTime}`;
            summaryItems[2].textContent = bookingData.datetime;


            // Enable the next button
            if (timeSelectionNextButton) {
                timeSelectionNextButton.disabled = false;
            }
        }
    });
}


if (prevWeekBtn && nextWeekBtn) {
    prevWeekBtn.addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() - 7);
        updateCalendar(currentDate);
    });

    nextWeekBtn.addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() + 7);
        updateCalendar(currentDate);
    });
}

// Remove this line or comment it out
// dateInput.addEventListener('change', checkTimeSelection);
    // مدیریت فرم اطلاعات
    const bookingForm = document.querySelector('.booking-form');
    const requiredInputs = bookingForm.querySelectorAll('input[required]');

    function checkFormValidity() {
        const submitButton = document.querySelector('#info-completion .next-step');
        const isValid = Array.from(requiredInputs).every(input => input.value.trim() !== '');
        if (submitButton) submitButton.disabled = !isValid;
    }

    requiredInputs.forEach(input => {
        input.addEventListener('input', checkFormValidity);
    });

    // مدیریت دکمه‌های قبلی و بعدی
    nextButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const currentSection = this.closest('.booking-section');
            const nextSectionId = this.dataset.next;
            const nextSection = document.getElementById(nextSectionId);

            if (nextSection) {
                currentSection.classList.remove('active');
                nextSection.classList.add('active');

                // به‌روزرسانی مراحل
                const currentStepIndex = Array.from(sections).indexOf(currentSection);
                if (steps[currentStepIndex]) steps[currentStepIndex].classList.remove('active');
                if (steps[currentStepIndex + 1]) steps[currentStepIndex + 1].classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentSection = this.closest('.booking-section');
            const prevSectionId = this.dataset.prev;
            const prevSection = document.getElementById(prevSectionId);

            if (prevSection) {
                currentSection.classList.remove('active');
                prevSection.classList.add('active');

                // به‌روزرسانی مراحل
                const currentStepIndex = Array.from(sections).indexOf(currentSection);
                if (steps[currentStepIndex]) steps[currentStepIndex].classList.remove('active');
                if (steps[currentStepIndex - 1]) steps[currentStepIndex - 1].classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // مدیریت فرم نهایی
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
    
            // ذخیره اطلاعات کاربر
            bookingData.userInfo = {
                fullname: document.getElementById('fullname').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                nationalId: document.getElementById('national-id').value,
                notes: document.getElementById('notes').value
            };
    
            // به‌روزرسانی صفحه تأیید
            const confirmedService = document.getElementById('confirmed-service');
            const confirmedDoctor = document.getElementById('confirmed-doctor');
            const confirmedTime = document.getElementById('confirmed-time');
            const confirmedPrice = document.getElementById('confirmed-price');
    
            if (confirmedService) confirmedService.textContent = bookingData.service ? bookingData.service.name : '-';
            if (confirmedDoctor) confirmedDoctor.textContent = bookingData.doctor || '-';
            if (confirmedTime) confirmedTime.textContent = bookingData.datetime || '-';
            if (confirmedPrice) confirmedPrice.textContent = bookingData.service ? bookingData.service.price : '-';
    

            // Hide the booking content section
            if (bookingContent) {
                bookingContent.style.display = 'none';
            }

            // به‌روزرسانی اطلاعات کاربر در صفحه تأیید
            const confirmedFullname = document.getElementById('confirmed-fullname'); // فرض بر وجود عنصری با این ID در HTML
            const confirmedPhone = document.getElementById('confirmed-phone'); // فرض بر وجود عنصری با این ID در HTML
            const confirmedEmail = document.getElementById('confirmed-email'); // فرض بر وجود عنصری با این ID در HTML
            const confirmedNationalId = document.getElementById('confirmed-national-id'); // فرض بر وجود عنصری با این ID در HTML
            const confirmedNotes = document.getElementById('confirmed-notes'); // فرض بر وجود عنصری با این ID در HTML

            if (confirmedFullname) confirmedFullname.textContent = bookingData.userInfo.fullname;
            if (confirmedPhone) confirmedPhone.textContent = bookingData.userInfo.phone;
            if (confirmedEmail) confirmedEmail.textContent = bookingData.userInfo.email;
            if (confirmedNationalId) confirmedNationalId.textContent = bookingData.userInfo.nationalId;
            if (confirmedNotes) confirmedNotes.textContent = bookingData.userInfo.notes;

            // نمایش صفحه تأیید
            const currentSection = document.querySelector('.booking-section.active');
            const confirmationSection = document.getElementById('confirmation');

            if (currentSection && confirmationSection) {
                currentSection.classList.remove('active');
                confirmationSection.classList.add('active');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        // دکمه چاپ رسید
        document.getElementById('print-booking').addEventListener('click', function() {
            window.print();
        });

        // دکمه رزرو جدید
        document.getElementById('new-booking').addEventListener('click', function() {
            // ریست تمام مراحل
            steps.forEach(step => step.classList.remove('active'));
            steps[0].classList.add('active');

            sections.forEach(section => section.classList.remove('active'));
            sections[0].classList.add('active');

            // Show the booking content section again
            if (bookingContent) {
                bookingContent.style.display = 'block'; // Or 'flex', depending on your CSS
            }


            // ریست فرم
            bookingForm.reset();

            // ریست انتخاب‌ها
            serviceItems.forEach(item => item.classList.remove('selected'));
            doctorCards.forEach(card => card.classList.remove('selected'));
            // Find all current time slots to remove selected class
            document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));


            // ریست خلاصه
            summaryItems.forEach(item => item.textContent = '-');
            summaryItems[3].textContent = '0 تومان';

            // ریست داده‌ها
            Object.keys(bookingData).forEach(key => {
                if (typeof bookingData[key] === 'object') {
                    bookingData[key] = {};
                } else {
                    bookingData[key] = null;
                }
            });

            // اسکرول به بالا
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


});