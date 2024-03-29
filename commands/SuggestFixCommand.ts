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

export class SuggestFixCommand implements ISlashCommand {
    public command = "rcc-suggestFix";
    public i18nParamsExample = "";
    public i18nDescription = "";
    public providesPreview = false;

    private commandEndpoint = "/suggestFix";

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp
    ): Promise<void> {
        const [targetEntity, query] = context.getArguments();
        if (!targetEntity || !query) {
            const errorMessage = modify.getCreator().startMessage();
            errorMessage
                .setSender(context.getSender())
                .setRoom(context.getRoom())
                .setText("Invalid arguments!");
            await modify.getCreator().finish(errorMessage);
            return;
        }

        const greetMessage = modify.getCreator().startMessage();
        greetMessage
            .setSender(context.getSender())
            .setRoom(context.getRoom())
            .setText("Inspecting ...");
        await modify.getCreator().finish(greetMessage);

        const res = await http.post(`${API_BASE_URI}${this.commandEndpoint}`, {
            data: { targetEntity, query },
        });
        const data = res?.data?.result;
        if (!res || !data) {
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
            .setText(data);
        await modify.getCreator().finish(resultMessage);
    }
}
