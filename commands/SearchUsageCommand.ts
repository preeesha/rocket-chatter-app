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
        const subcommand = context.getArguments().join(" ");
        if (!subcommand) {
            throw new Error("Error!");
        }

        const greetMessage = modify.getCreator().startMessage();
        greetMessage
            .setSender(context.getSender())
            .setRoom(context.getRoom())
            .setText("Searching ...");
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

        const data = res.data!;

        const answer = data.answer;
        const impact = data.impact;
        const diagram = data.diagram;

        const resultMessage = modify.getCreator().startMessage();
        const builder = resultMessage
            .setSender(context.getSender())
            .setRoom(context.getRoom())
            .setText(`Impact: ${impact}\n\nAnswer: ${answer}`);
        if (diagram) {
            builder.addAttachment({ imageUrl: diagram });
        }
        await modify.getCreator().finish(resultMessage);
    }
}
