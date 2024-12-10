"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const openai_1 = require("openai");
const utils_1 = require("@/utils");
const addLabelToIssueAction = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const apiKey = core.getInput("openai-api-key");
        const githubToken = core.getInput("github-token");
        const octokit = github.getOctokit(githubToken);
        const issue = yield octokit.rest.issues.get(Object.assign(Object.assign({}, github.context.issue), { issue_number: github.context.issue.number }));
        const availableLabels = yield octokit.rest.issues.listLabelsForRepo(Object.assign({}, github.context.repo));
        const prompt = createAddLabelsToIssuePrompt(issue.data.title, issue.data.body || '', availableLabels.data.map(label => label.name), './promptTemplate.txt');
        core.debug(`Prompt: ${prompt}`);
        const client = new openai_1.OpenAI({ apiKey });
        const params = {
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-4',
        };
        const chatCompletion = yield client.chat.completions.create(params);
        core.debug(`Response: ${JSON.stringify(chatCompletion)}`);
        const responseText = ((_c = (_b = (_a = chatCompletion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim()) || '';
        const parsedResponse = JSON.parse(responseText);
        const labels = parsedResponse.labels;
        if (labels.length > 0) {
            yield octokit.rest.issues.setLabels({
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
});
/**
 * Create a prompt for OpenAI based on the issue details and available labels.
 * @param issueTitle - Title of the GitHub issue.
 * @param issueBody - Body of the GitHub issue.
 * @param availableLabels - List of available labels in the repository.
 * @param templateFilePath - Path to the prompt template file.
 * @returns The generated prompt string.
 */
const createAddLabelsToIssuePrompt = (issueTitle, issueBody, availableLabels, templateFilePath) => {
    const template = (0, utils_1.loadFile)(templateFilePath);
    return template
        .replace('{{issueTitle}}', issueTitle)
        .replace('{{issueBody}}', issueBody)
        .replace('{{availableLabels}}', availableLabels.join(", "));
};
exports.default = addLabelToIssueAction;
