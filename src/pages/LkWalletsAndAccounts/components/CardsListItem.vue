<template>
	<div class="wallet fiat-wallet list__item" :class="{ active: item.currency === activeTab }">
		<div class="wallet-info" @click="$emit('onClickTab', item.currency)">
			<div class="code">
				<div class="image fiat">{{ item.code }}</div>
				<span>{{ item.fullName }}</span>
			</div>
			<div class="right">
				<div class="balance">
					{{ '22,000 ' + item.code }}
					<!-- {{ item.balance }} -->
				</div>
				<div class="wallet-toggle"></div>
			</div>
		</div>
		<div class="wallet-last-transactions">
			<transition-group name="slide-fade">
				<div class="wallet-last-transactions-item" v-for="card in item.cards" :key="card.Number">
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
						@click="$emit('onOpenDeletePopup', card.Number)"
					>
						<img src="@/assets/images/cross.svg" />
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
						<div class="amount">12, 500 {{ item.code }}</div>
						<div class="type"><img src="@/assets/images/cloud.svg" alt title /></div>
					</div>
					<div
						class="btn-remove"
						v-show="isCardsMovingAndDeleting"
						@click="$emit('onOpenDeletePopup', card.Number, card.Psid)"
					>
						<img src="@/assets/images/cross.svg" />
					</div>
				</div>
				<!-- ДЛЯ КРАСОТЫ -->
			</transition-group>
		</div>
	</div>
</template>
<script>
import getBankImage from '@/functions/getBankImage';

export default {
	props: ['item', 'isCardsMovingAndDeleting', 'activeTab'],
	methods: {
		getBankImage,
	},
};
</script>
