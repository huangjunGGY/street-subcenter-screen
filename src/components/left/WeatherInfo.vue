<template>
    <div class="top">
        <BorderBox11 title="今日环境" :color="['#3f91ec', 'rgb(33, 57, 101)']" backgroundColor="rgba(33, 57, 101,.2)">
            <div class="jrhj">
                <list class="flex-wrap" :data="hop" :simple="{
            'content': 'num',
            'name': 'Mtitle'
        }"></list>
            </div>
        </BorderBox11>
    </div>
</template>

<script setup lang="jsx">
import { asywarning } from '@/api';
import { useStore } from 'hooks/weather';
import { Pouring, Ship, MoonNight, CircleClose, Aim } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'


const hop = ref([])

watchEffect(() => {
    const store = useStore();
    console.log("---------------------");
    console.log(store.value, 'value666');
    hop.value = [{
        name: '降水量',
        content: store.value.rain,
        icon: <span className="icon"><el-icon size="32"><Pouring /></el-icon></span>
    }, {
        name: '风力',
        content: store.value.ws,
        icon: <span className="icon"><el-icon size="32"><Ship /></el-icon></span>
    }, {
        name: '相对湿度',
        content: store.value.sd,
        icon: <span className="icon"><el-icon size="32"><MoonNight /></el-icon></span>
    }, {
        name: 'PM2.5',
        content: store.value.aqi_pm25,
        icon: <span className="icon"><el-icon size="32"><Aim /></el-icon></span>
    }]
})



const hasShownWarning = ref(false);
let timerId;

// 页面加载时执行一次
onMounted(async () => {
    await getasywarning();

    // 开启轮询，每360000毫秒检查一次
    timerId = setInterval(async () => {
        if (!hasShownWarning.value) {
            await getasywarning();
        }
    }, 360000);
});

// 气象预警 成功获取到警告信息且未显示过时，显示通知并标记为已显示
const getasywarning = async () => {
    await asywarning({
        cityName: '武汉市'
    }).then(res => {
        console.log(res, 'res');

        if (Number(res.code) === 0 && !hasShownWarning.value) {
            ElNotification({
                title: res.data.head + ' ' + res.data.TIME,
                message: res.data.ISSUECONTENT,
                type: 'warning',
                duration: 0
            });

            // 弹出通知后，设置 hasShownWarning 为 true
            hasShownWarning.value = true;

            // 清除定时器，因为已经弹出了警告
            clearInterval(timerId);
        }
    });
};



</script>

<style lang="less">
.jrhj {
    padding: 60px 10px;
    height: 220px;
    box-sizing: border-box;

    .item {
        width: 50% !important;
        font-size: 28px;
        margin-top: 10px;

        >div {
            width: 120px !important;
        }
    }

    .Mtitle {
        font-size: 14px;
    }

    .icon {
        width: 50px;
        height: 50px;
        line-height: 60px;
        text-align: center;
        display: block;
        background: #3f91ec;
        border-radius: 50%;
        position: relative;

        &::after {
            content: '';
            display: block;
            width: 65px;
            height: 65px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotateZ(0deg);
            background: url('@/assets/images/border.png') no-repeat;
            background-size: 100% 100%;
            z-index: -1;
            animation: ro 2s linear infinite;
        }
    }
}

@keyframes ro {
    0% {
        transform: translate(-50%, -50%) rotateZ(0deg);
    }

    100% {
        transform: translate(-50%, -50%) rotateZ(360deg);
    }
}
</style>