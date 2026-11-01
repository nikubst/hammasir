/**
 * هم‌مسیر (HamMasir OS) - Application Engine
 * Interactive Roadmapping, Visual Graph Nodes, Buffer Calendar, and Adaptive Replanning.
 */

// Application State
const appState = {
    currentGoal: {
        title: "توسعه اپلیکیشن پایتون و طراحی سیستم‌های داده",
        timeframe: 60,
        dailyHours: 2,
        bufferDays: 2,
        createdAt: new Date().toISOString()
    },
    version: 1.0,
    resilienceScore: 100,
    bounceBackRate: 100,
    bufferAbsorbedCount: 4,
    streakDays: 7,
    selectedReason: null,
    userCustomNote: "",
    adaptationLogs: [
        {
            version: "۱.۰",
            event: "طراحی اولیه نقشه راه با ۲ روز ضربه‌گیر در هفته",
            date: "آغاز سفر"
        }
    ],
    milestones: [
        {
            id: 1,
            title: "ایستگاه ۱: فونداسیون، راه‌اندازی محیط و معماری پایگاه‌داده",
            desc: "تنظیم محیط ایزوله پایتون، طراحی جداول رابطه‌ای، و تست اتصال پایگاه داده.",
            tag: "تکمیل شده",
            statusClass: "tag-done",
            dotClass: "completed",
            tasks: [
                { id: 101, title: "نصب ابزارهای پایه و ایجاد ساختار پوشه‌ها", done: true, minutes: 25 },
                { id: 102, title: "تعریف مدل‌های ارتباطی (Users, Goals, Milestones)", done: true, minutes: 30 },
                { id: 103, title: "نوشتن اولین تست برای بررسی صحت تراکنش‌های دیتابیس", done: true, minutes: 20 }
            ]
        },
        {
            id: 2,
            title: "ایستگاه ۲: پیاده‌سازی منطق هسته، الگوریتم زمان‌بندی و تجزیه اهداف",
            desc: "توسعه توابع تقسیم هدف کلان به ریزگام‌های قابل مدیریت و تعیین روزهای ضربه‌گیر.",
            tag: "در حال پیمایش",
            statusClass: "tag-ongoing",
            dotClass: "",
            tasks: [
                { id: 201, title: "پیاده‌سازی سرویس ساخت و تجزیه مایل‌استون‌ها", done: true, minutes: 35 },
                { id: 202, title: "طراحی ماژول عارضه‌یابی و ریشه‌یابی علل توقف", done: false, minutes: 30 },
                { id: 203, title: "اتصال به پایگاه داده و ذخیره‌سازی وضعیت کاربر", done: false, minutes: 25 }
            ]
        },
        {
            id: 3,
            title: "ایستگاه ۳: پیاده‌سازی رابط کاربری تعاملی، تقویم و گزارش‌گیری",
            desc: "طراحی داشبورد تعاملی با تم تاریک، سیستم انتخاب دلایل و پیش‌نمایش بازطراحی.",
            tag: "ایستگاه آتی",
            statusClass: "tag-ongoing",
            dotClass: "",
            tasks: [
                { id: 301, title: "طراحی کامپوننت‌های بصری نقشه راه و نمودار گره‌ها", done: false, minutes: 40 },
                { id: 302, title: "افزودن تست‌های شبیه‌سازی وقفه و بازآرایی سریع", done: false, minutes: 20 }
            ]
        },
        {
            id: 4,
            title: "ایستگاه ۴: تست نهایی در سناریوهای واقعی و انتشار نسخه نهایی",
            desc: "بررسی سناریوهای مختلف خستگی و انقطاع و جشن گرفتن پیروزی نهایی.",
            tag: "مقصد نهایی",
            statusClass: "tag-ongoing",
            dotClass: "",
            tasks: [
                { id: 401, title: "بررسی تمام سناریوهای بازتنظیم با داده‌های آزمایشی", done: false, minutes: 40 },
                { id: 402, title: "مستندسازی و اهدای نشان افتخار تاب‌آوری به خود", done: false, minutes: 20 }
            ]
        }
    ]
};

