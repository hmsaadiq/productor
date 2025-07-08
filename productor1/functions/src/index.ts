/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

//import {setGlobalOptions} from "firebase-functions";
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import { onDocumentCreated } from "firebase-functions/v2/firestore";

// Reminder: In your functions directory, run:
// npm install nodemailer node-fetch@2
// npm install --save-dev @types/node-fetch

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
//setGlobalOptions({ maxInstances: 10 });

admin.initializeApp();

const BUSINESS_EMAIL = 'hmsaadiq@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: BUSINESS_EMAIL,
    pass: process.env.BUSINESS_EMAIL_PASSWORD,
  },
});

// Send order confirmation email
export const sendOrderConfirmation = functions.https.onRequest(async (req, res) => {
  try {
    const { orderId, userEmail, config } = req.body;

    const mailOptions = {
      from: BUSINESS_EMAIL,
      to: userEmail,
      subject: 'Order Confirmation',
      html: `
        <h1>Thank you for your order!</h1>
        <p>Order ID: ${orderId}</p>
        <h2>Order Details:</h2>
        <ul>
          <li>Size: ${config.size}"</li>
          <li>Layers: ${config.layers}</li>
          <li>Flavor: ${config.flavor}</li>
          <li>Add-ons: ${config.addons.join(', ')}</li>
          <li>Message: ${config.text}</li>
          <li>Total: $${config.price}</li>
        </ul>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    res.status(500).json({ error: 'Failed to send confirmation email' });
  }
});

// Notify business of new order
export const notifyBusiness = functions.https.onRequest(async (req, res) => {
  try {
    const { orderId } = req.body;

    const orderRef = admin.firestore().collection('orders').doc(orderId);
    const order = await orderRef.get();
    const orderData = order.data();

    const mailOptions = {
      from: BUSINESS_EMAIL,
      to: BUSINESS_EMAIL,
      subject: 'New Order Received',
      html: `
        <h1>New Order Received</h1>
        <p>Order ID: ${orderId}</p>
        <h2>Order Details:</h2>
        <ul>
          <li>Size: ${orderData?.config.size}"</li>
          <li>Layers: ${orderData?.config.layers}</li>
          <li>Flavor: ${orderData?.config.flavor}</li>
          <li>Add-ons: ${orderData?.config.addons.join(', ')}</li>
          <li>Message: ${orderData?.config.text}</li>
          <li>Total: ${orderData?.config.price}</li>
        </ul>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Error notifying business:', error);
    res.status(500).json({ error: 'Failed to notify business' });
  }
});

// Removed old v1 trigger and replaced with v2 API trigger for Trigger Email extension
export const sendOrderEmailOnCreate = onDocumentCreated("orders/{orderId}", async (event) => {
  const snap = event.data;
  if (!snap) return;
  const order = snap.data();
  if (!order) return;

  const html = `
    <h1>New Order Received</h1>
    <ul>
      <li>Order ID: ${event.params.orderId}</li>
      <li>Size: ${order.config.size}"</li>
      <li>Layers: ${order.config.layers}</li>
      <li>Flavor: ${order.config.flavor}</li>
      <li>Add-ons: ${order.config.addons.join(', ')}</li>
      <li>Message: ${order.config.text}</li>
      <li>Total: $${order.config.price}</li>
    </ul>
  `;

  await admin.firestore().collection('mail').add({
    to: 'hmsaadiq@gmail.com',
    message: {
      subject: 'New Order Received',
      html,
    },
  });
});