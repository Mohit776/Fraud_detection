    import { llmApi } from '../api';

/**
 * Fraud Detection API Services
 * Connects to FastAPI backend for ML-powered analysis
 * 
 * FastAPI endpoints:
 * - /spending/analyze - Spending anomaly detection
 * - /legal/analyze - Legal document scanner
 * - /welfare/analyze - Welfare fraud detection
 * - /bidrigging/analyze - Bid rigging/collusion detection
 * - /health - Health check
 */

// ============== Spending Anomaly Detection ==============

/**
 * Analyze spending transactions for anomalies
 * @param {Array} transactions - Array of transaction objects with amount and V1-V28 features
 * @returns {Promise<Object>} Analysis results with risk scores
 */
export const analyzeSpending = async (transactions) => {
    const response = await llmApi.post('/spending/analyze', {
        transactions: transactions.map(tx => ({
            amount: tx.amount || 0,
            v1: tx.v1 || 0, v2: tx.v2 || 0, v3: tx.v3 || 0, v4: tx.v4 || 0,
            v5: tx.v5 || 0, v6: tx.v6 || 0, v7: tx.v7 || 0, v8: tx.v8 || 0,
            v9: tx.v9 || 0, v10: tx.v10 || 0, v11: tx.v11 || 0, v12: tx.v12 || 0,
            v13: tx.v13 || 0, v14: tx.v14 || 0, v15: tx.v15 || 0, v16: tx.v16 || 0,
            v17: tx.v17 || 0, v18: tx.v18 || 0, v19: tx.v19 || 0, v20: tx.v20 || 0,
            v21: tx.v21 || 0, v22: tx.v22 || 0, v23: tx.v23 || 0, v24: tx.v24 || 0,
            v25: tx.v25 || 0, v26: tx.v26 || 0, v27: tx.v27 || 0, v28: tx.v28 || 0,
        }))
    });
    return response.data;
};

/**
 * Quick check for a single transaction
 * @param {Object} transaction - Single transaction object
 * @returns {Promise<Object>} Risk assessment for the transaction
 */
export const checkSingleTransaction = async (transaction) => {
    const response = await llmApi.post('/spending/check-single', {
        amount: transaction.amount || 0,
        v1: transaction.v1 || 0, v2: transaction.v2 || 0, v3: transaction.v3 || 0, v4: transaction.v4 || 0,
        v5: transaction.v5 || 0, v6: transaction.v6 || 0, v7: transaction.v7 || 0, v8: transaction.v8 || 0,
        v9: transaction.v9 || 0, v10: transaction.v10 || 0, v11: transaction.v11 || 0, v12: transaction.v12 || 0,
        v13: transaction.v13 || 0, v14: transaction.v14 || 0, v15: transaction.v15 || 0, v16: transaction.v16 || 0,
        v17: transaction.v17 || 0, v18: transaction.v18 || 0, v19: transaction.v19 || 0, v20: transaction.v20 || 0,
        v21: transaction.v21 || 0, v22: transaction.v22 || 0, v23: transaction.v23 || 0, v24: transaction.v24 || 0,
        v25: transaction.v25 || 0, v26: transaction.v26 || 0, v27: transaction.v27 || 0, v28: transaction.v28 || 0,
    });
    return response.data;
};

// ============== Legal Document Scanner ==============

/**
 * Analyze a document for suspicious/fabricated language
 * @param {string} text - Document text to analyze
 * @returns {Promise<Object>} Analysis with risk score and status
 */
export const analyzeLegalDocument = async (text) => {
    const response = await llmApi.post('/legal/analyze', { text });
    return response.data;
};

/**
 * Batch analyze multiple documents
 * @param {Array<string>} documents - Array of document texts
 * @returns {Promise<Object>} Analysis results for all documents
 */
export const batchAnalyzeLegalDocuments = async (documents) => {
    const response = await llmApi.post('/legal/batch-analyze',
        documents.map(text => ({ text }))
    );
    return response.data;
};

// ============== Welfare Fraud Detection ==============

/**
 * Analyze welfare/healthcare claims for fraud
 * @param {Array} claims - Array of claim objects
 * @returns {Promise<Object>} Fraud detection results
 */
export const analyzeWelfareClaims = async (claims) => {
    const response = await llmApi.post('/welfare/analyze', {
        claims: claims.map(claim => ({
            claim_id: claim.claimId || claim.claim_id,
            duration_days: claim.durationDays || claim.duration_days || 0,
            total_cost: claim.totalCost || claim.total_cost || 0,
            insc_claim_amt_reimbursed: claim.inscClaimAmtReimbursed || claim.insc_claim_amt_reimbursed || 0,
            op_annual_reimbursement_amt: claim.opAnnualReimbursementAmt || claim.op_annual_reimbursement_amt || 0,
            ip_annual_reimbursement_amt: claim.ipAnnualReimbursementAmt || claim.ip_annual_reimbursement_amt || 0,
        }))
    });
    return response.data;
};

// ============== Bid Rigging/Collusion Detection ==============

/**
 * Analyze a vendor for bid rigging/cartel connections
 * @param {string} vendorId - Vendor/participant code to analyze
 * @returns {Promise<Object>} Cartel analysis results
 */
export const analyzeBidRigging = async (vendorId) => {
    const response = await llmApi.post('/bidrigging/analyze', {
        vendor_id: vendorId
    });
    return response.data;
};

// ============== Health Check ==============

/**
 * Check FastAPI backend health and loaded models
 * @returns {Promise<Object>} Health status and loaded models
 */
export const checkLlmHealth = async () => {
    const response = await llmApi.get('/health');
    return response.data;
};

/**
 * Get API info and available endpoints
 * @returns {Promise<Object>} API information
 */
export const getApiInfo = async () => {
    const response = await llmApi.get('/');
    return response.data;
};
