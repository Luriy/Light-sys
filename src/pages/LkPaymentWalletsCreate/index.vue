<template>
  <lk-layout>
    <div>
      <button class="add-token" id="show-modal" @click="showModal = true">
      Add token
      </button>
      <div v-if="showModal" @close="showModal = false">
        <transition name="modal">
         <div class="modal-mask">
    			<div class="modal-wrapper">
    				<div class="modal-close">
    					<button class="modal-default-button" @click="showModal = false">
    						<div class="close"><img src="@/assets/images/path.svg" alt title /></div>
    					</button>
    				</div>
    				<div class="modal-container">
    					<p>Add Ethereum token</p>
    					<div class="add-token__width">
    						<span
    							>To add ane ERC-20 token to your wallet paste tokent contract address in a form
    							below</span
    						>
    					</div>
    					<div class="TokenType__inputs">
    						<div class="TokenType">
    							<div class="TokenType__row" @click="showOptions = !showOptions">
    								<span>{{ TokenType }}</span>
    								<button
    									class="buttonTokenType"
    									
    									:class="{ buttonTokenType__active: showOptions }"
    								>
    									<img src="@/assets/images/Triangle@3x.png" alt title />
    								</button>
    							</div>
    							<div v-show="showOptions" class="TokenType__options">
    								<div @click="ChangeShowOptions((name = 'ERC E20'))">ERC E20</div>
    								<div @click="ChangeShowOptions((name = 'ERC 223'))">ERC 223</div>
    							</div>
    						</div>
    						<input v-model="ContractAddress" placeholder="Contract address" />
    						<input v-model="FullName" placeholder="Full name" />
    						<input v-model="Ticket" placeholder="Ticket" />
    						<input v-model="Decimals" placeholder="Decimals" />
    					</div>
    					<button class="buttonAddToken">
    						Add token
    					</button>
    				</div>
    			</div>
    		  </div>
        </transition>
      </div>
      <div class="crypto-wallets">
        <div class="title">
          <p>Create wallet</p>
          <back-to-previous-page-button :link="'/wallets'"></back-to-previous-page-button>
        </div>
        <div class="crypto-wallets_table" cellspacing="0" cellpadding="0">
          <div class="thead">
            <div class="th">Asset name</div>
            <div class="th">Price</div>
            <div class="th">24H Change</div>
            <div class="th">30 Day Trend</div>
          </div>
          <div class="tbody">
            <div class="row" v-for="type in types" :key="type.code" @click="addWallet(type.code, type.isAvailable)">
              <div v-if="!type.isAvailable" class="unavailable-block flex justify-content-center align-items-center">
                <p class="unavailable-text">Temporarily unavailable</p>
              </div>
              <div class="row__item">
                <div class="currency">
                  <div class="icon flex align-items-center">
                    <img v-if="type.codeMarkup === 'btc'" src="@/assets/images/btc.png" alt title>
                    <img v-if="type.codeMarkup === 'eth'" src="@/assets/images/eth.png" alt title>
                    <img v-if="type.codeMarkup === 'ltc'" src="@/assets/images/ltc.svg" alt title>
                  </div>
                  <div :class="['text', type.codeMarkup]">
                    <p>{{ type.name }}</p>
                    <span>{{ type.code }}</span>
                  </div>
                </div>
              </div>
              <td class="row__item">{{ formatCurrency(type.price, '$') }}</td>
              <td class="row__item">{{ type.change24h | changePercent }}</td>
              <td class="row__item">
                <div class="flex align-items-flex-end">
                  <div class="progress">
                    <img src="@/assets/images/graph-yellow.svg" width="100%" height="100%" alt title>
                  </div>
                  <div class="progress-bar"></div>
                </div>
              </td>
            </div>
          </div>
        </div>
        <lk-create-wallet-success-popup
          :successPopup="successPopup"
          @onClose="handleCloseSuccessPopup"
        ></lk-create-wallet-success-popup>
      </div>
    </div>
  </lk-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import LkLayout from '@/layout/LkLayout';
import LkCreateWalletSuccessPopup from '@/components/Popups/CreateWalletSuccess';
import getCryptoInfo from '@/functions/getCryptoInfo';
import BackToPreviousPageButton from '@/elements/BackToPreviousPageButton';
import './styles.scss';

export default {
  name: 'LkPaymentWalletsCreate',
  components: {
    LkLayout,
    LkCreateWalletSuccessPopup,
    BackToPreviousPageButton,
  },
  data() {
    return {
      showOptions: false,
      showModal: false,
      TokenType:"Token type",
      ContractAddress:"",
      FullName:"",
      Ticket:"",
      Decimals:"",
      successPopup: {
        isOpened: false,
        currency: null,
        fullCurrency: null,
      },
    }
  },
  
  computed: {
    ...mapGetters({
      types: 'wallet/TYPES',
      wallets: 'wallet/WALLETS',
      groupWallets: 'group/GROUP_WALLETS',
    })
  },
  filters: {
    changePercent: value => `${(value > 0 ? '+' : '') + value.toFixed(2).toString()}%`,
  },
  created() {
    this.$store.dispatch('wallet/GET_TYPES');
  },
  methods: {
    ChangeShowOptions(option) {
      this.TokenType = option;
      this.showOptions = false;
    },
    handleOpenSuccessPopup(currency) {
      const timeoutId = setTimeout(() => this.handleCloseSuccessPopup(), 3000);
      this.successPopup = {
        isOpened: true,
        currency: currency,
        fullCurrency: getCryptoInfo(currency).fullName,
        timeoutId,
      }
    },
    handleCloseSuccessPopup() {
      this.successPopup = {
        isOpened: false,
        currency: null,
        fullCurrency: null,
        timeoutId: null,
      }
      this.$router.push('/wallets');
    },
    addWallet(code, isAvailable) {
      if (isAvailable) {
         this.$store.dispatch('wallet/CREATE_WALLET', code)
        .then((data) => {
          if (!data.error) {
            this.$store.commit('group/SET_GROUP_WALLETS', this.groupWallets.map(group => {
              if (group.groupName === 'Other wallets') {
                return {
                  ...group,
                  wallets: [
        						...group.wallets,
        						{
        							address: data[`${code}wallet`],
        							balance: 0,
        							balanceUSD: 0,
        							currency: code,
        							status: 'Active',
        							isAvailable: true,
        						},
        					]
                }
              } else return group;
            }))                                                   
            this.handleOpenSuccessPopup(code);
          }
        })
        .catch(reason => {
          console.log(reason)
        })
      }
    }
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
                    display: flex;
                    justify-content: center;
                    align-items: center;

                      img{
                        display: flex;
                          text-align: center;
                          justify-content:center;
                          align-items: center;
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