// Diagnosis Rule Book
const DIAGNOSIS_RULES = {
    burnout: {
        title: "تجویز هم‌مسیر: فاز بازیابی انرژی (Active Recovery Phase)",
        desc: "به جای احساس شرمندگی، سیستم به شما ۲ روز استراحت مطلق اهدا می‌کند. وظیفه مسدودکننده نیز به گام‌های فوق‌العاده کوتاه ۱۵ دقیقه‌ای تبدیل می‌شود تا بدون زحمت برگردید.",
        action: "INSERT_REST"
    },
    ambiguity: {
        title: "تجویز هم‌مسیر: خرد کردن به گام‌های ۵ دقیقه‌ای (Micro-Dosing)",
        desc: "مغز شما در برابر ابهام و بزرگی تسک مقاومت کرده است. سیستم کار فعلی را به ۳ ریزگام بسیار شفاف و آسان تقسیم می‌کند تا سد مقاومت ناپدید شود.",
        action: "DECHUNK"
    },
    life_event: {
        title: "تجویز هم‌مسیر: به‌کارگیری سپر ضربه‌گیر (Buffer Shield)",
        desc: "زندگی همیشه طبق تقویم پیش نمی‌رود. روزهای ضربه‌گیر ذخیره‌شده فعال می‌شوند و موعدها ۳ روز به جلو شیفت می‌یابند بدون اینکه هدف کلان آسیب ببیند.",
        action: "ACTIVATE_BUFFER"
    },
    time_estimate: {
        title: "تجویز هم‌مسیر: تعدیل ضریب زمان‌بندی (Pace Adjustment)",
        desc: "ضریب برآورد زمان ۱.۴ برابر افزایش می‌یابد و بار روزانه سبک‌تر می‌شود تا کیفیت فدای عجله نشود.",
        action: "EXTEND_TIME"
    }
};

// Preset Templates
const PRESETS = {
    python: {
        title: "توسعه اپلیکیشن پایتون و طراحی سیستم‌های داده",
        timeframe: 60,
        dailyHours: 2,
        buffer: 2
    },
    fitness: {
        title: "تناسب اندام، دویدن ۵ کیلومتر مداوم و ورزش ۳ روز در هفته",
        timeframe: 60,
        dailyHours: 1,
        buffer: 2
    },
    english: {
        title: "آمادگی آزمون زبان آیلتس (نمره ۷+) با مطالعه روزانه",
        timeframe: 90,
        dailyHours: 2,
        buffer: 2
    },
    startup: {
        title: "راه‌اندازی نسخه اولیه (MVP) استارتاپ و دریافت اولین فیدبک کاربران",
        timeframe: 90,
        dailyHours: 4,
        buffer: 2
    }
};

// Booting the App
document.addEventListener("DOMContentLoaded", () => {
    loadLocalState();
    renderAllViews();
    setupEventListeners();
    initAppMode();
});

function setupEventListeners() {
    const noteEl = document.getElementById("userReflectionNote");
    if (noteEl) {
        noteEl.addEventListener("input", (e) => {
            appState.userCustomNote = e.target.value;
        });
    }
}

