<template>
  <lk-layout>
    <v-container class="smart-contract">
      <v-row class="smart-text">
        <span>Smart Contract Designer</span>
      </v-row>
      <!-- Chose options layout, manual&instruction btn's -->
      <v-row class="chose-option-box d-flex flex-row">
        <div class="d-flex flex-row">
          <main-selects></main-selects>
        </div>
        <v-spacer></v-spacer>
          <div class="manual-btn-box">
            <div class="manual-btn">
              <span>Manual</span>
            </div>
            <div class="manual-btn__icon">
              <img src="@/assets/images/smart-info.svg" />
            </div>
          </div>
          <div class="instruction-btn-box">
            <div class="instruction-btn">
              <span>Video instruction</span>
            </div>
            <div class="instruction-btn__icon">
              <img src="@/assets/images/smart-play.svg" />
            </div>
          </div>
      </v-row>
      <!-- Input text-field layout  -->
      <v-row class="input-layout">
        <div class="input-components">
          <div class="d-flex">
              <v-text-field
                label="Enter the title"
                background-color="#4d3779"
                full-width
                height="60px"
                solo
                color="#ffffff"
                class="input-title"
                style="margin-right:15px;"
                autofocus
              />
              <v-text-field
                label="Enter a short name"
                background-color="#4d3779"
                full-width
                height="60px"
                solo
                color="#ffffff"
                class="input-name"
              />
          </div>
              <v-text-field
                label="Description"
                background-color="#4d3779"
                full-width
                height="60px"
                solo
                color="#ffffff"
                class="input-description"
              />
        </div>
      </v-row>
      <!-- Number of tokens layout -->
      <v-row class="tokens-layout">
        <div class="number-tokens">
          <p>Number of tokens</p>
          <span>100000 tokens = $ 1000 deposit amount</span>
          <div class="number-tokens-block">
            <div>
              <v-text-field
                v-model="sliderFormatted"
                solo
                height="60px"
                background-color="#4d3779"
                class="number-tokens-label"
                label="Enter"
                type="number"
              />
              <v-slider
                v-model="slider"
                min="0"
                max="120"
                color="#a67ff6"
                class="input-slider-text"
                track-fill-color="#a67ff6"
                track-color="#2b1b4c"
              ></v-slider>
            </div>
          </div>
          <div class="slider-block">
            <p>Number of decimal places</p>
            <v-text-field
              v-model="slider_decimal"
              class="discount-slider-label"
              hide-details
              single-line
              type="text"
              readonly
            ></v-text-field>
            <v-slider
              min="0.0000"
              step="0.0001"
              max="100.0000"
              color="#a67ff6"
              class="number-tokens-slider"
              track-fill-color="#a67ff6"
              track-color="#2b1b4c"
              v-model="slider_decimal"
            ></v-slider>
          </div>
          <div class="slider-block">
            <p>% Discount</p>
              <v-text-field
                v-model="slider_discount"
                class="discount-slider-label"
                readonly
                hide-details
                single-line
                type="number"
                suffix="%"
                color="#af89ff"
              ></v-text-field>
              <v-slider
                min="0"
                max="100"
                color="#a67ff6"
                class="number-tokens-slider"
                track-fill-color="#a67ff6"
                track-color="#2b1b4c"
                v-model="slider_discount"
              ></v-slider>
          </div>
          <div class="validity-block">
            <p class="mb-2">Validity</p>
            <!-- Date picker -->
            <div class="input-validity d-flex flex-row justify-content-between">
              <smart-date></smart-date>
              <!-- Example -->
            </div>
          </div>
          <!-- Cashback -->
          <div class="slider-block mt-5">
            <p>Cashback</p>
              <v-text-field
                v-model="slider_cashback"
                class="discount-slider-label"
                hide-details
                single-line
                type="number"
                suffix="%"
                readonly
              ></v-text-field>
              <v-slider
                min="0"
                max="100"
                color="#a67ff6"
                class="number-tokens-slider"
                track-fill-color="#a67ff6"
                track-color="#2b1b4c"
                v-model="slider_cashback"
              ></v-slider>
          </div>
        </div>

          <v-spacer></v-spacer>

        <div class="chose-tokens">

        <filter-selects></filter-selects>
            <!-- Checkbox layout ++ -->
        <div class="chose-tokens-scroll">
            <div class="chose-tokens-chechbox">
              <v-layout row wrap d-flex flex-box align-content-space-between fill-height>
                    <v-flex v-for="(category,index) in types" :key="types[index].text" xs4>
                      <v-checkbox
                        light
                        :label="category.text"
                        v-model="category.selected"
                        class="checkbox-layout"
                      ></v-checkbox>
                    </v-flex>
              </v-layout>
            </div>
        </div>
      </div>
    </v-row>
      <!-- Confirm layout -->
      <token-terms></token-terms>
      <!-- Deploy button -->
      <v-row class="deploy-btn-layout">
        <v-btn
          class="deploy-btn"
          width="420"
          height="50"
          @click="overlay = !overlay"
        >
          Deploy
        </v-btn>
        <div @click="overlay = false" v-on="timeOut">
          <v-overlay
            :absolute="absolute"
            :opacity="opacity"
            :value="overlay"
            :z-index="zIndex"
            @click="overlay = false"
          >
            <div
              class="deploy-btn-layout__succes"
            >
              <div class="deploy-btn-layout__succes__label">
                <v-row><p>Succes!</p></v-row>
                <v-row><span>Successful token deployment</span></v-row>
                <v-row><a href="#">0xfdjikfsdk4327423905ksdfd</a></v-row>
              </div>
              <div class="deploy-btn-layout__succes__icon">
                <img src="@/assets/images/tick-bigger.svg" />
              </div>
            </div>
          </v-overlay>
        </div>
      </v-row>
      <!-- Info layout -->
      <v-row class="info-layout">
        <p>I understand that in case of non-compliance with the rules, my the token will fall into the Suspicious section, andwill be searchable only by ID.</p>
      </v-row>
    </v-container>
  </lk-layout>
