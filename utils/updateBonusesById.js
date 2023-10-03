const admin = require("../config/firebase-admin");
const getAllDeliveryGuysByBranchId = require("./getAllDeliveryGuyIdsByBranchId");
const getDocumentById = require("./getDocumentById");
const getSingleDocFromCollection = require("./getSingleDocFromCollection");
const updateStatus = require("./updateStatusDoc");

const addHolidayBonusToDocument = async (docId, holidayBonus, branchId) => {
  const docRef = admin.firestore().collection("salary").doc(docId);

  try {
    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      const docData = docSnapshot.data();
      const updatedData1 = {};
      const branches = await getDocumentById("branches", branchId);
      console.log(docData);
      let totalHoliday = 0;

      for (const key in docData) {
        if (
          key !== "total" &&
          docData.hasOwnProperty(key) &&
          typeof docData[key].bonus === "number"
        ) {
          const deliveryGuy = await getDocumentById("deliveryguy", key);
          if (deliveryGuy.activeness) {
            totalHoliday = totalHoliday + holidayBonus;
            updatedData1[key] = {
              ...docData[key],
              holidayBonus:
                parseInt(docData[key].holidayBonus) + parseInt(holidayBonus),
              total: docData[key].total + parseInt(holidayBonus),
            };
          }
        }
      }

      updatedData1.total = docData.total;
      updatedData1.branchId = docData.branchId;
      updatedData1.sheetId = docData.sheetId;
      updatedData1.total.total =
        parseInt(updatedData1.total.total) + parseInt(totalHoliday);
      updatedData1["total"]["holidayBonus"] =
        parseInt(updatedData1["total"]["holidayBonus"]) +
        parseInt(totalHoliday);
      console.log(updatedData1.total);

      console.log("total salary", updatedData1["total"]["total"]);
      const Price = await getSingleDocFromCollection("prices");
      console.log(Price["fixedSalary"]);
      const totalSalary =
        parseInt(Price["fixedSalary"]) * parseInt(branches["numberofworker"]) +
        parseInt(updatedData1["total"]["total"]);

      console.log(totalSalary);
      await docRef.update(updatedData1);

      const dashboardQuerySnapshotBranch = await db
        .collection("branchInfo")
        .limit(1)
        .get();

      const dashboardDocRefBranch = dashboardQuerySnapshotBranch.docs[0].ref;
      const dashboardDataBranch = dashboardQuerySnapshotBranch.docs[0].data();

      const newData = {
        ...dashboardDataBranch[branchId],
        TotalExpense: parseInt(totalSalary),
        Status:
          parseInt(dashboardDataBranch[branchId]["TotalProfit"]) -
          parseInt(totalSalary),
      };
      console.log(newData);
      const updatedData = {
        ...dashboardDataBranch,
        [branchId]: newData,
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
      const updatedBranches = existingBranches.map((branch) => {
        if (branch.ID === branchId) {
          return {
            ...branch,
            BranchExpense: parseInt(totalSalary),
          };
        }
        return branch;
      });

      // branchesSnapshot.docs.map((doc) => console.log(doc.data()));

      let totalExpense = 0;
      console.log(existingBranches);
      for (const obj of updatedBranches) {
        totalExpense = parseInt(totalExpense) + parseInt(obj.BranchExpense);
      }

      console.log(totalExpense);
      await dashboardDocRef.update({
        totalExpense: totalExpense,
        data: updatedBranches,
      });

      await updateStatus(
        docId,
        "totalStaffSalary",
        "totalExpense",
        totalSalary,
        totalSalary,
        "salary"
      );
      return true;
    } else {
      return false; // Document doesn't exist
    }
  } catch (error) {
    console.error("Error adding holiday bonuses:", error);
    return false;
  }
};

module.exports = addHolidayBonusToDocument;
