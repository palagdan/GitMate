import * as core from '@actions/core';
import * as github from '@actions/github';
import { OpenAI } from 'openai';
import * as fs from 'fs';
import * as path from 'path';


export const addLabelToIssueAction = async (): Promise<void> => {
    try {
        const apiKey: string = core.getInput("openai-api-key");
        const githubToken: string = core.getInput("github-token");

        const octokit = github.getOctokit(githubToken);

        const issue = await octokit.rest.issues.get({
            ...github.context.issue,
            issue_number: github.context.issue.number,
        });

        const availableLabels = await octokit.rest.issues.listLabelsForRepo({
            ...github.context.repo,
        });

        const prompt = createAddLabelsToIssuePrompt(
            issue.data.title,
            issue.data.body || '',
            availableLabels.data.map(label => label.name),
            path.join(__dirname, "prompt.txt")
        );

        core.debug(`Prompt: ${prompt}`);

        const client = new OpenAI({ apiKey });

        const params: OpenAI.Chat.ChatCompletionCreateParams = {
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-4o-mini',
        };

        const chatCompletion = await client.chat.completions.create(params);
        core.debug(`Response: ${JSON.stringify(chatCompletion)}`);

        const responseText: string = chatCompletion.choices[0]?.message?.content?.trim() || '';
        const parsedResponse = JSON.parse(responseText);
        const labels: string[] = parsedResponse.labels;

        core.debug(`Labels: ${labels.toString()}`)

        if (labels.length > 0) {
            await octokit.rest.issues.setLabels({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                issue_number: github.context.issue.number,
                labels,
            });
            core.info(`Labels added: ${labels.join(", ")}`);
        } else {
            core.info('No labels suggested to add.');
        }
    } catch (error) {
        core.setFailed(`Error occurred: ${(error as Error).message}`);
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
const createAddLabelsToIssuePrompt = (
        issueTitle: string,
    issueBody: string,
    availableLabels: string[],
    templateFilePath: string
): string => {
    const template = fs.readFileSync(templateFilePath, 'utf-8');
    return template
        .replace('{{issueTitle}}', issueTitle)
        .replace('{{issueBody}}', issueBody)
        .replace('{{availableLabels}}', availableLabels.join(", "));
};