</template>

<script>
  import LkLayout from '@/layout/LkLayout'
  import FilterSelects from './FilterSelects';
  import MainSelects from './MainSelects';
  import SmartDate from './DatePicker';
  import TokenTerms from './TokenTerms';

    export default {
        name: 'SmartContract',
        components: { LkLayout, FilterSelects, MainSelects, SmartDate, TokenTerms },
        data: () => ({
          absolute: false,
          opacity: 0.46,
          overlay: false,
          zIndex: 5,
          slider: 0,
          sliderFormatted: this.label,
          isDescriptionOpened: false,
          slider_discount: 0,
          slider_decimal: '0.0000',
          slider_cashback: 0,
          dialog: false,
          dropdown_font: ['Arial', 'Calibri', 'Courier', 'Verdana'],
          types: [
            { text: 'The drinks', value: 'drinks', selected: false },
            { text: 'The drinks', value: 'drinks', selected: false },
            { text: 'The drinks', value: 'drinks', selected: false },
            { text: 'Dessert', value: 'desserts', selected: false },
            { text: 'Dessert', value: 'desserts', selected: false },
            { text: 'Dessert', value: 'desserts', selected: false },
            { text: 'Snacks', value: 'food', selected: false },
            { text: 'Snacks', value: 'food', selected: false },
            { text: 'Snacks', value: 'food', selected: false },
            { text: 'Salads', value: 'freshfood', selected: false },
            { text: 'Salads', value: 'freshfood', selected: false },
            { text: 'Salads', value: 'freshfood', selected: false },
            { text: 'Alcohol', value: 'life', selected: false },
            { text: 'Alcohol', value: 'life', selected: false },
            { text: 'Alcohol', value: 'life', selected: false },
            { text: 'Alcohol', value: 'life', selected: false },
            { text: 'Alcohol', value: 'life', selected: false },
            { text: 'Alcohol', value: 'life', selected: false },
            { text: 'Alcohol', value: 'life', selected: false },
            { text: 'Alcohol', value: 'life', selected: false },
            { text: 'Alcohol', value: 'life', selected: false },
            { text: 'Alcohol', value: 'life', selected: false },
            { text: 'Alcohol', value: 'life', selected: false },
          ],
        }),
        watch: {
          slider (val) {
            this.sliderFormatted = this.slider
          }
        },
        methods: {
          checkLength(index) {
            if (index < this.types.length - 1) {
              index = index + 1;
              return index;
            }
          },
        },
        beforeDestroy() {
          window.removeEventListener('click', this.windowHandler);
        },
    }
</script>

