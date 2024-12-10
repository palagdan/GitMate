import * as core from '@actions/core';
import * as github from '@actions/github';
import { ISSUE_LABEL } from './constants';
import {addLabelToIssueAction} from "./actions";


async function run(): Promise<void> {
    try {
        const mode: string = core.getInput('mode');

        switch (mode) {
            case ISSUE_LABEL:
                await addLabelToIssueAction();
                break;
            default:
                core.setFailed('Mode is not supported');
                break;
        }
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        } else {
            core.setFailed('An unknown error occurred');
        }
    }
}

run();
