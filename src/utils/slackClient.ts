import { WebClient } from '@slack/web-api';

const token = process.env.SLACK_BOT_TOKEN;
export const slackClient = new WebClient(token);