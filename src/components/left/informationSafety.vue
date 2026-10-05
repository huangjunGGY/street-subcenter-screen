<template>
    <div class="top">
        <BorderBox11 title="街道房屋情况" :color="['#3f91ec','rgb(33, 57, 101)']" backgroundColor="rgba(33, 57, 101,.2)">
            <div class="jdfwqk">

                <div class="Sname">
                    <div>
                        <Decoration11 style="width: 120px;height:50px;font-size: 16px; transform: translateY(-12px)">房屋总数
                        </Decoration11>
                        <div class="num">
                            <span>{{ hj.fwzs || 0 }}</span>间
                        </div>
                    </div>

                    <div>
                        <Decoration11 style="width: 120px;height:50px;font-size: 16px; transform: translateY(-12px)">自住房数
                        </Decoration11>
                        <div class="num">
                            <span>{{ hj.zzfs || 0 }}</span>间
                        </div>

                    </div>
                </div>

                <div class="Sname">
                    <div>
                        <Decoration11 style="width: 120px;height:50px;font-size: 16px; transform: translateY(-12px)">租赁房数
                        </Decoration11>
                        <div class="num">
                            <span>{{ hj.zlfs || 0 }}</span>间
                        </div>
                    </div>

                    <div>
                        <Decoration11 style="width: 120px;height:50px;font-size: 16px; transform: translateY(-12px)">空房数
                        </Decoration11>
                        <div class="num">
                            <span>{{ hj.kfs || 0 }}</span>间
                        </div>
                    </div>
                </div>

            </div>
        </BorderBox11>

    </div>
</template>

<script setup >
import { asyhouse } from '@/api'

let streetName = ''
if (window.location.search) {
    streetName = decodeURI(window.location.search.split("=")[1])
}

const hj = ref([])
const getasystreet = async () => {
    const res = await asyhouse({
        streetName
    })
    console.log(res.data, '11111');
    hj.value = res.data || {}
}
getasystreet();

</script>

<style lang="less" scoped>
.jdfwqk {
    width: 100%;
    height: 180px;
    padding-top: 70px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .Sname {
        width: 100%;
        display: flex;

        &>div {
            width: 46%;
            display: flex;
            justify-content: space-between;
            padding-left: 15px;
        }
    }
}

.top {
    position: relative;

    .Sname {
        color: #fff;
        font-size: 20px;

        .name {
            width: 100px;
            height: 29px;
            text-align: center;
            background-color: #0c93a9;
        }

        .num {
            // 不换行
            white-space: nowrap;

            span {
                color: #2be3e9;
            }
        }
    }
}
</style>