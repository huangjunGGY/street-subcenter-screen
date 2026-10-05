
<template>
    <div style="position:relative;-webkit-user-select:none;">
        <div class="iconBox">
            <div class="icon">
                <div class="cloud" v-if="weather === 'cloud'"></div>
                <div class="cloud" v-if="weather === 'thunder'">
                    <div class="thunder">
                        <div class="bolt"></div>
                        <div class="bolt"></div>
                    </div>
                </div>
                <div class="cloud" v-if="weather === 'rain'">
                    <div class="rain"></div>
                </div>
                <div class="sun" v-if="weather === 'sun' || weather === 'cloud&sun'">
                    <div class="rays"></div>
                </div>
                <div class="cloud" v-if="weather === 'snow'">
                <div class="snow">
                    <div class="flake"></div>
                    <div class="flake"></div>
                </div>
                </div>
            </div>
        </div>
        <!-- <div class="weather-bg rotate"
            :style="{ 'background-image': 'linear-gradient(to top,' + weatherSet[weather].bg.begin + ',' + weatherSet[weather].bg.end + ')' }">
        </div>
        <svg t="1594257719362" viewBox="0 0 300 120" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2212"
            data-spm-anchor-id="a313x.7781069.0.i1" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%"
            style="position:relative;">

            <filter id="filter-back">
                <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="4" seed="2"></feTurbulence>
                <feDisplacementMap in="SourceGraphic" scale="170"></feDisplacementMap>
            </filter>
            <filter id="filter-mid">
                <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="2"></feTurbulence>
                <feDisplacementMap in="SourceGraphic" scale="150"></feDisplacementMap>
            </filter>
            <filter id="filter-front">
                <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="2"></feTurbulence>
                <feDisplacementMap in="SourceGraphic" scale="100"></feDisplacementMap>
            </filter>

            <filter id="glow" x="-100%" y="-100%" width="400%" height="400%">
                <feOffset result="offOut" in="SourceGraphic" dx="0" dy="0"></feOffset>
                <feGaussianBlur result="blurOut" in="offOut" stdDeviation="25"></feGaussianBlur>
                <feBlend in="SourceGraphic" in2="blurOut" mode="multiply"></feBlend>
            </filter>
            <filter id="thunder-glow" x="-100%" y="-100%" width="400%" height="400%">
                <feGaussianBlur result="blurOut" in="offOut" stdDeviation="50"></feGaussianBlur>
            </filter>

            <transition name="slide-fade">
                <g v-if="isWeather(['sun', 'cloud&sun'])">
                    <g>
                        <circle fill="#f36fff" filter="url(#glow)" cx="240" cy="60" r="30"></circle>
                        <circle v-for="i in 6" fill="#fefef3" filter="url(#glow)" cx="240" cy="60" r="30"></circle>
                        <circle fill="#FFF" cx="240" cy="60" r="30"></circle>
                    </g>

                    <g>
                        <circle fill="rgba(255,255,255,0.2)" style="stroke:rgba(242,232,255,0.5);" cx="120" cy="20" r="22">
                        </circle>
                        <circle fill="rgba(255,255,255,0.2)" cx="138" cy="30" r="14"></circle>
                        <circle fill="rgba(255,255,255,0.2)" cx="180" cy="40" r="8"></circle>
                        <circle fill="rgba(255,255,255,0.2)" cx="190" cy="40" r="4"></circle>
                        <animateTransform attributeName="transform" begin="0s" dur="20s" type="rotate" rotate="auto"
                            values="0 240 60;-20 240 60;0 240 60" calcMode="linear" repeatCount="indefinite">
                        </animateTransform>
                    </g>
                </g>
            </transition>
        </svg>

        <svg v-if="['thunder'].indexOf(weather) > -1" preserveAspectRatio="xMinYMin" viewBox="0 0 300 120"
            style="position:absolute;left:0%;top:0;width:100%;height:100%;">
            <ellipse fill="#f1e7ff" style="opacity:0;animation:thunder-glow 5s linear 1s infinite"
                filter="url(#thunder-glow)" cx="150" cy="60" rx="300" ry="120"></ellipse>
            <ellipse fill="#f1e7ff" style="opacity:0;animation:thunder-glow 5s linear 4s infinite"
                filter="url(#thunder-glow)" cx="150" cy="60" rx="300" ry="120"></ellipse>

            <g style="transform:translateX(150px);">
                <polyline style="fill:none;stroke-width:1.2;animation: depict 5s linear 1s infinite;"
                    points="56.6 0.26 42.92 23 51.37 23 42.92 41.51 54.19 47.36 42.92 69.13 52.18 74.32 42.92 112.66">
                </polyline>
                <polyline style="fill:none;stroke-width:1;animation: depict-sub 5s linear 1s infinite;"
                    points="51.07 78.9 39.74 84.52 40.76 88.78 24.09 91.74 25.51 94.36 0.1 99.29"></polyline>
                <polyline style="fill:none;stroke-width:1;animation: depict-sub 5s linear 1s infinite;"
                    points="48.82 89.93 54.05 98.96 59.87 97.98 64.83 107.66 72.76 106.02 84.35 120.63"></polyline>
            </g>

            <polyline style="fill:none;transform:translateX(80px);stroke-width:1.2;animation: depict 5s linear 4s infinite;"
                points="56.6 0.26 42.92 23 51.37 23 42.92 41.51 54.19 47.36 42.92 69.13 52.18 74.32 42.92 112.66">
            </polyline>
        </svg>
        <div v-if="isWeather(['cloud', 'cloud&sun'])">
            <div style="position:absolute;" class="cloud-main cloud-last">
                <div class="cloud" id="cloud-back"></div>
                <div class="cloud" id="cloud-mid"></div>
                <div class="cloud" id="cloud-front"></div>
            </div>

            <div style="position:absolute;" class="cloud-main">
                <div class="cloud" id="cloud-back"></div>
                <div class="cloud" id="cloud-mid"></div>
                <div class="cloud" id="cloud-front"></div>
            </div>
        </div>

        <div class="rain" style="width:100%;height:100%;pointer-events:none;"
            v-if="['rain', 'thunder'].indexOf(weather) > -1">
            <svg v-for="i in 120" class="rain__" preserveAspectRatio="xMinYMin" viewBox="0 0 10 100"
                :style="'--x: ' + (Math.random() * 100) + '; --y: ' + (Math.random() * 100) + '; --o: ' + (Math.random() * 2) + '; --a: ' + (Math.random() * 2) + '; --d: ' + (Math.random() * 2) + '; --s: ' + (Math.random() * 2) + ';'">
                <path stroke="none"
                    d="M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z">
                </path>
            </svg>
        </div> -->
    </div>

    <!-- <div class="weather-btns">
        <button @click="weather = 'sun'">晴天</button>
        <button @click="weather = 'cloud'">阴天</button>
        <button @click="weather = 'cloud&sun'">多云</button>
        <button @click="weather = 'rain'">下雨</button>
        <button @click="weather = 'thunder'">雷雨</button>
    </div> -->
