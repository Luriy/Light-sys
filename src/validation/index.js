export const VALIDATE_AMOUNT_TRANSFER_EXCHANGE = (value, balance) => {
  if (value <= 0) {
    return 'Amount must be more than 0.'
  } else if (value > balance) {
    return 'Amount must be less than balance of your wallet.'
  } else return null
}
