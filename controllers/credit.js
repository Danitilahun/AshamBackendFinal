const generateSalaryFile = require("../utils/SalaryTable");
const admin = require("../config/firebase-admin");
const getDocumentById = require("../utils/getDocumentById");
const getSingleDocFromCollection = require("../utils/getSingleDocFromCollection");
const RemoveSalaryFile = require("../utils/removeFromSalary");
const updateBalance = require("../utils/updateBalance");
const updateCreditDocument = require("../utils/updateCreditDocument");
const updateDataForId = require("../utils/updateDataForId");
const updateFieldInDocument = require("../utils/updateFieldInDocument");
const updateStatus = require("../utils/updateStatusDoc");

const createCredit = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    let salary = {};
    if (data.active) {
      if (data.placement === "DeliveryGuy") {
        salary = await getDocumentById("salary", data.active);
      } else if (
        ["Cleaner", "Keeper", "Bike Technician", "Wifi Technician"].includes(
          data.placement
        )
      ) {
        salary = await getDocumentById("staffSalary", data.active);
      }
    }

    if (
      data.type === "StaffCredit" &&
      [
        "DeliveryGuy",
        "Cleaner",
        "Keeper",
        "Bike Technician",
        "Wifi Technician",
      ].includes(data.placement)
    ) {
      const balance = salary[data.deliveryguyId]["total"];
      console.log("your balance is ", balance);
      if (parseInt(balance) < parseInt(data.amount))
        return res.status(200).json({
          message:
            "You do not have enough balance to take credit. Please make a payment to your account.",
        });
    }
    const db = admin.firestore();
    if (!data.isHolidayBonus) {
      const creditCollection = db.collection(data.type); // Assuming you have a "credits" collection
      data.openingDate = new Date();
      data.createdAt = admin.firestore.FieldValue.serverTimestamp();
      await creditCollection.add(data);
    }
    if (data.type === "Essentials") {
      return res
        .status(200)
        .json({ message: `Essentials entry added successfully.` });
    }
    if (data.type !== "Bonus" && data.type !== "Penality") {
      if (data.type === "StaffCredit" && data.placement === "DeliveryGuy") {
      } else {
        await updateCreditDocument(
          data.branchId,
          data.type,
          parseInt(data.amount)
        );

        const totalCredit = await getDocumentById("totalCredit", data.branchId);
        const Credits = totalCredit["total"];
        console.log(Credits);
        await updateBalance(data.active, parseInt(Credits), "credit");

        await updateFieldInDocument(
          "Budget",
          data.branchId,
          "totalCredit",
          parseFloat(Credits)
        );
      }
    }

    if (
      data.type === "StaffCredit" ||
      data.type === "Bonus" ||
      data.type === "Penality"
    ) {
      // console.log("the data is ", data);
      // console.log("here", data.type, data.placement);
      const salaryUpdate = generateSalaryFile(data);
      console.log(data.type, salaryUpdate);
      // console.log(data.role);
      if (data.role === "DeliveryGuy" || data.placement === "DeliveryGuy") {
        console.log("here in delivery guy");
        await updateDataForId(
          "salary",
          data.active,
          data.deliveryguyId,
          salaryUpdate,
          "total",
          salaryUpdate
        );
      } else if (data.role) {
        console.log("here in staff");
        await updateDataForId(
          "staffSalary",
          data.active,
          data.deliveryguyId,
          salaryUpdate,
          "total",
          salaryUpdate
        );
        if (data.isHolidayBonus) {
          await updateDataForId(
            "staffSalary",
            data.active,
            data.deliveryguyId,
            {
              holidayBonus: parseInt(data.amount),
              total: parseInt(data.amount),
            },
            "total",
            {
              holidayBonus: parseInt(data.amount),
              total: parseInt(data.amount),
            }
          );
        }
      } else if (
        ["Cleaner", "Keeper", "Bike Technician", "Wifi Technician"].includes(
          data.placement
        )
      ) {
        console.log("here");
        await updateDataForId(
          "staffSalary",
          data.active,
          data.deliveryguyId,
          salaryUpdate,
          "total",
          salaryUpdate
        );
      }

      if (data.role === "DeliveryGuy" || data.placement === "DeliveryGuy") {
        // console.log("salary", salary);
        console.log("total salary", salary["total"]["total"]);

        const branches = await getDocumentById("branches", data.branchId);

        console.log(branches["numberofworker"]);

        const Price = await getSingleDocFromCollection("prices");

        console.log(Price["fixedSalary"]);

        const totalSalary =
          parseInt(Price["fixedSalary"]) *
            parseInt(branches["numberofworker"]) +
          parseInt(salary["total"]["total"]);

        await updateStatus(
          data.active,
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

        const newData = {
          ...dashboardDataBranch[data.branchId],
          TotalExpense: parseInt(totalSalary),
          Status:
            parseInt(dashboardDataBranch[data.branchId]["TotalProfit"]) -
            parseInt(totalSalary),
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
        const updatedBranches = existingBranches.map((branch) => {
          if (branch.ID === data.branchId) {
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
          totalExpense += parseInt(obj.BranchExpense);
        }

        console.log(totalExpense);
        await dashboardDocRef.update({
          totalExpense: totalExpense,
          data: updatedBranches,
        });
      }
    }

    if (data.placement === "DeliveryGuy" || data.role === "DeliveryGuy") {
      const docRef = db.collection("deliveryguy").doc(data.deliveryguyId);

      // Get the document data
      const docSnapshot = await docRef.get();

      if (!docSnapshot.exists) {
        console.log("Document does not exist.");
        return;
      }

      const currentExpense = docSnapshot.data().dailyCredit || 0; // Default to 0 if the field doesn't exist

      // Calculate the new totalExpense by adding the newExpense
      const updatedExpense = currentExpense + parseInt(data.amount);

      // Update the document with the new totalExpense
      await docRef.update({ dailyCredit: updatedExpense });
    }
    res.status(200).json({ message: `Credit entry added successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateCredit = async (req, res) => {
  const db = admin.firestore();
  try {
    const { id } = req.params;
    const data = req.body;
    console.log(data);
    await admin.firestore().collection(data.type).doc(id).update(data);
    if (data.type === "Essentials") {
      return res
        .status(200)
        .json({ message: `Credit entry added successfully.` });
    }
    if (data.type !== "Bonus" && data.type !== "Penality") {
      if (data.type === "StaffCredit" && data.placement === "DeliveryGuy") {
      } else {
        // await updateCreditDocument(data.active, data.type, parseInt(data.diff));
        await updateCreditDocument(
          data.branchId,
          data.type,
          parseInt(data.diff)
        );
        const totalCredit = await getDocumentById("totalCredit", data.branchId);
        const Credits = totalCredit["total"];
        console.log(Credits);
        await updateBalance(data.active, parseInt(Credits), "credit");
        await updateFieldInDocument(
          "Budget",
          data.branchId,
          "totalCredit",
          parseFloat(Credits)
        );
      }
    }

    if (
      data.type === "StaffCredit" ||
      data.type === "Bonus" ||
      data.type === "Penality"
    ) {
      const salaryUpdate = generateSalaryFile(data);
      console.log(data.type, salaryUpdate);

      if (data.role === "DeliveryGuy" || data.placement === "DeliveryGuy") {
        console.log("here in delivery guy");
        await updateDataForId(
          "salary",
          data.active,
          data.deliveryguyId,
          salaryUpdate,
          "total",
          salaryUpdate
        );
      } else if (data.role) {
        console.log("here in staff");
        await updateDataForId(
          "staffSalary",
          data.active,
          data.deliveryguyId,
          salaryUpdate,
          "total",
          salaryUpdate
        );
        if (data.isHolidayBonus) {
          await updateDataForId(
            "staffSalary",
            data.active,
            data.deliveryguyId,
            {
              holidayBonus: parseInt(data.diff),
              total: parseInt(data.diff),
            },
            "total",
            {
              holidayBonus: parseInt(data.diff),
              total: parseInt(data.diff),
            }
          );
        }
      } else if (
        ["Cleaner", "Keeper", "Bike Technician", "Wifi Technician"].includes(
          data.placement
        )
      ) {
        console.log("here");
        await updateDataForId(
          "staffSalary",
          data.active,
          data.deliveryguyId,
          salaryUpdate,
          "total",
          salaryUpdate
        );
      }
      if (data.role === "DeliveryGuy" || data.placement === "DeliveryGuy") {
        // console.log("salary", salary);
        console.log("total salary", salary["total"]["total"]);

        const branches = await getDocumentById("branches", data.branchId);

        // console.log(branches["numberofworker"]);

        const Price = await getSingleDocFromCollection("prices");

        // console.log(Price["fixedSalary"]);

        const totalSalary =
          parseInt(Price["fixedSalary"]) *
            parseInt(branches["numberofworker"]) +
          parseInt(salary["total"]["total"]);

        await updateStatus(
          data.active,
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

        const newData = {
          ...dashboardDataBranch[data.branchId],
          TotalExpense: parseInt(totalSalary),
          Status:
            parseInt(dashboardDataBranch[data.branchId]["TotalProfit"]) -
            parseInt(totalSalary),
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
        const updatedBranches = existingBranches.map((branch) => {
          if (branch.ID === data.branchId) {
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
          totalExpense += parseInt(obj.BranchExpense);
        }

        console.log(totalExpense);
        await dashboardDocRef.update({
          totalExpense: totalExpense,
          data: updatedBranches,
        });
      }
    }

    if (data.placement === "DeliveryGuy" || data.role === "DeliveryGuy") {
      const docRef = db.collection("deliveryguy").doc(data.deliveryguyId);

      // Get the document data
      const docSnapshot = await docRef.get();

      if (!docSnapshot.exists) {
        console.log("Document does not exist.");
        return;
      }

      const currentExpense = docSnapshot.data().dailyCredit || 0; // Default to 0 if the field doesn't exist

      // Calculate the new totalExpense by adding the newExpense
      const updatedExpense = currentExpense + parseInt(data.diff);

      // Update the document with the new totalExpense
      await docRef.update({ dailyCredit: updatedExpense });
    }
    res.status(200).json({ message: `Credit entry updated successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const RemoveCredit = async (req, res) => {
  const db = admin.firestore();
  try {
    console.log(data);
    // await admin.firestore().collection(data.type).doc(id).update(data);
    if (data.type !== "Bonus" && data.type !== "Penality") {
      if (data.type === "StaffCredit" && data.placement === "DeliveryGuy") {
      } else {
        // await updateCreditDocument(
        //   data.active,
        //   data.type,
        //   -parseInt(data.amount)
        // );

        await updateCreditDocument(
          data.branchId,
          data.type,
          -parseInt(data.amount)
        );
        const totalCredit = await getDocumentById("totalCredit", data.branchId);
        const Credits = totalCredit["total"];
        console.log(Credits);
        await updateBalance(data.active, parseInt(Credits), "credit");
        await updateFieldInDocument(
          "Budget",
          data.branchId,
          "totalCredit",
          parseFloat(Credits)
        );
      }
    }
    if (
      data.type === "StaffCredit" ||
      data.type === "Bonus" ||
      data.type === "Penality"
    ) {
      const salaryUpdate = RemoveSalaryFile(data);
      console.log(data.type, salaryUpdate);
      if (data.role === "DeliveryGuy" || data.placement === "DeliveryGuy") {
        console.log("here in delivery guy");
        await updateDataForId(
          "salary",
          data.active,
          data.deliveryguyId,
          salaryUpdate,
          "total",
          salaryUpdate
        );
      } else if (data.role) {
        console.log("here in staff");
        await updateDataForId(
          "staffSalary",
          data.active,
          data.deliveryguyId,
          salaryUpdate,
          "total",
          salaryUpdate
        );
        if (data.isHolidayBonus) {
          await updateDataForId(
            "staffSalary",
            data.active,
            data.deliveryguyId,
            {
              holidayBonus: -parseInt(data.amount),
              total: -parseInt(data.amount),
            },
            "total",
            {
              holidayBonus: -parseInt(data.amount),
              total: -parseInt(data.amount),
            }
          );
        }
      } else if (
        ["Cleaner", "Keeper", "Bike Technician", "Wifi Technician"].includes(
          data.placement
        )
      ) {
        console.log("here");
        await updateDataForId(
          "staffSalary",
          data.active,
          data.deliveryguyId,
          salaryUpdate,
          "total",
          salaryUpdate
        );
      }

      if (data.role === "DeliveryGuy" || data.placement === "DeliveryGuy") {
        // console.log("salary", salary);
        console.log("total salary", salary["total"]["total"]);

        const branches = await getDocumentById("branches", data.branchId);

        // console.log(branches["numberofworker"]);

        const Price = await getSingleDocFromCollection("prices");

        // console.log(Price["fixedSalary"]);

        const totalSalary =
          parseInt(Price["fixedSalary"]) *
            parseInt(branches["numberofworker"]) +
          parseInt(salary["total"]["total"]);

        await updateStatus(
          data.active,
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

        const newData = {
          ...dashboardDataBranch[data.branchId],
          TotalExpense: parseInt(totalSalary),
          Status:
            parseInt(dashboardDataBranch[data.branchId]["TotalProfit"]) -
            parseInt(totalSalary),
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
        const updatedBranches = existingBranches.map((branch) => {
          if (branch.ID === data.branchId) {
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
          totalExpense += parseInt(obj.BranchExpense);
        }

        console.log(totalExpense);
        await dashboardDocRef.update({
          totalExpense: totalExpense,
          data: updatedBranches,
        });
      }
    }

    if (data.placement === "DeliveryGuy" || data.role === "DeliveryGuy") {
      const docRef = db.collection("deliveryguy").doc(data.deliveryguyId);

      // Get the document data
      const docSnapshot = await docRef.get();

      if (!docSnapshot.exists) {
        console.log("Document does not exist.");
        return;
      }

      const currentExpense = docSnapshot.data().dailyCredit || 0; // Default to 0 if the field doesn't exist

      // Calculate the new totalExpense by adding the newExpense
      const updatedExpense = currentExpense - parseInt(data.amount);

      // Update the document with the new totalExpense
      await docRef.update({ dailyCredit: updatedExpense });
    }

    res.status(200).json({ message: `Credit entry updated successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteCredit = async (req, res) => {
  try {
    const { collection, id } = req.params;
    console.log(id);
    await admin.firestore().collection(collection).doc(id).delete();
    res.status(200).json({ message: `Credit entry deleted successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCredit,
  updateCredit,
  RemoveCredit,
  deleteCredit,
};
