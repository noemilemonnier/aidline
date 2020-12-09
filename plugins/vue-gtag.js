import Vue from 'vue';
import VueGtag from 'vue-gtag';

export default ({ app }) => {
    const getGDPR = localStorage.getItem('GDPR:accepted');
    Vue.use(VueGtag, {
        config: { id: 'G-KM3JGX0YFD' },
        bootstrap: getGDPR === 'true',
        appName: 'aidline',
        enabled: getGDPR === 'true',
        pageTrackerScreenviewEnabled: false
    }, app.router);
}