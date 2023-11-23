"use strict";
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
exports.SQSService = void 0;
class SQSService {
    constructor(sqs) {
        this.sqs = sqs;
    }
    sendMessage(queueUrl, messageBody) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Get the queue attributes to check if ContentBasedDeduplication is enabled
            const getQueueAttributesParams = {
                QueueUrl: queueUrl,
                AttributeNames: ['All'],
            };
            const queueAttributesResponse = yield this.sqs.getQueueAttributes(getQueueAttributesParams).promise();
            const isContentBasedDeduplicationEnabled = ((_a = queueAttributesResponse.Attributes) === null || _a === void 0 ? void 0 : _a.ContentBasedDeduplication) === 'true';
            // If ContentBasedDeduplication is not enabled, update the queue attributes
            if (!isContentBasedDeduplicationEnabled) {
                const setQueueAttributesParams = {
                    QueueUrl: queueUrl,
                    Attributes: {
                        ContentBasedDeduplication: 'true',
                    },
                };
                yield this.sqs.setQueueAttributes(setQueueAttributesParams).promise();
            }
            // Now, send the message
            const sendMessageParams = {
                QueueUrl: queueUrl,
                MessageBody: messageBody,
                MessageGroupId: "uploader",
            };
            return this.sqs.sendMessage(sendMessageParams).promise();
        });
    }
}
exports.SQSService = SQSService;
