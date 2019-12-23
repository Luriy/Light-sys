<template>
  <lk-layout>
    <v-card
      color="#3b2665"
      :loading="isLoading"
    >
      <div class="exchange-block">
        <div class="exchange-index">
          <div class="exchange-block_currency">
            <div class="arrows" @click="toggleCurrency()" v-bind:class="{active: dir}">
              <img src="@/assets/images/exchange-arrs.svg" alt title>
            </div>
            <div class="left">
              <div class="title">Exchange</div>
              <div class="select">
                <div @click="exchangeAction" class="select-title">
                  <div class="icon" :style="[!exchangeCurrency.isWallet ? {display: 'flex', alignSelf: 'center'} : '']">
                    <img :src="exchangeCurrency.icon" alt title>
                  </div>
                  <div class="amount">
                    <div class="code" :class="exchangeCurrency.code">{{exchangeCurrency.fullName}}</div>
                    <div class="value">
                    <span>
                      {{exchangeCurrency.isWallet ?
                      exchangeCurrency.balance :
                      `****${exchangeCurrency.number.substr(exchangeCurrency.number.length - 4)}`
                      }}
                      {{exchangeCurrency.currency}}
                    </span>
                      <span class="currency-divider">&#124;</span>
                      <span class="balance-reserve">
                      {{exchangeCurrency.isWallet ?
                      `$${exchangeCurrency.balanceUSD} USD` :
                      `Reserve: ${exchangeCurrency.reserve}`}}
                    </span>
                    </div>
                  </div>
                  <div class="toggle"></div>
                </div>

                <div class="select-body" v-if="exchangeModal">
                  <div class="select-wrapper">
                    <div class="search-input">
                      <input type="text" v-model="search" name="" placeholder="Search">
                      <span></span>
                    </div>
                    <div class="filter-buttons">
                      <v-btn class="filter-btn"
                             :class="{'active-list': currentExchangeList === 'all'}"
                             text
                             small
                             @click="currentExchangeList = 'all'"
                      >All</v-btn>

                      <v-btn
                        class="filter-btn"
                        :class="{'active-list': currentExchangeList === 'wallets'}"
                        text
                        small
                        @click="currentExchangeList = 'wallets'"
                      >My wallets</v-btn>

                      <v-btn
                        v-if="!receiveCurrency.holder"
                        class="filter-btn"
                        :class="{'active-list': currentExchangeList === 'cards'}"
                        text
                        small
                        @click="currentExchangeList = 'cards'"
                      >My cards</v-btn>

                      <v-btn
                        class="filter-btn"
                        :class="{'active-list': currentExchangeList === 'banks'}"
                        text
                        small
                        @click="currentExchangeList = 'banks'"
                      >Banks</v-btn>
                    </div>

                    <div class="select-item-wallet" v-if="currentExchangeList === 'wallets' || currentExchangeList === 'all'">
                      <div class="title-wrapper">
                        <span class="select-header">my wallets</span>
                        <span class="select-line"></span>
                      </div>
                      <div
                        class="select-item"
                        v-for="(wallet, index) of filteredExchangeWallets.filter(({isWallet}) => (isWallet))"
                        :key="`wallet-${index}`"
                        @click="!wallet.statusNode ? selectExchangeWallet(wallet) : ''"
                      >
                        <div class="select-item-disabled" v-if="wallet.statusNode">Temporarily unavailable</div>
                        <div class="icon"><img :src="wallet.icon" alt></div>
                        <div class="amount">
                          <div class="code btc">{{wallet.fullName}}</div>
                          <div class="value">
                        <span>
                          {{wallet.isWallet ? wallet.balance : `****${wallet.number.substr(wallet.number.length - 4)}`}}
                          {{wallet.currency}}
                        </span>
                            <span class="currency-divider">&#124;</span>
                            <span
                              class="balance-reserve"
                              :style="[wallet.isWallet ? {display: 'inline-block'} : '']"
                            >{{wallet.isWallet ? `$${wallet.balanceUSD}` : `Reserve: ${wallet.reserve}`}}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="select-item-fiat" v-if="!receiveCurrency.holder && currentExchangeList === 'cards' || currentExchangeList === 'all'">
                      <div class="title-wrapper" v-if="!receiveCurrency.holder">
                        <span class="select-header">my cards</span>
                        <span class="select-line"></span>
                      </div>
                      <div
                        class="select-item"
                        v-for="(wallet, index) of filteredExchangeWallets.filter(({isWallet}) => (!isWallet))"
                        :key="`fiat-${index}`"
                        @click="!wallet.statusNode ? selectExchangeWallet(wallet) : ''"
                      >
                        <div class="select-item-disabled" v-if="wallet.statusNode">Temporarily unavailable</div>
                        <div class="icon"><img :src="wallet.icon" alt></div>
                        <div class="amount">
                          <div class="code btc">{{wallet.fullName}}</div>
                          <div class="value">
                        <span>
                          {{wallet.isWallet ? wallet.balance : `****${wallet.number.substr(wallet.number.length - 4)}`}}
                          {{wallet.currency}}
                        </span>
                            <span class="currency-divider">&#124;</span>
                            <span class="balance-reserve">{{wallet.isWallet ? `$${wallet.balanceUSD}` : `Reserve: ${wallet.reserve}`}}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="select-item-fiat" v-if="currentExchangeList === 'banks' || currentExchangeList === 'all'">
                      <div class="title-wrapper">
                        <span class="select-header">banks</span>
                        <span class="select-line"></span>
                      </div>
                        <router-link
                          tag="div"
                          class="select-item"
                          to="/wallets/accounts-and-cards"
                          v-for="(wallet, index) of fiatData"
                          :key="`fiat-${index}`"
                        >
                          <div class="icon"><img :src="wallet.icon" alt></div>
                          <div class="amount">
                            <div class="code btc">{{wallet.name}}</div>
                            <div class="value">
                              <span class="balance-reserve">{{wallet.isWallet ? `$${wallet.balanceUSD}` : `Reserve: ${wallet.reserve}`}}</span>
                            </div>
                          </div>
                        </router-link>
                    </div>
                  </div>
                </div>
              </div>

              <div class="trans-size">
                <button :class="{active: exchangeBtn == 1}" @click="selectAll">{{exchangeCurrency.isWallet ? 'ALL' : 'MAX'}}</button>
                <button :class="{active: exchangeBtn == 2}" @click="selectHalf">HALF</button>
                <button :class="{active: exchangeBtn == 3}" @click="selectMin">MIN</button>
              </div>

              <div class="exchange-amount">
                <v-form
                  ref="exchangeForm"
                  :lazy-validation="true"
                >
                  <div class="exchange-amount_input" :class="exchangeCurrency.currency.toLowerCase()">
                    <v-text-field
                      v-model="exchangeAmount"
                      :hide-details="true"
                      :rules="exchangeAmountRules"
                      :color="exchangeCurrency.isWallet ? exchangeCurrency.color : '#fff'"
                      @input="exchangeChange"
                    ></v-text-field>
                    <span>{{exchangeCurrency.currency}}</span>
                  </div>
                  <div class="exchange-amount_input">
                    <v-text-field
                      v-model.lazy="exchangeUSD"
                      class="dollars_input"
                      @input="exchangeUSDChange"
                      color="#fff"
                      solo
                      prepend-inner-icon="$"
                    ></v-text-field>
                    <span>USD</span>
                  </div>
                </v-form>
              </div>
            </div>
            <div class="right">
              <div class="title">Receive</div>
              <div class="select">
                <div @click="receiveAction" class="select-title">
                  <div class="icon"
                       :style="[!receiveCurrency.isWallet ? {display:'flex', alignSelf:'center'} : '']">
                    <img :src="receiveCurrency.icon" alt title>
                  </div>
                  <div class="amount">
                    <div class="code" :class="receiveCurrency.code">{{receiveCurrency.fullName}}</div>
                    <div class="value">
                      <span>1 {{exchangeCurrency.currency}} =</span>
                      <span>
                        <!--todo не работает рест transferInfo заменить в будущем-->
                      {{exchangeCurrency.isWallet && receiveCurrency.isWallet ? (transferInfo.rate ? transferInfo.rate : '0') : fiatInfo.out}}
                      {{receiveCurrency.currency}}
                    </span>
                    </div>
                  </div>
                  <div class="toggle"></div>
                </div>

                <div class="select-body" v-if="receiveModal">
                  <div class="select-wrapper">
                    <div class="search-input">
                      <input type="" name="" v-model="search" placeholder="Search">
                      <span></span>
                    </div>
                    <div class="filter-buttons">
                      <v-btn
                        class="filter-btn"
                        :class="{'active-list': currentReceiveList === 'all'}"
                        text
                        small
                        @click="currentReceiveList = 'all'"
                      >All
                      </v-btn>

                      <v-btn
                        class="filter-btn"
                        :class="{'active-list': currentReceiveList === 'wallets'}"
                        text
                        small
                        @click="currentReceiveList = 'wallets'"
                      >My wallets</v-btn>

                      <v-btn
                        v-if="!exchangeCurrency.holder"
                        class="filter-btn"
                        :class="{'active-list': currentReceiveList === 'cards'}"
                        text
                        small
                        @click="currentReceiveList = 'cards'"
                      >My cards</v-btn>

                      <v-btn
                        class="filter-btn"
                        :class="{'active-list': currentReceiveList === 'banks'}"
                        text
                        small
                        @click="currentReceiveList = 'banks'"
                      >Banks</v-btn>
                    </div>
                    <div class="select-item-wallet" v-if="currentReceiveList === 'wallets' || currentReceiveList === 'all'">
                      <div class="title-wrapper">
                        <span class="select-header">my wallets</span>
                        <span class="select-line"></span>
                      </div>
                      <div
                        class="select-item"
                        v-for="(wallet, index) of filteredReceiveWallets.filter(({isWallet}) => (isWallet))"
                        :key="`wallet-${index}`"
                        @click="!wallet.statusNode && !wallet.directionStatus ? selectReceiveWallet(wallet) : ''"
                      >
                        <div class="select-item-disabled" v-if="wallet.statusNode">Temporarily unavailable</div>
                        <div class="select-item-disabled" v-if="wallet.directionStatus">Direction unavailable</div>
                        <div class="icon"><img :src="wallet.icon" alt title></div>
                        <div class="amount">
                          <div class="code btc">{{wallet.fullName}}</div>
                          <div class="value">
                        <span>
                          {{wallet.isWallet ? wallet.balance : `****${wallet.number.substr(wallet.number.length - 4)}`}}
                          {{wallet.currency}}
                        </span>
                            <span class="currency-divider">&#124;</span>
                            <span
                              class="balance-reserve"
                              :style="[wallet.isWallet ? {display: 'inline-block'} : '']"
                            >{{wallet.isWallet ? `$${wallet.balanceUSD}` : `Reserve: ${wallet.reserve}`}}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="select-item-wallet" v-if="!exchangeCurrency.holder && currentReceiveList === 'cards' || currentReceiveList === 'all'">
                      <div class="title-wrapper" v-if="!exchangeCurrency.holder">
                        <span class="select-header">my cards</span>
                        <span class="select-line"></span>
                      </div>
                      <div
                        class="select-item"
                        v-for="(wallet, index) of filteredReceiveWallets.filter(({isWallet}) => (!isWallet))"
                        :key="`wallet-${index}`"
                        @click="!wallet.statusNode ? selectReceiveWallet(wallet) : ''"
                      >
                        <div class="select-item-disabled" v-if="wallet.statusNode">Temporarily unavailable</div>
                        <div class="icon"><img :src="wallet.icon" alt title></div>
                        <div class="amount">
                          <div class="code btc">{{wallet.fullName}}</div>
                          <div class="value">
                        <span>
                          {{wallet.isWallet ? wallet.balance : `****${wallet.number.substr(wallet.number.length - 4)}`}}
                          {{wallet.currency}}
                        </span>
                            <span class="currency-divider">&#124;</span>
                            <span class="balance-reserve">{{wallet.isWallet ? `$${wallet.balanceUSD}` : `Reserve: ${wallet.reserve}`}}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="select-item-fiat" v-if="currentReceiveList === 'banks' || currentReceiveList === 'all'">
                      <div class="title-wrapper">
                        <span class="select-header">banks</span>
                        <span class="select-line"></span>
                      </div>
                        <router-link
                          tag="div"
                          :to="!wallet.directionStatus ? '/wallets/accounts-and-cards' : '/exchange'"
                          class="select-item"
                          v-for="(wallet, index) of fiatData"
                          :key="`fiat-${index}`"
                        >
                          <div class="select-item-disabled" v-if="wallet.directionStatus">Direction unavailable</div>
                          <div class="icon"><img :src="wallet.icon" alt></div>
                          <div class="amount">
                            <div class="code btc">{{wallet.name}}</div>
                            <div class="value">
                              <span class="balance-reserve">{{wallet.isWallet ? `$${wallet.balanceUSD}` : `Reserve: ${wallet.reserve}`}}</span>
                            </div>
                          </div>
                        </router-link>
                    </div>
                  </div>
                </div>
              </div>

              <div class="exchange-amount">
                <div class="exchange-amount_input" :class="receiveCurrency.currency.toLowerCase()">
                  <v-text-field
                    v-model.lazy="receiveAmount"
                    :hide-details="true"
                    :rules="receiveAmountRules"
                    @input="receiveChange"
                    :color="receiveCurrency.isWallet ? receiveCurrency.color : '#fff'"
                  ></v-text-field>
                  <span>{{receiveCurrency.currency}}</span>
                </div>

                <div class="exchange-amount_input">
                  <v-text-field
                    v-model.lazy="receiveUSD"
                    @input="receiveUSDChange"
                    class="dollars_input"
                    color="#fff"
                    solo
                    prepend-inner-icon="$"
                  ></v-text-field>
                  <span>USD</span>
                </div>
              </div>
            </div>
          </div>
          <transition name="fade">
          <div class="error-block" v-if="showError">
            {{errorMsg}}
          </div>
          </transition>
          <div class="exchange-block_info">
            <div class="to">
              <img src="@/assets/images/right-arr-white.svg" alt title style="margin-top: 17px;">
            </div>
            <div class="left">
              <div class="exchange_title" style="">You are exchanging</div>
              <div class="currency" :class="exchangeCurrency.currency.toLowerCase()">
                <div class="icon">
                  <img :src="exchangeCurrency.icon" alt title>
                </div>
                <div class="text">
                  <p :style="[!exchangeCurrency.isWallet ? {color:'#fff'}:'']">{{exchangeAmount || '0.00'}} {{exchangeCurrency.currency}}</p>
                  <span >${{exchangeUSD && typeof exchangeUSD === 'number' ? exchangeUSD.toFixed(2) : exchangeUSD}} USD</span>
                </div>
              </div>
            </div>
            <div class="right">
              <div class="exchange_title" style="font-size: 12px">You will receive</div>
              <div class="currency" :class="receiveCurrency.currency.toLowerCase()">
                <div class="text">
                  <p :style="[!receiveCurrency.isWallet ? {color:'#fff'}:'']">
                    {{receiveAmount || '0.00'}}
                    {{receiveCurrency.currency}}
                  </p>
                  <span>${{receiveUSD && typeof receiveUSD === 'number' ? receiveUSD.toFixed(2) : receiveUSD}} USD</span>
                </div>
                <div class="icon">
                  <img :src="receiveCurrency.icon" alt title>
                </div>
              </div>
            </div>
          </div>

          <div class="exchange-block_button">
            <button @click="exchange">Exchange</button>
            <p class="currency_info">
              1
              <!--todo не работает рест transferInfo заменить в будущем-->
              {{exchangeCurrency.currency}} = {{exchangeCurrency.isWallet && receiveCurrency.isWallet ?
              (transferInfo.rate ? transferInfo.rate : '0') :
                fiatInfo.out
              }}
              {{receiveCurrency.currency}}</p>
          </div>

          <lk-pop-up
            v-if="exchangePopup"
            class="exchange-popup"
            @closeModal="closeModal"
            @repeatTransferRequest="repeatTransferRequest"
          >
            <div slot='title' class="exchange-popup_title">
              <img v-if="exchangeCurrency.isWallet" :src="exchangeCurrency.icon" alt title>
              <div v-else class="wrapper_exchange-fiat-icon">
                <img :src="exchangeCurrency.icon" alt title>
              </div>
              <p class="transaction">Confirmation <br> exchange
                {{
                  exchangeUSD && typeof exchangeUSD === 'number' ? `$${exchangeUSD.toFixed(2)}` : `$${exchangeUSD}`
                }} USD</p>
              <div class="phone-question" v-if="user.Phone">
                <p class="question">We sent an SMS conformation to the number</p>
                <div class="number-block">
                  <p class="number">{{formatPhoneNumber(user.Phone)}}</p>
                  <router-link class="link" to="/">Wrong number?</router-link>
                </div>
              </div>
              <div class="email-question" v-else>
                <p class="question">We sent an email confirmation to the email</p>
                <div class="number-block">
                  <p class="number">{{user.Email}}</p>
                  <router-link class="link" to="/">Wrong email?</router-link>
                </div>
              </div>
            </div>
            <div slot='smsNumber' class="exchange-popup_sms-number">
              <input
                class="number-input"
                v-for="(input, index) in smsCodes"
                :key="index"
                v-model="input[index]"
                @keyup="smsChange($event, index)"
                placeholder="_"
                type="text"
                maxLength="1"
                size="1" min="0" max="9" pattern="[0-9]{1}"
              />

              <div class="timer-body">
                <div class="title">Resend code:</div>
                <div class="timer" v-if="!isRepeat">00:{{countdown < 10 ? 0 : ''}}{{countdown}} Sec</div>
                <div class="repeat-btn" v-else @click="repeatTransferRequest">Repeat</div>
              </div>
            </div>
            <div slot='body' class="exchange-popup_body">
              <div class="exchange-popup_info">
                <p class="from" :style="{color: exchangeCurrency.color}">{{exchangeAmount}} {{exchangeCurrency.currency}}</p>
                <img src="@/assets/images/exchange-arrs.svg" alt title>
                <p class="to" :style="{color: receiveCurrency.color}">{{receiveAmount}} {{receiveCurrency.currency}}</p>
              </div>
              <div class="exchange-block_fee">
                <div class="network-fee" :style="!exchangeCurrency.isWallet ? {justifyContent: 'flex-end'} : ''">
                  <p class="network-fee__title" :style="!exchangeCurrency.isWallet ? {flexGrow: '1'} : ''">
                    <span>{{receiveCurrency.name}}</span>
                    Network Fee
                  </p>
                  <p class="btc-value" v-if="exchangeCurrency.isWallet && receiveCurrency.isWallet">
                    {{transferInfo.minerFee || 0}}
                    {{receiveCurrency.currency}}
                  </p>
                  <p v-if="exchangeCurrency.isWallet && receiveCurrency.isWallet">
                    ${{(transferInfo.minerFee * types[receiveCurrency.name].price).toFixed(2)}}
                  </p>
                </div>
                <div class="balance" :style="!exchangeCurrency.isWallet && !receiveCurrency.isWallet ? {justifyContent: 'flex-end'} : ''">
                  <p class="network-fee__title" :style="!exchangeCurrency.isWallet && !receiveCurrency.isWallet ? {flexGrow: '1'} : ''">
                    {{
                    exchangeCurrency.isWallet && receiveCurrency.isWallet ? 'Remaining balance' :
                    'Reserve'
                    }}
                   </p>
                  <p class="btc-value" style="margin-right: 37px" v-if="exchangeCurrency.isWallet && receiveCurrency.isWallet">
                    {{exchangeCurrency.balance}} {{exchangeCurrency.currency}}
                  </p>
                  <p>
                    {{
                      exchangeCurrency.isWallet && receiveCurrency.isWallet ?
                      `$${exchangeCurrency.balanceUSD}` : exchangeCurrency.reserve ||
                      receiveCurrency.reserve
                    }}
                  </p>
                </div>
              </div>
            </div>
            <div slot='buttons' class="exchange-popup_buttons">
              <button class="back" @click="closeExchangePopup">Back</button>
            </div>
          </lk-pop-up>

          <lk-pop-up
            v-if="exchangeSucces"
            class="exchange-popup"
            :popup-size="{width: '346px', height: '387px'}"
            @closeModal="closeModal"
          >
            <div slot='title' class="success-popup_title">
              <div class="icon-wrapper">
                <i class="icon checked-icon">Success icon</i>
              </div>
              <p class="status">Success</p>
            </div>
            <div slot='body' class="success-popup_body">
              <div class="images">
                <img :src="exchangeCurrency.icon" alt title>
                <img class="success_arrows" src="@/assets/images/exchange-arrs.svg" alt title>
                <img :src="receiveCurrency.icon" alt title>
              </div>
              <p class="to">{{receiveAmount}} {{receiveCurrency.currency}}</p>
              <div class="transaction-info">
                <div class="network-fee">
                  <p class="network-fee__title" :style="!exchangeCurrency.isWallet ? {flexGrow: '1'} : ''">
                    <span>{{exchangeCurrency.name}}</span>
                    Network Fee
                  </p>
                  <p class="btc-value" style="margin-left: 5px;">
                    {{exchangeCurrency.isWallet && receiveCurrency.isWallet ? ` ${transferInfo.minerFee}` : 0}} {{exchangeCurrency.currency}}
                  </p>
                  <p> ${{exchangeCurrency.isWallet ? (types[exchangeCurrency.name].price * transferInfo.minerFee).toFixed(3) : 0}}</p>
                </div>
                <div class="balance">
                  <p class="success_title">Remaining balance</p>
                  <p class="middle-text">
                    {{exchangeCurrency.balance}}
                    {{exchangeCurrency.currency}} </p>
                  <p v-if="exchangeCurrency.isWallet"> ${{exchangeCurrency.balanceUSD}} </p>
                </div>
              </div>
            </div>
          </lk-pop-up>

          <lk-pop-up
            v-if="false"
            class="exchange-popup fiat-popup"
            :popup-size="{width: '346px', height: '387px'}"
            @closeModal="closeModal"
          >
            <div slot='title' class="success-popup_title">
              <img
                v-if="exchangeCurrency.isWallet"
                :src="exchangeCurrency.icon"
                class="fiat-icon"
                alt
                title
              >
              <div v-else class="icon-wrapper">
                <img :src="exchangeCurrency.icon" alt title>
              </div>
              <p class="status">Exchange</p>
              <p class="exchange-ammount">{{exchangeAmount}} {{exchangeCurrency.currency}}</p>
            </div>

            <div slot='body' class="success-popup_body">
              <div class="images">
                <img v-if="exchangeCurrency.isWallet" class="exchange_wallet" :src="exchangeCurrency.icon" alt title>
                <div v-else class="image-exchange-wrapper">
                  <img style="align-self: center" :src="exchangeCurrency.icon" alt title>
                </div>
                <img class="success_arrows" src="@/assets/images/exchange-arrs.svg" alt title>
                <img class="receive_wallet" v-if="receiveCurrency.isWallet" :src="receiveCurrency.icon" alt title>
                <div v-else class="image-receive-wrapper">
                  <img style="align-self: center" :src="receiveCurrency.icon" alt title>
                </div>
              </div>
              <p class="to">{{receiveAmount}} {{receiveCurrency.currency}}</p>
              <div class="card-to-send-block">
                <p class="message">Make a transfer from your bank’s personal account, according to the details:</p>
                <p class="card-number">6729 2134 3421 1342</p>
              </div>
              <div class="transaction-info">
                <div class="network-fee">
                  <p class="success_title">Bitcoin Network Fee</p>
                  <p class="middle-text">0.00</p>
                  <p>$ 0.00</p>
                </div>
                <div class="balance">
                  <p class="success_title">Remaining {{exchangeCurrency.isWallet ? 'balance' : 'reserve'}}</p>
                  <p class="middle-text">
                    {{exchangeCurrency.currency}}
                  </p>
                  <p>{{exchangeCurrency.isWallet ? `$ ${exchangeCurrency.balanceUSD.toFixed(3)}` : exchangeCurrency.reserve}} </p>
                </div>
              </div>
            </div>
          </lk-pop-up>
        </div>
      </div>
    </v-card>
  </lk-layout>
