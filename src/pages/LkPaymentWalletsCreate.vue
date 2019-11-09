<template>
  <lk-layout>
    <button class="add-token" id="show-modal" @click="showModal = true">
      Add token
    </button>
    <modal v-if="showModal" @close="showModal = false">
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-close">
              <button class="modal-default-button" @click="showModal = false">
                <div class="close"><img src="@/assets/images/path.svg" alt title></div>
              </button>
              </div>
              <div class="modal-container">
                <p>Add Ethereum token</p>
                <div class="add-token__width">
                  <span>To add ane ERC-20 token to your wallet paste tokent contract address in a form below</span>
                </div>
                <div>
                <div class="TokenType__inputs">
                <div class="TokenType">
                <div class="TokenType__row">
                  <span>{{TokenType}}</span>
                  <button class="buttonTokenType" @click="showOptions = !showOptions" :class="{ buttonTokenType__active: showOptions }"><img src="@/assets/images/Triangle@3x.png" alt title></button>
                </div>
                <div v-show="showOptions" class="TokenType__options">
                  <div @click="ChangeShowOptions(name='ERC E20')">ERC E20</div>
                  <div @click="ChangeShowOptions(name='ERC 223')">ERC 223</div>
                </div>
              </div>
              <input v-model="ContractAddress" placeholder="Contract address"></input>
              <input v-model="FullName" placeholder="Full name"></input>
              <input v-model="Ticket" placeholder="Ticket"></input>
              <input v-model="Decimals" placeholder="Decimals"></input></div>
              <button class="buttonAddToken">
                 Add token
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
  </modal>
    <div class="crypto-wallets">
      <div class="title">
        <p>Create wallet</p>
        <router-link to="/wallets"><div class="close"><img src="@/assets/images/path.svg" alt title></div></router-link>
      </div>
      <table class="crypto-wallets_table" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th>Asset name</th>
            <th>Price</th>
            <th>24H Change</th>
            <th>30 Day Trend</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="type in types" :key="type.code" @click="addWallet(type.code)">
            <td>
              <div class="currency">
                <div class="icon">
                  <img v-if="type.codeMarkup === 'btc'" src="@/assets/images/btc.png" alt title>
                  <img v-if="type.codeMarkup === 'eth'" src="@/assets/images/eth.png" alt title>
                  <img v-if="type.codeMarkup === 'ltc'" src="@/assets/images/ltc.svg" alt title>
                </div>
                <div :class="['text', type.codeMarkup]">
                  <p>{{ type.name }}</p>
                  <span>{{ type.code }}</span>
                </div>
              </div>
            </td>
            <td>{{ formatCurrency(type.price, '$') }}</td>
            <td>{{ type.change24h | changePercent }}</td>
            <td><div class="progress"><img src="@/assets/images/graph-yellow.svg" alt title></div></td>
          </tr>
        </tbody>
      </table>
    </div>
  </lk-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import Axios from 'axios';
import LkLayout from '@/layout/LkLayout';
import { getAuthParams } from '@/functions/auth';

