import "vuetify/styles"
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import vuetify from './plugins/vuetify'
import { x3DDashboardUtils } from './lib/widget'
import store from './store';
import App from './components/app';

function init(){
    // Internalization
    const localeEN = require('./locale/en.json');
    const localeFR = require('./locale/fr.json');

    const i18n = createI18n({
        locale: navigator.language,
        fallbackLocale: 'en',
        messages: {
            en: localeEN,
            'en-US': localeEN,
            fr: localeFR
        }
    });

    x3DDashboardUtils.disableCSS(true);

    window.appStore = store;
    store.dispatch("init").then(() => {
        const app = createApp(App)
        .use(i18n)
        .use(store)
        .use(vuetify)
        .mount('app');}
    );

    requirejs(["DS/PlatformAPI/PlatformAPI"], PlatformAPI => {
        window.PlatformAPI = PlatformAPI;
    });
}

function loadWindowFunction() {
    const appPreference = widget.getPreference("appData");
    console.log("==appPreference ===");
    if (typeof appPreference === "undefined") {
        widget.addPreference({
            name: "appData",
            type: "hidden",
            label: "appData",
            defaultValue: "{}"
        });
    }

    window.getAppPreferenceData = function() {
        let strData = widget.getValue("appData");
        if (!strData) strData = "{}";
        return JSON.parse(strData);
    };

    window.updateAppPreferenceData = function(newData) {
        widget.setValue("appData", JSON.stringify(newData));
    };
}

export default function() {
    widget.addEvent("onLoad", () => {
        loadWindowFunction();
        init();
    });

    widget.addEvent("onRefresh", () => {
        window.appStore.dispatch("init");
    });
}
