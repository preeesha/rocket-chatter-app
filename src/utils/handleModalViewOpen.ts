import { IUIKitSurfaceViewParam } from "@rocket.chat/apps-engine/definition/accessors";
import { UIKitBlockInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import {
    FIND_SIMILAR_COMMAND_MODAL,
    findSimilarModal,
} from "../modals/findSimilarModal";
import {
    STYLEGUIDE_COMMAND_MODAL,
    styleguideModal,
} from "../modals/styleguideModal";
import { SUGGEST_COMMAND_MODAL, suggestModal } from "../modals/suggestModal";

export async function handleModalViewOpen(
    context: UIKitBlockInteractionContext
) {
    const triggerId = context.getInteractionData().triggerId;
    const data = context.getInteractionData();
    const { actionId, user } = data;

    try {
        let modal: IUIKitSurfaceViewParam | null = null;
        switch (actionId) {
            case SUGGEST_COMMAND_MODAL:
                modal = await suggestModal();
            case FIND_SIMILAR_COMMAND_MODAL:
                modal = await findSimilarModal();
            case STYLEGUIDE_COMMAND_MODAL:
                modal = await styleguideModal();
            default:
                break;
        }
        await this.modify
            .getUiController()
            .openSurfaceView(modal, { triggerId }, user);
        return context.getInteractionResponder().successResponse();
    } catch (error) {
        return context.getInteractionResponder().viewErrorResponse({
            viewId: actionId,
            errors: error,
        });
    }

    return context.getInteractionResponder().successResponse();
}