</template>
<script>
  import formatPhoneNumber from '@/functions/formatPhoneNumber';
  import LkLayout from '@/layout/LkLayout'
  import LkPopUp from '@/layout/LkPopUp';
  import capitalizeFirstLetter from '@/functions/capitalizeFirstLetter';
  import currencyList from '@/settings/currensyList'
  import { getAuthParams } from '@/functions/auth';
  let exchangePrice = null;
  let receivePrice = null;
  export default {
    name: 'LkPaymentExchange',
    components: {
      LkLayout,
      LkPopUp,
    },
    data () {
      return {
        currentExchangeList: 'all',
        currentReceiveList: 'all',
        firstStart: true,
        receiveModal: false,
        exchangeModal: false,
        errorMsg: '',
        showError: false,
        isRepeat: '',
        countdown: 59,
        timer: null,
        search: '',
        smsCodes: [
          { 0: '' },
          { 1: '' },
          { 2: '' },
          { 3: '' },
          { 4: '' },
          { 5: '' },
        ],
        exchangePopup: false,
        exchangeBtn: 0,
        receiveBtn: 0,
        dir: 0,
        exchangeAmount: '0.00',
        receiveAmount: '0.00',
        exchangeUSD: '0.00',
        receiveUSD: '0.00',
        exchangeAmountRules: [
          value => {
            if (!+value) {
              this.errorMsg = ('Required');
              return 'Required'
            }
            this.showError = false;
            return false
          },
          value => {
            if (this.exchangeCurrency.isWallet) {
              if (this.exchangeCurrency.balance < value) {
                this.showError = true;
                this.errorMsg = ('Value of balance is not enough to make this transaction');
                return 'Value of balance is not enough to make this transaction'
              }
            }
            this.showError = false;
            return false
          },
          value => {
            if (this.exchangeCurrency.isWallet && this.receiveCurrency.isWallet) {
              if (value < this.transferInfo.minimum) {
                this.showError = true;
                this.errorMsg = (`Minimum value of transactions is ${this.transferInfo.minimum.toFixed(5)}`);
                return `Minimum value of transactions is ${this.transferInfo.minimum}`
              }
            }
            this.showError = false;
            return false
          },
          value => {
            if (this.exchangeCurrency.isWallet) {
              if (value > this.transferInfo.limit) {
                this.errorMsg = ('Ammount cannot be more than limit');
                this.showError = true;
                return 'Ammount cannot be more than limit'
              }
            }
            this.showError = false;
            return false
          },
          value => {
            if (!this.exchangeCurrency.isWallet) {
              if (value > this.exchangeCurrency.reserve) {
                this.errorMsg = ('Ammount cannot be more than reserve');
                this.showError = true;
                return 'Ammount cannot be more than reserve'
              }
            }
            return false
          },
          value => {
            if (!this.exchangeCurrency.isWallet) {
              if (value < this.fiatInfo.in_min) {
                this.errorMsg = ('Ammount cannot be less than min ammount of transaction');
                this.showError = true;
                return 'Ammount cannot be less than min ammount of transaction'
              }
            }
            return false
          }
        ],
        receiveAmountRules: [
          value => {
            if (!+value) {
              this.errorMsg = ('Required');
              return 'Required'
            }
            this.showError = false;
            return false
          },
          value => {
            if (this.exchangeCurrency.isWallet && this.receiveCurrency.isWallet) {
              if (value < this.transferInfo.minimum) {
                this.showError = true;
                this.errorMsg = (`Minimum value of transactions is ${this.transferInfo.minimum.toFixed(5)}`);
                return `Minimum value of transactions is ${this.transferInfo.minimum}`
              }
            }
            this.showError = false;
            return false
          },
          value => {
            if (this.receiveCurrency.isWallet) {
              if (value > this.transferInfo.limit) {
                this.showError = true;
                this.errorMsg = ('Ammount cannot be more than limit');
                return 'Ammount cannot be more than limit'
              }
            }
            this.showError = false;
            return false
          },
          value => {
            if (!this.receiveCurrency.isWallet) {
              if (value > this.exchangeCurrency.reserve) {
                this.showError = true;
                this.errorMsg = ('Ammount cannot be more than reserve');
                return 'Ammount cannot be more than reserve'
              }
            }
            this.showError = false;
            return false
          },
          value => {
            if (!this.receiveCurrency.isWallet) {
              if (value < this.fiatInfo.in_min && this.firstStart) {
                this.showError = true;
                this.errorMsg = ('Ammount cannot be less than min ammount of transaction');
                return 'Ammount cannot be less than min ammount of transaction'
              }
            }
            this.showError = false;
            return false
          }
        ],
        exchangeCurrency: {
          code: 'btc',
          currency: 'BTC',
          balance: '0.00',
          balanceUSD: '0.00',
          ...currencyList['BTC'],
          isWallet: true,
          psid: 12
        },
        receiveCurrency: {
          code: 'eth',
          currency: 'ETH',
          balance: '0.00',
          balanceUSD: '0.00',
          ...currencyList['ETH'],
          isWallet: true,
          psid: 42
        }
      }
    },
    methods: {
      send() {
        this.exchangePopup = false;
        const token = this.smsCodes.map((smsCode, index) => smsCode[index]).join('');
        if (this.exchangeCurrency.isWallet && this.receiveCurrency.isWallet) {
          this.$store.dispatch('exchange/POST_WALLETS', {
            transferData: {
              From: this.exchangeCurrency.number,
              To: this.receiveCurrency.number,
              Amount: this.exchangeAmount,
              Token: token,
              ...getAuthParams()
            },
            pair: {
              exchange: capitalizeFirstLetter(this.exchangeCurrency.currency.toLowerCase()),
              receive: capitalizeFirstLetter(this.receiveCurrency.currency.toLowerCase())
            },
            usdAmmount: this.exchangeCurrency.exchangeUSD
          }).then(() => {
            this.clearSms()
          });
        } else {
          this.$store.dispatch('exchange/POST_FIAT', {
            ...getAuthParams(),
            From: this.exchangeCurrency.number,
            To: this.receiveCurrency.number,
            Amount: this.exchangeAmount,
            Token: token,
            Vid: this.exchangeCurrency.isWallet ? 1 : 2,
            Psid1: this.exchangeCurrency.psid,
            Psid2: this.receiveCurrency.psid,
            LastName: this.exchangeCurrency.isWallet ? this.receiveCurrency.holder : this.exchangeCurrency.holder,
          }).then(() => {
            this.clearSms()
          });
        }
      },
      closeExchangePopup() {
        this.exchangePopup = false;
        clearInterval(this.timer);
        this.countdown = 59;
      },
      smsChange(event, index) {
        if (event.key === 'ArrowLeft') {
          event.target.previousSibling.focus()
        } else if (event.key !== 'Backspace') {
          if (index !== (this.smsCodes.length - 1)) {
            event.target.nextElementSibling.focus()
          } else {
            this.send()
          }
        }
      },
      exchange() {
        if (this.$refs.exchangeForm.validate()) {
          this.showError = false;
          this.exchangePopup = !this.exchangePopup;
          this.$store.dispatch('wallet/GET_TRANSFER_TOKEN', getAuthParams()).then(() => {
            this.setTimer()
          });
        } else {
          this.showError = true;
        }
      },
      setTimer() {
        this.timer = setInterval(() => {
          this.countdown--
        }, 1000)
      },
      setData() {
        if (this.wallets && this.wallets.length) {
          this.exchangeCurrency = this.wallets.filter((item) => {
            if (item.currency === 'ETH' && !item.statusNode) {
              return item
            }
          })[0] || this.wallets.filter((item) => (!item.statusNode))[0];
          this.receiveCurrency = this.wallets.filter(item => {
            if (item.holder && !item.statusNode) {
              return item
            }
          })[0];
        }
      },
      exchangeAction() {
        this.exchangeModal = !this.exchangeModal;
        this.receiveModal = false;
        this.search = '';
      },
      hideExchange() {
        this.exchangeModal = false;
      },
      hideReceive() {
        this.receiveModal = false;
      },
      receiveAction() {
        this.receiveModal = !this.receiveModal;
        this.exchangeModal = false;
        this.search = '';
      },
      formatPhoneNumber,
      toggleCurrency() {
        this.clearValues();
        let c = this.exchangeCurrency;
        this.exchangeCurrency = this.receiveCurrency;
        this.receiveCurrency = c;
        this.dir = !this.dir;
        if (this.exchangeCurrency.isWallet && this.receiveCurrency.isWallet) {
          this.getTransferInfo();
        } else {
          this.getFiatInfo();
        }
        this.checkExchangeDirection()
      },
      getFiatExchange() {
        this.$store.dispatch('exchange/GET_FIAT_EXCHANGE');
      },
      clearSms() {
        this.smsCodes.forEach((smsCode, index) => { smsCode[index] = '' })
      },
      getTransferInfo() {
        this.$store.dispatch('exchange/GET_TRANSFER_INFO', {
          exchange: capitalizeFirstLetter(this.exchangeCurrency.currency.toLowerCase()),
          receive: capitalizeFirstLetter(this.receiveCurrency.currency.toLowerCase())
        });
      },
      getFiatInfo() {
        this.$store.dispatch('exchange/GET_FIAT_INFO', {
          exchange: this.exchangeCurrency.psid,
          receive: this.receiveCurrency.psid
        });
      },
      getTypes() {
        this.$store.dispatch('wallet/GET_TYPES');
      },
      selectExchangeWallet(wallet) {
        this.clearValues();
        this.exchangeCurrency = wallet;
        this.checkExchangeDirection();
        this.exchangeModal = false;
        if (wallet.isWallet) {
          this.getTransferInfo();
        } else {
          this.getFiatInfo();
        }
      },
      clearValues() {
        this.exchangeAmount = '0.00';
        this.receiveAmount = '0.00';
        this.exchangeUSD = '0.00';
        this.receiveUSD = '0.00';
      },
      checkExchangeDirection() {
        if (this.exchangeCurrency.isWallet) {
          this.$store.dispatch('exchange/CHECK_WALLET_DIRECTIONS', {
              from: this.exchangeCurrency.currency
          });
        } else if (!this.exchangeCurrency.isWallet) {
          this.$store.dispatch('exchange/SET_FIAT_DIRECTIONS', this.exchangeCurrency.directions);
        }

        // if (this.exchangeCurrency.isWallet && this.receiveCurrency.isWallet) {
        //   this.$store.dispatch('exchange/SET_WALLET_DIRECTIONS',
        //     {
        //       direction: `${this.exchangeCurrency.currency}${this.receiveCurrency.currency}`,
        //       receive: this.receiveCurrency.currency
        //     });
      },
      selectReceiveWallet(wallet) {
        this.clearValues();
        this.receiveCurrency = wallet;
        this.receiveModal = false;
        if (this.exchangeCurrency.isWallet && this.receiveCurrency.isWallet) {
          this.getTransferInfo();
        } else {
          this.getFiatInfo();
        }
      },
      closeModal() {
        this.exchangePopup = false;
        this.sucessFiat = false;
        if (this.exchangeSucces) {
          this.$store.dispatch('wallet/SET_SUCCES', false);
        }
      },
      repeatTransferRequest() {
        this.clearSms();
        this.$store.dispatch('wallet/GET_TRANSFER_TOKEN', getAuthParams()).then(() => {
          this.isRepeat = false;
          this.setTimer();
        });
      },
      selectAll() {
        this.exchangeBtn = 1;
        if (this.exchangeCurrency.isWallet && !+this.exchangeCurrency.balance) {
          this.clearValues()
          return;
        }
        if (this.exchangeCurrency.isWallet && this.receiveCurrency.isWallet) {
          exchangePrice = this.types[this.exchangeCurrency.name].price;
          receivePrice = this.types[this.receiveCurrency.name].price;
          this.exchangeAmount = this.exchangeCurrency.balance > this.transferInfo.limit ? this.transferInfo.limit : this.exchangeCurrency.balance;
          this.receiveAmount = +(this.exchangeAmount * this.transferInfo.rate).toFixed(5);
          this.exchangeUSD = +(this.exchangeAmount * exchangePrice).toFixed(2);
          this.receiveUSD = +(this.receiveAmount * receivePrice).toFixed(2);
          return;
        }
        if (!this.exchangeCurrency.isWallet) {
          exchangePrice = this.exchangeCurrency.currency === 'RUR'
            ? this.fiatInfo.RUR.USD
            : this.fiatInfo.USD[this.exchangeCurrency.currency];
          receivePrice = +this.types[this.receiveCurrency.name].price;
          this.exchangeAmount = this.fiatInfo.in_max;
          this.exchangeUSD = +(this.exchangeAmount / exchangePrice).toFixed(2);
          this.receiveAmount = +(this.exchangeAmount * this.fiatInfo.out).toFixed(2);
          this.receiveUSD = +(this.receiveAmount * receivePrice).toFixed(2);
          return;
        }
        if (!this.receiveCurrency.isWallet) {
          exchangePrice = +this.types[this.exchangeCurrency.name].price;
          receivePrice = this.receiveCurrency.currency === 'RUR'
            ? this.fiatInfo.RUR.USD
            : this.fiatInfo.USD[this.receiveCurrency.currency];
          this.exchangeAmount = this.exchangeCurrency.balance;
          this.receiveAmount = +(this.exchangeAmount * this.fiatInfo.out).toFixed(2);
          this.exchangeUSD = +(this.exchangeAmount * exchangePrice).toFixed(2);
          this.receiveUSD = +(this.receiveAmount / receivePrice).toFixed(2);
        }
      },
      selectHalf() {
        this.exchangeBtn = 2;
        if (this.exchangeCurrency.isWallet && !+this.exchangeCurrency.balance) {
          this.clearValues()
          return;
        }
        if (this.exchangeCurrency.isWallet && this.receiveCurrency.isWallet) {
          exchangePrice = this.types[this.exchangeCurrency.name].price;
          receivePrice = this.types[this.receiveCurrency.name].price;
          this.exchangeAmount = this.exchangeCurrency.balance > this.transferInfo.limit
            ? this.transferInfo.limit / 2
            : this.exchangeCurrency.balance / 2;
          this.receiveAmount = +(this.exchangeAmount * this.transferInfo.rate).toFixed(5);
          this.exchangeUSD = +(this.exchangeAmount * exchangePrice).toFixed(2);
          this.receiveUSD = +(this.receiveAmount * receivePrice).toFixed(2);
          return;
        }
        if (!this.exchangeCurrency.isWallet) {
          exchangePrice = this.exchangeCurrency.currency === 'RUR'
            ? this.fiatInfo.RUR.USD
            : this.fiatInfo.USD[this.exchangeCurrency.currency];
          receivePrice = +this.types[this.receiveCurrency.name].price;
          this.exchangeAmount = this.fiatInfo.in_max / 2;
          this.exchangeUSD = +(this.exchangeAmount / exchangePrice).toFixed(2);
          this.receiveAmount = +(this.exchangeAmount * this.fiatInfo.out).toFixed(2);
          this.receiveUSD = +(this.receiveAmount * receivePrice).toFixed(2);
          return;
        }
        if (!this.receiveCurrency.isWallet) {
          exchangePrice = +this.types[this.exchangeCurrency.name].price;
          receivePrice = this.receiveCurrency.currency === 'RUR'
            ? this.fiatInfo.RUR.USD
            : this.fiatInfo.USD[this.receiveCurrency.currency];
          const exchangeAmount = this.exchangeCurrency.balance / 2
          this.exchangeAmount = exchangeAmount.toFixed(5);
          this.receiveAmount = +(exchangeAmount * this.fiatInfo.out).toFixed(2);
          this.exchangeUSD = +(exchangeAmount * exchangePrice).toFixed(2);
          this.receiveUSD = +(this.receiveAmount / receivePrice).toFixed(2);
        }
      },
      selectMin() {
        this.exchangeBtn = 3;
        if (this.exchangeCurrency.isWallet && !+this.exchangeCurrency.balance) {
          this.clearValues()
        } else {
          if (this.exchangeCurrency.isWallet && this.receiveCurrency.isWallet) {
            exchangePrice = this.types[this.exchangeCurrency.name].price;
            receivePrice = this.types[this.receiveCurrency.name].price;
            this.exchangeAmount = +(this.transferInfo.minimum).toFixed(5);
            this.receiveAmount = +(this.exchangeAmount * this.transferInfo.rate).toFixed(5);
            this.exchangeUSD = +(this.exchangeAmount * exchangePrice).toFixed(2);
            this.receiveUSD = +(this.receiveAmount * receivePrice).toFixed(2);
          } else if (!this.exchangeCurrency.isWallet && this.receiveCurrency.isWallet) {
            exchangePrice = this.exchangeCurrency.currency === 'RUR'
              ? this.fiatInfo.RUR.USD
              : this.fiatInfo.USD[this.exchangeCurrency.currency];
            receivePrice = +this.types[this.receiveCurrency.name].price;
            this.exchangeAmount = this.fiatInfo.in_min;
            this.exchangeUSD = +(this.exchangeAmount / exchangePrice).toFixed(2);
            this.receiveAmount = +(this.exchangeAmount * this.fiatInfo.out).toFixed(2);
            this.receiveUSD = +(this.receiveAmount * receivePrice).toFixed(2);
          } else if (this.exchangeCurrency.isWallet && !this.receiveCurrency.isWallet) {
            exchangePrice = +this.types[this.exchangeCurrency.name].price;
            receivePrice = this.receiveCurrency.currency === 'RUR'
              ? this.fiatInfo.RUR.USD
              : this.fiatInfo.USD[this.receiveCurrency.currency];
            this.exchangeAmount = +(this.transferInfo.minimum).toFixed(5);
            this.receiveAmount = +(this.exchangeAmount * this.fiatInfo.out).toFixed(2);
            this.exchangeUSD = +(this.exchangeAmount * exchangePrice).toFixed(2);
            this.receiveUSD = +(this.receiveAmount / receivePrice).toFixed(2);
          }
        }
      },
      exchangeChange() {
        if (this.exchangeCurrency.isWallet && this.receiveCurrency.isWallet) {
          exchangePrice = this.types[this.exchangeCurrency.name].price;
          receivePrice = this.types[this.receiveCurrency.name].price;
          this.exchangeUSD = +(this.exchangeAmount * exchangePrice).toFixed(2);
          this.receiveAmount = +(this.exchangeAmount * this.transferInfo.rate).toFixed(5);
          this.receiveUSD = +(this.receiveAmount * receivePrice).toFixed(2);
        } else if (!this.exchangeCurrency.isWallet && this.receiveCurrency.isWallet) {
          exchangePrice = this.exchangeCurrency.currency === 'RUR'
            ? this.fiatInfo.RUR.USD
            : this.fiatInfo.USD[this.exchangeCurrency.currency];
          receivePrice = +this.types[this.receiveCurrency.name].price;
          this.exchangeUSD = +(this.exchangeAmount / exchangePrice).toFixed(2);
          this.receiveAmount = +(this.exchangeAmount * this.fiatInfo.out).toFixed(2);
          this.receiveUSD = +(this.receiveAmount * receivePrice).toFixed(2);
        } else if (this.exchangeCurrency.isWallet && !this.receiveCurrency.isWallet) {
          exchangePrice = +this.types[this.exchangeCurrency.name].price;
          receivePrice = this.receiveCurrency.currency === 'RUR'
            ? this.fiatInfo.RUR.USD
            : this.fiatInfo.USD[this.receiveCurrency.currency];
          this.exchangeUSD = +(this.exchangeAmount * exchangePrice).toFixed(2);
          this.receiveAmount = +(this.exchangeAmount * this.fiatInfo.out).toFixed(2);
          this.receiveUSD = +(this.receiveAmount / receivePrice).toFixed(2);
        }
      },
      receiveChange() {
        if (this.receiveCurrency.isWallet && this.exchangeCurrency.isWallet && this.receiveAmount) {
          receivePrice = this.types[this.receiveCurrency.name].price;
          exchangePrice = this.types[this.exchangeCurrency.name].price;
          this.receiveUSD = +(this.receiveAmount * receivePrice).toFixed(2);
          this.exchangeAmount = +(this.receiveUSD / exchangePrice).toFixed(5);
          this.exchangeUSD = +(this.exchangeAmount * exchangePrice).toFixed(2);
        } else if (!this.exchangeCurrency.isWallet && this.receiveCurrency.isWallet && this.receiveAmount) {
          exchangePrice = this.receiveCurrency.currency === 'RUR'
            ? this.fiatInfo.RUR.USD
            : this.fiatInfo.USD[this.receiveCurrency.currency];
          receivePrice = this.types[this.receiveCurrency.name].price;
          this.receiveUSD = +(this.receiveAmount / receivePrice).toFixed(2);
          this.exchangeAmount = +(this.receiveUSD / exchangePrice).toFixed(5);
          this.exchangeUSD = +(this.exchangeAmount * exchangePrice).toFixed(2);
        } else if (this.exchangeCurrency.isWallet && !this.receiveCurrency.isWallet) {
          exchangePrice = +this.types[this.exchangeCurrency.name].price;
          receivePrice = this.receiveCurrency.currency === 'RUR'
            ? this.fiatInfo.RUR.USD
            : this.fiatInfo.USD[this.receiveCurrency.currency];
          this.receiveUSD = +(this.receiveAmount / receivePrice).toFixed(2);
          this.exchangeAmount = +(this.receiveUSD * this.fiatInfo.out).toFixed(5);
          this.exchangeUSD = +(this.exchangeAmount / exchangePrice).toFixed(2);
        }
      },
      exchangeUSDChange() {
        if (this.exchangeCurrency.isWallet && this.receiveCurrency.isWallet) {
          exchangePrice = this.types[this.exchangeCurrency.name].price;
          receivePrice = this.types[this.receiveCurrency.name].price;
          this.exchangeAmount = +(this.exchangeUSD / exchangePrice).toFixed(5)
          this.receiveAmount = +(this.exchangeAmount * this.transferInfo.rate).toFixed(5);
          this.receiveUSD = +(this.receiveAmount * receivePrice).toFixed(2);
        } else if (!this.exchangeCurrency.isWallet && this.receiveCurrency.isWallet) {
          exchangePrice = this.exchangeCurrency.currency === 'RUR'
            ? this.fiatInfo.RUR.USD
            : this.fiatInfo.USD[this.exchangeCurrency.currency];
          receivePrice = this.types[this.receiveCurrency.name].price;
          this.exchangeAmount = +(this.exchangeUSD * exchangePrice).toFixed(2);
          this.receiveAmount = +(this.exchangeAmount / this.transferInfo.rate).toFixed(2);
          this.receiveUSD = +(this.receiveAmount / receivePrice).toFixed(2);
        } else if (this.exchangeCurrency.isWallet && !this.receiveCurrency.isWallet) {
          exchangePrice = +this.types[this.exchangeCurrency.name].price;
          receivePrice = this.receiveCurrency.currency === 'RUR'
            ? this.fiatInfo.RUR.USD
            : this.fiatInfo.USD[this.receiveCurrency.currency];
          this.exchangeAmount = +(this.exchangeUSD / exchangePrice).toFixed(2);
          this.receiveAmount = +(this.exchangeAmount * this.fiatInfo.out).toFixed(2);
          this.receiveUSD = +(this.receiveAmount / receivePrice).toFixed(2);
        }
      },
      receiveUSDChange() {
        if (this.receiveCurrency.isWallet && this.exchangeCurrency.isWallet && this.receiveUSD) {
          receivePrice = this.types[this.receiveCurrency.name].price;
          exchangePrice = this.types[this.exchangeCurrency.name].price;
          this.receiveAmount = +(this.receiveUSD / receivePrice).toFixed(5);
          this.exchangeAmount = +(this.receiveUSD / exchangePrice).toFixed(5);
          this.exchangeUSD = +(this.exchangeAmount * exchangePrice).toFixed(2);
        } else if (this.receiveCurrency.isWallet && !this.exchangeCurrency.isWallet && this.receiveUSD) {
          exchangePrice = this.exchangeCurrency.currency === 'RUR'
            ? this.fiatInfo.RUR.USD
            : this.fiatInfo.USD[this.exchangeCurrency.currency];
          receivePrice = this.types[this.receiveCurrency.name].price;
          this.receiveAmount = +(this.receiveUSD / receivePrice).toFixed(5);
          this.exchangeAmount = +(this.receiveUSD / exchangePrice).toFixed(2);
          this.exchangeUSD = +(this.exchangeAmount * exchangePrice).toFixed(2);
        } else if (this.exchangeCurrency.isWallet && !this.receiveCurrency.isWallet) {
          exchangePrice = +this.types[this.exchangeCurrency.name].price;
          receivePrice = this.receiveCurrency.currency === 'RUR'
            ? this.fiatInfo.RUR.USD
            : this.fiatInfo.USD[this.receiveCurrency.currency];
          this.receiveAmount = +(this.receiveUSD / exchangePrice).toFixed(2);
          this.exchangeAmount = +(this.receiveAmount * this.fiatInfo.out).toFixed(2);
          this.exchangeUSD = +(this.exchangeAmount / receivePrice).toFixed(2);
        }
      }
    },
    computed: {
      wallets() {
        return this.$store.getters['exchange/EXCHANGE_DATA'] || [];
      },
      user() {
        return { ...getAuthParams() }
      },
      transferInfo() {
        return this.$store.getters['exchange/TRANSFER_INFO'];
      },
      fiatInfo() {
        return this.$store.getters['exchange/FIAT_INFO'];
      },
      fiatData() {
        return this.$store.getters['exchange/FIAT_DATA'];
      },
      types() {
        return this.$store.getters['wallet/TYPES'];
      },
      filteredExchangeWallets() {
        return this.wallets
          .filter(({ currency }) => currency !== this.receiveCurrency.currency)
          .filter((item) => {
            if (!this.receiveCurrency.isWallet) {
              return item.isWallet
            }
            return item
          })
          .filter(({ fullName }) => {
            if (fullName) {
              return fullName.toLowerCase().includes(this.search);
            }
          })
      },
      filteredReceiveWallets() {
        return this.wallets
          .filter(({ currency }) => currency !== this.exchangeCurrency.currency)
          .filter((item) => {
            if (!this.exchangeCurrency.isWallet) {
              return item.isWallet
            }
            return item
          })
          .filter(({ fullName }) => {
            if (fullName) {
              return fullName.toLowerCase().includes(this.search);
            }
          })
      },
      exchangeSucces() {
        return this.$store.getters['exchange/EXCHANGE_SUCCES'];
      },
      isLoading() {
        return this.$store.getters['alerts/loading'];
      },
    },
    created() {
      this.getFiatExchange();
      this.getTransferInfo();
      this.getTypes();
    },
    watch: {
      wallets() {
        this.setData();
        this.checkExchangeDirection();
        this.getFiatInfo();
        this.firstStart = false;
      },
      countdown(value) {
        if (value === 0) {
          clearInterval(this.timer);
          this.isRepeat = true;
          this.countdown = 59;
        }
      },
      exchangePopup(status) {
        if (!status) {
          clearInterval(this.timer);
          this.countdown = 59;
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .select-body {
    width:100%;
    top: 66px;
    position:absolute;
    border-radius: 14px;
    background-color: #4d3779;
    padding:20px;
    z-index: 5;
    left: 0;
    .select-item {
      display: flex;
      position: relative;
      align-items:center;
      padding:8px 9px;
      height: 56px;
      border-radius: 8px;
      background-color: #684e9c;
      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
    .search-input {
      margin-bottom: 10px;
      input {
        width:100%;
        border:none;
        height: 29px;
        border-radius: 8px;
        background-color: #684e9c;
        padding-left:11px;
      }
      input, input::placeholder {
        color: rgba(255,255,255,.7);
        font-size: 12px;
        font-weight: 600;
      }
    }
  }
  .select-item-disabled {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    line-height: 56px;
    border-radius: 8px;
    background-color: #402b6a;
    opacity: 0.88;
    text-align: center;
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
  }
  .success-popup_body {
    .middle-text {
      margin: 0 5px;
    }
  }
  .fiat-popup {
    .success-popup_title {
      position: relative;
      .fiat-icon {
        position: absolute;
        top: -33px;
      }
      .icon-wrapper {
        width: 67px;
        height: 67px;
        border-radius: 25px;
        background-color: #543b88;
        position: absolute;
        top: -63px;
        display: flex;
        justify-content: center;
      }
      .status {
        padding-top: 50px;
        font-size: 28px;
        font-weight: 600;
        line-height: 35px;
      }
    }
    .images {
      .exchange_wallet {
        width: 38px;
        height: 38px;
        align-self: center;
        margin-left: 5px;
      }
      .receive_wallet {
        @extend .exchange_wallet
      }
    }
    .image-exchange-wrapper {
      margin-right: 5px;
      width: 50px;
      height: 50px;
      border-radius: 25px;
      background-color: #543b88;
      display: flex;
      justify-content: center;
      img {
        width: 32px;
        height: 15px;
      }
    }
    .image-receive-wrapper {
      @extend .image-exchange-wrapper;
      margin-right: 0;
      margin-left: 5px;
    }
    .card-to-send-block {
      text-align: center;
      width: 285px;
      .message {
        color: #ffffff;
        font-size: 12px;
        line-height: 21px;
        opacity: 0.5;
      }
      .card-number {
        color: #ffffff;
        margin-top: 5px;
        font-size: 16px;
        font-weight: 600;
        line-height: 21px;
      }
    }
  }
  .title-wrapper {
    display: flex;
    margin: 10px 0;
  }
  .select-header {
    color: #ffffff;
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 0.2px;
    line-height: 21px;
    text-transform: uppercase;
  }
  .select-line {
    flex-grow: 1;
    border-bottom: 1px solid #ffffff;
    opacity: 0.5;
    margin-bottom: 7px;
  }
  .filter-btn {
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    line-height: 21px;
    text-transform: capitalize;
    &.active-list {
      border-radius: 5px;
      background-image: linear-gradient(270deg, #8e6ee4 0%, #d268bc 100%);
    }
  }
  .error-block {
    text-align: center;
    color: #db5353;
    position: relative;
    background-color: rgb(59, 38, 101);
    font-size: 12px;
    font-weight: 600;
    line-height: 21px;
  }
  .currency-divider {
    vertical-align: text-top;
    font-size: 10px!important;
    line-height: 23px!important;
  }
</style>
