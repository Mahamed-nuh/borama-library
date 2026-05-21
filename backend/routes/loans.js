const express = require('express');
const router = express.Router();
const { createLoan, getAllLoans, returnLoan, extendLoan } = require('../controllers/loanController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, createLoan);
router.get('/', authMiddleware, getAllLoans);
router.put('/:loanId/return', authMiddleware, returnLoan);
router.put('/:loanId/extend', authMiddleware, extendLoan);

module.exports = router;
