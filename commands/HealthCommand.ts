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
import { handleCommand } from "../utils/handleCommand";

export class HealthCommand implements ISlashCommand {
    public command = "rcc-health";
    public i18nParamsExample = "";
    public i18nDescription = "";
    public providesPreview = false;

    private commandEndpoint = "health";

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp
    ): Promise<void> {
        const sendEditedMessage = await handleCommand(
            context,
            modify,
            this.command
        );

        const res = await http.get(`${API_BASE_URI}/${this.commandEndpoint}`);
        if (!res) {
            await sendEditedMessage("❌ Health check failed");
            return;
        }

        await sendEditedMessage("✅ Health check successful");

        console.log(res);
    }
}
