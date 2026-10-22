
/* ==========================================
   ConvertEase — Smart Unit Converter
   HTML + CSS + Vanilla JavaScript
   ========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------
    // 1. Select HTML elements
    // ----------------------------------------

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => [...document.querySelectorAll(selector)];

    const inputValue = $("#inputValue");
    const fromUnit = $("#fromUnit");
    const toUnit = $("#toUnit");
    const resultValue = $("#resultValue");
    const formulaText = $("#formulaText");

    const languageSelect = $("#languageSelect");
    const themeToggle = $("#themeToggle");
    const themeIcon = $("#themeIcon");

    const favoriteToggle = $("#favoriteToggle");
    const favoriteIcon = $("#favoriteIcon");

    const historyCount = $("#historyCount");
    const favoriteCount = $("#favoriteCount");

    const recentHistory = $("#recentHistory");
    const fullHistory = $("#fullHistory");
    const favoritesList = $("#favoritesList");

    const converterView = $("#converterView");
    const historyView = $("#historyView");
    const favoritesView = $("#favoritesView");
    const breadcrumbTitle = $("#breadcrumbTitle");

    const toast = $("#toast");
    const toastMessage = $("#toastMessage");
    const toastIcon = $("#toastIcon");

    const menuToggle = $("#menuToggle");
    const sidebar = $("#sidebar");

    // ----------------------------------------
    // 2. Unit definitions
    //
    // factor = multiplier to the base unit.
    // Temperature uses separate conversion logic.
    // ----------------------------------------

    const categories = {
        length: {
            icon: "↔",
            units: {
                m:  { name: "Meter", factor: 1 },
                km: { name: "Kilometer", factor: 1000 },
                cm: { name: "Centimeter", factor: 0.01 },
                mm: { name: "Millimeter", factor: 0.001 },
                mi: { name: "Mile", factor: 1609.344 },
                ft: { name: "Foot", factor: 0.3048 },
                in: { name: "Inch", factor: 0.0254 },
                yd: { name: "Yard", factor: 0.9144 }
            }
        },

        weight: {
            icon: "⚖",
            units: {
                kg: { name: "Kilogram", factor: 1 },
                g:  { name: "Gram", factor: 0.001 },
                mg: { name: "Milligram", factor: 0.000001 },
                lb: { name: "Pound", factor: 0.45359237 },
                oz: { name: "Ounce", factor: 0.028349523125 },
                st: { name: "Stone", factor: 6.35029318 },
                t:  { name: "Metric ton", factor: 1000 }
            }
        },

        temperature: {
            icon: "°",
            units: {
                C: { name: "Celsius", symbol: "°C" },
                F: { name: "Fahrenheit", symbol: "°F" },
                K: { name: "Kelvin", symbol: "K" }
            }
        },

        area: {
            icon: "▧",
            units: {
                "m2":  { name: "Square meter", factor: 1 },
                "km2": { name: "Square kilometer", factor: 1000000 },
                "cm2": { name: "Square centimeter", factor: 0.0001 },
                ha:    { name: "Hectare", factor: 10000 },
                acre:  { name: "Acre", factor: 4046.8564224 },
                ft2:   { name: "Square foot", factor: 0.09290304 },
                yd2:   { name: "Square yard", factor: 0.83612736 }
            }
        },

        volume: {
            icon: "◈",
            units: {
                L:   { name: "Liter", factor: 1 },
                mL:  { name: "Milliliter", factor: 0.001 },
                m3:  { name: "Cubic meter", factor: 1000 },
                gal: { name: "US gallon", factor: 3.785411784 },
                qt:  { name: "US quart", factor: 0.946352946 },
                cup: { name: "US cup", factor: 0.2365882365 },
                floz: { name: "US fluid ounce", factor: 0.0295735295625 }
            }
        },

        speed: {
            icon: "↗",
            units: {
                "m/s":  { name: "Meters per second", factor: 1 },
                "km/h": { name: "Kilometers per hour", factor: 1 / 3.6 },
                mph:    { name: "Miles per hour", factor: 0.44704 },
                knot:   { name: "Knot", factor: 0.514444444444 },
                "ft/s": { name: "Feet per second", factor: 0.3048 }
            }
        },

        time: {
            icon: "◷",
            units: {
                s:   { name: "Second", factor: 1 },
                ms:  { name: "Millisecond", factor: 0.001 },
                min: { name: "Minute", factor: 60 },
                h:   { name: "Hour", factor: 3600 },
                day: { name: "Day", factor: 86400 },
                wk:  { name: "Week", factor: 604800 },
                yr:  { name: "Year (365 days)", factor: 31536000 }
            }
        },

        data: {
            icon: "▤",
            units: {
                B:  { name: "Byte", factor: 1 },
                KB: { name: "Kilobyte", factor: 1000 },
                MB: { name: "Megabyte", factor: 1000000 },
                GB: { name: "Gigabyte", factor: 1000000000 },
                TB: { name: "Terabyte", factor: 1000000000000 },
                KiB: { name: "Kibibyte", factor: 1024 },
                MiB: { name: "Mebibyte", factor: 1048576 },
                GiB: { name: "Gibibyte", factor: 1073741824 }
            }
        }
    };

    const categoryOrder = Object.keys(categories);

    // ----------------------------------------
    // 3. Translations
    // ----------------------------------------

    const translations = {
        en: {
            workspace: "WORKSPACE",
            converter: "Converter",
            history: "History",
            favorites: "Favorites",
            categories: "CATEGORIES",

            length: "Length",
            weight: "Weight",
            temperature: "Temperature",
            area: "Area",
            volume: "Volume",
            speed: "Speed",
            time: "Time",
            data: "Data Storage",

            sidebarTip: "Little conversions. Big convenience.",
            ready: "Ready when you are",

            welcomeEyebrow: "YOUR EVERYDAY CONVERSION TOOL",
            welcomeTitle: "Make every unit|make sense.",
            welcomeDescription:
                "From tiny measurements to big ideas, convert anything with ease.",

            quickTitle: "Quick conversions",
            quickDescription: "Jump into a commonly used conversion.",
            travel: "Travel",
            weather: "Weather",
            fitness: "Fitness",
            technology: "Technology",

            converterTitle: "Unit converter",
            converterSubtitle: "Precision made simple.",
            saveFavorite: "Save favorite",
            removeFavorite: "Saved favorite",

            from: "FROM",
            to: "TO",
            enterValue: "Enter your value",
            convertedInstantly: "Converted instantly",
            formulaLabel: "CONVERSION FORMULA",
            reset: "Reset",
            copyResult: "Copy result",

            recentTitle: "Recent conversions",
            recentDescription: "Your latest calculations, all in one place.",
            viewAll: "View all",
            emptyHistory: "Your conversions will appear here.",

            historyEyebrow: "YOUR ACTIVITY",
            historyTitle: "Conversion history",
            historyDescription:
                "Revisit your recent conversions whenever you need them.",
            allHistory: "All conversions",
            clearHistory: "Clear history",

            favoritesEyebrow: "YOUR SHORTCUTS",
            favoritesTitle: "Favorite conversions",
            favoritesDescription:
                "Keep the conversions you use most within easy reach.",
            emptyFavorites: "Save a conversion to find it here.",

            footerText:
                "Made for everyday moments that need a little clarity.",

            copied: "Result copied to clipboard!",
            copyFailed: "Could not copy. Please try again.",
            favoriteAdded: "Added to favorites!",
            favoriteRemoved: "Removed from favorites.",
            historyCleared: "History cleared.",
            nothingToClear: "There is no history to clear.",
            resetDone: "Converter reset.",
            invalidNumber: "Please enter a valid number.",
            emptyInput: "Enter a value to see the result.",
            sameUnits: "Choose two different units.",
            savedSettings: "Preferences saved.",
            historyRestored: "Conversion loaded.",
            conversionDeleted: "Conversion removed.",
            favoritesLimit: "This conversion is already saved.",
            remove: "Remove",
            use: "Use conversion",
            copy: "Copy",
            noResult: "No result",
            formulaSame: "Same unit",
            resultLabel: "Result",
            converted: "Converted",
            dateLocale: "en-US"
        },

        bn: {
            workspace: "ওয়ার্কস্পেস",
            converter: "কনভার্টার",
            history: "ইতিহাস",
            favorites: "প্রিয়",
            categories: "ক্যাটাগরি",

            length: "দৈর্ঘ্য",
            weight: "ওজন",
            temperature: "তাপমাত্রা",
            area: "ক্ষেত্রফল",
            volume: "আয়তন",
            speed: "গতি",
            time: "সময়",
            data: "ডেটা স্টোরেজ",

            sidebarTip: "ছোট্ট কনভার্সন, বড় সুবিধা।",
            ready: "আপনার জন্য প্রস্তুত",

            welcomeEyebrow: "আপনার প্রতিদিনের কনভার্সন টুল",
            welcomeTitle: "প্রতিটি একক|সহজেই বুঝুন।",
            welcomeDescription:
                "ছোট পরিমাপ থেকে বড় হিসাব—সবকিছু সহজেই কনভার্ট করুন।",

            quickTitle: "দ্রুত কনভার্সন",
            quickDescription: "বহুল ব্যবহৃত কনভার্সন থেকে শুরু করুন।",
            travel: "ভ্রমণ",
            weather: "আবহাওয়া",
            fitness: "ফিটনেস",
            technology: "প্রযুক্তি",

            converterTitle: "ইউনিট কনভার্টার",
            converterSubtitle: "সহজেই নির্ভুল হিসাব।",
            saveFavorite: "প্রিয় হিসেবে রাখুন",
            removeFavorite: "প্রিয় হিসেবে সেভ করা",

            from: "যেখান থেকে",
            to: "যেখানে",
            enterValue: "মান লিখুন",
            convertedInstantly: "সঙ্গে সঙ্গে ফলাফল",
            formulaLabel: "কনভার্সন সূত্র",
            reset: "রিসেট",
            copyResult: "ফলাফল কপি",

            recentTitle: "সাম্প্রতিক কনভার্সন",
            recentDescription: "আপনার সাম্প্রতিক হিসাব এক জায়গায়।",
            viewAll: "সব দেখুন",
            emptyHistory: "আপনার কনভার্সন এখানে দেখা যাবে।",

            historyEyebrow: "আপনার কার্যক্রম",
            historyTitle: "কনভার্সন ইতিহাস",
            historyDescription: "প্রয়োজনে আগের কনভার্সন আবার দেখুন।",
            allHistory: "সব কনভার্সন",
            clearHistory: "ইতিহাস মুছুন",

            favoritesEyebrow: "আপনার শর্টকাট",
            favoritesTitle: "প্রিয় কনভার্সন",
            favoritesDescription: "প্রয়োজনীয় কনভার্সন হাতের কাছেই রাখুন।",
            emptyFavorites: "কোনো কনভার্সন প্রিয় হিসেবে রাখলে এখানে পাবেন।",

            footerText: "প্রতিদিনের হিসাবকে সহজ করার জন্য তৈরি।",

            copied: "ফলাফল কপি হয়েছে!",
            copyFailed: "কপি করা যায়নি। আবার চেষ্টা করুন।",
            favoriteAdded: "প্রিয় তালিকায় যোগ হয়েছে!",
            favoriteRemoved: "প্রিয় তালিকা থেকে সরানো হয়েছে।",
            historyCleared: "ইতিহাস মুছে ফেলা হয়েছে।",
            nothingToClear: "মুছে ফেলার মতো ইতিহাস নেই।",
            resetDone: "কনভার্টার রিসেট হয়েছে।",
            invalidNumber: "সঠিক একটি সংখ্যা লিখুন।",
            emptyInput: "ফলাফল দেখতে একটি মান লিখুন।",
            sameUnits: "দুটি আলাদা ইউনিট নির্বাচন করুন।",
            savedSettings: "পছন্দগুলো সেভ হয়েছে।",
            historyRestored: "আগের কনভার্সন লোড হয়েছে।",
            conversionDeleted: "কনভার্সন সরানো হয়েছে।",
            favoritesLimit: "এই কনভার্সনটি আগে থেকেই সেভ করা আছে।",
            remove: "সরান",
            use: "ব্যবহার করুন",
            copy: "কপি",
            noResult: "ফলাফল নেই",
            formulaSame: "একই ইউনিট",
            resultLabel: "ফলাফল",
            converted: "কনভার্ট করা হয়েছে",
            dateLocale: "bn-BD"
        },

        bt: {
            workspace: "WORKSPACE",
            converter: "Converter",
            history: "History",
            favorites: "Favorites",
            categories: "CATEGORIES",

            length: "Length",
            weight: "Weight",
            temperature: "Temperature",
            area: "Area",
            volume: "Volume",
            speed: "Speed",
            time: "Time",
            data: "Data Storage",

            sidebarTip: "Choto conversion, boro convenience.",
            ready: "Apnar jonno ready",

            welcomeEyebrow: "YOUR EVERYDAY CONVERSION TOOL",
            welcomeTitle: "Protiti unit|shohoje bujhun.",
            welcomeDescription:
                "Choto measurement theke boro calculation, sob kichu easily convert korun.",

            quickTitle: "Quick conversions",
            quickDescription: "Common conversion theke shuru korun.",
            travel: "Travel",
            weather: "Weather",
            fitness: "Fitness",
            technology: "Technology",

            converterTitle: "Unit converter",
            converterSubtitle: "Easy ebong accurate calculation.",
            saveFavorite: "Favorite save",
            removeFavorite: "Favorite saved",

            from: "FROM",
            to: "TO",
            enterValue: "Value likhun",
            convertedInstantly: "Sathe sathe result",
            formulaLabel: "CONVERSION FORMULA",
            reset: "Reset",
            copyResult: "Result copy",

            recentTitle: "Recent conversions",
            recentDescription: "Apnar recent calculation ek jaygay.",
            viewAll: "Sob dekhun",
            emptyHistory: "Apnar conversion ekhane dekhabe.",

            historyEyebrow: "YOUR ACTIVITY",
            historyTitle: "Conversion history",
            historyDescription: "Proyojone ager conversion abar dekhun.",
            allHistory: "Sob conversion",
            clearHistory: "History clear",

            favoritesEyebrow: "YOUR SHORTCUTS",
            favoritesTitle: "Favorite conversions",
            favoritesDescription: "Proyojonio conversion kache rakhun.",
            emptyFavorites: "Conversion favorite korle ekhane paben.",

            footerText: "Daily calculation easy korar jonno toiri.",

            copied: "Result clipboard-e copy hoyeche!",
            copyFailed: "Copy kora jayni. Abar try korun.",
            favoriteAdded: "Favorite list-e add hoyeche!",
            favoriteRemoved: "Favorite list theke remove hoyeche.",
            historyCleared: "History clear hoyeche.",
            nothingToClear: "Clear korar moto history nei.",
            resetDone: "Converter reset hoyeche.",
            invalidNumber: "Please valid number likhun.",
            emptyInput: "Result dekhte ekta value likhun.",
            sameUnits: "Duita different unit select korun.",
            savedSettings: "Preferences save hoyeche.",
            historyRestored: "Ager conversion load hoyeche.",
            conversionDeleted: "Conversion remove hoyeche.",
            favoritesLimit: "Ei conversion agei save kora ache.",
            remove: "Remove",
            use: "Use korun",
            copy: "Copy",
            noResult: "No result",
            formulaSame: "Same unit",
            resultLabel: "Result",
            converted: "Converted",
            dateLocale: "en-GB"
        }
    };

    // ----------------------------------------
    // 4. Safe localStorage helpers
    // ----------------------------------------

    function loadStorage(key, fallback) {
        try {
            const saved = localStorage.getItem(key);
            return saved === null ? fallback : JSON.parse(saved);
        } catch (error) {
            return fallback;
        }
    }

    function saveStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            showToast(
                "Storage is unavailable in this browser.",
                "!"
            );
            return false;
        }
    }

    let currentLanguage = loadStorage("convertease_language", "en");
    let currentTheme = loadStorage("convertease_theme", "light");

    let history = loadStorage("convertease_history", []);
    let favorites = loadStorage("convertease_favorites", []);

    let currentCategory = "length";
    let toastTimer = null;

    if (!translations[currentLanguage]) {
        currentLanguage = "en";
    }

    if (!Array.isArray(history)) {
        history = [];
    }

    if (!Array.isArray(favorites)) {
        favorites = [];
    }

    if (!["light", "dark"].includes(currentTheme)) {
        currentTheme = "light";
    }

    history = history.filter((item) =>
        item &&
        typeof item.id === "string" &&
        categories[item.category] &&
        categories[item.category].units[item.from] &&
        categories[item.category].units[item.to]
    ).slice(0, 100);

    favorites = favorites.filter((item) =>
        item &&
        typeof item.id === "string" &&
        categories[item.category] &&
        categories[item.category].units[item.from] &&
        categories[item.category].units[item.to]
    );

    // ----------------------------------------
    // 5. Translation helpers
    // ----------------------------------------

    function t(key) {
        return translations[currentLanguage][key]
            ?? translations.en[key]
            ?? key;
    }

    function unitLabel(unitCode, category = currentCategory) {
        const unit = categories[category]?.units[unitCode];

        if (!unit) {
            return unitCode;
        }

        const symbols = {
            m: "m",
            km: "km",
            cm: "cm",
            mm: "mm",
            mi: "mi",
            ft: "ft",
            in: "in",
            yd: "yd",
            kg: "kg",
            g: "g",
            mg: "mg",
            lb: "lb",
            oz: "oz",
            st: "st",
            t: "t",
            C: "°C",
            F: "°F",
            K: "K",
            "m2": "m²",
            "km2": "km²",
            "cm2": "cm²",
            ha: "ha",
            acre: "acre",
            ft2: "ft²",
            yd2: "yd²",
            L: "L",
            mL: "mL",
            m3: "m³",
            gal: "gal",
            qt: "qt",
            cup: "cup",
            floz: "fl oz",
            "m/s": "m/s",
            "km/h": "km/h",
            mph: "mph",
            knot: "kn",
            "ft/s": "ft/s",
            s: "s",
            ms: "ms",
            min: "min",
            h: "h",
            day: "day",
            wk: "wk",
            yr: "yr",
            B: "B",
            KB: "KB",
            MB: "MB",
            GB: "GB",
            TB: "TB",
            KiB: "KiB",
            MiB: "MiB",
            GiB: "GiB"
        };

        return symbols[unitCode] || unit.name;
    }

    function categoryLabel(category) {
        return t(category);
    }

    function formatNumber(value, maximumFractionDigits = 10) {
        if (!Number.isFinite(value)) {
            return "—";
        }

        if (Object.is(value, -0) || value === 0) {
            return "0";
        }

        const abs = Math.abs(value);

        if (abs >= 1e15 || abs < 1e-8) {
            return value.toExponential(6);
        }

        return new Intl.NumberFormat(
            translations[currentLanguage].dateLocale,
            {
                maximumFractionDigits,
                useGrouping: true
            }
        ).format(value);
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, (character) => {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entities[character];
        });
    }

    function generateId() {
        if (window.crypto?.randomUUID) {
            return window.crypto.randomUUID();
        }

        return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    // ----------------------------------------
    // 6. Toast messages
    // ----------------------------------------

    function showToast(message, icon = "✓") {
        clearTimeout(toastTimer);

        toastMessage.textContent = message;
        toastIcon.textContent = icon;
        toast.classList.add("show");

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2600);
    }

    // ----------------------------------------
    // 7. Theme
    // ----------------------------------------

    function applyTheme() {
        document.documentElement.dataset.theme = currentTheme;

        themeIcon.textContent = currentTheme === "dark" ? "☀" : "☾";

        themeToggle.setAttribute(
            "aria-label",
            currentTheme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
        );

        themeToggle.title = themeToggle.getAttribute("aria-label");

        saveStorage("convertease_theme", currentTheme);
    }

    themeToggle.addEventListener("click", () => {
        currentTheme = currentTheme === "light" ? "dark" : "light";
        applyTheme();
    });

    // ----------------------------------------
    // 8. Language
    // ----------------------------------------

    function applyLanguage() {
        document.documentElement.lang =
            currentLanguage === "bn" ? "bn" : "en";

        languageSelect.value = currentLanguage;

        $$("[data-i18n]").forEach((element) => {
            const key = element.dataset.i18n;
            const translated = t(key);

            if (key === "welcomeTitle") {
                const parts = translated.split("|");

                element.replaceChildren();

                element.append(
                    document.createTextNode(parts[0])
                );

                element.appendChild(document.createElement("br"));

                const span = document.createElement("span");
                span.textContent = parts[1] || "";
                element.appendChild(span);
            } else {
                element.textContent = translated;
            }
        });

        renderUnitOptions();
        updateConversion(false);
        renderHistory();
        renderFavorites();
        updateFavoriteButton();
        updateCounts();
        updateNavigationTitle();

        saveStorage("convertease_language", currentLanguage);
    }

    languageSelect.addEventListener("change", () => {
        currentLanguage = languageSelect.value;

        applyLanguage();
        showToast(t("savedSettings"));
    });

    // ----------------------------------------
    // 9. Unit dropdowns
    // ----------------------------------------

    function renderUnitOptions() {
        const units = categories[currentCategory].units;

        const previousFrom = fromUnit.value;
        const previousTo = toUnit.value;

        const options = Object.entries(units)
            .map(([code, unit]) => {
                const label =
                    `${unit.name} (${unitLabel(code, currentCategory)})`;

                return `<option value="${escapeHTML(code)}">${escapeHTML(label)}</option>`;
            })
            .join("");

        fromUnit.innerHTML = options;
        toUnit.innerHTML = options;

        fromUnit.value = units[previousFrom]
            ? previousFrom
            : Object.keys(units)[0];

        toUnit.value = units[previousTo] && previousTo !== fromUnit.value
            ? previousTo
            : Object.keys(units).find((code) => code !== fromUnit.value)
                || fromUnit.value;
    }

    // ----------------------------------------
    // 10. Conversion engine
    // ----------------------------------------

    function convertTemperature(value, from, to) {
        let celsius;

        if (from === "C") {
            celsius = value;
        } else if (from === "F") {
            celsius = (value - 32) * 5 / 9;
        } else {
            celsius = value - 273.15;
        }

        if (to === "C") {
            return celsius;
        }

        if (to === "F") {
            return celsius * 9 / 5 + 32;
        }

        return celsius + 273.15;
    }

    function convertValue(value, from, to, category = currentCategory) {
        const units = categories[category]?.units;

        if (!units || !units[from] || !units[to]) {
            return NaN;
        }

        if (category === "temperature") {
            return convertTemperature(value, from, to);
        }

        const fromFactor = units[from].factor;
        const toFactor = units[to].factor;

        return value * fromFactor / toFactor;
    }

    function getConversion() {
        const rawValue = inputValue.value.trim();
        const value = Number(rawValue);

        if (rawValue === "" || !Number.isFinite(value)) {
            return {
                valid: false,
                empty: true,
                value: NaN
            };
        }

        const result = convertValue(
            value,
            fromUnit.value,
            toUnit.value
        );

        return {
            valid: Number.isFinite(result),
            empty: false,
            value,
            result,
            from: fromUnit.value,
            to: toUnit.value,
            category: currentCategory
        };
    }

    function getFormula(conversion) {
        const { value, result, from, to, category } = conversion;

        if (from === to) {
            return `${formatNumber(value)} ${unitLabel(from, category)} = ${formatNumber(result)} ${unitLabel(to, category)}`;
        }

        if (category === "temperature") {
            if (from === "C" && to === "F") {
                return "°F = (°C × 9/5) + 32";
            }

            if (from === "F" && to === "C") {
                return "°C = (°F − 32) × 5/9";
            }

            if (from === "C" && to === "K") {
                return "K = °C + 273.15";
            }

            if (from === "K" && to === "C") {
                return "°C = K − 273.15";
            }

            if (from === "F" && to === "K") {
                return "K = (°F − 32) × 5/9 + 273.15";
            }

            return "°F = (K − 273.15) × 9/5 + 32";
        }

        const units = categories[category].units;
        const factor = units[from].factor / units[to].factor;

        return `1 ${unitLabel(from, category)} = ${formatNumber(factor)} ${unitLabel(to, category)}`;
    }

    function updateConversion(addToHistory = false) {
        const conversion = getConversion();

        if (!conversion.valid) {
            resultValue.textContent = "—";
            formulaText.textContent = conversion.empty
                ? t("emptyInput")
                : t("invalidNumber");

            updateFavoriteButton();
            return;
        }

        resultValue.textContent = formatNumber(conversion.result);
        formulaText.textContent = getFormula(conversion);

        updateFavoriteButton();

        if (addToHistory) {
            addHistory(conversion);
        }
    }

    inputValue.addEventListener("input", () => {
        updateConversion(false);
    });

    inputValue.addEventListener("change", () => {
        updateConversion(true);
    });

    fromUnit.addEventListener("change", () => {
        updateConversion(true);
    });

    toUnit.addEventListener("change", () => {
        updateConversion(true);
    });

    // ----------------------------------------
    // 11. Category navigation
    // ----------------------------------------

    function selectCategory(category, defaults = {}) {
        if (!categories[category]) {
            return;
        }

        currentCategory = category;

        $$(".category-item").forEach((button) => {
            const active = button.dataset.category === category;

            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        renderUnitOptions();

        if (defaults.from && categories[category].units[defaults.from]) {
            fromUnit.value = defaults.from;
        }

        if (defaults.to && categories[category].units[defaults.to]) {
            toUnit.value = defaults.to;
        }

        updateConversion(true);
        updateFavoriteButton();
        closeSidebar();
    }

    $$(".category-item").forEach((button) => {
        button.addEventListener("click", () => {
            selectCategory(button.dataset.category);
        });
    });

    // ----------------------------------------
    // 12. Quick conversion presets
    // ----------------------------------------

    const quickPresets = {
        "km-mi": {
            category: "length",
            from: "km",
            to: "mi",
            value: "1"
        },

        "c-f": {
            category: "temperature",
            from: "C",
            to: "F",
            value: "25"
        },

        "kg-lb": {
            category: "weight",
            from: "kg",
            to: "lb",
            value: "1"
        },

        "gb-mb": {
            category: "data",
            from: "GB",
            to: "MB",
            value: "1"
        }
    };

    function usePreset(preset) {
        selectCategory(preset.category, {
            from: preset.from,
            to: preset.to
        });

        inputValue.value = preset.value;
        updateConversion(true);
    }

    $$("[data-quick]").forEach((button) => {
        button.addEventListener("click", () => {
            const preset = quickPresets[button.dataset.quick];

            if (preset) {
                usePreset(preset);
            }
        });
    });

    // ----------------------------------------
    // 13. Swap units
    // ----------------------------------------

    $("#swapUnits").addEventListener("click", () => {
        const oldFrom = fromUnit.value;
        const oldTo = toUnit.value;

        fromUnit.value = oldTo;
        toUnit.value = oldFrom;

        updateConversion(true);

        showToast("⇄ " + unitLabel(oldTo) + " ↔ " + unitLabel(oldFrom));
    });

    // ----------------------------------------
    // 14. Reset converter
    // ----------------------------------------

    $("#resetConverter").addEventListener("click", () => {
        currentCategory = "length";

        $$(".category-item").forEach((button) => {
            button.classList.toggle(
                "active",
                button.dataset.category === "length"
            );
        });

        renderUnitOptions();

        fromUnit.value = "m";
        toUnit.value = "km";
        inputValue.value = "1";

        updateConversion(false);
        showToast(t("resetDone"));
    });

    // ----------------------------------------
    // 15. Copy result
    // ----------------------------------------

    async function copyText(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const textarea = document.createElement("textarea");

                textarea.value = text;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";

                document.body.appendChild(textarea);
                textarea.select();

                const copied = document.execCommand("copy");
                textarea.remove();

                if (!copied) {
                    throw new Error("Copy failed");
                }
            }

            showToast(t("copied"));
        } catch (error) {
            showToast(t("copyFailed"), "!");
        }
    }

    function currentResultText() {
        const conversion = getConversion();

        if (!conversion.valid) {
            showToast(t("invalidNumber"), "!");
            return null;
        }

        return `${formatNumber(conversion.value)} ${unitLabel(conversion.from)} = ${formatNumber(conversion.result)} ${unitLabel(conversion.to)}`;
    }

    $("#copyResult").addEventListener("click", () => {
        const text = currentResultText();

        if (text) {
            copyText(text);
        }
    });

    // ----------------------------------------
    // 16. Conversion history
    // ----------------------------------------

    function addHistory(conversion) {
        if (!conversion.valid) {
            return;
        }

        const item = {
            id: generateId(),
            category: conversion.category,
            from: conversion.from,
            to: conversion.to,
            input: conversion.value,
            result: conversion.result,
            createdAt: Date.now()
        };

        const previous = history[0];

        if (
            previous &&
            previous.category === item.category &&
            previous.from === item.from &&
            previous.to === item.to &&
            previous.input === item.input &&
            previous.result === item.result
        ) {
            return;
        }

        history.unshift(item);
        history = history.slice(0, 100);

        saveStorage("convertease_history", history);

        renderHistory();
        updateCounts();
    }

    function formatTime(timestamp) {
        try {
            return new Intl.DateTimeFormat(
                translations[currentLanguage].dateLocale,
                {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            ).format(new Date(timestamp));
        } catch (error) {
            return "";
        }
    }

    function historyRowHTML(item) {
        const category = categories[item.category];
        const description =
            `${formatNumber(item.input)} ${unitLabel(item.from, item.category)} → ${unitLabel(item.to, item.category)}`;

        return `
            <article class="history-row">
                <div class="history-main">
                    <span class="history-symbol" aria-hidden="true">
                        ${escapeHTML(category.icon)}
                    </span>

                    <div class="history-description">
                        <strong>${escapeHTML(description)}</strong>
                        <small>
                            ${escapeHTML(categoryLabel(item.category))}
                            · ${escapeHTML(formatTime(item.createdAt))}
                        </small>
                    </div>
                </div>

                <div class="history-result">
                    ${escapeHTML(formatNumber(item.result))}
                    ${escapeHTML(unitLabel(item.to, item.category))}
                </div>

                <div class="history-actions">
                    <button
                        class="small-icon-button"
                        type="button"
                        data-action="restore"
                        data-id="${escapeHTML(item.id)}"
                        aria-label="${escapeHTML(t("use"))}"
                        title="${escapeHTML(t("use"))}">↗</button>

                    <button
                        class="small-icon-button"
                        type="button"
                        data-action="copy-history"
                        data-id="${escapeHTML(item.id)}"
                        aria-label="${escapeHTML(t("copy"))}"
                        title="${escapeHTML(t("copy"))}">▢</button>

                    <button
                        class="small-icon-button"
                        type="button"
                        data-action="delete-history"
                        data-id="${escapeHTML(item.id)}"
                        aria-label="${escapeHTML(t("remove"))}"
                        title="${escapeHTML(t("remove"))}">×</button>
                </div>
            </article>
        `;
    }

    function emptyStateHTML(icon, message) {
        return `
            <div class="empty-state">
                <span class="empty-icon" aria-hidden="true">${icon}</span>
                <p>${escapeHTML(message)}</p>
            </div>
        `;
    }

    function renderHistory() {
        recentHistory.innerHTML = history.length
            ? history.slice(0, 4).map(historyRowHTML).join("")
            : emptyStateHTML("◷", t("emptyHistory"));

        fullHistory.innerHTML = history.length
            ? history.map(historyRowHTML).join("")
            : emptyStateHTML("◷", t("emptyHistory"));
    }

    function findHistory(id) {
        return history.find((item) => item.id === id);
    }

    function restoreHistory(id) {
        const item = findHistory(id);

        if (!item) {
            return;
        }

        currentCategory = item.category;

        $$(".category-item").forEach((button) => {
            button.classList.toggle(
                "active",
                button.dataset.category === currentCategory
            );
        });

        renderUnitOptions();

        fromUnit.value = item.from;
        toUnit.value = item.to;
        inputValue.value = String(item.input);

        updateConversion(false);
        showToast(t("historyRestored"));

        showView("converter");
    }

    function removeHistory(id) {
        history = history.filter((item) => item.id !== id);

        saveStorage("convertease_history", history);
        renderHistory();
        updateCounts();

        showToast(t("conversionDeleted"));
    }

    function handleHistoryAction(event) {
        const button = event.target.closest("button[data-action]");

        if (!button) {
            return;
        }

        const { action, id } = button.dataset;
        const item = findHistory(id);

        if (!item) {
            return;
        }

        if (action === "restore") {
            restoreHistory(id);
        } else if (action === "delete-history") {
            removeHistory(id);
        } else if (action === "copy-history") {
            const text =
                `${formatNumber(item.input)} ${unitLabel(item.from, item.category)} = ${formatNumber(item.result)} ${unitLabel(item.to, item.category)}`;

            copyText(text);
        }
    }

    recentHistory.addEventListener("click", handleHistoryAction);
    fullHistory.addEventListener("click", handleHistoryAction);

    $("#clearHistory").addEventListener("click", () => {
        if (history.length === 0) {
            showToast(t("nothingToClear"), "!");
            return;
        }

        history = [];

        saveStorage("convertease_history", history);
        renderHistory();
        updateCounts();

        showToast(t("historyCleared"));
    });

    // ----------------------------------------
    // 17. Favorites
    // ----------------------------------------

    function favoriteKey(category, from, to) {
        return `${category}:${from}:${to}`;
    }

    function isFavorite(category, from, to) {
        return favorites.some((item) =>
            item.category === category &&
            item.from === from &&
            item.to === to
        );
    }

    function updateFavoriteButton() {
        const saved = isFavorite(
            currentCategory,
            fromUnit.value,
            toUnit.value
        );

        favoriteToggle.setAttribute("aria-pressed", String(saved));
        favoriteIcon.textContent = saved ? "★" : "☆";

        const label = favoriteToggle.querySelector("[data-i18n]");

        if (label) {
            label.textContent = saved
                ? t("removeFavorite")
                : t("saveFavorite");
        }
    }

    favoriteToggle.addEventListener("click", () => {
        const category = currentCategory;
        const from = fromUnit.value;
        const to = toUnit.value;

        if (isFavorite(category, from, to)) {
            favorites = favorites.filter((item) =>
                !(item.category === category &&
                  item.from === from &&
                  item.to === to)
            );

            showToast(t("favoriteRemoved"));
        } else {
            favorites.push({
                id: generateId(),
                category,
                from,
                to
            });

            showToast(t("favoriteAdded"));
        }

        saveStorage("convertease_favorites", favorites);

        renderFavorites();
        updateFavoriteButton();
        updateCounts();
    });

    function favoriteCardHTML(item) {
        const category = categories[item.category];

        return `
            <article class="favorite-card">
                <span class="history-symbol" aria-hidden="true">
                    ${escapeHTML(category.icon)}
                </span>

                <div class="favorite-card-info">
                    <strong>
                        ${escapeHTML(unitLabel(item.from, item.category))}
                        → ${escapeHTML(unitLabel(item.to, item.category))}
                    </strong>

                    <p>${escapeHTML(categoryLabel(item.category))}</p>
                </div>

                <div class="favorite-card-actions">
                    <button
                        class="small-icon-button"
                        type="button"
                        data-favorite-action="use"
                        data-id="${escapeHTML(item.id)}"
                        aria-label="${escapeHTML(t("use"))}"
                        title="${escapeHTML(t("use"))}">↗</button>

                    <button
                        class="small-icon-button"
                        type="button"
                        data-favorite-action="remove"
                        data-id="${escapeHTML(item.id)}"
                        aria-label="${escapeHTML(t("remove"))}"
                        title="${escapeHTML(t("remove"))}">×</button>
                </div>
            </article>
        `;
    }

    function renderFavorites() {
        favoritesList.innerHTML = favorites.length
            ? favorites.map(favoriteCardHTML).join("")
            : emptyStateHTML("☆", t("emptyFavorites"));
    }

    favoritesList.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-favorite-action]");

        if (!button) {
            return;
        }

        const item = favorites.find(
            (favorite) => favorite.id === button.dataset.id
        );

        if (!item) {
            return;
        }

        if (button.dataset.favoriteAction === "use") {
            selectCategory(item.category, {
                from: item.from,
                to: item.to
            });

            showView("converter");
        } else {
            favorites = favorites.filter(
                (favorite) => favorite.id !== item.id
            );

            saveStorage("convertease_favorites", favorites);
            renderFavorites();
            updateFavoriteButton();
            updateCounts();

            showToast(t("favoriteRemoved"));
        }
    });

    // ----------------------------------------
    // 18. Navigation between app views
    // ----------------------------------------

    function updateCounts() {
        historyCount.textContent = history.length;
        favoriteCount.textContent = favorites.length;
    }

    function updateNavigationTitle() {
        const activeButton = $(".nav-item.active");

        if (activeButton) {
            const label = activeButton.querySelector("[data-i18n]");
            breadcrumbTitle.textContent = label
                ? t(label.dataset.i18n)
                : t("converter");
        }
    }

    function showView(viewName) {
        const views = {
            converter: converterView,
            history: historyView,
            favorites: favoritesView
        };

        if (!views[viewName]) {
            return;
        }

        Object.entries(views).forEach(([name, element]) => {
            element.hidden = name !== viewName;
        });

        $$(".nav-item").forEach((button) => {
            const active = button.dataset.view === viewName;

            button.classList.toggle("active", active);
            button.setAttribute("aria-current", active ? "page" : "false");
        });

        updateNavigationTitle();
        closeSidebar();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    $$(".nav-item").forEach((button) => {
        button.addEventListener("click", () => {
            showView(button.dataset.view);
        });
    });

    $("#viewAllHistory").addEventListener("click", () => {
        showView("history");
    });

    // ----------------------------------------
    // 19. Mobile sidebar
    // ----------------------------------------

    const backdrop = document.createElement("div");

    backdrop.className = "sidebar-backdrop";
    backdrop.setAttribute("aria-hidden", "true");

    document.body.appendChild(backdrop);

    function openSidebar() {
        sidebar.classList.add("open");
        backdrop.classList.add("visible");
        menuToggle.setAttribute("aria-expanded", "true");
    }

    function closeSidebar() {
        sidebar.classList.remove("open");
        backdrop.classList.remove("visible");
        menuToggle.setAttribute("aria-expanded", "false");
    }

    menuToggle.addEventListener("click", () => {
        if (sidebar.classList.contains("open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    backdrop.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });

    // ----------------------------------------
    // 20. Initial application setup
    // ----------------------------------------

    applyTheme();

    renderUnitOptions();

    fromUnit.value = "m";
    toUnit.value = "km";
    inputValue.value = "1";

    applyLanguage();
    updateConversion(false);

    renderHistory();
    renderFavorites();
    updateCounts();
    updateFavoriteButton();

    showView("converter");

    // All initial setup is complete.
});