</template>

<script setup>
import { useStore } from 'hooks/weather'
// import "./index.css"


const weather = ref('');

const weatherSet = ref({
    'sun': {
        bg: {
            begin: '#f2ffff',
            end: '#aedeff'
        },
        name: '晴',
        color: '#4f5862'
    },
    'cloud': {
        bg: {
            begin: '#f2ffff',
            end: '#b1c7d7'
        },
        name: '阴',
        color: '#4f5862'
    },
    'rain': {
        bg: {
            begin: '#c9d3db',
            end: '#566874'
        },
        name: '雨天',
        color: '#FFF'
    },
    'thunder': {
        bg: {
            begin: '#c9d3db',
            end: '#566874'
        },
        name: '雷电',
        color: '#FFF'
    },
    'cloud&sun': {
        bg: {
            begin: '#f2ffff',
            end: '#aedeff'
        },
        name: '多云',
        color: '#4f5862'
    },
});


const isWeather = ref((arr) => {
    return arr.indexOf(weather.value) > -1
})

const store = useStore();
// 往useStore中传函数
store.setChange((w) => {
    // 字符串模糊匹配
    if (w.indexOf('晴') > -1) {
        weather.value = 'sun'
    } else if (w.indexOf('云') > -1) {
        weather.value = 'cloud'
    } else if (w.indexOf('雨') > -1) {
        weather.value = 'rain'
    } else if (w.indexOf('阴') > -1) {
        weather.value = 'cloud'
    } else if (w.indexOf('雷') > -1) {
        weather.value = 'thunder'
    } else if (w.indexOf('雾') > -1) {
        weather.value = 'cloud&sun'
    } else if (w.indexOf('雪') > -1) {
        weather.value = 'snow'
    } else {
        weather.value = 'cloud&sun'
    }
});

</script>

