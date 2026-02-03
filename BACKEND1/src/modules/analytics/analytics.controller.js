const analyticsService = require('./analytics.service');

exports.workflowEfficiency = async (req, res) => {
  try {
    const data = await analyticsService.workflowEfficiency(
      req.user.organizationId
    );
    res.json({ data: data || {} });
  } catch (err) {
    console.error('workflowEfficiency error:', err.message);
    res.json({ data: {} });
  }
};

exports.userWorkload = async (req, res) => {
  try {
    const data = await analyticsService.userWorkload(
      req.user.organizationId
    );
    res.json({ data: data || {} });
  } catch (err) {
    console.error('userWorkload error:', err.message);
    res.json({ data: {} });
  }
};

const predictionService = require('./prediction.service');

exports.getDelayRisk = async (req, res, next) => {
  try {
    const { organizationId } = req.user;

    const data = await predictionService.getDelayRisk(organizationId);

    res.json({ data: data || {} });
  } catch (err) {
    console.error('getDelayRisk error:', err.message);
    res.json({ data: {} });
  }
};
