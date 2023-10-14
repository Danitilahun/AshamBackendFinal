const { getMessaging } = require("firebase-admin/messaging");
const getSingleDocFromCollection = require("../utils/getSingleDocFromCollection");

/**
 * Send an FCM notification for a new order.
 * @param {Object} data - Data for the notification.
 * @returns {void}
 */
const sendFCMNotification = async (data, from = "create") => {
  try {
    const notification = await getSingleDocFromCollection("notificationTokens");
    const registrationToken =
      notification && notification[data.branchId]
        ? notification[data.branchId]
        : null;

    if (registrationToken) {
      const message = {
        data: {
          title: `${from === "create" ? "New" : "Updated"} ${data.type} order`,
          body: `${data.type} Order for delivery guy ${data.deliveryguyName} ${
            from === "create" ? "" : "is Updated"
          }`,
        },
        token: registrationToken,
      };

      getMessaging()
        .send(message)
        .then((response) => {
          console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = sendFCMNotification;
