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

export class TranslateCommand implements ISlashCommand {
    public command = "rcc-translate";
    public i18nParamsExample = "";
    public i18nDescription = "";
    public providesPreview = false;

    private commandEndpoint = "/translate";

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp
    ): Promise<void> {
        const [targetEntity, targetLanguage] = context.getArguments();
        if (!targetEntity || !targetLanguage) {
            const errorMessage = modify.getCreator().startMessage();
            errorMessage
                .setSender(context.getSender())
                .setRoom(context.getRoom())
                .setText("Invalid arguments!");
            await modify.getCreator().finish(errorMessage);
            return;
        }

        const sendEditedMessage = await handleCommand(
            context,
            modify,
            this.command
        );

        const res = await requestServer(http, this.commandEndpoint, {
            targetEntity,
            targetLanguage,
        });
        if (!res) {
            await sendEditedMessage("❌ Translation failed");
            return;
        }

        const data = res as Record<string, string>;

        await sendEditedMessage(data["result"]);
    }
}