<style lang="scss" scoped>
.rotate {
    width: 100%;
    height: 130%;
    position: absolute;
    left: 0;
    top: 0;
    transition: all 1s;
    background: transparent !important;

    .cloud {
        position: absolute;
        transition: all 1s;
    }

    .cloud-main {
        animation: movetoleft 20s linear infinite;
        width: 100%;
        height: 100%;
        opacity: 0;
        top: 0;
        pointer-events: none;
        transform: translateX(50%);
    }

    .cloud-last {
        animation: movetoleft 20s linear 10s infinite;
    }

    #cloud-back {
        filter: url(#filter-back);
        box-shadow: 300px 300px 60px -20px #fff;
    }

    #cloud-mid {
        filter: url(#filter-mid);
        box-shadow: 300px 340px 170px -60px rgba(158, 168, 179, 0.5);
        left: -25vw;
    }

    #cloud-front {
        filter: url(#filter-front);
        box-shadow: 300px 370px 160px -100px rgba(0, 0, 0, 0.3);
        left: -25vw;
    }

    @keyframes movetoleft {
        0% {}

        30% {
            opacity: 1;
        }

        100% {
            transform: translateX(-100%);
            opacity: 0;
        }

    }

    .rain__ {
        -webkit-animation-delay: calc(var(--d) * 1s);
        animation-delay: calc(var(--d) * 1s);
        -webkit-animation-duration: calc(var(--a) * 1s);
        animation-duration: calc(var(--a) * 1s);
        -webkit-animation-iteration-count: infinite;
        animation-iteration-count: infinite;
        -webkit-animation-timing-function: linear;
        animation-timing-function: linear;
        height: 30px;
        left: calc(var(--x) * 1%);
        position: absolute;
        top: calc((var(--y) + 50) * -1px);
    }

    .rain__ path {
        fill: #a1c6cc;
        opacity: var(--o);
        -webkit-transform: scaleY(calc(var(--s) * 1.5));
        transform: scaleY(calc(var(--s) * 1.5));
    }


    .slide-fade-enter-active {
        animation: bounce-in 1s;
    }

    .slide-fade-leave-active {
        animation: bounce-in 1s reverse;
    }

    svg:not(:root) {
        overflow: visible !important;
    }
}


