export enum ReasonType {
  DUPLICATE = 'DUPLICATE',
  BALANCE_MISMATCH = 'BALANCE_MISMATCH',
  OUT_OF_BOUNDS = 'OUT_OF_BOUNDS',
  UNVERIFIABLE_MOVEMENTS = 'UNVERIFIABLE_MOVEMENTS',
}

export enum ReasonMessageLabels {
  DUPLICATE = 'Duplicate operation',
  POSITIVE_BALANCE_MISMATCH = 'Possible duplicate or incorrect movement(s)',
  NEGATIVE_BALANCE_MISMATCH = 'Possible missing movement(s)',
  OUT_OF_BOUNDS = 'Movement out of bounds',
  UNVERIFIABLE_MOVEMENTS_NO_CHECK_POINT = 'Unverifiable movements, no balance check point available',
  UNVERIFIABLE_MOVEMENTS_ONLY_ONE_CHECK_POINT = 'Unverifiable movements, only one balance check point available',
}
