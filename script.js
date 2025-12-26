// ملف الجافاسكريبت الرئيسي لموقع مطعم بيتر
console.log("تم تحميل موقع مطعم بيتر بنجاح");

// التعامل مع زر القائمة في الجوال
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.querySelector('.main-nav');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mainNav.classList.toggle('active');
    });
}

// إغلاق القائمة عند النقر على أي رابط (لتجربة مستخدم أفضل)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mainNav.classList.remove('active');
    });
});

// سيتم إضافة المزيد من الوظائف لاحقاً (مثل تصفية القائمة)

// نظام تصفية القائمة (Menu Filtering)
const filterBtns = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');

// دالة موحدة لتطبيق جميع الفلاتر (التصنيف + الحساسية)
function applyFilters() {
    // 1. الحصول على التصنيف النشط
    const activeCategoryBtn = document.querySelector('.filter-btn.active');
    const categoryFilter = activeCategoryBtn ? activeCategoryBtn.getAttribute('data-filter') : 'all';

    // 2. الحصول على مسببات الحساسية المختارة
    const selectedAllergens = Array.from(allergyCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    let hiddenByAllergyCount = 0;

    menuItems.forEach(item => {
        // التحقق من الحساسية أولاً
        const itemAllergensAttr = item.getAttribute('data-allergens');
        let isAllergic = false;

        if (itemAllergensAttr && selectedAllergens.length > 0) {
            const allergensList = itemAllergensAttr.split(',').map(a => a.trim().toLowerCase());
            isAllergic = selectedAllergens.some(allergen => allergensList.includes(allergen.toLowerCase()));
        }

        // تحديد ما إذا كان العنصر يجب أن يظهر بناءً على التصنيف
        const matchesCategory = (categoryFilter === 'all' || item.getAttribute('data-category') === categoryFilter);

        // المنطق النهائي للإظهار/الإخفاء
        if (isAllergic) {
            // إذا كان يسبب حساسية، نخفيه دائماً بغض النظر عن التصنيف
            item.style.display = 'none';
            // نحسبه فقط إذا كان ضمن التصنيف الحالي (للعرض في الإحصائيات إذا أردنا) أو نحسبه بشكل عام
            hiddenByAllergyCount++;
        } else if (matchesCategory) {
            // إذا لم يكن يسبب حساسية ويطابق التصنيف، نظهره
            item.style.display = 'block';
            item.style.animation = 'none';
            item.offsetHeight; /* trigger reflow */
            item.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
            // لا يطابق التصنيف (ولا يسبب حساسية)، نخفيه
            item.style.display = 'none';
        }
    });

    // تحديث رسالة الحساسية إذا كان هناك فلتر مفعل
    if (selectedAllergens.length > 0) {
        allergyMessage.style.display = 'block';
        allergyMessage.textContent = `تم إخفاء ${hiddenByAllergyCount} صنف يحتوي على مسببات الحساسية المختارة.`;
        allergyMessage.style.backgroundColor = '#fff3cd';
        allergyMessage.style.color = '#856404';
        allergyMessage.style.borderColor = '#ffeeba';
    } else {
        allergyMessage.style.display = 'none';
    }
}

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // إزالة الكلاس active من جميع الأزرار
            filterBtns.forEach(b => b.classList.remove('active'));
            // إضافة active للزر المضغوط
            btn.classList.add('active');
            
            // استدعاء الدالة الموحدة
            applyFilters();
        });
    });
}

// إضافة أنيميشن في CSS (يمكن إضافته في ملف style.css، لكن سنضيفه هنا كـ style tag سريعاً أو نعتمد على CSS)
// سنعتمد على أنيميشن CSS الافتراضي للعناصر

// نظام فلترة الحساسية (Allergy Filtering) - القائمة المنسدلة
const allergyDropdownTrigger = document.getElementById('allergyDropdownTrigger');
const allergyDropdownMenu = document.getElementById('allergyDropdownMenu');
const allergyCheckboxes = document.querySelectorAll('.allergy-checkbox-input');
const applyAllergyBtn = document.getElementById('apply-allergy-filter');
const resetAllergyBtn = document.getElementById('reset-allergy-filter');
const allergyMessage = document.getElementById('allergy-message');
const selectedText = document.querySelector('.selected-text');

// إدارة القائمة المنسدلة
if (allergyDropdownTrigger) {
    allergyDropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        allergyDropdownTrigger.classList.toggle('active');
        allergyDropdownMenu.classList.toggle('show');
    });

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', (e) => {
        if (!allergyDropdownTrigger.contains(e.target) && !allergyDropdownMenu.contains(e.target)) {
            allergyDropdownTrigger.classList.remove('active');
            allergyDropdownMenu.classList.remove('show');
        }
    });
}

// تحديث النص عند تغيير الاختيارات
function updateSelectedText() {
    const selectedCount = Array.from(allergyCheckboxes).filter(cb => cb.checked).length;
    if (selectedCount > 0) {
        selectedText.textContent = `تم اختيار ${selectedCount} حساسيات`;
        selectedText.style.fontWeight = '700';
        selectedText.style.color = 'var(--primary-color)';
    } else {
        selectedText.textContent = 'اختر الحساسيات لتجنبها...';
        selectedText.style.fontWeight = '500';
        selectedText.style.color = 'var(--text-color)';
    }
}

// ربط تحديث النص بتغيير مربعات الاختيار
allergyCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateSelectedText);
});

if (applyAllergyBtn) {
    applyAllergyBtn.addEventListener('click', () => {
        // جمع الحساسيات المختارة
        const selectedAllergens = Array.from(allergyCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        if (selectedAllergens.length === 0) {
            allergyMessage.style.display = 'block';
            allergyMessage.textContent = 'الرجاء اختيار مسبب حساسية واحد على الأقل.';
            allergyMessage.style.backgroundColor = '#f8d7da';
            allergyMessage.style.color = '#721c24';
            allergyMessage.style.borderColor = '#f5c6cb';
            return;
        }

        // استخدام الدالة الموحدة بدلاً من المنطق المكرر
        applyFilters();

        // إغلاق القائمة بعد التطبيق
        allergyDropdownTrigger.classList.remove('active');
        allergyDropdownMenu.classList.remove('show');
    });
}

if (resetAllergyBtn) {
    resetAllergyBtn.addEventListener('click', () => {
        // إلغاء تحديد جميع الـ checkboxes
        allergyCheckboxes.forEach(cb => cb.checked = false);
        
        // تحديث النص
        updateSelectedText();

        // استخدام الدالة الموحدة لإعادة تعيين العرض
        applyFilters();
        
        // إخفاء الرسالة (يتم التعامل معها داخل applyFilters، ولكن للتأكيد)
        allergyMessage.style.display = 'none';
        
        // إغلاق القائمة
        allergyDropdownTrigger.classList.remove('active');
        allergyDropdownMenu.classList.remove('show');
    });
}