<style scoped lang="scss">

  .smart-contract{
    width: 100%;
    max-width: 2048px;
  }
  .container {
    padding: 0;
  }
  .v-card:not(.v-sheet--tile):not(.v-card--shaped){
    border-radius: 17px;
  }
  .smart-text{
    width: 100%;
    height: 21px;
    display: inline-block;
    span{
      color: #ffffff;
      font-family: "Open Sans Semi Bold";
      font-size: 16px;
      font-weight: 600;
      line-height: 21px;
      margin-left: 20px;
    }
    p{
      width: 191px;
      height: 21px;
      font-size: 16px;
      font-weight: 600px;
      line-height: 21px;
  }
  }
  .number-tokens p, .input-small, .confirm-layout p{
    color: #ffffff;
    -webkit-text-stroke-color: #ffffff;
    font-family: "Open Sans Semi Bold";
  }
  .v-input, .v-label {
    font-size: 14px important;
    -webkit-text-fill-color: #ffffff;
    font-family: "Open Sans Semi Bold";
  }
  // -----------------------------------------------
  // Chose option, network && manual, video instruction buttons
  // -----------------------------------------------
  .chose-option-box{
    width: 100%;
    position: relative;
    height: 64px;
    margin: 0 auto;
    margin-top: 30px;
    margin-bottom: 15px;
  }
  .theme--light.v-card {
    background-color: #3b2665;
    color: rgba(0,0,0,.87);
  }
  .v-select-list[data-v-6472e3c8] {
    border-radius: 17px;
  }
  .v-input__icon{
    background-image: src('@/assets/images/select-icon.svg');
  }
  .manual-btn-box{
    width: 132px;
    height: 64px;
    position: relative;
  }
  .manual-btn__icon{
    width: 39px;
    height: 39px;
    border-radius: 14px;
    background-color: #543b88;
    margin-right: 70px;
    margin-bottom: 23px;
    position: absolute;
    padding: 10px 11px 12px 10px;
    img{
      width: 18px;
      height: 18px;
    }
  }
  .manual-btn{
    width: 115px;
    height: 51px;
    border-radius: 17px;
    background-color: #3b2665;
    position: absolute;
    margin-top: 13px;
    margin-left: 17px;
    padding: 12px 24px 14px 32px;
    span{
      width: 51px;
      height: 21px;
      color: #ffffff;
      font-family: "Open Sans Semi Bold";
      font-size: 14px;
      font-weight: 600;
      line-height: 21px;
      display: inline-block;
    }
  }

  .instruction-btn-box{
    width: 196px;
    height: 64px;
    position: relative;
    margin-left: 15px;
  }
  .instruction-btn__icon{
    width: 39px;
    height: 39px;
    border-radius: 14px;
    background-color: #543b88;
    margin-right: 147px;
    margin-bottom: 23px;
    position: absolute;
    padding: 11px 11px 11px 10px;
    img{
      width: 19px;
      height: 19px;
    }
  }
  .instruction-btn{
    width: 180px;
    height: 51px;
    border-radius: 17px;
    background-color: #3b2665;
    margin-top: 13px;
    margin-left: 17px;
    position: absolute;
    padding: 12px 17px 14px 33px;
    span{
      width: 118px;
      height: 21px;
      color: #ffffff;
      font-family: "Open Sans Semi Bold";
      font-size: 14px;
      font-weight: 600;
      line-height: 21px;
      display: inline-block;
    }
  }
  .manual-btn__icon, .manual-btn, .instruction-btn__icon, .instruction-btn:hover{
    cursor: pointer;
  }
  // -----------------------------------------------
  // Input layout (title, name, description)
  // -----------------------------------------------
  .input-layout{
    width: 100%;
    height: 177px;
    border-radius: 14px;
    background-color: #3b2665;
    padding: 20px;
    margin: 0 auto;
    margin-bottom: 15px;
  }
  .input-components{
    width: 100%;
    height: 127px;
  }
  .input-title, .input-name, .input-description{
    width: 100%;
    border-radius: 14px;
    height: 60px;
    font-weight: 600;
    line-height: 21px;
    color: #ffffff;
    box-shadow: none;
  }
  .input-description{
    margin: 0 auto;
    margin-top: 15px;
  }

  // -----------------------------------------------
  // Options layout (number of tokens..., checkboxes)
  // -----------------------------------------------
  // Number of tokens
  .tokens-layout{
    width: 100%;
    height: 54%;
    display: grid;
    grid-template-columns: 30% 70%;
    margin: 0 auto;
    margin-bottom: 30px;
    position: relative;
  }
  .number-tokens{
    width: 29%;
    height: 100%;
    border-radius: 14px;
    background-color: #3b2665;;
    padding: 20px;
    position: absolute;
    p{
      height: 21px;
      color: #ffffff;
      font-weight: 600;
      line-height: 21px;
      font-size: 14px;
      font-family: "Open Sans Semi Bold";
    }
      span{
      width: 225px;
      height: 21px;
      opacity: 0.5;
      color: #ffffff;
      font-family: "Open Sans";
      font-size: 12px;
      line-height: 21px;
    }
  }
  .number-tokens-block{
    width: 100%;
    height: 70px;
    margin: 0 auto;
    margin-bottom: 8%;
    margin-top: 4%;
    position: relative;
  }
  .number-tokens-label{
    width: 98%;
    font-weight: 600;
    line-height: 21px;
    position: absolute;
  }
  .input-slider-text{
    margin-left: 12px;
    width: 90%;
    height: 2px;
    position: absolute;
    bottom: 25px;
  }
  .input-slider{
    width: 100%;
    height: 60px;
    margin: 0 auto;
  }
  .slider-block{
    width: 100%;
    height: 68px;
    margin-bottom: 35px;
    position: relative;

  }
  .slider-block input {
      margin-left: 0 !important;
    }
  .discount-slider-label{
    width: 64px;
    color: #af89ff;
    font-family: "Open Sans Semi Bold";
    font-size: 14px;
    font-weight: 600;
    line-height: 21px;
    position: absolute;
    margin-top: 0;
    right: 0;
    margin-right: 5%;
  }
  .number-tokens-slider{
    width: 98%;
    height: 2px;
    margin-top: 28px;
    margin-right: 2px;
    margin-left: 2px;
    position: absolute;
  }
  .validity-block{
    width: 100%;
    height: 82px;
  }
  .input-validity{
    margin-top: -6px;
    width: 100%;
    height: 56px;
    position: relative;
    .v-input {
      max-width: 48% !important;
    }
    p{
      margin-bottom: 10px ;
    }
  }

  // Second block (chose tokens)

  .chose-tokens{
    width: 100%;
    height: 100%;
    border-radius: 14px;
    background-color: #3b2665;
    padding: 20px 20px 25px 20px;
    right: 0;
    margin-bottom: 2%;
  }

  // Checkbox Layout

  .checkbox-layout {
    width: 116px;
    height: 12px;
    color: #ffffff;
    font-family: "Open Sans Semi Bold";
    font-size: 14px;
    font-weight: 600;
    line-height: 21px;
    margin: 5px 100px 20px 15px;
  }
  .chose-tokens-scroll {
    border-radius: 17px;
    background-color: #4d3779;
    padding: 11px 10px 61px 20px;
    margin: 0 auto;
    margin-top: 25px;
    width: 100%;
    height: 307px;
  }
  .chose-tokens-chechbox {
    margin-top: 1%;
    width: 100%;
    height: 191px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .checkbox-item {
    font-weight: 600;
    line-height: 21px;
    height: 12px;
    width: 116px;
  }
  // -----------------------------------------------
  // Confirm layout, Deploy button & Info layout
  // -----------------------------------------------

  .deploy-btn-layout {
    width: 420px;
    height: 50px;
    margin: 0 auto;
    margin-bottom: 13px;
    &__succes {
      width: 346px;
      height: 207px;
      margin-left: 50%;
      position: relative;
      &__icon {
        width: 57px;
        height: 57px;
        border-radius: 22px;
        background-color: #4d3779;
        position: absolute;
        margin: 0px 144px 150px 145px;
        img {
          margin: 21px 17px 19px 18px;
          width: 22px;
          height: 17px;
        }
      }
      &__label {
        width: 346px;
        height: 179px;
        background-color: #3b2665;
        border-radius: 35px;
        position: absolute;
        margin-top: 28px;
        font-weight: 600;
        line-height: 21px;
        font-family: "Open Sans Semi Bold";
        color: #ffffff;
        p {
          width: 127px;
          height: 39px;
          font-size: 36px;
          margin-top: 54px;
          margin-left: 123px;
        }
        span {
          width: 346px;
          height: 21px;
          font-size: 16px;
          margin-left: 73px;
        }
        a {
          width: 219px;
          height: 21px;
          color: #8898f7;
          font-size: 16px;
          text-decoration: none;
          margin-top: 9px;
          margin-left: 76px;
        }
      }
    }
  }
  .deploy-btn {
    border-radius: 28px;
    background-image: linear-gradient(270deg, #8e6ee4 0%, #d268bc 100%);
    color: #ffffff;
    font-family: "Open Sans Semi Bold";
    font-size: 16px;
    font-weight: 600;
    line-height: 21px;
    text-transform: none;
  }
  .info-layout p {
    width: 805px;
    height: 21px;
    opacity: 0.5;
    color: #ffffff;
    font-family: "Open Sans";
    font-size: 12px;
    line-height: 21px;
    margin: 0 auto;
  }
</style>
