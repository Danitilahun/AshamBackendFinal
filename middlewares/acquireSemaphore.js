const admin = require("firebase-admin");
const firestore = admin.firestore();

const acquireSemaphoreWithRetry = (req, res, next) => {
  const { branchId } = req.body;

  if (!branchId) {
    return res
      .status(400)
      .json({ error: "Branch ID is missing in the request body" });
  }

  const semaphoreDoc = firestore.collection("semaphores").doc(branchId);

  const tryAcquireSemaphore = () => {
    firestore.runTransaction(async (transaction) => {
      try {
        const semaphoreData = await transaction.get(semaphoreDoc);
        let semaphoreState = semaphoreData.data() || {
          locked: false,
          timestamp: null,
        };

        // Check if the semaphore has been locked for more than a minute
        if (semaphoreState.locked && semaphoreState.timestamp) {
          const totalSeconds =
            semaphoreState.timestamp._seconds +
            semaphoreState.timestamp._nanoseconds / 1e9;

          const currentTime = admin.firestore.Timestamp.now();
          const currentTotalSeconds =
            currentTime._seconds + currentTime._nanoseconds / 1e9;

          const timeDiffInMillis = currentTotalSeconds - totalSeconds;
          console.log(timeDiffInMillis);
          if (timeDiffInMillis >= 60) {
            // 1 minute in seconds
            // Automatically release the semaphore
            console.log(
              `Semaphore for branch ${branchId} has been locked for more than a minute and is automatically released.`
            );
            semaphoreState = { locked: false, timestamp: null };
            transaction.update(semaphoreDoc, {
              locked: false,
              timestamp: null,
            });
          }
        }

        if (semaphoreState.locked) {
          console.log(
            `Semaphore for branch ${branchId} is already locked. Retrying after delay...`
          );

          setTimeout(() => {
            tryAcquireSemaphore();
          }, 1000);
        } else {
          console.log(`Acquiring semaphore for branch ${branchId}`);
          transaction.set(semaphoreDoc, {
            locked: true,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          });
          semaphoreState = {
            locked: true,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          };
          req.releaseSemaphore = async () => {
            await semaphoreDoc.update({
              locked: false,
              timestamp: null,
            });
            console.log(
              `Semaphore for branch ${branchId} has been manually released.`
            );
          };
          next();
        }
      } catch (error) {
        console.error("Error acquiring semaphore:", error);
        res.status(500).json({ error: "Error acquiring semaphore" });
      }
    });
  };

  tryAcquireSemaphore();
};

module.exports = { acquireSemaphoreWithRetry };