// Tab Switching
function switchTab(tabId) {
    document.querySelectorAll(".nav-tab, .bottom-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

    document.querySelectorAll(`[data-tab="${tabId}"]`).forEach(b => b.classList.add("active"));

    const content = document.getElementById(tabId);
    if (content) content.classList.add("active");

    if (tabId === "visualGraphView") renderVisualGraph();
    if (tabId === "calendarView") renderWeekCalendar();
    if (tabId === "analyticsView") renderAnalytics();
}

function scrollToCreateGoal() {
    document.getElementById("goalWizardCard").scrollIntoView({ behavior: "smooth" });
}

// Preset Picker
function applyPresetGoal(key) {
    const p = PRESETS[key];
    if (!p) return;
    document.getElementById("inputGoalStatement").value = p.title;
    document.getElementById("selectTimeframe").value = p.timeframe;
    document.getElementById("selectDailyHours").value = p.dailyHours;
    document.getElementById("selectBufferIntensity").value = p.buffer;
    showToast(`الگوی «${p.title.substring(0, 25)}...» اعمال شد.`);
}

// Submit New Goal
function handleNewGoalSubmit() {
    const title = document.getElementById("inputGoalStatement").value.trim();
    const timeframe = parseInt(document.getElementById("selectTimeframe").value, 10);
    const dailyHours = parseFloat(document.getElementById("selectDailyHours").value);
    const bufferDays = parseInt(document.getElementById("selectBufferIntensity").value, 10);

    if (!title) return;

    appState.currentGoal = {
        title,
        timeframe,
        dailyHours,
        bufferDays,
        createdAt: new Date().toISOString()
    };

    appState.version = 1.0;
    appState.adaptationLogs = [
        {
            version: "۱.۰",
            event: `تعریف هدف کلان: «${title}» با ${bufferDays} روز بافر هفتگی`,
            date: "هم‌اکنون"
        }
    ];

    saveLocalState();
    renderAllViews();
    switchTab("roadmapView");
    showToast("نقشه راه هدف جدید شما با ضربه‌گیرهای هوشمند فعال شد! 🚀");
}

// Render Master UI
function renderAllViews() {
    renderRoadmapTimeline();
    renderVisualGraph();
    renderWeekCalendar();
    renderAnalytics();
}

// 1. Render Timeline
function renderRoadmapTimeline() {
    document.getElementById("activeGoalTitle").innerText = appState.currentGoal.title;
    document.getElementById("roadmapVerLabel").innerText = `نسخه ${appState.version.toFixed(1)} مسیر`;
    document.getElementById("heroVersionCount").innerText = `نسخه ${appState.version.toFixed(1)}`;
    document.getElementById("heroBufferCount").innerText = `${appState.currentGoal.bufferDays} روز / هفته`;

    // Progress
    let total = 0;
    let done = 0;
    appState.milestones.forEach(m => {
        m.tasks.forEach(t => {
            total++;
            if (t.done) done++;
        });
    });

    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    document.getElementById("progressPercentLabel").innerText = `${percent}٪`;
    document.getElementById("progressTrackBar").style.width = `${percent}%`;

    const timeline = document.getElementById("milestonesTimeline");
    timeline.innerHTML = "";

    appState.milestones.forEach(m => {
        const item = document.createElement("div");
        item.className = "milestone-item";

        const tasksHtml = m.tasks.map(t => `
            <div class="microtask-row ${t.done ? 'done' : ''}" onclick="toggleTaskStatus(${m.id}, ${t.id})">
                <div class="microtask-right">
                    <input type="checkbox" ${t.done ? 'checked' : ''} onclick="event.stopPropagation(); toggleTaskStatus(${m.id}, ${t.id})">
                    <span class="microtask-txt">${t.title}</span>
                </div>
                ${t.minutes > 0 ? `<span class="pomo-badge">⏱️ ${t.minutes} دقیقه</span>` : ''}
            </div>
        `).join("");

        item.innerHTML = `
            <div class="milestone-node ${m.dotClass || ''}"></div>
            <div class="milestone-header">
                <h4 class="milestone-title-text">${m.title}</h4>
                <span class="badge-tag ${m.statusClass || 'tag-ongoing'}">${m.tag}</span>
            </div>
            <p class="milestone-desc-text">${m.desc}</p>
            <div class="microtasks-list">
                ${tasksHtml}
            </div>
        `;

        timeline.appendChild(item);
    });
}

function toggleTaskStatus(mId, tId) {
    const milestone = appState.milestones.find(m => m.id === mId);
    if (!milestone) return;
    const task = milestone.tasks.find(t => t.id === tId);
    if (!task) return;

    task.done = !task.done;

    const allDone = milestone.tasks.every(t => t.done);
    if (allDone) {
        milestone.dotClass = "completed";
        milestone.statusClass = "tag-done";
        milestone.tag = "تکمیل شده ✨";
    }

    saveLocalState();
    renderAllViews();
}

// 2. Render Visual Path Graph
function renderVisualGraph() {
    const container = document.getElementById("visualGraphContainer");
    if (!container) return;
    container.innerHTML = "";

    appState.milestones.forEach((m, idx) => {
        const isLast = idx === appState.milestones.length - 1;
        const allDone = m.tasks.every(t => t.done);
        const isBuffer = m.tag.includes("ریکاوری") || m.tag.includes("بافر");

        let iconStateClass = isBuffer ? "buffer" : (allDone ? "done" : "");
        let iconSymbol = isBuffer ? "🍃" : (allDone ? "✓" : (idx + 1));

        const node = document.createElement("div");
        node.className = "graph-step-node";
        node.innerHTML = `
            <div class="node-icon-circle ${iconStateClass}">${iconSymbol}</div>
            <div style="flex: 1;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">
                    <h4 style="font-size: 1.05rem; font-weight: 800; color: #fff;">${m.title}</h4>
                    <span class="badge-tag ${m.statusClass}">${m.tag}</span>
                </div>
                <p style="font-size: 0.85rem; color: #94a3b8;">${m.desc}</p>
                <div style="font-size: 0.78rem; color: #818cf8; margin-top: 0.4rem;">
                    تعداد ریزگام‌ها: ${m.tasks.filter(t => t.done).length} از ${m.tasks.length} انجام شده
                </div>
            </div>
        `;
        container.appendChild(node);

        if (!isLast) {
            const connector = document.createElement("div");
            connector.className = "node-connector-line";
            container.appendChild(connector);
        }
    });
}

// 3. Render Buffer Calendar
function renderWeekCalendar() {
    const grid = document.getElementById("weekCalendarGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const days = [
        { name: "شنبه", type: "work", task: "تمرکز روی گام ۱ و مطالعه منابع" },
        { name: "یکشنبه", type: "work", task: "توسعه کد و پیاده‌سازی منطق" },
        { name: "دوشنبه", type: "work", task: "حل چالش‌ها و دیباگ" },
        { name: "سه‌شنبه", type: "work", task: "تست یکپارچگی مدل‌ها" },
        { name: "چهارشنبه", type: "work", task: "بازبینی و ثبت پیشرفت" },
        { name: "پنج‌شنبه", type: "buffer", task: "🛡️ ضربه‌گیر فعال: جبران آرام وظایف عقب‌افتاده بدون استرس" },
        { name: "جمعه", type: "buffer", task: "🍃 ضربه‌گیر و ریکاوری: استراحت مطلق و تجدید قوا برای هفته بعد" }
    ];

    days.forEach(d => {
        const box = document.createElement("div");
        box.className = `day-box ${d.type === 'buffer' ? 'buffer-day' : ''}`;
        box.innerHTML = `
            <div>
                <span class="day-name">${d.name}</span>
                <span class="day-tag ${d.type === 'buffer' ? 'buffer' : 'normal'}">
                    ${d.type === 'buffer' ? 'روز ضربه‌گیر (Buffer)' : 'روز تمرکز هدف'}
                </span>
            </div>
            <div class="day-task-summary">${d.task}</div>
        `;
        grid.appendChild(box);
    });
}

// 4. Render Analytics
function renderAnalytics() {
    document.getElementById("bounceBackRate").innerText = `${appState.bounceBackRate}٪`;
    document.getElementById("bufferAbsorbCount").innerText = `${appState.bufferAbsorbedCount} بار`;
    document.getElementById("totalAdaptationsCount").innerText = `${appState.adaptationLogs.length} نسخه`;

    const logList = document.getElementById("adaptationLogEntries");
    if (!logList) return;
    logList.innerHTML = "";

    appState.adaptationLogs.forEach(l => {
        const item = document.createElement("div");
        item.className = "log-item";
        item.innerHTML = `
            <div>
                <span style="font-weight: 700; color: #fff; margin-left: 0.5rem;">نسخه ${l.version}:</span>
                <span style="color: #cbd5e1;">${l.event}</span>
            </div>
            <span style="font-size: 0.78rem; color: #818cf8;">${l.date}</span>
        `;
        logList.appendChild(item);
    });
}

// Modal Diagnostics Flow
function openDiagnosisModal() {
    document.getElementById("diagnosisModal").style.display = "flex";
    appState.selectedReason = null;
    document.querySelectorAll(".reason-card").forEach(r => r.classList.remove("selected"));
    document.getElementById("aiSolutionBox").style.display = "none";
    document.getElementById("btnConfirmAdaptation").disabled = true;
    document.getElementById("userReflectionNote").value = "";
}

function closeDiagnosisModal() {
    document.getElementById("diagnosisModal").style.display = "none";
}

function selectFailureReason(key, element) {
    document.querySelectorAll(".reason-card").forEach(r => r.classList.remove("selected"));
    element.classList.add("selected");
    appState.selectedReason = key;

    const rule = DIAGNOSIS_RULES[key];
    if (rule) {
        document.getElementById("aiSolutionBox").style.display = "block";
        document.getElementById("aiSolutionTitle").innerText = rule.title;
        document.getElementById("aiSolutionDesc").innerText = rule.desc;
        document.getElementById("btnConfirmAdaptation").disabled = false;
    }
}

// Apply Compassionate Adaptation Plan
function applyAdaptationPlan() {
    if (!appState.selectedReason) return;

    const rule = DIAGNOSIS_RULES[appState.selectedReason];
    appState.version += 0.1;
    appState.bufferAbsorbedCount += 1;

    const timeStr = new Date().toLocaleTimeString("fa-IR", { hour: '2-digit', minute: '2-digit' });
    appState.adaptationLogs.unshift({
        version: appState.version.toFixed(1),
        event: `${rule.title} - ${appState.userCustomNote || 'تنظیم مجدد بر اساس شرایط واقعی شما'}`,
        date: `امروز ساعت ${timeStr}`
    });

    if (rule.action === "INSERT_REST") {
        const recoveryPhase = {
            id: Date.now(),
            title: "🍃 ایستگاه تنفس و شارژ باتری ذهنی (ضربه‌گیر بدون استرس)",
            desc: "دو روز استراحت سازنده بدون هیچ الزام یا سرزنشی. هدف ریکاوری انگیزه است.",
            tag: "ریکاوری فعال",
            statusClass: "tag-recovery",
            dotClass: "recovery",
            tasks: [
                { id: 901, title: "پیاده‌روی و فاصله گرفتن از استرس پروژه", done: true, minutes: 20 },
                { id: 902, title: "افتخار به گام‌هایی که تا اینجا طی کرده‌اید", done: true, minutes: 10 }
            ]
        };

        const idx = appState.milestones.findIndex(m => m.tasks.some(t => !t.done));
        if (idx >= 0) appState.milestones.splice(idx, 0, recoveryPhase);
        else appState.milestones.unshift(recoveryPhase);
    } 
    else if (rule.action === "DECHUNK") {
        const currentM = appState.milestones.find(m => m.tasks.some(t => !t.done));
        if (currentM) {
            currentM.title = `⚡ ${currentM.title} (ساده‌شده به گام‌های ۵ دقیقه‌ای)`;
            currentM.tag = "تسهیل شده";
            currentM.statusClass = "tag-adapted";
            currentM.dotClass = "adapted";
            currentM.tasks = [
                { id: 801, title: "تنها ۵ دقیقه باز کردن پروژه و نگاه کردن به تسک بدون کار سنگین", done: true, minutes: 5 },
                { id: 802, title: "نوشتن تنها یک خط کامنت یا تغییر بسیار کوچک", done: false, minutes: 10 },
                { id: 803, title: "پاداش برای پیروزی کوچک امروز و حفظ ریتم", done: false, minutes: 5 }
            ];
        }
    } 
    else {
        appState.milestones.forEach(m => {
            if (m.tasks.some(t => !t.done)) {
                m.tag = "بازتنظیم بافر";
                m.statusClass = "tag-adapted";
                m.dotClass = "adapted";
            }
        });
    }

    saveLocalState();
    renderAllViews();
    closeDiagnosisModal();

    showToast(`نسخه جدید (${appState.version.toFixed(1)}) با موفقیت بازطراحی شد! هیچ چیزی از دست نرفته است ✨`);
    switchTab("roadmapView");
}

// Storage
function saveLocalState() {
    try {
        localStorage.setItem("hammasir_os_state", JSON.stringify(appState));
    } catch (e) {
        console.error(e);
    }
}

function loadLocalState() {
    try {
        const saved = localStorage.getItem("hammasir_os_state");
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(appState, parsed);
        }
    } catch (e) {
        console.error(e);
    }
}

