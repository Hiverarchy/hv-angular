/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

admin.initializeApp();

const corsHandler = cors({origin: true});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const getUserInfo = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      const {uid} = request.body.data;

      if (!uid) {
        response.status(400).send({
          error: {
            message: "The function must be called with a valid uid.",
            status: "INVALID_ARGUMENT",
          },
        });
        return;
      }

      const userDoc = await admin
        .firestore()
        .collection("users")
        .doc(uid)
        .get();

      if (!userDoc.exists) {
        response.status(404).send({
          error: {
            message: "No user found with the given uid.",
            status: "NOT_FOUND",
          },
        });
        return;
      }

      response.status(200).send({data: userDoc.data()});
    } catch (error) {
      console.error("Error fetching user info:", error);
      response.status(500).send({
        error: {
          message: "An error occurred while fetching user info.",
          status: "INTERNAL",
        },
      });
    }
  });
});
