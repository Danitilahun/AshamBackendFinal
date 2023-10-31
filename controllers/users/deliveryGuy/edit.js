const pushToFieldArray = require("../../../service/utils/pushToFieldArray");
const updateFieldsInNestedObject = require("../../../service/utils/updateFieldsInNestedObject");
const editDocument = require("../../../service/mainCRUD/editDoc");
const updateDeliveryGuyName = require("../../../service/users/deliveryGuyActiveness/updateDeliveryGuyName");
const admin = require("../../../config/firebase-admin"); // Import Firebase Admin
/**
 * Edit delivery guy data by processing a request.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} A JSON response indicating the result of the operation.
 */
const editDeliveryGuy = async (req, res) => {
  // Create Firestore database and batch
  const db = admin.firestore();
  const batch = db.batch();

  try {
    // Step 1: Extract delivery guy ID from the request parameters
    const { id } = req.params;

    // Step 2: Extract relevant fields from the request body
    const { nameChange, active, activeTable, ...updatedData } = req.body;

    // Step 3: Edit the delivery guy document in the "deliveryguy" collection
    await editDocument(db, batch, "deliveryguy", id, updatedData);

    // Step 4: Update related data in the "tables" and "salary" collections
    if (activeTable && nameChange) {
      await updateFieldsInNestedObject(db, batch, "tables", activeTable, id, {
        name: updatedData.fullName,
        uniqueName: updatedData.uniqueName,
      });
    }

    if (active && nameChange) {
      await updateFieldsInNestedObject(db, batch, "tables", active, id, {
        name: updatedData.fullName,
        uniqueName: updatedData.uniqueName,
      });
      await updateFieldsInNestedObject(db, batch, "salary", active, id, {
        name: updatedData.fullName,
        uniqueName: updatedData.uniqueName,
        bankAccount: updatedData.bankAccount,
      });
    }

    // Step 5: Update the "worker" field array in the "branches" collection
    await pushToFieldArray(
      db,
      batch,
      "branches",
      updatedData.branchId,
      "worker",
      {
        id: id,
        name: updatedData.fullName,
        role: "DeliveryGuy",
      }
    );

    await updateDeliveryGuyName(
      updatedData.branchId,
      id,
      updatedData.fullName,
      db,
      batch
    );
    // Step 6: Send a success response
    // Commit the batch updates
    await batch.commit();

    res.status(200).json({ message: "Delivery guy data edited successfully." });
  } catch (error) {
    // Step 7: Handle errors and send an error response
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = editDeliveryGuy;
