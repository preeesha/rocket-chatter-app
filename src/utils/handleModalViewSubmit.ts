import {
    IHttp,
    IModify,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import {
    SUGGEST_COMMAND_MODAL,
    suggestModalSubmitHandler,
} from "../modals/suggestModal";
import { getUIData } from "./persistenceHandlers";

export async function handleModalViewSubmit(
    context: UIKitViewSubmitInteractionContext,
    read: IRead,
    http: IHttp,
    modify: IModify
) {
    const { user, view } = context.getInteractionData();
    const slashCommandContext = await getUIData<SlashCommandContext>(
        read.getPersistenceReader(),
        user.id
    );

    if (!slashCommandContext) {
        console.log("NO DATA FOUND");
        context.getInteractionResponder().viewErrorResponse({
            viewId: view.id,
            errors: {
                error: "No data found",
            },
        });
        return;
    }

    const room = JSON.parse(JSON.stringify(slashCommandContext)).room as IRoom;

    switch (view.id) {
        case SUGGEST_COMMAND_MODAL:
            await suggestModalSubmitHandler(
                view,
                user,
                room,
                read,
                modify,
                http
            );
            break;
        default:
            break;
    }

    return context.getInteractionResponder().successResponse();
}
