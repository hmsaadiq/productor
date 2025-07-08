interface EmailConfig {
  to: string;
  subject: string;
  html: string;
}

export const sendOrderConfirmation = async (orderId: string, userEmail: string, config: any) => {
  try {
    const response = await fetch('/api/send-order-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        userEmail,
        config,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send order confirmation email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    throw error;
  }
};

export const notifyBusiness = async (orderId: string) => {
  try {
    const response = await fetch('/api/notify-business', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to notify business');
    }

    return await response.json();
  } catch (error) {
    console.error('Error notifying business:', error);
    throw error;
  }
}; 