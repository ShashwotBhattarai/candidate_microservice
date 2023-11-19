import { SQS } from 'aws-sdk';

export class SQSService {
  constructor(private sqs: SQS) {}

  async sendMessage(queueUrl: string, messageBody: string): Promise<SQS.Types.SendMessageResult> {
    // Get the queue attributes to check if ContentBasedDeduplication is enabled
    const getQueueAttributesParams: SQS.Types.GetQueueAttributesRequest = {
      QueueUrl: queueUrl,
      AttributeNames: ['All'],
    };

    const queueAttributesResponse = await this.sqs.getQueueAttributes(getQueueAttributesParams).promise();
    const isContentBasedDeduplicationEnabled = queueAttributesResponse.Attributes?.ContentBasedDeduplication === 'true';

    // If ContentBasedDeduplication is not enabled, update the queue attributes
    if (!isContentBasedDeduplicationEnabled) {
      const setQueueAttributesParams: SQS.Types.SetQueueAttributesRequest = {
        QueueUrl: queueUrl,
        Attributes: {
          ContentBasedDeduplication: 'true',
        },
      };

      await this.sqs.setQueueAttributes(setQueueAttributesParams).promise();
    }

    // Now, send the message
    const sendMessageParams: SQS.Types.SendMessageRequest = {
      QueueUrl: queueUrl,
      MessageBody: messageBody,
      MessageGroupId: "uploader",
    };

    return this.sqs.sendMessage(sendMessageParams).promise();
  }
}
