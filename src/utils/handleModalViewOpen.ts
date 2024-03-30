import { UIKitBlockInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import { suggestModal } from "../modals/suggestModal";

export async function handleModalViewOpen(
    context: UIKitBlockInteractionContext
) {
    const triggerId = context.getInteractionData().triggerId;
    const data = context.getInteractionData();
    const { actionId, user } = data;

    try {
        switch (actionId) {
            case "suggest":
                const modal = await suggestModal();
                await this.modify
                    .getUiController()
                    .openSurfaceView(modal, { triggerId }, user);
                return context.getInteractionResponder().successResponse();
            default:
                break;
        }
    } catch (error) {
        return context.getInteractionResponder().viewErrorResponse({
            viewId: actionId,
            errors: error,
        });
    }

    return context.getInteractionResponder().successResponse();
}
