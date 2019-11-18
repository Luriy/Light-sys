import fiatList from '@/settings/fiatList';

export default function getBankImage(psid, size) {
	return fiatList[psid] && fiatList[psid].icon && fiatList[psid].icon[size];
}
