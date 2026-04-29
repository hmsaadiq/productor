export interface CancellationValidation {
  allowed: boolean;
  reason?: string;
}

// Returns whether an order can be cancelled given its current status and the caller's role.
// Users may only cancel while pending/confirmed; admins have one extra window (in_progress).
export const canCancelOrder = (
  orderStatus: string,
  userRole: 'user' | 'admin'
): CancellationValidation => {
  if (orderStatus === 'cancelled') {
    return { allowed: false, reason: 'Order already cancelled' };
  }

  if (['completed', 'delivered', 'out_for_delivery'].includes(orderStatus)) {
    return { allowed: false, reason: 'Order cannot be cancelled at this stage' };
  }

  if (userRole === 'user') {
    if (!['pending', 'confirmed'].includes(orderStatus)) {
      return { allowed: false, reason: 'Order is being prepared and cannot be cancelled' };
    }
  }

  if (userRole === 'admin') {
    if (!['pending', 'confirmed', 'in_progress'].includes(orderStatus)) {
      return { allowed: false, reason: 'Cannot cancel at this stage' };
    }
  }

  return { allowed: true };
};
