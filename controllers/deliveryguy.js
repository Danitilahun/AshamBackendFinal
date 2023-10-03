// Import required modules
const admin = require("firebase-admin");
const { v4: UUID } = require("uuid");
const parseForm = require("../utils/formParser");
const uploadProfileImage = require("../utils/imageUploader");
const createUserDocument = require("../utils/createUserDocument");
const getInternationalDate = require("../utils/getInternationalDate");
const addElementAndField = require("../utils/addElementAndField");
const getDefaultDataObject = require("../utils/createWork");
const getDefaultDataObject2 = require("../utils/createSalary");
const incrementFieldByOne = require("../utils/incrementByOne");
const getDocumentById = require("../utils/getDocumentById");
const pushToFieldArray = require("../utils/pushToFieldArray");

// Main function to create admin data
const createDeliveryGuyData = async (req, res) => {
  try {
    const { fields, files } = await parseForm(req);
    console.log(fields);
    const date = getInternationalDate();
    console.log(date);
    let uuid = UUID();
    if (fields.type === "deliveryguy") {
      if (fields.activeTable) {
        let Work = getDefaultDataObject();
        Work.name = fields.fullName;
        Work.uniqueName = fields.uniqueName;
        await addElementAndField("tables", fields.activeTable, {
          [uuid]: Work,
        });
      }

      if (fields.active) {
        const Work = getDefaultDataObject();
        Work.name = fields.fullName;
        Work.uniqueName = fields.uniqueName;
        const salary = getDefaultDataObject2();
        salary.name = fields.fullName;
        salary.uniqueName = fields.uniqueName;
        await addElementAndField("tables", fields.active, {
          [uuid]: Work,
        });
        await addElementAndField("salary", fields.active, {
          [uuid]: salary,
        });
      }
    } else {
      if (fields.active) {
        const Work = {
          bonus: 0,
          penality: 0,
          fixedSalary: parseInt(fields.salary),
          holidayBonus: 0,
          totalCredit: 0,
          total: parseInt(fields.salary),
        };
        Work.name = fields.fullName;
        Work.uniqueName = fields.uniqueName;

        await addElementAndField(
          "staffSalary",
          fields.active,
          {
            [uuid]: Work,
          },
          (salary = parseInt(fields.salary))
        );
      }
    }

    let uid = UUID();
    const imageUrl = await uploadProfileImage(
      files.profileImage,
      uid,
      fields.type
    );

    if (fields.type === "deliveryguy") {
      delete fields.active;
      delete fields.activeTable;
      console.log(imageUrl);
    } else {
      delete fields.active;
    }

    await createUserDocument(uuid, fields, imageUrl, fields.type);
    await incrementFieldByOne("branches", fields.branch, "numberofworker", 1);
    await pushToFieldArray("branches", fields.branch, "worker", {
      id: uuid,
      name: fields.fullName,
      role: fields.role,
    });
    const dashboardQuerySnapshot = await db
      .collection("dashboard")
      .limit(1)
      .get();

    if (dashboardQuerySnapshot.empty) {
      return res.status(404).json({ error: "Dashboard document not found" });
    }

    const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
    const dashboardData = dashboardQuerySnapshot.docs[0].data();

    // Update the existing branches data with the new branch
    const newEmploye = dashboardData.totalEmployees + 1;

    await dashboardDocRef.update({
      totalEmployees: newEmploye,
    });

    res.status(201).json({ message: "User registration successful!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateDeliveryGuyData = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await admin.firestore().collection("deliveryguy").doc(id).update(data);
    res.status(200).json({ message: "Delivery guy updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;
    const { fields, files } = await parseForm(req);

    let uuid = UUID();

    const imageUrl = await uploadProfileImage(
      files.profileImage,
      uuid,
      "admin"
    );

    data = {
      profileImage: imageUrl,
    };

    // console.log("data", data);
    await admin.firestore().collection("deliveryguy").doc(id).update(data);
    res.status(200).json({ message: "Data updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
const deleteDeliveryGuyData = async (req, res) => {
  try {
    const { id, branchId } = req.params;
    const person = await getDocumentById("deliveryguy", id);
    await admin.firestore().collection("deliveryguy").doc(id).delete();
    await incrementFieldByOne("branches", branchId, "numberofworker", -1);
    const dashboardQuerySnapshot = await db
      .collection("dashboard")
      .limit(1)
      .get();

    if (dashboardQuerySnapshot.empty) {
      return res.status(404).json({ error: "Dashboard document not found" });
    }

    const dashboardDocRef = dashboardQuerySnapshot.docs[0].ref;
    const dashboardData = dashboardQuerySnapshot.docs[0].data();

    const newEmploye = dashboardData.totalEmployees - 1;
    await dashboardDocRef.update({
      totalEmployees: newEmploye,
    });
    res.status(200).json({ message: "Delivery guy deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDeliveryGuyData,
  updateDeliveryGuyData,
  deleteDeliveryGuyData,
  updateProfilePicture,
};
