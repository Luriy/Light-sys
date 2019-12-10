<template>
  <lk-layout>
    <div class="profile-header d-flex justify-content-between">
      <div class="header-info d-flex flex-row align-items-center">
        <img src="../../assets/images/Rectangle.png" alt="" class="image">
        <div class="general-info">
          <p class="name">Julia Dzubina</p>
          <div class="id-number">
            <span class="id-head">ID</span>
            <span>573 983</span>
          </div>
        </div>
      </div>
      <div class="security d-flex flex-column justify-content-between">
        <div class="level d-flex align-items-center">
          <span class="level-title">Security</span>
          <span class="level-status" style="color: #ff3b3b">Low</span>
          <img src="../../assets/images/smyles/cry.png" alt="" class="level-image align-self-center">
        </div>
        <div class="bar">
          <v-progress-linear
            value="15"
            height="2"
            color="#ff3b3b"
            background-color="#452865"
          ></v-progress-linear>
        </div>
        <p class="hint">Take measures to protect your wallet from losses and grabs</p>
      </div>
    </div>

    <div class="settings-list">
      <div class="setting d-flex flex-row align-items-center" v-for="(setting, index) of settingsList" :key="`setting-${index}`">
        <div class="setting-icon-wrapper d-flex justify-content-center"><img class="align-self-center" :src="setting.icon" alt=""></div>
        <span class="setting-name">{{setting.name}}</span>
      </div>
    </div>
  </lk-layout>
</template>

<script>
  import LkLayout from '@/layout/LkLayout'

    export default {
      name: 'index',
      data() {
        return {
          settingsList: [
            {
              name: 'Account',
              icon: require('@/assets/images/icons/Account.png')
            },
            {
              name: 'Security',
              icon: require('@/assets/images/icons/Security.png')
            },
            {
              name: 'Notifications',
              icon: require('@/assets/images/icons/Notifications.png')
            },
            {
              name: 'Decor',
              icon: require('@/assets/images/icons/Decor.png')
            },
            {
              name: 'Decor',
              icon: require('@/assets/images/icons/Decor.png')
            },
            {
              name: 'Support Center',
              icon: require('@/assets/images/icons/Support_Center.png')
            },
            {
              name: 'Support Center',
              icon: require('@/assets/images/icons/Support_Center.png')
            },
            {
              name: 'Verification',
              icon: require('@/assets/images/icons/Verification.png')
            },
            {
              name: 'Referral system',
              icon: require('@/assets/images/icons/Referral_system.png')
            },
            {
              name: 'Languages',
              icon: require('@/assets/images/icons/Languages.png')
            },
            {
              name: 'O Lightnet ecosystem',
              icon: require('@/assets/images/icons/Heart.png')
            },
          ]
        }
      },
      components: {
        LkLayout
      },
      computed: {
        profile() {
          return this.$store.getters['user/getProfile'];
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "../../assets/scss/common";

  .profile-header {
    width: 100%;
    height: 175px;
    margin-bottom: 40px;
    border-radius: 50px;
    background-color: $first-dark;
  }

  .level-status {
    margin: 0 5px;
  }

  .header-info {
    .image {
      margin: 36px;
    }

    .general-info {
      .name {
        color: $general-font-color;
        font-size: 24px;
        font-weight: 600;
        line-height: 21px;
        margin-bottom: 10px!important;
      }
      .id-head {
        color: $general-font-color;
        font-size: 16px;
        font-weight: 600;
        line-height: 21px;
        opacity: 0.5;
      }
      .id-number, .level-status {
        color: $general-font-color;
        font-size: 16px;
        font-weight: 600;
        line-height: 21px;
      }
    }
  }

  .security {
    border-radius: 24px;
    padding: 25px 20px;
    margin: 26px;
    width: 395px;
    height: 123px;
    border: 1px solid $third-dark;

    .level {
      .level-title {
        font-size: 14px;
        font-weight: 600;
        line-height: 21px;
        color: $general-font-color;
      }
    }

    .bar {
      max-width: 290px;
    }

    .hint {
      color: $general-font-color;
      opacity: 0.5;
      font-size: 12px;
      line-height: 21px;
    }
  }

  .settings-list {
    display: grid;
    column-count: 2;
    column-gap: 20px;
    grid-row-gap: 20px;
    grid-template-columns: repeat(2, 1fr);
  }

  .setting {
    background-color: $forth-dark;
    height: 56px;
    border-radius: 14px;
  }

  .setting-icon-wrapper {
    height: 37px;
    margin: 10px;
    border-radius: 14px;
    background-color: $fifth-dark;
    width: 37px;
  }

  .setting-name {
    color: $general-font-color;
    font-size: 16px;
    font-weight: 600;
    line-height: 21px;
  }
</style>