export default {
  name: 'LkPaymentWalletsCreate',
    data() {
      return {
        showOptions: false,
        showModal: false,
        TokenType:"Token type",
        ContractAddress:"",
        FullName:"",
        Ticket:"",
        Decimals:"",
      }
    },
  computed: {
    ...mapGetters({
      pageDetail: 'wallet/PAGE_DETAIL',
    })
  },
  filters: {
    changePercent: value => `${value.toFixed(2)}%`,
  },
  mounted() {
    this.$store.dispatch('wallet/GET_TYPES');
  },
  methods: {
    ChangeShowOptions(option){
        this.TokenType = option;
        this.showOptions = false;
      },
    addWallet(code) {
      this.$store.dispatch('wallet/CREATE_WALLET', code)
        .then((resp) => {
            console.log(resp)
            alert('Кошелек успешно добавлен!')
            this.$router.push('/wallets')
          })
        .then(async () => await this.$store.dispatch('wallet/GET_WALLETS'))
        .catch(reason => {
          console.log(reason)
        })
    }
  },
  components: {
    LkLayout
  },
}
</script>
<style lang="scss">
.add-token {
  position:fixed;  
  width: 160px;
  height: 50px;
  border-top-left-radius: 14px;  
  border-top-right-radius: 14px;  
  font-size: 14px;
  font-weight: 600;
  color: rgba(255,255,255,.5);
  border:none;
  background-color: #4d3779;
  left: 0;
  right: 0;
  margin:auto;
  transform: translateX(157px);
  bottom:0;
}
.modal-mask {
    position: fixed;  
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(38, 8, 72, .73);
    display: table;
    transition: opacity .3s ease;
    display: flex;
    text-align: center;
    justify-content:center;
    align-items: center;

      .modal-wrapper{
        position: relative;

          .modal-container{
            min-width: 390px;
            width: 29vw;
            min-height: 533px;    
            height: 69vh;
            border-radius: 8px;
            background-color: #654d95;

              p{
                padding-top: 4.7vh;
                color: #ffffff;
                font-size: 1rem;
                font-weight: 600;
                line-height: 21px;
                padding-bottom: 1vh;
                }

              .add-token__width{
                width: 21.5vw;
                min-width: 307px;
                margin: auto;
                padding-bottom: 2.3vh;

                  span{
                    text-align: center;
                    opacity: 0.5;
                    color: #ffffff;
                    font-size: 0.875rem;
                    line-height: 1.5vh;
                  }
              }

              .TokenType__inputs{
                display: flex;
                flex-direction:column;
                  justify-content:center;
                  align-items: center;

                  .TokenType__row{
                    width: 25.6vw;
                    min-width: 350px;
                    height: 7.2vh;
                    min-height: 56px;
                    border-radius: 14px;
                    background-color: rgb(59,38,102);
                    border:none;
                    margin-bottom: 1.3vh;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;

                  span{
                    padding-left: 1.2vw;
                    opacity: 0.5;
                    color: #ffffff;
                    font-size: 0.875rem;
                    font-weight: 600;
                    }

                  .buttonTokenType__active{

                    img{
                      display: flex;
                        text-align: center;
                        justify-content:center;
                        align-items: center;
                        margin-left: 1px;
                      -moz-transition: all .3s ease-in-out;
                        -o-transition: all .3s ease-in-out;
                        -webkit-transition: all .3s ease-in-out;
                        transition: all .3s ease-in-out;
                      transform: rotate(-180deg);
                      }
                  }

                  .buttonTokenType{
                    width: 20px;
                    border: none;
                    margin-right: 1.2vw;
                    height: 20px;
                    border-radius: 9px;
                    background-color: #65489d;

                      img{
                        display: flex;
                          text-align: center;
                          justify-content:center;
                          align-items: center;
                          padding-left: 1px;
                        width: 6px;
                        height: 4px;
                      }

                  }


                }
                .TokenType__options{
                  padding-top: 2.2vh;
                  box-shadow: 0 2px 19px rgba(0, 0, 0, 0.29);
                  border-radius: 17px;
                  background-color: #3b2665;
                  position: absolute;
                  z-index: 10000;
                  width: 25.6vw;
                  display: flex;
                  flex-direction:column;
                    justify-content:center;
                  min-width: 350px;
                  padding-bottom: 2.2vh;

                    div{
                      display: flex;
                      flex-direction:column;
                        justify-content:center;
                      text-align: left;
                      color: #ffffff;
                      font-size: 0.875rem;
                      font-weight: 600;
                      line-height: 21px;
                      text-transform: uppercase;
                      height: 4.2vh;
                      padding-left: 1.2vw;
                      width: 25.6vw !important;

                        &:hover{
                          background-color: #4c3677;
                          width: 100% !important;
                          cursor: pointer;
                          }
                    }

                }

              input{
                width: 25.6vw;
                min-width: 350px;
                height: 7.2vh;
                min-height: 56px;
                border-radius: 14px;
                background-color: rgb(59,38,102);
                border:none;
                margin-bottom: 1.3vh;
                padding-left: 1.2vw;
                color: #ffffff;

                  &::placeholder{
                    color: #ffffff;
                    font-size: 0.875rem;
                    font-weight: 600;
                    opacity: 0.5 !important;
                  }
            }
}
              
              .buttonAddToken{
                margin-top: 2.8vh;
                width: 25.6vw;
                min-width: 350px;
                height: 6.5vh;
                min-height: 50px;
                border-radius: 28px;
                background-image: linear-gradient(270deg, #8e6ee4 0%, #d268bc 100%);
                border:none;
                color: #ffffff;
                font-size: 1rem;
                font-weight: 600;
                background-size: 100% 100%;

                  &:hover {
                    background-size: 400% 700%;
                    opacity: .9;
                    background-image: linear-gradient(270deg, #d268bc 0%, #8e6ee4 100%);
                    -moz-transition: all .9s ease-out;
                    -o-transition: all .9s ease-out;
                    -webkit-transition: all .9s ease-out;
                    transition: all .9s ease-out;
                    }
              }
          }

            .modal-default-button{
              width: 36px;
              height: 36px;
              border: none;
              border-radius: 8px;
              float: right;
              margin-right: -66px;
              display: flex;
                text-align: center;
              background-color: #654d95;

                .close{
                  margin-top: -2px;
                  display: flex;
                    justify-content:center;
                    align-items: center;
                  width: 36px;
                  height: 36px;
                  background-color: #654d95;
                  }
              }
          }
      
      }
@media (min-height: 1366px){
  .modal-wrapper{
        position: relative;

          .modal-container{ 
            height: 942px !important;

              p{
                padding-top: 65px !important;
                padding-bottom: 13.66px !important;
                }

              .add-token__width{
                padding-bottom: 31px !important;


                  span{
                    line-height: 20.29px !important;
                  }
                }

                  .TokenType__row{
                    height: 98.3px !important;
                    margin-bottom: 17.76px !important;
  

                  .buttonTokenType{
                    height: 20px !important;

                }
                .TokenType__options{
                  padding-top: 30px !important;
                  padding-bottom: 30px !important;

                    div{
                      height: 57px !important;
                    }

                }

              }

              input{

                height: 98.3px !important;
                margin-bottom: 17.7px !important;
                }

              .buttonTokenType{
                margin-top: 38.2px !important;
                }

              .buttonAddToken{
                margin-top: 38.2px !important;
                height: 88px !important;
  
              }
          }
      }

}

</style>
