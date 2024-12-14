const express = require("express");
const {authMiddleware} = require("../middleware");
const {User, Account} = require("../db");

const router = express.Router();

router.get("/checkbalance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({userId: req.userId});
    res.status(200).json({balance: account.balance});
  } catch(error) {
    res.status(500).json({message: "Error fetching from database!"});
  }
})

router.post("/pay", authMiddleware, async (req, res) => {
  const amount = req.body.amount;
  const recipient = req.body.recipient;
  const sender = req.userId;

  //let senderAccount, recieverAccount;

  try {
    const senderAccount = Account.findOne({userId: sender});
    if (!senderAccount) {
      return res.status(400).json({message: "Something wrong occured!"});
    } else if  (senderAccount.balance < amount) {
      return res.status(400).json({message: "Insufficient balance!"});
    }
  } catch (error) {
    return res.status(404).json({message: "Error occured!"});
  }

  try {
    const recieverAccount = Account.findOne({userId: recipient});
    if ((!senderAccount) || (senderAccount.balance < amount)) {
      return res.status(400).json({message: "Reciever does not exist!"});
    }
  } catch (error) {
    return res.status(404).json({message: "Error occured!"});
  }


  try {
    await Account.updateOne({ userId: sender}, { $inc: { balance: -amount } });
    await Account.updateOne({ userId: recipient }, { $inc: { balance: amount } });
    res.status(200).json({message: "Transaction successful."});
    return;
  } catch(error) {
    return res.status(404).json({message: "Error occured!"});
  }

})
module.exports = router;