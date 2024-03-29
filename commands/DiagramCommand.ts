import {
    IHttp,
    IModify,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    ISlashCommand,
    SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";
import { handleCommand } from "../utils/handleCommand";
import { requestServer } from "../utils/requestServer";

export class DiagramCommand implements ISlashCommand {
    public command = "rcc-diagram";
    public i18nParamsExample = "";
    public i18nDescription = "";
    public providesPreview = false;

    private commandEndpoint = "/diagram";

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp
    ): Promise<void> {
        const query = context.getArguments().join(" ");
        if (!query) {
            throw new Error("Error!");
        }

        const sendEditedMessage = await handleCommand(
            context,
            modify,
            this.command
        );

        const res = await requestServer(http, this.commandEndpoint, { query });
        console.log(res);

        if (!res) {
            await sendEditedMessage("Error!");
            return;
        }

        const data = res as string;
        await sendEditedMessage("", [data]);
    }
}
