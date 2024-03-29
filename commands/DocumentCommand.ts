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

export class DocumentCommand implements ISlashCommand {
    public command = "rcc-document";
    public i18nParamsExample = "";
    public i18nDescription = "";
    public providesPreview = false;

    private commandEndpoint = "/document";

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp
    ): Promise<void> {
        const [targetEntity, query] = context.getArguments();
        if (!targetEntity) {
            throw new Error("Error!");
        }

        const sendEditedMessage = await handleCommand(
            context,
            modify,
            this.command
        );

        const res = await requestServer(http, this.commandEndpoint, {
            query: query || "make it easy for me",
            targetEntity: targetEntity,
        });
        if (!res) {
            await sendEditedMessage("Error!");
            return;
        }

        const data = res as Record<string, string>;

        await sendEditedMessage(
            `\`\`\`\n${data["jsDoc"]}\n\`\`\`\n\n${data["explanation"]}`
        );
    }
}