// Toast Notification
function showToast(msg) {
    const toast = document.getElementById("toastBox");
    const text = document.getElementById("toastText");
    text.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}

// ==========================================================================
// App Mode (PWA): service worker, install prompt, iOS hint, shortcuts
// ==========================================================================
let deferredInstallPrompt = null;

function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function initAppMode() {
    // Offline support
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("/sw.js").catch((e) => console.warn("SW registration failed:", e));
        });
    }

    // Android / Chrome / Edge: native install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
        const btn = document.getElementById("btnInstallApp");
        if (btn && !isStandalone()) btn.style.display = "inline-flex";
    });

    window.addEventListener("appinstalled", () => {
        deferredInstallPrompt = null;
        const btn = document.getElementById("btnInstallApp");
        if (btn) btn.style.display = "none";
        showToast("هم‌مسیر روی دستگاه شما نصب شد 🎉");
    });

    // iOS Safari: no install prompt, show a one-time hint
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIOS && !isStandalone() && !localStorage.getItem("hammasir_ios_hint_dismissed")) {
        setTimeout(() => {
            const hint = document.getElementById("iosInstallHint");
            if (hint) hint.classList.add("show");
        }, 2500);
    }

    // Home-screen shortcut: /?action=replan opens the diagnosis sheet directly
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "replan") {
        setTimeout(openDiagnosisModal, 300);
    }
}

async function installApp() {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    document.getElementById("btnInstallApp").style.display = "none";
}

function dismissIosHint() {
    document.getElementById("iosInstallHint").classList.remove("show");
    localStorage.setItem("hammasir_ios_hint_dismissed", "1");
}
