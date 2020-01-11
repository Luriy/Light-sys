<template>
  <lk-layout>
    <v-container class="smart-contract">
      <v-row class="smart-text">
        <span>Smart Contract Designer</span>
      </v-row>
      <!-- Chose options layout, manual&instruction btn's -->
      <v-row class="chose-option-box d-flex flex-row">
        <div class="d-flex flex-row">
          <v-overflow-btn
          :items="['Token','Stablecoin','Smart contract']"
          label="Choose an option"
          color="#4c3677"
          background-color="#3b2665"
          item-color="grey"
          solo-inverted
          height="60"
          class="chose-option"
          clear-icon
        ></v-overflow-btn>
        <v-overflow-btn
          :items="['Testnet', 'Mainnet']"
          label="Choose a network"
          color="#4c3677"
          background-color="#3b2665"
          item-color="grey"
          solo-inverted
          height="60"
          class="chose-network"
        ></v-overflow-btn>
        </div>
        <v-spacer></v-spacer>
          <div class="manual-btn-box">
            <div class="manual-btn">
              <span>Manual</span>
            </div>
            <div class="manual-btn__icon">
              <!-- <img src="@/assets/images/smart-info.svg" /> -->
            </div>
          </div>
          <div class="instruction-btn-box">
            <div class="instruction-btn">
              <span>Video instruction</span>
            </div>
            <div class="instruction-btn__icon">
              <!-- <img src="@/assets/images/smart-play.svg" /> -->
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
                height="56px"
                solo
                color="#ffffff"
                class="input-title"
                style="margin-right:15px;"
              />
              <v-text-field
                label="Enter a short name"
                background-color="#4d3779"
                full-width
                height="56px"
                solo
                color="#ffffff"
                class="input-name"
              />
          </div>
              <v-text-field
                label="Description"
                background-color="#4d3779"
                full-width
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
            <div style="width:270px;height:60px;margin-top:10px;">
              <v-text-field
                v-model="slider"
                solo
                height="56"
                full-width
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
              type="number"
            ></v-text-field>
            <v-slider
              min="0"
              max="130"
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
            <div class="input-validity d-flex flex-row">
              <!-- Example -->
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="dateRangeText"
                  readonly
                  v-on="on"
                  solo
                  background-color="#4d3779"
                  height="56px"
                />
              </template>
              <v-date-picker v-model="dates" range @input="menu"></v-date-picker>
            </v-menu>
            </div>
          </div>
          <div class="slider-block mt-5">
            <p>Cashback</p>
              <v-text-field
                v-model="slider_cashback"
                class="discount-slider-label"
                hide-details
                single-line
                type="number"
                suffix="%"
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

          <!-- <v-spacer></v-spacer> -->

        <div class="chose-tokens">
            <div class="select-tokens-inside d-flex flex-row">
              <!-- <v-select
                :items="[1,3,4,5]"
                label="Burning"
                color="#F44336"
                background-color="#4d3779"
                solo
                height="60"
                class="select-first-token"
              ></v-select> -->
              <v-overflow-btn
                :items="[1,3,4,5]"
                label="Burning"
                color="#F44336"
                background-color="#4d3779"
                item-color="grey"
                solo
                height="60"
                class="chose-option"
                clear-icon
              ></v-overflow-btn>
                <v-spacer></v-spacer>
              <v-select
                :items="[1,3,4,5]"
                label="Additional issue"
                color="#F44336"
                background-color="#4d3779"
                solo
                height="60"
                class="select-last-token"
              ></v-select>
            </div>
            <div class="select-tokens-inside d-flex flex-row">
              <v-select
                :items="[1,3,4,5]"
                label="Loyalty"
                color="#F44336"
                background-color="#4d3779"
                solo
                height="60"
                class="select-first-token"
              ></v-select>
                <v-spacer></v-spacer>
              <v-select
                :items="[1,3,4,5]"
                label="Escrow"
                color="#F44336"
                background-color="#4d3779"
                solo
                height="60"
                class="select-last-token"
              ></v-select>
            </div>
            <div class="select-tokens-inside d-flex flex-row">
              <v-select
                :items="[1,3,4,5]"
                label="Finance"
                color="#F44336"
                background-color="#4d3779"
                solo
                height="60"
                class="select-first-token"
              ></v-select>
                <v-spacer></v-spacer>
              <v-select
                :items="[1,3,4,5]"
                label="Score"
                color="#F44336"
                background-color="#4d3779"
                solo
                height="60"
                class="select-last-token"
              ></v-select>
            </div>
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
      <v-row class="confirm-layout">
        <p>By creating a token, you confirm that:
          <br>I) You will not use it for fraudulent purposes;
          <br>II) You do not duplicate in the name of the token in full or in part the name of existing cryptocurrencies or the names of well-known
        </p>
        <!-- <img src="@/assets/images/confirm-icon.svg" /> -->
      </v-row>
      <!-- Deploy button -->
      <v-row class="deploy-btn-layout">
        <v-btn
          class="deploy-btn"
          width="420"
          height="50"
        >
          <p>Deploy</p>
        </v-btn>
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

    export default {
        name: 'SmartContract',
        components: { LkLayout },
        data: () => ({
          slider: 0,
          slider_discount: 0,
          slider_decimal: 0,
          slider_cashback: 0,
          dates: ['2019-09-10', '2019-09-20'],
          menu: false,
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
        methods: {
          checkLength(index) {
            if (index < this.types.length - 1) {
              index = index + 1;
              return index;
            }
          },
        },
        computed: {
          dateRangeText () {
            return this.dates.join(' ~ ')
          },
        },
    }
</script>

<style scoped lang="scss">
  @import "../assets/scss/common";
  .smart-contract{
    width: 100%;
    max-width: 2048px;
    height: 1116px;
    // border-radius: 32px;
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
    height: 60px;
    margin: 0 auto;
    margin-top: 30px;
    margin-bottom: 15px;
  }
  .chose-option{
    margin-right: 15px;
    font-weight: 600;
    line-height: 21px;
    width: 310px;
  }
  .chose-network{
    font-weight: 600;
    line-height: 21px;
    width: 310px;
  }
  .theme--light.v-card {
    background-color: #3b2665;
    color: rgba(0,0,0,.87);
  }
  .v-select-list[data-v-6472e3c8] {
    border-radius: 17px;
    box-shadow: 0 2px 19px rgba(0,0,0,0.29);
  }
  .manual-btn-box{
    width: 132px;
    height: 60px;
    position: relative;
  }
  .manual-btn__icon{
    width: 37px;
    height: 37px;
    border-radius: 14px;
    background-color: #543b88;
    margin-right: 70px;
    margin-bottom: 23px;
    position: absolute;
    padding: 9px 11px 12px 10px;
    img{
      width: 16px;
      height: 16px;
    }
  }
  .manual-btn{
    width: 115px;
    height: 47px;
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
    height: 60px;
    position: relative;
    margin-left: 15px;
  }
  .instruction-btn__icon{
    width: 37px;
    height: 37px;
    border-radius: 14px;
    background-color: #543b88;
    margin-right: 147px;
    margin-bottom: 23px;
    position: absolute;
    padding: 10px 11px 11px 10px;
    img{
      width: 18px;
      height: 18px;
    }
  }
  .instruction-btn{
    width: 180px;
    height: 47px;
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
    height: 167px;
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
    height: 56px;
    font-weight: 600;
    line-height: 21px;
    opacity: 0.5;
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
    width: 1057px;
    height: 536px;
    margin: 0 auto;
    margin-bottom: 30px;
    // background-color: grey;
    // position: relative;
  }
  .number-tokens{
    width: 339px;
    height: 536px;
    border-radius: 14px;
    background-color: #3b2665;;
    margin-right: 16px;
    padding: 20px;
    // position: absolute;
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
    // @media screen and (min-width: 1948px) {
    //   width: (339px + 339px);
    //   height: (536px - 200px);
    // }
  }
  .number-tokens-block{
    width: 295px;
    height: 70px;
    margin-bottom: 10px;
    margin-top: 20px;
    // background-color: #fff;
    position: relative;
  }
  .number-tokens-label{
    width: 100%;
    font-weight: 600;
    line-height: 21px;
    opacity: 0.5;
    position: absolute;
  }
  .input-slider-text{
    margin-left: 12px;
    width: 270px;
    height: 2px;
    position: absolute;
    bottom: 28px;
  }
  .input-slider{
    width: 295px;
    height: 60px;
    margin: 0 auto;
  }
  .slider-block{
    width: 295px;
    height: 68px;
    p{
      margin-bottom: 30px;
    }
    margin-bottom: 15px;
    position: relative;
  }
  .discount-slider-label{
    width: 60px;
    height: 21px;
    color: #af89ff;
    font-family: "Open Sans Semi Bold";
    font-size: 14px;
    font-weight: 600;
    line-height: 21px;
    position: absolute;
    margin-top: 0;
    margin-left: 225px;
    input{
      text-align: right;
    }
  }
  .number-tokens-slider{
    width: 295px;
    height: 2px;
    margin-top: 28px;
    margin-right: 2px;
    margin-left: 2px;
    position: absolute;
  }
  .validity-block{
    width: 295px;
    height: 82px;
  }
  .input-validity{
    width: 295px;
    height: 56px;
    position: relative;
    p{
      margin-bottom: 10px;
    }
  }
  // .validity-first{
  //   width: 130px;
  //   border-radius: 14px;
  //   opacity: 0.5;
  //   font-weight: 600;
  //   line-height: 21px;
  //   margin-right: 140px;
  //   position: absolute;
  // }
  // .validity-last{
  //   width: 130px;
  //   border-radius: 14px;
  //   opacity: 0.5;
  //   font-weight: 600;
  //   line-height: 21px;
  //   margin-left: 140px;
  //   position: absolute;
  // }

  // Second block (chose tokens)
    
  .chose-tokens{
    width: 702px;
    height: 536px;
    border-radius: 14px;
    background-color: #3b2665;
    padding: 20px 20px 25px 20px;
    // @media screen and (min-width: 1548px) {
    //   width: (677px + 100px);
    // }
    // @media screen and (max-width: 2048px){
    //   width: (60% + 18%);
    // }
  }
  .select-tokens-inside{
    width: 660px;
    height: 61px;
    padding-right: 14px;
    padding-left: 14px;
    padding: 0;
    margin-bottom: 15px;
    font-weight: 600;
    line-height: 21px;
    // background-color: #fff;
  }
  .select-first-token{
    width: 312px;
    height: 60px;
  }
  .select-last-token{
    width: 312px;
    height: 60px;
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
    margin: 5px 100px 20px 5px;
  }
  .chose-tokens-scroll{
    border-radius: 17px;
    background-color: #4d3779;
    padding: 11px 10px 61px 20px;
    margin: 0 auto;
    width: 660px;
    height: 267px;
  }
  .chose-tokens-chechbox{
    width: 630px;
    height: 181px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .chose-tokens-chechbox::-webkit-scrollbar {
    margin-top: 15px;
    width: 3px;
    border-radius: 3px;
  }
  .chose-tokens-chechbox::-webkit-scrollbar-track {
    background-color: #4d3779;
    margin-top: 10px;
  }
  .chose-tokens-chechbox::-webkit-scrollbar-thumb {
    width: 2px;
    height: 47px;
    border-radius: 3px;
    background-color: #2e0e52;
  }
  .scrollbar, .scrollbar-viewport, .scrollbar-systemscrolls, .scrollbar-contentwrap, .scrollbar-content {
      bottom: 0px;
      height: 47px;
      left: 0px;
      position: absolute;
      right: 0px;
      top: 0px;
      width: auto;
  }
  .checkbox-item{
    font-weight: 600;
    line-height: 21px;
    height: 12px;
    width: 116px;
    // margin-right: 65px;
    // text-align: left;
    // align-items: flex-start;
  }
  // -----------------------------------------------
  // Confirm layout, Deploy button & Info layout
  // -----------------------------------------------
  .confirm-layout{
    width: 100%;
    height: 94px;
    border-radius: 8px;
    border: 1px solid #4d3779;
    margin: 0 auto;
    margin-bottom: 20px; //40px
    position: relative;
    img{
      width: 30px;
      height: 30px;
      border-radius: 8px;
      background-color: #3b2665;
      // margin: 32px 32px 33px 955px;
      position: absolute;
      cursor: pointer;
      margin: 32px 32px 33px 95%;
    }
    p{
      width: 774px;
      height: 65px;
      opacity: 0.5;
      font-size: 12px;
      line-height: 21px;
      margin: 15px 144px 14px 15px;
      position: absolute;
    }
  }
  .deploy-btn-layout{
    width: 420px;
    height: 50px;
    margin: 0 auto;
    margin-bottom: 13px;
  }
  .deploy-btn{
    border-radius: 28px;
    background-image: linear-gradient(270deg, #8e6ee4 0%, #d268bc 100%);
    color: #ffffff;
    font-family: "Open Sans Semi Bold";
    font-size: 16px;
    font-weight: 600;
    line-height: 21px;
    text-transform: none;
  }
  .info-layout p{
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
