const redis = require('../config/redis');
const automationService = require('../modules/automations/automation.service');
const escalationService = require('../modules/automations/escalation.service');

console.log('🤖 Automation worker started');

redis.subscribe('automation:run');

redis.on('message', async () => {
  try {
    console.log('⚙️ Running automation cycle');

    // ⚠️ For now, one org (later loop orgs)
    const organizationId = process.env.DEFAULT_ORG_ID;

    const stuckTasks = await automationService.findStuckTasks(
      organizationId,
      24
    );

    for (const task of stuckTasks) {
      await escalationService.escalateTask(task, organizationId);
    }

    console.log(`✅ Escalated ${stuckTasks.length} task(s)`);
  } catch (err) {
    console.error('❌ Automation worker error:', err.message);
  }
});
