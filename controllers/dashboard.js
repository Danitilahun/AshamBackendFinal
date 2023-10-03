const admin = require("../config/firebase-admin");

const createDashboard = async (req, res) => {
  const db = admin.firestore();
  try {
    const branchesSnapshot = await db.collection("branches").get();

    const branchData = branchesSnapshot.docs.map((doc) => ({
      BranchName: doc.data().name,
      ID: doc.id,
      uniqueName: doc.data().uniqueName,
      BranchIncome: 0,
      BranchExpense: 0,
    }));
    console.log(branchData);
    const dashboardData = {
      totalBudget: 0,
      totalEmployees: 0,
      totalIncome: 0,
      totalExpense: 0,
      totalCustomer: 0,
      activeEmployees: 0,
      data: branchData,
      data2: [
        { Name: "Asbeza", Amount: 0 },
        { Name: "Card", Amount: 0 },
        { Name: "Wifi", Amount: 0 },
        { Name: "Water", Amount: 0 },
        { Name: "Hotel", Amount: 0 },
      ],
    };

    console.log(dashboardData);
    const dashboardDocRef = await db.collection("dashboard").add(dashboardData);
    console.log("Dashboard document created with ID:", dashboardDocRef.id);

    return res.status(201).json({
      message: "Dashboard document created successfully",
      docId: dashboardDocRef.id,
    });
  } catch (error) {
    console.error("Error creating dashboard document:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const createBranchData = async (req, res) => {
  try {
    // Get data from the "branches" collection
    const db = admin.firestore();
    const branchesRef = db.collection("branches");
    const snapshot = await branchesRef.get();

    // Prepare an object to hold the data for each branch
    const dataToBeAdded = {};

    // Loop through the documents and create the data you mentioned
    snapshot.forEach((doc) => {
      const branchData = doc.data();
      const branchId = doc.id;

      const newData = {
        BranchName: branchData.name, // Assuming the branch name field is "name"
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
      };

      dataToBeAdded[branchId] = newData;
    });
    console.log(dataToBeAdded);
    // Add the collected data to the "branchInfo" collection
    const branchInfoRef = db.collection("branchInfo");
    await branchInfoRef.add(dataToBeAdded);

    return res
      .status(200)
      .send("Data added to branchInfo collection successfully");
  } catch (error) {
    console.error("Error adding data:", error);
    return res.status(500).send("Error adding data");
  }
};

module.exports = { createDashboard, createBranchData };
