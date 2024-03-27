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

export class ExplainCommand implements ISlashCommand {
    public command = "explain";
    public i18nParamsExample = "";
    public i18nDescription = "";
    public providesPreview = false;

    private commandEndpoint = "/explain";

    private async sendMessage(
        context: SlashCommandContext,
        modify: IModify,
        message: string
    ): Promise<void> {
        const messageStructure = modify.getCreator().startMessage();
        const sender = context.getSender();
        const room = context.getRoom();

        messageStructure.setSender(sender).setRoom(room).setText(message);

        await modify.getCreator().finish(messageStructure);
    }

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

        const res = await http.get(`${API_BASE_URI}${this.commandEndpoint}`);
        if (!res) {
            await this.sendMessage(context, modify, "No response");
            return;
        }
        await this.sendMessage(context, modify, `${res.content}`);
        console.log(res);
    }
}
