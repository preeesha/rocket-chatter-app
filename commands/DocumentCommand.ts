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
        const subcommand = context.getArguments().join(" ");
        if (!subcommand) {
            throw new Error("Error!");
        }

        const greetMessage = modify.getCreator().startMessage();
        greetMessage
            .setSender(context.getSender())
            .setRoom(context.getRoom())
            .setText("Searching ...");
        await modify.getCreator().finish(greetMessage);

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

        const data = res.data!;

        const jsDoc = data.jsDoc;
        const explaination = data.explaination;

        console.log([
            {
                type: "mrkdwn",
                text: "```\n" + jsDoc + "\n```",
            },
            {
                type: "plain_text",
                text: explaination,
            },
        ]);

        const resultMessage = modify.getCreator().startMessage();
        resultMessage
            .setSender(context.getSender())
            .setRoom(context.getRoom())
            .setText(`\`\`\`\n${jsDoc}\n\`\`\`\n\n${explaination}`);
        await modify.getCreator().finish(resultMessage);
    }
}
