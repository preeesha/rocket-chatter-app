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

export class SearchUsageCommand implements ISlashCommand {
    public command = "rcc-searchUsage";
    public i18nParamsExample = "";
    public i18nDescription = "";
    public providesPreview = false;

    private commandEndpoint = "/searchUsage";

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp
    ): Promise<void> {
        const [query] = context.getArguments();
        if (!query) {
            throw new Error("Error!");
        }

        const sendEditedMessage = await handleCommand(
            context,
            modify,
            this.command
        );

        const res = await requestServer(http, this.commandEndpoint, { query });
        if (!res) {
            await sendEditedMessage("Error!");
            return;
        }

        const data = res as Record<string, string>;

        const answer = data.answer;
        const impact = data.impact;
        const diagram = data.diagram;

        await sendEditedMessage(`*Answer:*\n${answer}\n\n*Impact:* ${impact}`, [
            diagram,
        ]);
    }
}
