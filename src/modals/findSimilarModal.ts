import {
    IHttp,
    IModify,
    IRead,
    IUIKitSurfaceViewParam,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import {
    IUIKitSurface,
    UIKitSurfaceType,
} from "@rocket.chat/apps-engine/definition/uikit";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { getButton, getInputBox } from "../utils/blockBuilders";
import { handleCommandResponse } from "../utils/handleCommandResponse";
import { requestServer } from "../utils/requestServer";

export const COMMAND = "rcc-findsimilar";
export const FIND_SIMILAR_COMMAND_MODAL = "findsimilar-command";

export async function findSimilarModal(): Promise<IUIKitSurfaceViewParam> {
    return {
        id: FIND_SIMILAR_COMMAND_MODAL,
        type: UIKitSurfaceType.MODAL,
        title: {
            type: "plain_text",
            text: "Find similar chunks",
        },
        close: await getButton("Close", "", ""),
        clearOnClose: true,
        submit: await getButton("Submit", "submit", "submit", "Submit"),
        blocks: [
            await getInputBox(
                "",
                "Insert the code for which you want to find similar chunks here",
                "findsimilar",
                FIND_SIMILAR_COMMAND_MODAL,
                "",
                true
            ),
        ],
    };
}

export async function findSimilarModalSubmitHandler(
    view: IUIKitSurface,
    sender: IUser,
    room: IRoom,
    read: IRead,
    modify: IModify,
    http: IHttp
) {
    const state = view.state as Record<string, any> | undefined;
    if (!state) return;

    const query = state.findsimilar[FIND_SIMILAR_COMMAND_MODAL];
    const sendMessage = await handleCommandResponse(
        "\n```\n" + query + "\n```",
        sender,
        room,
        modify,
        COMMAND
    );

    const res = await requestServer(http, "/findSimilar", { query });
    if (!res) {
        await sendMessage(
            "❌ Failed to find similar chunks. Please try again later."
        );
        return;
    }

    await sendMessage(res as string);
}
