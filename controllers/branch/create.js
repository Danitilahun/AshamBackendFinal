const admin = require("../../config/firebase-admin");
const createBudgetCollection = require("../../service/branches/createBudgetCollection");
const createDeliveryTurnCollection = require("../../service/branches/createDeliveryTurnCollection");
const createTotalCreditCollection = require("../../service/branches/createTotalCreditCollection");
const updateBranchData = require("../../service/branches/dashBoard/updateBranchData");
const updateDashboardData = require("../../service/branches/dashBoard/updateDashboardData");
const createDocument = require("../../service/mainCRUD/createDoc");
const createBankCollection = require("../../service/users/finance/createBankCollection");
const getCountOfDocuments = require("../../service/utils/getCountOfDocuments");

/**
 * Creates a branch document in the Firestore database, along with associated collections and data updates.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Object} branchData - The data for the branch document.
 * @returns {void}
 * @throws {Error} Throws an error if any step of the branch creation process fails.
 * @example
 */
const createBranch = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch(); // Initialize a Firestore batch

  try {
    console.log("the new function");
    // Step 1: Get data from the request body or use provided branchData
    const data = req.body;

    // Check if data is null or undefined
    if (!data) {
      return res
        .status(400)
        .json({ message: "Request body is missing or empty." });
    }

    // Step 2: Generate a unique name for the branch
    const count = await getCountOfDocuments("branches");
    data.uniqueName = `B-${count + 1}`;
    data.paid = false;
    data.createdAt = admin.firestore.FieldValue.serverTimestamp();
    // Step 3: Create a branch document in the "branches" collection
    const branchesRef = db.collection("branches");
    const newBranchRef = branchesRef.doc();
    batch.set(newBranchRef, data);

    // Step 4: Create associated collections and update data
    const branchId = newBranchRef.id;
    await createBankCollection(db, batch, branchId);
    await createBudgetCollection(db, batch, branchId, data.budget);
    await createTotalCreditCollection(db, batch, branchId);
    await createDeliveryTurnCollection(db, batch);
    await updateBranchData(db, batch, data, branchId);
    await updateDashboardData(db, batch, data, branchId);
    // console.log(mane);
    // Commit the entire batch as a transaction
    await batch.commit();

    // Step 5: Respond with a success message
    res.status(200).json({ message: "Branch document created successfully." });
  } catch (error) {
    // Step 6: Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: "Failed to create the branch document." });
  }
};

module.exports = createBranch;
