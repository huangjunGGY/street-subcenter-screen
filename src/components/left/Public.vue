<template>
  <div class="top">
    <BorderBox11 title="公共服务信息" style="height: 240px;" :color="['#3f91ec','rgb(33, 57, 101)']" backgroundColor="rgba(33, 57, 101,.2)">
      <div class="ggfwxx">
        <div class="resource">
          <div class="center flex l">

            <BorderBox10 style="width: 74px;height:74px;font-size: 13px;">
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 3px; line-height: 1.2;">
                <img src="/assets/images/hosp.svg" style="width: 24px; height: 24px; filter: drop-shadow(0 0 5px #00e5ff);" alt="医疗" />
                <span>医疗卫生</span>
              </div>
            </BorderBox10>

            <list class="flex-wrap left" :data="hop" :simple="{
                'content': 'num',
                'name': 'Mtitle'
              }" :detail="{
                medicalName: '医院名称',
                createTime: '创建时间',
                medicalAddress: '详细地址',
                medicalClass: '医院类型',
                medicalMidclass: '医院中级类型',
                medicalSubclass: '医院低级类型',
                streetName: '街道名'
            }" :short="['medicalName', 'createTime', 'medicalAddress', 'medicalClass', 'medicalMidclass', 'medicalSubclass']" pop></list>

          </div>

          <Decoration2 style="width:100%; height:10px;" />

          <div class="center flex r">
            <BorderBox10 style="width: 74px;height:74px;font-size: 13px;">
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 3px; line-height: 1.2;">
                <img src="/assets/images/school.svg" style="width: 24px; height: 24px; filter: drop-shadow(0 0 5px #ffd04b);" alt="教育" />
                <span>教育资源</span>
              </div>
            </BorderBox10>

            <div class="right flex">

              <div class="item">
                <div class="num">
                  {{ edu.xxNum || 0 }}
                  <span>家</span>
                </div>
                <div class="Mtitle">
                  小学
                </div>
              </div>

              <div class="item">
                <div class="num">
                  {{ edu.zxNum || 0 }}
                  <span>家</span>
                </div>
                <div class="Mtitle">
                  中学
                </div>
              </div>

              <div class="item">
                <div class="num">
                  {{ edu.yryNum || 0 }}
                  <span>家</span>
                </div>
                <div class="Mtitle">
                  幼儿教育
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BorderBox11>

  </div>
</template>

<script setup >
import { asypublic, asyhospital } from '@/api'
import { useDataStore } from 'hooks/data'

const dataStore = useDataStore()

let streetName = ''
if (window.location.search) {
  streetName = decodeURI(window.location.search.split("=")[1])
}


const hop = ref([])
const getasyhospital = async () => {
  const res = await asyhospital({
    streetName
  })
  console.log(res.data, 'hop');
  hop.value = Object.keys(res.data).map(key => ({
    name: key,
    content: res.data[key].length,
    list: res.data[key]
  }))
  hop.value.length = hop.value.length > 6 ? 6 : hop.value.length

  const arr = []
  for (const key in res.data) {
      const element = res.data[key];
      console.log(element);
      arr.push(...element)
  }
  console.log(arr);
  dataStore.storeData('hosp', arr)
}
getasyhospital()


const edu = ref([])
const getPublic = async () => {
  const res = await asypublic({
    streetName
  })
  console.log(res.data, 'public');
  edu.value = res.data
  
  const arr = []
  for (const key in res.data) {
      const element = res.data[key];
      console.log(element);
      arr.push(...element)
  }
  console.log(arr);
  dataStore.storeData('edu', arr)
}

getPublic()


// return {
//   ...toRefs(state),
//   ...toRefs(state1),
// }

</script>

<style lang="less">
.top {
  position: relative;

  .title {
    display: flex;
    align-items: center;
    height: 30px;
    margin-bottom: 15px;
    margin-left: 15px;
    background: url(/src/assets/images/title.png) no-repeat 0px 0px;
    background-size: 418px 40px;
    width: 543px;
    height: 40px;

    p {
      margin-left: 39px;
      font-size: 24px;
      color: #e5f4fb;
    }

  }

  .resource {
    display: flex;
    flex-wrap: wrap;
    font-size: 22px;

    .r-2 {
      padding: 4px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      .num {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: baseline;

        span {
          color: #fff;
        }
      }
    }
  }
}

.Mtitle {
  font-size: 12px;
  // 强制不换行
  white-space: nowrap;
}

.ggfwxx {
  padding-top: 70px;
  padding-bottom: 20px;

  .resource {
    padding: 0 20px;
  }

  .dv-border-box-10 {
    position: relative !important;
    text-align: center;
    line-height: 30px;
  }

  .l {
    .dv-border-box-10 {
      padding: 5px 7px;
    }
  }

  .r {
    .dv-border-box-10 {
      padding: 5px 15px !important;
    }
  }

  .left {
    width: calc(100% - 60px);
    display: flex;
    justify-content: space-around;

    .item {
      width: calc(100% / 6);
    }
  }

  .right {
    width: calc(100% - 60px);
    justify-content: flex-start !important;
    align-items: center !important;

    .item {
      width: calc(100% / 6);
    }
  }

  .item {
    flex-flow: column;

    .num {
      font-size: 33px !important;
      line-height: 30px;
      color: #fff;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: baseline;

      span {
        font-size: 22px !important;
        opacity: 0.6;
      }
    }

    .Mtitle {
      text-align: center;
      white-space: normal;
    }
  }
}

.title {
  font-size: 16px !important;
}

.center {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
</style>