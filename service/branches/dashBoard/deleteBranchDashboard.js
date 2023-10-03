const getAllDeliveryGuysByBranchId = require("../../utils/getAllDeliveryGuysByBranchId");

const deleteBranchAndUpdateDashboard = async (db, batch, id, branchData) => {
  try {
    if (!id) {
      return null;
    }

    // Fetch the main dashboard document
    const dashboardQuerySnapshot = await db
      .collection("dashboard")
      .limit(1)
      .get();

    if (dashboardQuerySnapshot.empty) {
      throw new Error("Main Dashboard document not found");
    }

    const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
    const dashboardData = dashboardQuerySnapshot.docs[0].data();
    const existingBranches = dashboardData.data || [];
    // const branchToMatch = existingBranches.find((branch) => branch.ID === id);
    // Calculate new values for the dashboard
    const newEmployeeCount =
      parseInt(dashboardData.totalEmployees) -
      parseInt(branchData.numberofworker);
    const newTotalBudget =
      parseInt(dashboardData.totalBudget) - parseInt(branchData.budget);
    let newTotalDeliveryGuy = parseInt(dashboardData.activeEmployees);

    // // Remove the deleted branch from the existing branches array
    const updatedBranches = existingBranches.filter(
      (branch) => branch.ID !== id
    );

    // Fetch and delete associated delivery guys

    const deliveryGuy = await getAllDeliveryGuysByBranchId("deliveryguy", id);

    for (const delivery of deliveryGuy) {
      if (delivery.activeness) {
        newTotalDeliveryGuy = newTotalDeliveryGuy - 1;
      }
      batch.delete(db.collection("deliveryguy").doc(delivery.id));
    }

    // Update the main dashboard document with the updated values
    batch.update(dashboardDocRef, {
      data: updatedBranches,
      totalBudget: newTotalBudget,
      totalEmployees: newEmployeeCount,
      activeEmployees: newTotalDeliveryGuy,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = deleteBranchAndUpdateDashboard;
