import i18next from 'i18next';
import { toast } from 'react-toastify';
import { FeedbacksService } from '../../../services/feedbacks';
import { ArrayWithAtLeastOneStep } from '../GenericModalForm';
import { SendFeedback, sendFeedbackSchema } from './SendFeedback';

const sendFeedbackSteps: ArrayWithAtLeastOneStep = [{ content: SendFeedback, schema: sendFeedbackSchema }];

const sendFeedbackModalContent = async (data: any) => {
    const { baseId, requesterId, ...metaData } = data;

    try {
        await FeedbacksService.createOne({ ...metaData, genesisId: requesterId });
        localStorage.removeItem('sendFeedback');
        toast.success(i18next.t('feedback.success'));
    } catch (error) {
        throw new Error(i18next.t('feedback.error'));
    }
};

const SendFeedbackModal = {
    title: 'feedback.title',
    steps: sendFeedbackSteps,
    request: sendFeedbackModalContent,
};

export default SendFeedbackModal;
