import * as core from '@actions/core';
import { ISSUE_LABEL } from './constants/index.js';
import { addLabelToIssueAction } from "./actions/index.js";
async function run() {
    try {
        const mode = core.getInput('mode');
        switch (mode) {
            case ISSUE_LABEL:
                await addLabelToIssueAction();
                break;
            default:
                core.setFailed('Mode is not supported');
                break;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
        else {
            core.setFailed('An unknown error occurred');
        }
    }
}
run();
