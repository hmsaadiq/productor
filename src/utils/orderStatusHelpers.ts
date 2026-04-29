export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'completed';
export type OrderStatusColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

// Ordered progression used for advance/revert controls; cancelled and completed are terminal and excluded.
const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'in_progress', 'out_for_delivery', 'delivered'];

// Returns the next status in the fulfilment flow, or null if already at a terminal state.
export const getNextStatus = (current: OrderStatus): OrderStatus | null => {
  if (current === 'cancelled' || current === 'delivered' || current === 'completed') return null;
  const index = STATUS_FLOW.indexOf(current);
  return index >= 0 && index < STATUS_FLOW.length - 1 ? STATUS_FLOW[index + 1] : null;
};

// Returns the previous status in the fulfilment flow, or null if already at the start or a terminal state.
export const getPreviousStatus = (current: OrderStatus): OrderStatus | null => {
  if (current === 'cancelled' || current === 'pending' || current === 'completed') return null;
  const index = STATUS_FLOW.indexOf(current);
  return index > 0 ? STATUS_FLOW[index - 1] : null;
};

// Whether the admin "Advance" button should be shown for this status.
export const hasNext = (current: OrderStatus): boolean => getNextStatus(current) !== null;

// Whether the admin "Revert" button should be shown for this status.
export const hasPrevious = (current: OrderStatus): boolean => getPreviousStatus(current) !== null;

// Converts snake_case status strings to Title Case for display (e.g. "in_progress" → "In Progress").
export const formatStatus = (status: OrderStatus): string => {
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Maps each order status to an MUI Chip colour variant.
export const getStatusColor = (status: OrderStatus): OrderStatusColor => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'confirmed':
      return 'info';
    case 'in_progress':
      return 'primary';
    case 'out_for_delivery':
      return 'secondary';
    case 'delivered':
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};
