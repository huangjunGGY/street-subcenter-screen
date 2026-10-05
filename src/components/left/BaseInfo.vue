
<!-- background-color="#b11e31" :color="['red', '#79081a']" -->
<template>
    <div class="top">
        <BorderBox11 title="街道党建展示" style="height: 140px; padding-top: 35px;" :color="['#3f91ec', 'rgb(33, 57, 101)']" backgroundColor="rgba(33, 57, 101,.2)">
            <div class="resource">
                <div class="right">

                    <div class="flex justify-center items-center">
                        <div class="has-icon">
                            <img src="@/assets/images/house.png" />
                        </div>
                        <div class="r-2">
                            <div class="num" style="color: #ccc">
                                <span>{{ party.dzzsltj?.zb || 0 }}</span>个
                            </div>
                            <div class="Mtitle" style="color: #ccc">
                                党支部数量
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-center items-center">
                        <div class="has-icon">
                            <img src="@/assets/images/people.png" />
                        </div>
                    <div class="r-2">
                        <div class="num" style="color: #ccc">
                            <span>{{ party.dyqk?.dyrs || 0 }}</span>人
                        </div>
                        <div class="Mtitle" style="color: #ccc">
                            党员数量
                        </div>
                    </div>
                    </div>
                </div>
            </div>

        </BorderBox11>

        <BorderBox11 title="基本信息" style="height: 190px; padding-top: 55px;" :color="['#3f91ec', 'rgb(33, 57, 101)']"
            backgroundColor="rgba(33, 57, 101,.2)">

            <div class="resource">

                <div class="right">

                    <div class="r-2">
                        <div class="num">
                            <span>{{ hop.streetArea || 0 }}</span>平方公里
                        </div>
                        <div class="Mtitle">
                            占地面积
                        </div>
                    </div>

                    <div class="r-2">
                        <div class="num">
                            <span>{{ hop.communityNum || 0 + hop.villageNum || 0 }}</span>个
                        </div>
                        <div class="Mtitle">
                            村社区数量
                        </div>
                    </div>

                    <div class="r-2">
                        <div class="num">
                            <span>{{ hop.czrk || 0 }}</span>万
                        </div>
                        <div class="Mtitle">
                            常住人口
                        </div>
                    </div>
                </div>

                <div class="right">
                    <div class="r-2">
                        <div class="num">
                            <span>{{ hop.ldrk || 0 }}</span>万
                        </div>
                        <div class="Mtitle">
                            流动人口
                        </div>
                    </div>

                    <div class="r-2">
                        <div class="num">
                            <span>{{ hop.zzrk || 0 }}</span>万
                        </div>
                        <div class="Mtitle">
                            寄住人口
                        </div>
                    </div>

                    <div class="r-2">
                        <div class="num">
                            <span>{{ hop.qtrk || 0 }}</span>万
                        </div>
                        <div class="Mtitle">
                            空挂户
                        </div>
                    </div>
                </div>
            </div>
        </BorderBox11>
    </div>
</template>

<script setup >

import { asystreet, asyscreen, asyparty } from '@/api'

let streetName = ''
if (window.location.search) {
    streetName = decodeURI(window.location.search.split("=")[1])
}


const party = ref([])
const getasyparty = async () => {
    const res = await asyparty({
        streetName
    })
    console.log(res.data, 'hosp');
    party.value = res.data
}
getasyparty()


const hop = ref([])
const getasyhospital = async () => {
    const res = await asystreet({
        streetName
    })
    const man = await asyscreen({
        streetName
    })

    console.log(man)
    hop.value = {
        ...res.data,
        ...man.data
    }
}
getasyhospital()

</script>

<style lang="scss" scoped>
.top {
    position: relative;

    .resource {
        display: flex;
        flex-wrap: wrap;
        font-size: 16px;
        margin-left: 14px;
        box-sizing: border-box;
        padding-left: 5px;
        padding-right: 5px;
        height: 100px;

        .right {
            width: 500px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
        }

        .r-2 {
            width: 32%;
            height: 50px;
            margin-left: 5px;
            margin-bottom: 5px;

            .num {
                display: flex;
                justify-content: center;
                align-items: baseline;
                color: rgba(255, 255, 255, .5);
                font-size: 22px;
                white-space: nowrap !important;

                span {
                    color: #fff;
                    margin-right: 5px;
                    font-size: 26px;
                    white-space: nowrap !important;
                }
            }
        }
    }
}

.Mtitle {
    text-align: center;
    white-space: nowrap !important;
}

.has-icon {
    height: 70px;
    position: relative;

    img {
        height: 100%;
    }

    &::after {
        content: "";
        width: 90px;
        height: 90px;
        background: url("@/assets/images/bottom.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left: 50%;
        bottom: -15px;
        transform: translate(-50%);
        z-index: -1;
    }
}
</style>