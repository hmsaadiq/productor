export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'completed';
export type OrderStatusColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'in_progress', 'out_for_delivery', 'delivered'];

export const getNextStatus = (current: OrderStatus): OrderStatus | null => {
  if (current === 'cancelled' || current === 'delivered' || current === 'completed') return null;
  const index = STATUS_FLOW.indexOf(current);
  return index >= 0 && index < STATUS_FLOW.length - 1 ? STATUS_FLOW[index + 1] : null;
};

export const getPreviousStatus = (current: OrderStatus): OrderStatus | null => {
  if (current === 'cancelled' || current === 'pending' || current === 'completed') return null;
  const index = STATUS_FLOW.indexOf(current);
  return index > 0 ? STATUS_FLOW[index - 1] : null;
};

export const hasNext = (current: OrderStatus): boolean => getNextStatus(current) !== null;

export const hasPrevious = (current: OrderStatus): boolean => getPreviousStatus(current) !== null;

export const formatStatus = (status: OrderStatus): string => {
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

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
