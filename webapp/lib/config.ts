interface FeedbackConfig {
  github: {
    token: string;
    owner: string;
    repo: string;
  };
  validation: {
    maxLength: number;
    minLength: number;
  };
  dify: {
    apiEndpoint: string;
    apiKey: string;
    agentId?: string; // Workflow ID（可选，如果 API Key 中已包含 workflow，可以留空）
  };
}

function getConfig(): FeedbackConfig {
  const requiredEnvVars = {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_OWNER: process.env.GITHUB_OWNER,
    GITHUB_REPO: process.env.GITHUB_REPO,
    DIFY_API_ENDPOINT: process.env.DIFY_API_ENDPOINT,
    DIFY_API_KEY: process.env.DIFY_API_KEY,
  };

  // 验证必需的环境变量（DIFY_AGENT_ID 是可选的）
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `缺少必需的环境变量: ${missingVars.join(', ')}`
    );
  }

  return {
    github: {
      token: requiredEnvVars.GITHUB_TOKEN!,
      owner: requiredEnvVars.GITHUB_OWNER!,
      repo: requiredEnvVars.GITHUB_REPO!,
    },
    validation: {
      maxLength: parseInt(process.env.FEEDBACK_MAX_LENGTH || '5000', 10),
      minLength: 1,
    },
    dify: {
      apiEndpoint: requiredEnvVars.DIFY_API_ENDPOINT!,
      apiKey: requiredEnvVars.DIFY_API_KEY!,
      agentId: process.env.DIFY_AGENT_ID, // 可选
    },
  };
}

export const config = getConfig();
