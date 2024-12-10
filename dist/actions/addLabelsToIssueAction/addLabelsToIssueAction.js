import * as core from '@actions/core';
import * as github from '@actions/github';
import { OpenAI } from 'openai';
import { loadFile } from '../../utils/fsUtils.js';
export const addLabelToIssueAction = async () => {
    try {
        const apiKey = core.getInput("openai-api-key");
        const githubToken = core.getInput("github-token");
        const octokit = github.getOctokit(githubToken);
        const issue = await octokit.rest.issues.get({
            ...github.context.issue,
            issue_number: github.context.issue.number,
        });
        const availableLabels = await octokit.rest.issues.listLabelsForRepo({
            ...github.context.repo,
        });
        const prompt = createAddLabelsToIssuePrompt(issue.data.title, issue.data.body || '', availableLabels.data.map(label => label.name), './promptTemplate.txt');
        core.debug(`Prompt: ${prompt}`);
        const client = new OpenAI({ apiKey });
        const params = {
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-4',
        };
        const chatCompletion = await client.chat.completions.create(params);
        core.debug(`Response: ${JSON.stringify(chatCompletion)}`);
        const responseText = chatCompletion.choices[0]?.message?.content?.trim() || '';
        const parsedResponse = JSON.parse(responseText);
        const labels = parsedResponse.labels;
        if (labels.length > 0) {
            await octokit.rest.issues.setLabels({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                issue_number: github.context.issue.number,
                labels,
            });
            core.info(`Labels added: ${labels.join(", ")}`);
        }
        else {
            core.info('No labels suggested to add.');
        }
    }
    catch (error) {
        core.setFailed(`Error occurred: ${error.message}`);
    }
};
/**
 * Create a prompt for OpenAI based on the issue details and available labels.
 * @param issueTitle - Title of the GitHub issue.
 * @param issueBody - Body of the GitHub issue.
 * @param availableLabels - List of available labels in the repository.
 * @param templateFilePath - Path to the prompt template file.
 * @returns The generated prompt string.
 */
const createAddLabelsToIssuePrompt = (issueTitle, issueBody, availableLabels, templateFilePath) => {
    const template = loadFile(templateFilePath);
    return template
        .replace('{{issueTitle}}', issueTitle)
        .replace('{{issueBody}}', issueBody)
        .replace('{{availableLabels}}', availableLabels.join(", "));
};
