const deleteField = require("../utils/deleteField");
const admin = require("../config/firebase-admin");
const getAllDeliveryGuysByBranchId = require("../utils/getAllDeliveryGuyIdsByBranchId");
const getCountOfDocuments = require("../utils/getCountOfDocuments");

async function createBankCollection(id) {
  const deliveryTurnCollectionRef = db.collection("Bank").doc(id);
  const deliveryTurnDocumentSnapshot = await deliveryTurnCollectionRef.get();

  if (!deliveryTurnDocumentSnapshot.exists) {
    return deliveryTurnCollectionRef.set({
      withdrawal: 0,
      deposit: 0,
      total: 0,
    });
  }
}

async function createBudgetCollection(id, budget) {
  const deliveryTurnCollectionRef = db.collection("Budget").doc(id);
  const deliveryTurnDocumentSnapshot = await deliveryTurnCollectionRef.get();

  if (!deliveryTurnDocumentSnapshot.exists) {
    return deliveryTurnCollectionRef.set({
      sheetSummery: [],
      totalCredit: 0,
      budget: budget,
      total: 0,
    });
  }
}

async function createTotalCreditCollection(id) {
  const deliveryTurnCollectionRef = db.collection("totalCredit").doc(id);
  const deliveryTurnDocumentSnapshot = await deliveryTurnCollectionRef.get();

  if (!deliveryTurnDocumentSnapshot.exists) {
    return deliveryTurnCollectionRef.set({
      CustomerCredit: 0,
      StaffCredit: 0,
      total: 0,
    });
  }
}

async function createDeliveryTurnCollection() {
  const deliveryTurnCollectionRef = db.collection("Deliveryturn");
  const deliveryTurnCollectionSnapshot = await deliveryTurnCollectionRef.get();

  if (deliveryTurnCollectionSnapshot.empty) {
    return deliveryTurnCollectionRef.doc("turnQueue").set({});
  }
}

