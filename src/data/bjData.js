import '@/data/jd'
import '@/data/sq'
import '@/data/wg'

window.sqbjData = window.sq || { type: "FeatureCollection", features: [] };
window.wgbjData = window.wg || { type: "FeatureCollection", features: [] };
window.jbjData = window.jd || { type: "FeatureCollection", features: [] };
window.qbjData = window.jd || { type: "FeatureCollection", features: [] };

export const sqbjData = window.sqbjData;
export const wgbjData = window.wgbjData;
export const jbjData = window.jbjData;
export const qbjData = window.qbjData;
