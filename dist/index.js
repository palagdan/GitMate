var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as core from '@actions/core';
import { ISSUE_LABEL } from './constants';
import { addLabelsToIssueAction } from './actions';
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mode = core.getInput('mode');
            switch (mode) {
                case ISSUE_LABEL:
                    yield addLabelsToIssueAction();
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
    });
}
run();
