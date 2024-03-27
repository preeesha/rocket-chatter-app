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

export class HealthCommand implements ISlashCommand {
    public command = "rcc-health";
    public i18nParamsExample = "";
    public i18nDescription = "";
    public providesPreview = false;

    private commandEndpoint = "health";

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
        const res = await http.get(`${API_BASE_URI}/${this.commandEndpoint}`);
        if (!res) {
            await this.sendMessage(
                context,
                modify,
                `Rocket Chatter is not available at the moment. Please try again later.`
            );
            return;
        }
        await this.sendMessage(
            context,
            modify,
            `Rocket Chatter Health is ${res.content}`
        );
        console.log(res);
    }
}