const CreateBranch = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const db = admin.firestore();
    const branchesCollection = db.collection("branches");
    const count = await getCountOfDocuments("branches");
    data.uniqueName = `B-${count + 1}`;

    const newBranchRef = await branchesCollection.add(data);
    await createDeliveryTurnCollection();
    await createBankCollection(newBranchRef.id);
    await createBudgetCollection(newBranchRef.id, parseInt(data.budget));
    await createTotalCreditCollection(newBranchRef.id);

    const dashboardQuerySnapshot = await db
      .collection("dashboard")
      .limit(1)
      .get();

    const dashboardQuerySnapshotBranch = await db
      .collection("branchInfo")
      .limit(1)
      .get();

    if (dashboardQuerySnapshot.empty) {
      return res.status(404).json({ error: "Dashboard document not found" });
    }
    const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
    const dashboardData = dashboardQuerySnapshot.docs[0].data();

    const dashboardDocRefBranch = dashboardQuerySnapshotBranch.docs[0].ref;
    const dashboardDataBranch = dashboardQuerySnapshotBranch.docs[0].data();
    const updatedData = {
      ...dashboardDataBranch,
      [newBranchRef.id]: {
        BranchName: data.name, // Assuming the branch name field is "name"
        Asbeza_N: 0,
        Asbeza_P: 0,
        CardCollect: 0,
        CardFee: 0,
        CardDistribute: 0,
        WaterCollect: 0,
        WaterDistribute: 0,
        WifCollect: 0,
        WifiDistribute: 0,
        HotelProfit: 0,
        TotalProfit: 0,
        TotalExpense: 0,
        Status: 0,
      },
    };

    console.log(updatedData);
    await dashboardDocRefBranch.update(updatedData);
    // Update the existing branches data with the new branch
    const newTotalBudget = dashboardData.totalBudget + parseInt(data.budget);
    const existingBranches = dashboardData.data || [];
    const newBranch = {
      BranchName: data.name,
      ID: newBranchRef.id,
      uniqueName: data.uniqueName,
      BranchIncome: 0,
      BranchExpense: 0,
    };
    existingBranches.push(newBranch);

    // Update the dashboard data with the new branches array
    await dashboardDocRef.update({
      data: existingBranches,
      totalBudget: newTotalBudget,
    });

    res.status(200).json({ message: `Branch ${data.name} successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("the id is ", id);
    console.log(req.body);
    const data = req.body;
    console.log(data);
    const dashboardQuerySnapshot = await db
      .collection("dashboard")
      .limit(1)
      .get();

    const dashboardQuerySnapshotBranch = await db
      .collection("branchInfo")
      .limit(1)
      .get();

    const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
    const dashboardData = dashboardQuerySnapshot.docs[0].data();

    const dashboardDocRefBranch = dashboardQuerySnapshotBranch.docs[0].ref;
    const dashboardDataBranch = dashboardQuerySnapshotBranch.docs[0].data();
    // console.log(dashboardDataBranch);
    console.log(dashboardDataBranch[id]);
    const newData = { ...dashboardDataBranch[id], BranchName: data.name };
    console.log(newData);
    const updatedData = {
      ...dashboardDataBranch,
      [id]: newData,
    };
    console.log(updatedData);
    await dashboardDocRefBranch.update(updatedData);
    const existingBranches = dashboardData.data || [];
    const newTotalBudget = dashboardData.totalBudget + parseInt(data.diff);
    const updatedBranches = existingBranches.map((branch) => {
      if (branch.ID === data.id) {
        return {
          ...branch,
          BranchName: data.name,
        };
      }
      return branch;
    });

    // Update the dashboard data with the updated branches
    await dashboardDocRef.update({
      data: updatedBranches,
      totalBudget: newTotalBudget,
    });

    delete data.diff;

    await admin.firestore().collection("branches").doc(id).update(data);
    res
      .status(200)
      .json({ message: `Branch ${data.name} updated successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const branchData = await branchRef.get();
    const branch = branchData.data();
    const dashboardQuerySnapshot = await db
      .collection("dashboard")
      .limit(1)
      .get();
    const branchRef = await admin.firestore().collection("branches").doc(id);
    console.log(branch);
    await admin.firestore().collection("branches").doc(id).delete();
    const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
    const dashboardData = dashboardQuerySnapshot.docs[0].data();
    const existingBranches = dashboardData.data || [];
    const newEmploye =
      parseInt(dashboardData.totalEmployees) - parseInt(branch.numberofworker);
    const newTotalBudget =
      parseInt(dashboardData.totalBudget) - parseInt(branch.budget);
    let newTotalDeliveryGuy = parseInt(dashboardData.activeEmployees);
    const updatedBranches = existingBranches.filter(
      (branch) => branch.ID !== id
    );

    const deliveryGuy = await getAllDeliveryGuysByBranchId(id);
    console.log(deliveryGuy);
    for (const delivery of deliveryGuy) {
      if (delivery.activeness) {
        newTotalDeliveryGuy = newTotalDeliveryGuy - 1;
      }
      await admin
        .firestore()
        .collection("deliveryguy")
        .doc(delivery.id)
        .delete();
    }

    await dashboardDocRef.update({
      data: updatedBranches,
      totalBudget: newTotalBudget,
      totalEmployees: newEmploye,
      activeEmployees: newTotalDeliveryGuy,
    });

    const dashboardQuerySnapshotBranch = await db
      .collection("branchInfo")
      .limit(1)
      .get();

    const dashboardDocRefBranch = dashboardQuerySnapshotBranch.docs[0].ref;
    await deleteField(id, dashboardDocRefBranch.id, "branchInfo");

    await admin.firestore().collection("Bank").doc(id).delete();
    await admin.firestore().collection("Budget").doc(id).delete();
    await admin.firestore().collection("totalCredit").doc(id).delete();
    await deleteField(id, "turnQueue", "Deliveryturn");
    res.status(200).json({ message: `Branch deleted successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  CreateBranch,
  updateBranch,
  deleteBranch,
};