.iconBox {
    width: 100%;
    display: flex;
    justify-content: center;

    .icon {
        position: relative;
        display: inline-block;
        width: 9em;
        height: 9em;
    }

    .cloud {
        position: absolute;
        z-index: 1;
        top: 50%;
        left: 50%;
        width: 3.6875em;
        height: 3.6875em;
        margin: -1.84375em;
        background: currentColor;
        border-radius: 50%;
        box-shadow:
            -2.1875em 0.6875em 0 -0.6875em,
            2.0625em 0.9375em 0 -0.9375em,
            0 0 0 0.375em #fff,
            -2.1875em 0.6875em 0 -0.3125em #fff,
            2.0625em 0.9375em 0 -0.5625em #fff;

        * {
            background: transparent !important;
        }
    }

    .cloud:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: -0.5em;
        display: block;
        width: 4.5625em;
        height: 1em;
        // background: currentColor;
        box-shadow: 0 0.4375em 0 -0.0625em #fff;
    }

    .cloud:nth-child(2) {
        z-index: 0;
        // background: #fff;
        box-shadow:
            -2.1875em 0.6875em 0 -0.6875em #fff,
            2.0625em 0.9375em 0 -0.9375em #fff,
            0 0 0 0.375em #fff,
            -2.1875em 0.6875em 0 -0.3125em #fff,
            2.0625em 0.9375em 0 -0.5625em #fff;
        opacity: 0.3;
        transform: scale(0.5) translate(6em, -3em);
        animation: cloud 4s linear infinite;
    }

    .cloud:nth-child(2):after {
        // background: #fff;
    }

    .sun {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 2.5em;
        height: 2.5em;
        margin: -1.25em;
        background: currentColor;
        border-radius: 50%;
        box-shadow: 0 0 0 0.375em #fff;
        animation: spin 12s infinite linear;
    }

    .rays {
        position: absolute;
        top: -2em;
        left: 50%;
        display: block;
        width: 0.375em;
        height: 1.125em;
        margin-left: -0.1875em;
        background: #fff;
        border-radius: 0.25em;
        box-shadow: 0 5.375em #fff;
    }

    .rays:before,
    .rays:after {
        content: '';
        position: absolute;
        top: 0em;
        left: 0em;
        display: block;
        width: 0.375em;
        height: 1.125em;
        transform: rotate(60deg);
        transform-origin: 50% 3.25em;
        background: #fff;
        border-radius: 0.25em;
        box-shadow: 0 5.375em #fff;
    }

    .rays:before {
        transform: rotate(120deg);
    }

    .cloud+.sun {
        margin: -2em 1em;
    }

    .rain,
    .thunder,
    .snow {
        background: transparent !important;
        position: absolute;
        z-index: 2;
        top: 50%;
        left: 50%;
        width: 3.75em;
        height: 3.75em;
        margin: 0.375em 0 0 -2em;
        background: currentColor;
    }

    .rain {
        background: transparent;
    }

    .rain:after {
        content: '';
        position: absolute;
        z-index: 2;
        top: 50%;
        left: 50%;
        width: 1.125em;
        height: 1.125em;
        margin: -1em 0 0 -0.25em;
        background: #0cf;
        border-radius: 100% 0 60% 50% / 60% 0 100% 50%;
        box-shadow:
            0.625em 0.875em 0 -0.125em rgba(255, 255, 255, 0.2),
            -0.875em 1.125em 0 -0.125em rgba(255, 255, 255, 0.2),
            -1.375em -0.125em 0 rgba(255, 255, 255, 0.2);
        transform: rotate(-28deg);
        animation: rain 3s linear infinite;
    }

    .bolt {
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -0.25em 0 0 -0.125em;
        color: #fff;
        opacity: 0.3;
        animation: thunder 2s linear infinite;
    }

    .bolt:nth-child(2) {
        width: 0.5em;
        height: 0.25em;
        margin: -1.75em 0 0 -1.875em;
        transform: translate(2.5em, 2.25em);
        opacity: 0.2;
        animation: thunder 1.5s linear infinite;
    }

    .bolt:before,
    .bolt:after {
        content: '';
        position: absolute;
        z-index: 2;
        top: 50%;
        left: 50%;
        margin: -1.625em 0 0 -1.0125em;
        border-top: 1.25em solid transparent;
        border-right: 0.75em solid;
        border-bottom: 0.75em solid;
        border-left: 0.5em solid transparent;
        transform: skewX(-10deg);
    }

    .bolt:after {
        margin: -0.25em 0 0 -0.25em;
        border-top: 0.75em solid;
        border-right: 0.5em solid transparent;
        border-bottom: 1.25em solid transparent;
        border-left: 0.75em solid;
        transform: skewX(-10deg);
    }

    .bolt:nth-child(2):before {
        margin: -0.75em 0 0 -0.5em;
        border-top: 0.625em solid transparent;
        border-right: 0.375em solid;
        border-bottom: 0.375em solid;
        border-left: 0.25em solid transparent;
    }

    .bolt:nth-child(2):after {
        margin: -0.125em 0 0 -0.125em;
        border-top: 0.375em solid;
        border-right: 0.25em solid transparent;
        border-bottom: 0.625em solid transparent;
        border-left: 0.375em solid;
    }

    .flake:before,
    .flake:after {
        content: '❄️';
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -1.025em 0 0 -1.0125em;
        color: #fff;
        list-height: 1em;
        opacity: 0.2;
        animation: spin 8s linear infinite reverse;
    }

    .flake:after {
        margin: 0.125em 0 0 -1em;
        font-size: 1.5em;
        opacity: 0.4;
        animation: spin 14s linear infinite;
    }

    .flake:nth-child(2):before {
        margin: -0.5em 0 0 0.25em;
        font-size: 1.25em;
        opacity: 0.2;
        animation: spin 10s linear infinite;
    }

    .flake:nth-child(2):after {
        margin: 0.375em 0 0 0.125em;
        font-size: 2em;
        opacity: 0.4;
        animation: spin 16s linear infinite reverse;
    }

    /* Animations */
    @keyframes spin {
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes cloud {
        0% {
            opacity: 0;
        }

        50% {
            opacity: 0.3;
        }

        100% {
            opacity: 0;
            transform: scale(0.5) translate(-200%, -3em);
        }
    }

    @keyframes rain {
        0% {
            background: #0cf;
            box-shadow:
                0.625em 0.875em 0 -0.125em rgba(255, 255, 255, 0.2),
                -0.875em 1.125em 0 -0.125em rgba(255, 255, 255, 0.2),
                -1.375em -0.125em 0 #0cf;
        }

        25% {
            box-shadow:
                0.625em 0.875em 0 -0.125em rgba(255, 255, 255, 0.2),
                -0.875em 1.125em 0 -0.125em #0cf,
                -1.375em -0.125em 0 rgba(255, 255, 255, 0.2);
        }

        50% {
            background: rgba(255, 255, 255, 0.3);
            box-shadow:
                0.625em 0.875em 0 -0.125em #0cf,
                -0.875em 1.125em 0 -0.125em rgba(255, 255, 255, 0.2),
                -1.375em -0.125em 0 rgba(255, 255, 255, 0.2);
        }

        100% {
            box-shadow:
                0.625em 0.875em 0 -0.125em rgba(255, 255, 255, 0.2),
                -0.875em 1.125em 0 -0.125em rgba(255, 255, 255, 0.2),
                -1.375em -0.125em 0 #0cf;
        }
    }

    @keyframes thunder {
        45% {
            color: #fff;
            background: #fff;
            opacity: 0.2;
        }

        50% {
            color: #0cf;
            background: #0cf;
            opacity: 1;
        }

        55% {
            color: #fff;
            background: #fff;
            opacity: 0.2;
        }
    }
}
</style>
