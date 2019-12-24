<template>
	<div class="flex flex-column outside-wrapper">
		<div
			class="wallet fiat-wallet list__item"
			:class="{ active: item.currency === activeTab, active2: !isCardsMovingAndDeleting }"
		>
			<div class="wallet-info" @click="$emit('onClickTab', item.currency)">
				<div class="code">
					<div class="image fiat" v-html="item.code"></div>
					<span>{{ item.fullName }}</span>
				</div>
				<div class="right">
					<div class="flex justify-content-between align-items-center">
						<p class="balance">{{ '22.000' }}&nbsp;</p>

						<p class="balance-currency" v-html="item.code"></p>
					</div>
					<div class="wallet-toggle"></div>
				</div>
			</div>
			<div class="wallet-last-transactions">
				<transition-group name="slide-fade">
					<div
						class="wallet-last-transactions-item"
						v-for="(card, index) in item.cards"
						:key="card.Number + index"
					>
						<div class="from">
							<div class="image">
								<img :src="getBankImage(card.Psid, 'small')" alt title />
							</div>
							<span>{{ card.Name }}</span>
						</div>
						<div class="info">
							<div class="type"><img src="@/assets/images/left-arrow-purple.svg" alt title /></div>
						</div>
						<div
							class="btn-remove"
							v-show="isCardsMovingAndDeleting"
							@click="$emit('onOpenDeletePopup', card.Number, card.Psid)"
						>
							<img src="@/assets/images/icons/cross.svg" />
						</div>
					</div>
					<!-- ДЛЯ КРАСОТЫ -->
					<div :key="item.fullName + 1" class="wallet-last-transactions-item">
						<div class="from">
							<div class="image">
								<img src="@/assets/images/lightnet.png" alt title />
							</div>
							<span>NEO bank</span>
						</div>
						<div class="info">
							<div class="amount flex">
								12.500&nbsp;
								<p class="balance-currency" v-html="item.code"></p>
							</div>
							<div class="type"><img src="@/assets/images/icons/cloud.svg" alt title /></div>
						</div>
						<div
							class="btn-remove"
							v-show="isCardsMovingAndDeleting"
							@click="$emit('onOpenDeletePopup', card.Number, card.Psid)"
						>
							<img src="@/assets/images/icons/cross.svg" />
						</div>
					</div>
					<!-- ДЛЯ КРАСОТЫ -->
				</transition-group>
			</div>
			<div class="group-toggler"></div>
		</div>
		<div
			class="under-wallet-block flex align-items-center"
			:class="{ 'active-input': isInputEditingActive }"
			v-show="isCardsMovingAndDeleting"
			@click="handleClickLine"
		>
			<div class="under-wallet-line" v-if="!isInputEditingActive"></div>
			<div class="add-group-input-wrapper flex align-items-center" v-else>
				<input type="text" v-model="groupName" @blur="handleSaveGroup" />
			</div>
		</div>
	</div>
</template>
<script>
import getBankImage from '@/functions/getBankImage';

export default {
	props: ['item', 'isCardsMovingAndDeleting', 'activeTab', 'groupCurrencies'],
	methods: {
		getBankImage,
	},
	data() {
		return {
			groupName: 'Group name',
			isInputEditingActive: false,
		};
	},
	methods: {
		getBankImage,
		handleClickLine() {
			if (!this.isInputEditingActive) {
				this.isInputEditingActive = true;
				setTimeout(
					() =>
						document.querySelector('.under-wallet-block .add-group-input-wrapper input').focus(),
					50,
				);
			}
		},
		handleSaveGroup() {
			this.isInputEditingActive = false;
			const isNewGroupNameAlreadyExist = this.groupCurrencies.some(
				({ groupName }) => groupName === this.groupName,
			);

			if (!isNewGroupNameAlreadyExist) {
				const clonedGroupCurrencies = [...this.groupCurrencies];
				clonedGroupCurrencies.unshift({
					groupName: this.groupName,
					currencies: [],
				});
				this.$store.commit('group/SET_GROUP_CURRENCIES', clonedGroupCurrencies);
				this.$store.dispatch('group/CREATE_CURRENCY_GROUP', {
					GroupName: this.groupName,
					currencies: [],
				});
			}
			this.groupName = 'Group name';
		},
	},
};
</script>
