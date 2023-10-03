const checkDocumentExistsInTable = require("../utils/checkDocumentExistsInTable");
const admin = require("../config/firebase-admin");
const generateCustomID = require("../utils/generateCustomID");
const getDocumentById = require("../utils/getDocumentById");
const getDocumentByTwoCriteria = require("../utils/getDocumentByTwoCriteria");
const getSingleDocFromCollection = require("../utils/getSingleDocFromCollection");
const updateBalance = require("../utils/updateBalance");
const updateDataForId = require("../utils/updateDataForId");
const updateStatus = require("../utils/updateStatusDoc");
const updateCreditDocument = require("../utils/updateCreditDocument");
const updateFieldInDocument = require("../utils/updateFieldInDocument");

const CreateReport = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const db = admin.firestore();
    const reportsCollection = db.collection(data.type);
    data.openingDate = new Date();
    data.createdAt = admin.firestore.FieldValue.serverTimestamp();
    await reportsCollection.add(data);
    await updateBalance(data.act, -parseInt(data.price), "fee");
    res
      .status(200)
      .json({ message: `Report ${data.type} created successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("the id is ", id);
    console.log(req.body);
    const data = req.body;
    console.log(data);
    await admin.firestore().collection(data.type).doc(id).update(data);
    res
      .status(200)
      .json({ message: `Report ${data.name} updated successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteReport = async (req, res) => {
  try {
    const { id, collection } = req.params;
    console.log(id);
    await admin.firestore().collection(collection).doc(id).delete();
    res.status(200).json({ message: `Report deleted successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const HotelProfit = async (req, res) => {
  const data = req.body;

  try {
    const newData1 = {
      hotelProfit: data.profit,
      total: data.profit,
    };

    const newData2 = {
      hotelProfit: data.profit,
      total: data.profit,
    };

    console.log(newData1);
    console.log(newData2);

    const sheet = await getDocumentByTwoCriteria(
      "sheets",
      "sheetNumber",
      data.sheetNumber,
      "branchId",
      data.branchId
    );
    console.log(sheet.id);
    const customId1 = generateCustomID(
      `${data.date}-${sheet.id}-${data.branchId}`
    );
    const summaryId = generateCustomID(`${sheet.id}-${data.branchId}`);
    const customId2 = generateCustomID(
      `${sheet.id}-${data.branchId}-${"16day"}`
    );
    const table1ExistsDaily = await checkDocumentExistsInTable(customId1);
    await updateBalance(summaryId, parseInt(data.profit), "order");
    if (table1ExistsDaily) {
      await updateDataForId(
        "tables",
        customId1,
        data.deliveryguyId,
        newData1,
        "total",
        newData2
      );
      await updateDataForId(
        "tables",
        customId2,
        data.date,
        newData1,
        "total",
        newData2
      );
    }

    await updateDataForId(
      "tables",
      summaryId,
      data.deliveryguyId,
      newData1,
      "total",
      newData2
    );

    const income = await getDocumentById("tables", summaryId);
    // console.log("salary", income);
    // console.log("total income", income["total"]["total"]);
    const totalIncome = parseInt(income["total"]["total"]);
    const totalAsbezaProfit = parseInt(income["total"]["hotelProfit"]);
    await updateStatus(
      summaryId,
      "totalIncome",
      "totalExpense",
      totalIncome,
      totalIncome,
      "table"
    );

    const salary = await getDocumentById("salary", summaryId);
    console.log("salary", salary);
    console.log("total salary", salary["total"]["total"]);
    const branches = await getDocumentById("branches", data.branchId);
    console.log(branches["numberofworker"]);
    // const Price = await getSingleDocFromCollection("prices");
    // console.log(Price["fixedSalary"]);
    // const totalSalary =
    //   parseInt(Price["fixedSalary"]) * parseInt(branches["numberofworker"]) +
    //   parseInt(salary["total"]["total"]);
    const dashboardQuerySnapshotBranch = await db
      .collection("branchInfo")
      .limit(1)
      .get();

    const dashboardDocRefBranch = dashboardQuerySnapshotBranch.docs[0].ref;
    const dashboardDataBranch = dashboardQuerySnapshotBranch.docs[0].data();
    // console.log(dashboardDataBranch);
    console.log(dashboardDataBranch[data.branchId]);
    const newData = {
      ...dashboardDataBranch[data.branchId],
      HotelProfit: parseInt(data.profit),
      TotalProfit: parseInt(totalIncome),
      Status:
        parseInt(totalIncome) -
        parseInt(dashboardDataBranch[data.branchId]["TotalExpense"]),
    };
    console.log(newData);
    const updatedData = {
      ...dashboardDataBranch,
      [data.branchId]: newData,
    };

    console.log(updatedData);
    await dashboardDocRefBranch.update(updatedData);

    const dashboardQuerySnapshot = await db
      .collection("dashboard")
      .limit(1)
      .get();
    const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
    const dashboardData = dashboardQuerySnapshot.docs[0].data();

    const existingBranches = dashboardData.data || [];
    const existingBranches2 = dashboardData.data2 || [];
    const updatedBranches = existingBranches.map((branch) => {
      if (branch.ID === data.branchId) {
        return {
          ...branch,
          BranchIncome: parseInt(totalIncome),
        };
      }
      return branch;
    });
    const updatedBranches2 = existingBranches2.map((branch) => {
      if (branch.Name === "Hotel") {
        return {
          ...branch,
          Amount: parseInt(branch.Amount) + parseInt(data.profit),
        };
      }
      return branch;
    });

    // branchesSnapshot.docs.map((doc) => console.log(doc.data()));
    let totalBIncome = 0;
    for (const obj of updatedBranches) {
      totalBIncome += parseInt(obj.BranchIncome);
    }
    await dashboardDocRef.update({
      totalIncome: totalBIncome,
      data: updatedBranches,
      data2: updatedBranches2,
    });

    const newDailyCredit = {
      active: summaryId,
      amount: parseInt(data.profit),
      branchId: data.branchId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      date: data.date,
      deliveryguyId: data.deliveryguyId,
      deliveryguyName: data.deliveryguyName,
      openingDate: admin.firestore.FieldValue.serverTimestamp(),
      reason: "hotelProfit",
      type: "DailyCredit",
    };
    await admin.firestore().collection("DailyCredit").add(newDailyCredit);

    await updateCreditDocument(
      data.branchId,
      "DailyCredit",
      parseInt(newData1.total)
    );

    const totalCredit = await getDocumentById("totalCredit", data.branchId);
    const Credits = totalCredit["total"];
    console.log(Credits);
    await updateBalance(summaryId, parseInt(Credits), "credit");
    await updateFieldInDocument(
      "Budget",
      data.branchId,
      "totalCredit",
      parseFloat(Credits)
    );

    const docRef = db.collection("deliveryguy").doc(data.deliveryguyId);

    // Get the document data
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      console.log("Document does not exist.");
      return;
    }

    const currentExpense = docSnapshot.data().dailyCredit || 0; // Default to 0 if the field doesn't exist

    // Calculate the new totalExpense by adding the newExpense
    const updatedExpense = currentExpense + parseInt(data.profit);

    // Update the document with the new totalExpense
    await docRef.update({ dailyCredit: updatedExpense });
    res.status(200).json({ message: "Table updated successfully." });
  } catch (error) {
    console.error("Error updating status:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating status." });
  }
};

const Collect = async (req, res) => {
  const data = req.body;
  console.log("data ----------->", data);
  try {
    const Price = await getSingleDocFromCollection("prices");
    const servicePrice = await getSingleDocFromCollection("companyGain");
    const getNewData1 = (feeType) => {
      switch (feeType) {
        case "CardFee":
          return { cardFee: 1 };
        case "cardCollect":
          return { cardCollect: 1 };
        case "wifiCollect":
          return { wifiCollect: 1 };
        case "waterCollect":
          return { waterCollect: 1 };
        // Add more cases for other fee types if needed
        default:
          return {};
      }
    };

    const getSalaryData = (feeType) => {
      switch (feeType) {
        case "CardFee":
          return { cardFee: Price.card_fee_price, total: Price.card_fee_price };
        case "cardCollect":
          return {
            cardCollect: Price.card_collect_price,
            total: Price.card_collect_price,
          };
        case "wifiCollect":
          return {
            wifiCollect: Price.wifi_collect_price,
            total: Price.wifi_collect_price,
          };
        case "waterCollect":
          return {
            waterCollect: Price.water_collect_price,
            total: Price.water_collect_price,
          };
        // Add more cases for other fee types if needed
        default:
          return {};
      }
    };

    const newData1 = getNewData1(data.type);
    const newData2 = getNewData1(data.type);
    const salaryData = getSalaryData(data.type);

    console.log(newData1);
    console.log(newData2);

    const sheet = await getDocumentByTwoCriteria(
      "sheets",
      "sheetNumber",
      data.sheetNumber,
      "branchId",
      data.branchId
    );

    const customId1 = generateCustomID(
      `${data.date}-${sheet.id}-${data.branchId}`
    );
    const summaryId = generateCustomID(`${sheet.id}-${data.branchId}`);
    console.log(summaryId);
    const customId2 = generateCustomID(
      `${sheet.id}-${data.branchId}-${"16day"}`
    );
    console.log("customId1", customId1);
    const table1ExistsDaily = await checkDocumentExistsInTable(customId1);

    if (table1ExistsDaily) {
      await updateDataForId(
        "tables",
        customId1,
        data.deliveryguyId,
        newData1,
        "total",
        newData2
      );

      await updateDataForId(
        "tables",
        customId2,
        data.date,
        newData1,
        "total",
        newData2
      );
    }
    await updateDataForId(
      "tables",
      summaryId,
      data.deliveryguyId,
      newData1,
      "total",
      newData2
    );

    await updateDataForId(
      "salary",
      summaryId,
      data.deliveryguyId,
      salaryData,
      "total",
      salaryData
    );

    const income = await getDocumentById("tables", summaryId);
    console.log("salary", income);
    console.log("total income", income["total"]["total"]);
    const totalIncome = parseInt(income["total"]["total"]);

    const salary = await getDocumentById("salary", summaryId);
    console.log("salary", salary);
    console.log("total salary", salary["total"]["total"]);
    const branches = await getDocumentById("branches", data.branchId);
    console.log(branches["numberofworker"]);
    console.log(Price["fixedSalary"]);

    const totalSalary =
      parseInt(Price["fixedSalary"]) * parseInt(branches["numberofworker"]) +
      parseInt(salary["total"]["total"]);
    await updateStatus(
      summaryId,
      "totalStaffSalary",
      "totalExpense",
      totalSalary,
      totalSalary,
      "salary"
    );
    const dashboardQuerySnapshotBranch = await db
      .collection("branchInfo")
      .limit(1)
      .get();

    const dashboardDocRefBranch = dashboardQuerySnapshotBranch.docs[0].ref;
    const dashboardDataBranch = dashboardQuerySnapshotBranch.docs[0].data();

    const dashboardQuerySnapshot = await db
      .collection("dashboard")
      .limit(1)
      .get();
    const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
    const dashboardData = dashboardQuerySnapshot.docs[0].data();

    const existingBranches = dashboardData.data || [];
    const existingBranches2 = dashboardData.data2 || [];

    // console.log(dashboardDataBranch);

    if (data.type === "CardFee") {
      // console.log("data.price", newprice);

      const totalCarFeeProfit = parseInt(income["total"]["cardFee"]);
      console.log(dashboardDataBranch[data.branchId]);
      const newData = {
        ...dashboardDataBranch[data.branchId],
        CardFee: totalCarFeeProfit,
        TotalExpense: parseInt(totalSalary),
        Status: parseInt(totalIncome) - parseInt(totalSalary),
      };
      console.log(newData);
      const updatedData = {
        ...dashboardDataBranch,
        [data.branchId]: newData,
      };

      console.log(updatedData);
      await dashboardDocRefBranch.update(updatedData);
      const updatedBranches = existingBranches.map((branch) => {
        if (branch.ID === data.branchId) {
          return {
            ...branch,
            BranchIncome: parseInt(totalIncome),
            BranchExpense: parseInt(totalSalary),
          };
        }
        return branch;
      });

      let totalBIncome = 0;
      let totalExpense = 0;
      console.log(existingBranches);
      for (const obj of updatedBranches) {
        totalBIncome += parseInt(obj.BranchIncome);
        totalExpense += parseInt(obj.BranchExpense);
      }

      await dashboardDocRef.update({
        totalIncome: totalBIncome,
        totalExpense: totalExpense,
        data: updatedBranches,
      });
    } else if (data.type === "cardCollect") {
      const collectCard = parseInt(income["total"]["cardCollect"]);
      console.log(dashboardDataBranch[data.branchId]);
      const newData = {
        ...dashboardDataBranch[data.branchId],
        CardCollect: parseInt(collectCard),
        TotalExpense: parseInt(totalSalary),
        Status: parseInt(totalIncome) - parseInt(totalSalary),
      };
      console.log(newData);
      const updatedData = {
        ...dashboardDataBranch,
        [data.branchId]: newData,
      };

      console.log(updatedData);
      await dashboardDocRefBranch.update(updatedData);
      const updatedBranches = existingBranches.map((branch) => {
        if (branch.ID === data.branchId) {
          return {
            ...branch,
            BranchExpense: parseInt(totalSalary),
          };
        }
        return branch;
      });

      let totalExpense = 0;
      console.log(existingBranches);
      for (const obj of updatedBranches) {
        totalExpense += parseInt(obj.BranchExpense);
      }

      await dashboardDocRef.update({
        totalExpense: totalExpense,
        data: updatedBranches,
      });
    } else if (data.type === "wifiCollect") {
      const wifiCollectAmount = parseInt(income["total"]["wifiCollect"]);
      console.log(dashboardDataBranch[data.branchId]);
      const newData = {
        ...dashboardDataBranch[data.branchId],
        WifCollect: parseInt(wifiCollectAmount),
        TotalExpense: parseInt(totalSalary),
        Status: parseInt(totalIncome) - parseInt(totalSalary),
      };
      console.log(newData);
      const updatedData = {
        ...dashboardDataBranch,
        [data.branchId]: newData,
      };

      console.log(updatedData);
      await dashboardDocRefBranch.update(updatedData);
      const updatedBranches = existingBranches.map((branch) => {
        if (branch.ID === data.branchId) {
          return {
            ...branch,
            BranchExpense: parseInt(totalSalary),
          };
        }
        return branch;
      });

      let totalExpense = 0;
      console.log(existingBranches);
      for (const obj of updatedBranches) {
        totalExpense += parseInt(obj.BranchExpense);
      }

      await dashboardDocRef.update({
        totalExpense: totalExpense,
        data: updatedBranches,
      });
    } else if (data.type === "waterCollect") {
      const water = parseInt(income["total"]["waterCollect"]);
      console.log(dashboardDataBranch[data.branchId]);
      const newData = {
        ...dashboardDataBranch[data.branchId],
        WaterCollect: parseInt(water),
        TotalExpense: parseInt(totalSalary),
        Status: parseInt(totalIncome) - parseInt(totalSalary),
      };
      console.log(newData);
      const updatedData = {
        ...dashboardDataBranch,
        [data.branchId]: newData,
      };

      console.log(updatedData);
      await dashboardDocRefBranch.update(updatedData);

      const updatedBranches = existingBranches.map((branch) => {
        if (branch.ID === data.branchId) {
          return {
            ...branch,
            BranchExpense: parseInt(totalSalary),
          };
        }
        return branch;
      });

      let totalExpense = 0;
      console.log(existingBranches);
      for (const obj of updatedBranches) {
        totalExpense += parseInt(obj.BranchExpense);
      }

      await dashboardDocRef.update({
        totalExpense: totalExpense,
        data: updatedBranches,
      });
    }

    if (data.type === "CardFee") {
      const newDailyCredit = {
        active: summaryId,
        amount: parseInt(data.price),
        branchId: data.branchId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        date: data.date,
        deliveryguyId: data.deliveryguyId,
        deliveryguyName: data.deliveryguyName,
        openingDate: admin.firestore.FieldValue.serverTimestamp(),
        reason: data.type,
        type: "DailyCredit",
      };
      await admin.firestore().collection("DailyCredit").add(newDailyCredit);

      await updateCreditDocument(
        data.branchId,
        "DailyCredit",
        parseInt(data.price)
      );

      const totalCredit = await getDocumentById("totalCredit", data.branchId);
      const Credits = totalCredit["total"];
      console.log(Credits);
      await updateBalance(summaryId, parseInt(Credits), "credit");
      await updateFieldInDocument(
        "Budget",
        data.branchId,
        "totalCredit",
        parseFloat(Credits)
      );

      const docRef = db.collection("deliveryguy").doc(data.deliveryguyId);

      // Get the document data

      const docSnapshot = await docRef.get();

      if (!docSnapshot.exists) {
        console.log("Document does not exist.");
        return;
      }

      const currentExpense = docSnapshot.data().dailyCredit || 0; // Default to 0 if the field doesn't exist

      // Calculate the new totalExpense by adding the newExpense
      const updatedExpense = currentExpense + parseInt(data.price);

      // Update the document with the new totalExpense
      await docRef.update({ dailyCredit: updatedExpense });
    }

    res.status(200).json({ message: "Table updated successfully." });
  } catch (error) {
    console.error("Error updating status:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating status." });
  }
};

const Distribute = async (req, res) => {
  const data = req.body;
  const servicePrice = await getSingleDocFromCollection("companyGain");
  const servicePrices = await getSingleDocFromCollection("prices");
  console.log(data);
  console.log(servicePrice);
  try {
    const getNewData1 = (feeType) => {
      switch (feeType) {
        case "cardDistribute":
          return {
            cardDistribute: data.numberOfCard,
            total: data.numberOfCard * servicePrice.card_distribute_gain,
          };
        case "wifiDistribute":
          return {
            wifiDistribute: data.numberOfCard,
            total: data.numberOfCard * servicePrice.wifi_distribute_gain,
          };
        case "waterDistribute":
          return {
            waterDistribute: data.numberOfCard,
            total: data.numberOfCard * servicePrice.water_distribute_gain,
          };
        // Add more cases for other fee types if needed
        default:
          return {};
      }
    };
    console.log(servicePrices);
    const getSalaryData = (feeType) => {
      switch (feeType) {
        case "cardDistribute":
          return {
            cardDistribute:
              data.numberOfCard * servicePrices.card_distribute_price,
            total: data.numberOfCard * servicePrices.card_distribute_price,
          };
        case "wifiDistribute":
          return {
            wifiDistribute:
              data.numberOfCard * servicePrices.wifi_distribute_price,
            total: data.numberOfCard * servicePrices.wifi_distribute_price,
          };
        case "waterDistribute":
          return {
            waterDistribute:
              data.numberOfCard * servicePrices.water_distribute_price,
            total: data.numberOfCard * servicePrices.water_distribute_price,
          };
        // Add more cases for other fee types if needed
        default:
          return {};
      }
    };

    const newData1 = getNewData1(data.type);
    const newData2 = getNewData1(data.type);
    const salaryData = getSalaryData(data.type);

    console.log(newData1);
    console.log(newData2);

    const sheet = await getDocumentByTwoCriteria(
      "sheets",
      "sheetNumber",
      data.sheetNumber,
      "branchId",
      data.branchId
    );
    console.log(sheet.id);
    const customId1 = generateCustomID(
      `${data.date}-${sheet.id}-${data.branchId}`
    );
    const summaryId = generateCustomID(`${sheet.id}-${data.branchId}`);
    const customId2 = generateCustomID(
      `${sheet.id}-${data.branchId}-${"16day"}`
    );
    const table1ExistsDaily = await checkDocumentExistsInTable(customId1);
    await updateBalance(summaryId, parseInt(newData2["total"]), "order");

    if (table1ExistsDaily) {
      await updateDataForId(
        "tables",
        customId1,
        data.deliveryguyId,
        newData1,
        "total",
        newData2
      );

      await updateDataForId(
        "tables",
        customId2,
        data.date,
        newData1,
        "total",
        newData2
      );
    }

    await updateDataForId(
      "tables",
      summaryId,
      data.deliveryguyId,
      newData1,
      "total",
      newData2
    );

    console.log("salaryData", salaryData);
    await updateDataForId(
      "salary",
      summaryId,
      data.deliveryguyId,
      salaryData,
      "total",
      salaryData
    );

    const income = await getDocumentById("tables", summaryId);
    console.log("salary", income);
    console.log("total income", income["total"]["total"]);
    const totalIncome = parseInt(income["total"]["total"]);
    await updateStatus(
      summaryId,
      "totalIncome",
      "totalExpense",
      totalIncome,
      totalIncome,
      "table"
    );
    const salary = await getDocumentById("salary", summaryId);
    // console.log("salary", salary);
    // console.log("total salary", salary["total"]["total"]);
    const branches = await getDocumentById("branches", data.branchId);
    // console.log(branches["numberofworker"]);
    const Price = await getSingleDocFromCollection("prices");
    // console.log(Price["fixedSalary"]);
    const totalSalary =
      parseInt(Price["fixedSalary"]) * parseInt(branches["numberofworker"]) +
      parseInt(salary["total"]["total"]);
    await updateStatus(
      summaryId,
      "totalStaffSalary",
      "totalExpense",
      totalSalary,
      totalSalary,
      "salary"
    );

    const dashboardQuerySnapshotBranch = await db
      .collection("branchInfo")
      .limit(1)
      .get();

    const dashboardDocRefBranch = dashboardQuerySnapshotBranch.docs[0].ref;
    const dashboardDataBranch = dashboardQuerySnapshotBranch.docs[0].data();

    const dashboardQuerySnapshot = await db
      .collection("dashboard")
      .limit(1)
      .get();
    const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
    const dashboardData = dashboardQuerySnapshot.docs[0].data();

    const existingBranches = dashboardData.data || [];
    const existingBranches2 = dashboardData.data2 || [];

    if (data.type === "cardDistribute") {
      const cardD = parseInt(income["total"]["cardDistribute"]);
      console.log(dashboardDataBranch[data.branchId]);
      const newData = {
        ...dashboardDataBranch[data.branchId],
        CardDistribute: parseInt(cardD),
        TotalExpense: parseInt(totalSalary),
        TotalProfit: parseInt(totalIncome),
        Status: parseInt(totalIncome) - parseInt(totalSalary),
      };
      console.log(newData);
      const updatedData = {
        ...dashboardDataBranch,
        [data.branchId]: newData,
      };

      console.log(updatedData);
      await dashboardDocRefBranch.update(updatedData);

      const updatedBranches = existingBranches.map((branch) => {
        if (branch.ID === data.branchId) {
          return {
            ...branch,
            BranchIncome: parseInt(totalIncome),
            BranchExpense: parseInt(totalSalary),
          };
        }
        return branch;
      });
      const updatedBranches2 = existingBranches2.map((branch) => {
        if (branch.Name === "Card") {
          return {
            ...branch,
            Amount:
              branch.Amount +
              parseInt(data.numberOfCard) *
                parseInt(servicePrice.card_distribute_gain),
          };
        }
        return branch;
      });

      let totalBIncome = 0;
      let totalExpense = 0;
      console.log(existingBranches);
      for (const obj of updatedBranches) {
        totalBIncome += parseInt(obj.BranchIncome);
        totalExpense += parseInt(obj.BranchExpense);
      }

      console.log(totalBIncome);
      console.log(totalExpense);
      await dashboardDocRef.update({
        totalIncome: totalBIncome,
        totalExpense: totalExpense,
        data: updatedBranches,
        data2: updatedBranches2,
      });
    } else if (data.type === "wifiDistribute") {
      const wifiD = parseInt(income["total"]["wifiDistribute"]);
      console.log(dashboardDataBranch[data.branchId]);
      const newData = {
        ...dashboardDataBranch[data.branchId],
        WifiDistribute: parseInt(wifiD),
        TotalExpense: parseInt(totalSalary),
        TotalProfit: parseInt(totalIncome),
        Status: parseInt(totalIncome) - parseInt(totalSalary),
      };
      console.log(newData);
      const updatedData = {
        ...dashboardDataBranch,
        [data.branchId]: newData,
      };

      console.log(updatedData);
      await dashboardDocRefBranch.update(updatedData);

      const updatedBranches = existingBranches.map((branch) => {
        if (branch.ID === data.branchId) {
          return {
            ...branch,
            BranchIncome: parseInt(totalIncome),
            BranchExpense: parseInt(totalSalary),
          };
        }
        return branch;
      });
      const updatedBranches2 = existingBranches2.map((branch) => {
        if (branch.Name === "Wifi") {
          return {
            ...branch,
            Amount:
              branch.Amount +
              parseInt(data.numberOfCard) *
                parseInt(servicePrice.wifi_distribute_gain),
          };
        }
        return branch;
      });

      let totalBIncome = 0;
      let totalExpense = 0;
      console.log(existingBranches);
      for (const obj of updatedBranches) {
        totalBIncome += parseInt(obj.BranchIncome);
        totalExpense += parseInt(obj.BranchExpense);
      }

      console.log(totalBIncome);
      console.log(totalExpense);
      await dashboardDocRef.update({
        totalIncome: totalBIncome,
        totalExpense: totalExpense,
        data: updatedBranches,
        data2: updatedBranches2,
      });
    } else if (data.type === "waterDistribute") {
      const waterD = parseInt(income["total"]["waterDistribute"]);

      console.log(dashboardDataBranch[data.branchId]);
      const newData = {
        ...dashboardDataBranch[data.branchId],
        WaterDistribute: parseInt(waterD),
        TotalExpense: parseInt(totalSalary),
        TotalProfit: parseInt(totalIncome),
        Status: parseInt(totalIncome) - parseInt(totalSalary),
      };
      console.log(newData);
      const updatedData = {
        ...dashboardDataBranch,
        [data.branchId]: newData,
      };

      console.log(updatedData);
      await dashboardDocRefBranch.update(updatedData);

      const updatedBranches = existingBranches.map((branch) => {
        if (branch.ID === data.branchId) {
          return {
            ...branch,
            BranchIncome: parseInt(totalIncome),
            BranchExpense: parseInt(totalSalary),
          };
        }
        return branch;
      });
      const updatedBranches2 = existingBranches2.map((branch) => {
        if (branch.Name === "Water") {
          return {
            ...branch,
            Amount:
              branch.Amount +
              parseInt(data.numberOfCard) *
                parseInt(servicePrice.water_distribute_gain),
          };
        }
        return branch;
      });

      let totalBIncome = 0;
      let totalExpense = 0;
      console.log(existingBranches);
      for (const obj of updatedBranches) {
        totalBIncome += parseInt(obj.BranchIncome);
        totalExpense += parseInt(obj.BranchExpense);
      }

      console.log(totalBIncome);
      console.log(totalExpense);
      await dashboardDocRef.update({
        totalIncome: totalBIncome,
        totalExpense: totalExpense,
        data: updatedBranches,
        data2: updatedBranches2,
      });
    }

    const newDailyCredit = {
      active: summaryId,
      amount: parseInt(newData1.total),
      branchId: data.branchId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      date: data.date,
      deliveryguyId: data.deliveryguyId,
      deliveryguyName: data.deliveryguyName,
      openingDate: admin.firestore.FieldValue.serverTimestamp(),
      reason: data.type,
      type: "DailyCredit",
    };
    await admin.firestore().collection("DailyCredit").add(newDailyCredit);

    await updateCreditDocument(
      data.branchId,
      "DailyCredit",
      parseInt(newData1.total)
    );

    const totalCredit = await getDocumentById("totalCredit", data.branchId);
    const Credits = totalCredit["total"];
    console.log(Credits);
    await updateBalance(summaryId, parseInt(Credits), "credit");
    await updateFieldInDocument(
      "Budget",
      data.branchId,
      "totalCredit",
      parseFloat(Credits)
    );

    const docRef = db.collection("deliveryguy").doc(data.deliveryguyId);

    // Get the document data
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      console.log("Document does not exist.");
      return;
    }

    const currentExpense = docSnapshot.data().dailyCredit || 0; // Default to 0 if the field doesn't exist

    // Calculate the new totalExpense by adding the newExpense
    const updatedExpense = currentExpense + parseInt(newData1.total);

    // Update the document with the new totalExpense
    await docRef.update({ dailyCredit: updatedExpense });
    res.status(200).json({ message: "Table updated successfully." });
  } catch (error) {
    console.error("Error updating status:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating status." });
  }
};

module.exports = {
  HotelProfit,
  Collect,
  Distribute,
  CreateReport,
  updateReport,
  deleteReport,
};
