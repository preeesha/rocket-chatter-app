import {
    IHttp,
    IModify,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    ISlashCommand,
    SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";
import { API_BASE_URI } from "../constants";

export class SummarizeCommand implements ISlashCommand {
    public command = "rcc-summarize";
    public i18nParamsExample = "";
    public i18nDescription = "";
    public providesPreview = false;

    private commandEndpoint = "/summarize";

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp
    ): Promise<void> {
        const subcommand = context.getArguments().join(" ");
        if (!subcommand) {
            throw new Error("Error!");
        }

        const greetMessage = modify.getCreator().startMessage();
        greetMessage
            .setSender(context.getSender())
            .setRoom(context.getRoom())
            .setText("Summarizing...");
        const messageID = await modify.getCreator().finish(greetMessage);

        const res = await http.post(`${API_BASE_URI}${this.commandEndpoint}`, {
            data: {
                query: subcommand,
            },
        });
        if (!res) {
            const errorMessage = modify.getCreator().startMessage();
            errorMessage
                .setSender(context.getSender())
                .setRoom(context.getRoom())
                .setText("Error!");
            await modify.getCreator().finish(errorMessage);
            return;
        }

        const resultMessage = modify.getCreator().startMessage();
        resultMessage
            .setSender(context.getSender())
            .setRoom(context.getRoom())
            .setText(res.data);
        await modify.getCreator().finish(resultMessage);
    }
}
